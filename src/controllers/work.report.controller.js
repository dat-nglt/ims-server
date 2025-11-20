import { sentWorkReportService } from "../services/work.report.service";

export const sentWorkReportController = async (req, res) => {
    try {
        const reportData = req.body;
        const result = await sentWorkReportService(reportData);
        res.status(200).json({ message: "Báo cáo công việc đã được gửi thành công", result });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi gửi báo cáo công việc", error: error.message });
    }
};
