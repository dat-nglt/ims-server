# 📚 API Documentation - Department & Auto-Assign Roles

## Overview

Endpoints untuk quản lý phòng ban (Department) và tự động gán vai trò (Auto-Assign Roles) cho nhân viên.

---

## Table of Contents

1. [Department Management APIs](#department-management-apis)
2. [Employee Department Assignment APIs](#employee-department-assignment-apis)
3. [Department-Role Management APIs](#department-role-management-apis)
4. [Examples & Workflows](#examples--workflows)

---

## Department Management APIs

### 1. GET /api/departments
Lấy danh sách tất cả phòng ban

**Query Parameters:**
```
includeRoles=true|false   - Có bao gồm roles mapping hay không (default: false)
includeInactive=true|false - Có bao gồm inactive/archived departments (default: false)
```

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/departments?includeRoles=true"
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Phòng Kỹ Thuật",
      "code": "TECH",
      "description": "Bộ phận phát triển kỹ thuật",
      "manager_id": 5,
      "phone": "0901-000-001",
      "email": "tech@company.com",
      "location": "Tầng 2",
      "parent_department_id": null,
      "status": "active",
      "is_deleted": false,
      "departmentRoles": [
        {
          "id": 1,
          "department_id": 1,
          "role_id": 10,
          "is_primary": true,
          "is_default": true,
          "priority": 0,
          "role": {
            "id": 10,
            "name": "Technician",
            "level": 20
          }
        }
      ]
    }
  ],
  "message": "Lấy danh sách phòng ban thành công"
}
```

---

### 2. GET /api/departments/:id
Lấy chi tiết phòng ban cùng với default roles

**Path Parameters:**
```
id (integer) - Department ID
```

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/departments/1"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Phòng Kỹ Thuật",
    "code": "TECH",
    "description": "Bộ phận phát triển kỹ thuật",
    "manager_id": 5,
    "manager": {
      "id": 5,
      "name": "Nguyễn Quản Lý",
      "email": "manager@company.com"
    },
    "phone": "0901-000-001",
    "email": "tech@company.com",
    "location": "Tầng 2",
    "status": "active",
    "departmentRoles": [
      {
        "id": 1,
        "department_id": 1,
        "role_id": 10,
        "is_primary": true,
        "is_default": true,
        "priority": 0,
        "role": {
          "id": 10,
          "name": "Technician",
          "permissions": [
            { "id": 101, "code": "edit_work", "name": "Chỉnh sửa công việc" },
            { "id": 102, "code": "submit_report", "name": "Nộp báo cáo" }
          ]
        }
      }
    ]
  },
  "message": "Lấy chi tiết phòng ban thành công"
}
```

---

### 3. POST /api/departments
Tạo phòng ban mới

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Phòng Phát Triển",
  "code": "DEV",
  "description": "Bộ phận phát triển phần mềm",
  "manager_id": 5,
  "phone": "0901-111-111",
  "email": "dev@company.com",
  "location": "Tầng 3",
  "parent_department_id": null,
  "status": "active"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/departments" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Phòng Phát Triển",
    "code": "DEV",
    "manager_id": 5
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 4,
    "name": "Phòng Phát Triển",
    "code": "DEV",
    "description": "Bộ phận phát triển phần mềm",
    "manager_id": 5,
    "created_by": 1,
    "created_at": "2023-12-23T10:00:00Z"
  },
  "message": "Tạo phòng ban thành công"
}
```

---

### 4. PUT /api/departments/:id
Cập nhật phòng ban

**Path Parameters:**
```
id (integer) - Department ID
```

**Request Body:**
```json
{
  "name": "Phòng Kỹ Thuật (Updated)",
  "manager_id": 6,
  "status": "active"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/departments/1" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"manager_id": 6}'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Phòng Kỹ Thuật (Updated)",
    "manager_id": 6,
    "updated_by": 1,
    "updated_at": "2023-12-23T10:30:00Z"
  },
  "message": "Cập nhật phòng ban thành công"
}
```

---

### 5. DELETE /api/departments/:id
Xóa (soft delete) phòng ban

**Path Parameters:**
```
id (integer) - Department ID
```

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/departments/4" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "status": "success",
  "message": "Department deleted successfully"
}
```

---

## Employee Department Assignment APIs

### 6. PUT /api/departments/employees/:employeeId/department
Cập nhật phòng ban cho nhân viên + Auto-assign roles

**⭐ MAIN API - Auto-Assign Roles**

**Path Parameters:**
```
employeeId (integer) - EmployeeProfile user_id
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "department_id": 1
}
```

**What Happens:**
1. Fetch department dengan default roles
2. Get current user roles
3. Remove old roles
4. Add new roles (from department)
5. Update employee profile

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/departments/employees/100/department" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "department_id": 1
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "success": true,
    "employee": {
      "id": 100,
      "user_id": 20,
      "department_id": 1
    },
    "rolesAssigned": [10, 15],
    "rolesRemoved": [20],
    "department": {
      "id": 1,
      "name": "Phòng Kỹ Thuật"
    }
  },
  "message": "Cập nhật phòng ban và vai trò cho nhân viên thành công"
}
```

**Field Descriptions:**
- `rolesAssigned`: Danh sách role IDs được gán
- `rolesRemoved`: Danh sách role IDs được loại bỏ
- `department`: Thông tin phòng ban mới

---

### 7. PUT /api/departments/employees/:employeeId
Cập nhật thông tin nhân viên (bao gồm department)

**Alternative endpoint** - có thể cập nhật department + other fields cùng lúc

**Path Parameters:**
```
employeeId (integer) - EmployeeProfile user_id
```

**Request Body:**
```json
{
  "name": "Nguyễn Văn A (Updated)",
  "position": "Senior Kỹ Sư",
  "department_id": 1,
  "email": "new-email@company.com"
}
```

**Behavior:**
- Nếu có `department_id`: Tự động gán roles
- Nếu không có `department_id`: Chỉ cập nhật other fields

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/departments/employees/100" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "position": "Senior Kỹ Sư",
    "department_id": 1
  }'
```

