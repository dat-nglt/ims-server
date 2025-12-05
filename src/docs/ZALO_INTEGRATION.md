# IMS Server - Zalo Integration Documentation

## Zalo Mini App Authentication

### Overview
Hệ thống IMS hỗ trợ đăng nhập qua Zalo Mini App với cơ chế bảo mật cao, tuân thủ yêu cầu của Zalo Platform từ 01/01/2024.

### Authentication Flow

```
1. User mở Zalo Mini App
   ↓
2. Mini App gọi getAccessToken() từ ZMP SDK
   ↓
3. Client gửi access_token → IMS Server
   ↓
4. Server tính appsecret_proof = HMAC-SHA256(access_token, ZALO_SECRET_KEY)
   ↓
5. Server gọi Zalo API với headers:
   - access_token: <token>
   - appsecret_proof: <proof>
   ↓
6. Zalo trả về user profile (id, name, picture)
   ↓
7. Server tạo/cập nhật user account
   ↓
8. Server trả về JWT token cho client
```

### Environment Variables

Thêm các biến sau vào file `.env`:

```env
# Zalo App Configuration
ZALO_APP_ID=your_zalo_app_id
ZALO_SECRET_KEY=your_zalo_app_secret_key
ZALO_API_BASE_URL=https://graph.zalo.me
```

### API Endpoints

#### POST /api/v1/ims/auth/zalo-login
Đăng nhập qua Zalo Mini App

**Request Body:**
```json
{
  "access_token": "zalo_access_token_from_sdk"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "zalo_id": "123456789",
      "avatar_url": "https://...",
      "role": "user"
    },
    "access_token": "jwt_token_here"
  },
  "message": "Đăng nhập qua Zalo thành công"
}
```

### Security Implementation

#### App Secret Proof
```javascript
const calculateAppSecretProof = (accessToken, appSecret) => {
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(accessToken);
    return hmac.digest('hex');
};
```

#### API Call Example
```javascript
const response = await axios.get('https://graph.zalo.me/v2.0/me', {
    headers: {
        'access_token': accessToken,
        'appsecret_proof': appSecretProof
    },
    params: {
        fields: 'id,name,picture'
    }
});
```

### Error Handling

- **401 Unauthorized**: Access token không hợp lệ
- **500 Internal Server Error**: Lỗi server hoặc cấu hình sai
- **Token Expired**: Cần user refresh token từ Zalo

### User Account Management

- **Auto Creation**: Tự động tạo tài khoản cho user Zalo mới
- **Profile Sync**: Đồng bộ tên và ảnh đại diện
- **Flexible Schema**: Email và phone có thể null cho Zalo users

### Testing

1. Đảm bảo Zalo Mini App được cấu hình đúng
2. Test với access token hợp lệ
3. Verify appsecret_proof calculation
4. Check user creation và JWT token generation

### References

- [Zalo Developers Documentation](https://developers.zalo.me/)
- [Zalo OpenAPI Reference](https://developers.zalo.me/docs/api/social-api-1)
- [HMAC-SHA256 Implementation](https://nodejs.org/api/crypto.html#crypto_class_hmac)