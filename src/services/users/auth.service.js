import jwt from 'jsonwebtoken'; // Giả sử đã cài đặt jsonwebtoken

// Service cho refresh token: Verify refresh token và tạo access token mới
export const refreshTokenService = async (refreshToken) => {
  try {
    // Verify refresh token (giả sử secret là process.env.REFRESH_TOKEN_SECRET)
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Tạo access token mới với payload từ decoded (e.g., userId, role)
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' } // Ví dụ expires in 15 phút
    );
    return newAccessToken;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};