**Response (with department_id):**
```json
{
  "status": "success",
  "data": {
    "success": true,
    "employee": { ... },
    "rolesAssigned": [10],
    "rolesRemoved": [20]
  },
  "message": "Cập nhật phòng ban và vai trò thành công"
}
```

---

## Department-Role Management APIs

### 8. PUT /api/departments/:id/roles/:roleId
Gán role cho phòng ban

**Path Parameters:**
```
id (integer) - Department ID
roleId (integer) - Role ID
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "isPrimary": true,
  "isDefault": true,
  "priority": 0
}
```

**Field Descriptions:**
- `isPrimary` (boolean): Có phải role chính không (default: true)
- `isDefault` (boolean): Có tự động gán không (default: true)
- `priority` (integer): Thứ tự gán (0 = cao nhất)

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/departments/1/roles/10" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "isPrimary": true,
    "isDefault": true,
    "priority": 0
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "department_id": 1,
    "role_id": 10,
    "is_primary": true,
    "is_default": true,
    "priority": 0,
    "created_at": "2023-12-23T10:00:00Z"
  },
  "message": "Gán vai trò cho phòng ban thành công"
}
```

---

### 9. DELETE /api/departments/:id/roles/:roleId
Gỡ role khỏi phòng ban

**Path Parameters:**
```
id (integer) - Department ID
roleId (integer) - Role ID
```

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/departments/1/roles/15" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "status": "success",
  "message": "Role removed from department"
}
```

---

## Examples & Workflows

### Workflow 1: Tạo Department + Gán Roles

```bash
# Step 1: Tạo phòng ban
curl -X POST "http://localhost:3000/api/departments" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Phòng Marketing",
    "code": "MKT",
    "manager_id": 7
  }'
# Response: { "data": { "id": 4 } }

# Step 2: Gán role cho phòng ban
curl -X PUT "http://localhost:3000/api/departments/4/roles/25" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isPrimary": true,
    "isDefault": true
  }'

# Step 3: Gán role phụ (optional)
curl -X PUT "http://localhost:3000/api/departments/4/roles/26" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isPrimary": false,
    "isDefault": false
  }'
```

---

### Workflow 2: Chuyển Nhân Viên Sang Phòng Ban Khác

```bash
# Employee 100 hiện tại:
# - Department: 2 (Sales)
# - Roles: [20] (Sales)

# Chuyển sang Phòng Kỹ Thuật
curl -X PUT "http://localhost:3000/api/departments/employees/100/department" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "department_id": 1
  }'

# Response:
# {
#   "rolesAssigned": [10, 15],    // Assigned: Technician + Senior Tech
#   "rolesRemoved": [20],         // Removed: Sales
#   "employee": {
#     "user_id": 20,
#     "department_id": 1
#   }
# }

# Result: Employee 100 bây giờ có:
# - Department: 1 (Phòng Kỹ Thuật)
# - Roles: [10, 15] (Technician, Senior Technician)
# - Permissions: Được cấp từ 2 roles này
```

---

### Workflow 3: Preview Roles Trước Khi Gán

```bash
# Lấy department với roles trước khi gán
curl -X GET "http://localhost:3000/api/departments/1" \
  -H "Authorization: Bearer TOKEN"

# Response chứa:
# {
#   "data": {
#     "id": 1,
#     "name": "Phòng Kỹ Thuật",
#     "departmentRoles": [
#       {
#         "role": {
#           "id": 10,
#           "name": "Technician",
#           "permissions": [...]
#         }
#       }
#     ]
#   }
# }

# UI có thể preview: "Nhân viên sẽ được gán vai trò: Technician + Senior Technician"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "department_id is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Department with ID 999 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database error: violation of unique constraint"
}
```

---

## Database Schema Reference

### departments table
```sql
CREATE TABLE departments (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50),
  description TEXT,
  manager_id INTEGER REFERENCES users(id),
  phone VARCHAR(20),
  email VARCHAR(255),
  location VARCHAR(255),
  parent_department_id INTEGER REFERENCES departments(id),
  status ENUM('active', 'inactive', 'archived'),
  is_deleted BOOLEAN DEFAULT false,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(name, is_deleted),
  UNIQUE(code, is_deleted)
);
```

### department_roles table (Junction)
```sql
CREATE TABLE department_roles (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  role_id INTEGER NOT NULL REFERENCES roles(id),
  is_primary BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(department_id, role_id)
);
```

### employee_profiles table (Updated)
```sql
ALTER TABLE employee_profiles
ADD COLUMN department_id INTEGER REFERENCES departments(id);
```

---

## Notes

1. **Auto-Assign Logic:**
   - Chỉ roles có `is_default = true` mới được auto-assign
   - Roles có `is_primary = true` được assign trước
   - `priority` xác định thứ tự (0 = cao nhất)

2. **Soft Delete:**
   - Departments không bao giờ bị xóa vật lý
   - Chỉ bị mark `is_deleted = true`
   - Unique constraints tính `is_deleted` để có thể tạo lại tên cũ

3. **Audit Trail:**
   - `created_by`, `created_at`: Người/khi tạo
   - `updated_by`, `updated_at`: Người/khi sửa
   - `assigned_by`, `assigned_at` (trong UserRoles): Người/khi gán role

4. **Transaction Safety:**
   - Auto-assign logic sử dụng transaction
   - Nếu có lỗi, tất cả changes sẽ rollback

