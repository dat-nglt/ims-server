// Bạn cần import axios ở đầu file
import axios from "axios";
import { getValidAccessToken } from "../chatboxAI/zalo.service";

// Lấy ACCESS_TOKEN an toàn từ biến môi trường trên server của bạn
const ZALO_API_URL = "https://openapi.zalo.me/v3.0/oa/message/cs";

/**
 * Dịch vụ gửi báo cáo công việc và thông báo qua Zalo (sử dụng Axios)
 * @param {object} reportData - Dữ liệu báo cáo (chính là state 'workInfo' của bạn)
 */
export const sentWorkReportService = async (reportData) => {
    // (Logic để lấy RECIPIENT_USER_ID của bạn vẫn giữ nguyên)
    // Ví dụ: const RECIPIENT_USER_ID = "2512523625412515";
    // Vui lòng thay thế bằng logic thực tế
    const RECIPIENT_USER_ID = "7365147034329534561";

    // 1. Format tin nhắn từ reportData
    const messageText = `
BÁO CÁO CÔNG VIỆC:
- Ngày: ${new Date(reportData.date).toLocaleDateString("vi-VN")}
- Công ty: ${reportData.company}
- Địa chỉ: ${reportData.address}
- Nội dung: ${reportData.content}
- Khách hàng: ${reportData.customerName}
- SĐT: ${reportData.phoneNumber}
- Ghi chú: ${reportData.notes || "Không có"}
    `;

    // 2. Chuẩn bị body cho Zalo API
    const zaloApiBody = {
        recipient: {
            user_id: RECIPIENT_USER_ID,
        },
        message: {
            text: messageText.trim(),
        },
    };

    const accessToken = await getValidAccessToken(); // Lấy accessToken hợp lệ để gửi tin nhắn & tự động refresh nếu cần
    // 3. Chuẩn bị headers
    const headers = {
        "Content-Type": "application/json",
        access_token: accessToken,
    };

    try {
        // 4. Gọi Zalo API bằng axios.post
        // axios.post(url, data, config)
        const response = await axios.post(ZALO_API_URL, zaloApiBody, { headers });

        // 5. Xử lý kết quả (axios trả về data trong response.data)
        const result = response.data;

        if (result.error === 0) {
            // Thành công
            console.log("Gửi tin nhắn Zalo thành công:", result);
            return { success: true, message: "Gửi báo cáo thành công", data: result };
        } else {
            // Lỗi nghiệp vụ từ Zalo (ví dụ: user_id sai)
            console.error("Lỗi nghiệp vụ Zalo:", result);
            throw new Error(result.message || "Lỗi từ Zalo API");
        }
    } catch (error) {
        // 6. Xử lý lỗi (lỗi mạng hoặc lỗi HTTP 4xx/5xx)
        console.error("Lỗi khi gọi Zalo API bằng Axios:", error.message);

        // Axios ném lỗi nếu status code không phải 2xx
        // Thông tin lỗi chi tiết từ Zalo thường nằm trong error.response.data
        if (error.response && error.response.data) {
            const zaloError = error.response.data;
            console.error("Data lỗi từ Zalo:", zaloError);
            throw new Error(zaloError.message || "Gửi tin nhắn Zalo thất bại");
        }

        // Lỗi mạng chung (không kết nối được)
        throw error;
    }
};
