# Authentication Middleware Documentation

## Overview

Hệ thống IMS sử dụng JWT-based authentication với các middleware linh hoạt để kiểm soát quyền truy cập.

## Available Middlewares

### 1. checkAuth
**Mục đích**: Xác thực JWT token và gắn thông tin user vào request

**Cách sử dụng**:
```javascript
const express = require('express');
const { checkAuth } = require('./middlewares/auth.middleware');

app.get('/api/protected', checkAuth, (req, res) => {
  // req.user đã được gắn thông tin user
  res.json({ user: req.user });
});
```

**Thông tin user được gắn**:
```javascript
req.user = {
  userId: 1,
  employeeId: "EMP001",
  name: "Nguyễn Văn A",
  phone: "0123456789",
  email: "user@example.com",
  zaloId: "zalo123",
  role: "user",
  roles: [{ id: 1, name: "user" }],
  permissions: [{ id: 1, name: "read" }],
  avatarUrl: "https://...",
  department: "IT",
  position: "Developer"
}
```

### 2. checkAdmin
**Mục đích**: Kiểm tra quyền Admin

**Cách sử dụng**:
```javascript
app.get('/api/admin-only', checkAuth, checkAdmin, (req, res) => {
  res.json({ message: "Admin access granted" });
});
```

### 3. checkRole
**Mục đích**: Kiểm tra role cụ thể

**Cách sử dụng**:
```javascript
const { checkRole } = require('./middlewares/auth.middleware');

// Single role
app.get('/api/manager', checkAuth, checkRole('manager'), handler);

// Multiple roles (OR condition)
app.get('/api/staff', checkAuth, checkRole(['manager', 'supervisor']), handler);
```

### 4. checkPermission
**Mục đích**: Kiểm tra permission cụ thể

**Cách sử dụng**:
```javascript
const { checkPermission } = require('./middlewares/auth.middleware');

// Single permission
app.get('/api/users', checkAuth, checkPermission('users.read'), handler);

// Multiple permissions (AND condition)
app.get('/api/users', checkAuth, checkPermission(['users.read', 'users.write']), handler);
```

### 5. checkOwnership
**Mục đích**: Kiểm tra quyền sở hữu tài nguyên

**Cách sử dụng**:
```javascript
const { checkOwnership } = require('./middlewares/auth.middleware');

// Default: kiểm tra userId trong params
app.get('/api/users/:userId/profile', checkAuth, checkOwnership(), handler);

// Custom field name
app.get('/api/posts/:postId', checkAuth, checkOwnership('authorId'), handler);
```

### 6. checkAccess (Advanced)
**Mục đích**: Kết hợp multiple checks trong một middleware

**Cách sử dụng**:
```javascript
const { checkAccess } = require('./middlewares/auth.middleware');

app.get('/api/projects/:projectId',
  checkAuth,
  checkAccess({
    roles: ['manager', 'admin'],           // OR condition
    permissions: ['projects.read'],         // AND condition
    requireOwnership: true,                 // Check ownership
    ownerField: 'projectManagerId'          // Custom owner field
  }),
  handler
);
```

## Usage Examples

### Basic API Protection
```javascript
// Public API
app.get('/api/public', (req, res) => { ... });

// Authenticated users only
app.get('/api/dashboard', checkAuth, (req, res) => { ... });

// Admin only
app.get('/api/admin/stats', checkAuth, checkAdmin, (req, res) => { ... });

// Role-based access
app.get('/api/sales', checkAuth, checkRole('sales'), (req, res) => { ... });

// Permission-based access
app.get('/api/users', checkAuth, checkPermission('users.read'), (req, res) => { ... });

// Ownership check
app.get('/api/users/:id/profile', checkAuth, checkOwnership(), (req, res) => { ... });

// Complex access control
app.put('/api/projects/:id',
  checkAuth,
  checkAccess({
    roles: ['manager'],
    permissions: ['projects.write'],
    requireOwnership: true
  }),
  (req, res) => { ... }
);
```

## Error Responses

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Xác thực thất bại: Token đã hết hạn."
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Truy cập bị từ chối: Yêu cầu quyền Quản trị viên (Admin)."
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Lỗi server trong quá trình xác thực."
}
```

## Best Practices

1. **Thứ tự middleware**: Luôn đặt `checkAuth` trước các middleware khác
2. **Performance**: Sử dụng `checkAccess` thay vì multiple middleware riêng lẻ
3. **Logging**: Tất cả access denied đều được log với request ID
4. **Ownership**: Sử dụng cho resources nhạy cảm như profile, settings
5. **Roles vs Permissions**: Roles cho business logic, Permissions cho fine-grained control

## Integration with Routes

```javascript
// routes/users.js
import { checkAuth, checkAdmin, checkPermission } from '../middlewares/auth.middleware.js';

export const userRoutes = (app) => {
  // Public routes
  app.get('/api/users/login', loginHandler);

  // Protected routes
  app.get('/api/users/profile', checkAuth, getProfileHandler);
  app.put('/api/users/profile', checkAuth, checkOwnership(), updateProfileHandler);

  // Admin routes
  app.get('/api/users', checkAuth, checkPermission('users.read'), getAllUsersHandler);
  app.post('/api/users', checkAuth, checkAdmin, createUserHandler);
};
```

## Security Considerations

- JWT tokens có expire time (24h)
- Tất cả requests đều verify token với database
- Role và permission được load real-time
- Comprehensive logging cho audit trail
- Proper error messages không expose sensitive info