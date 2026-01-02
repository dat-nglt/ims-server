# Attendance API Documentation

## Tổng quan

API Attendance quản lý việc chấm công nhân viên với hỗ trợ cho:
- Check-in/Check-out cơ bản
- Multi-technician check-in (nhiều kỹ thuật viên cùng lúc)
- Attendance Sessions (quản lý phiên chấm công)
- Attendance Types (loại chấm công)
- Location tracking (theo dõi vị trí)
- Attendance Summary & Statistics (tổng hợp và thống kê)

## Architecture

### Models Liên Quan

#### 1. **Attendance** (attendance)
Lưu trữ từng lần check-in/check-out
- `id`: PK
- `user_id`: FK→users (người dùng chính)
- `work_id`: FK→works (công việc)
- `project_id`: FK→projects (dự án, optional)
- `attendance_session_id`: FK→attendance_sessions (phiên chấm công)
- `parent_attendance_id`: FK→attendance (parent record nếu từ multi-technician)
- `check_in_time`: Thời gian check-in
- `check_out_time`: Thời gian check-out
- `latitude/longitude`: Vị trí GPS
- `status`: 'checked_in' | 'checked_out' | 'on_leave'
- `technicians`: JSONB array (danh sách user IDs tham gia)
- `check_in_type_id`: FK→attendance_type
- `violation_distance`: Khoảng cách vi phạm từ công việc
- `is_valid_time_check_in`: Boolean (null = chưa đánh giá, true = hợp lệ, false = không hợp lệ) — đánh giá sơ bộ khi check-in (ví dụ: kiểm tra thời gian)
- `is_valid_time_check_out`: Boolean (null = chưa đánh giá, true = hợp lệ, false = không hợp lệ) — đánh giá cuối cùng khi check-out (sau khi có duration). Note: if the attendance type defines a `start_time` and the check-in time is at or after that `start_time`, the system will consider the record valid with respect to the duration requirement.

#### 2. **AttendanceSession** (attendance_sessions)
Quản lý một phiên chấm công (cặp check-in/out)
- `id`: PK
- `user_id`: FK→users (primary technician)
- `work_id`: FK→works
- `project_id`: FK→projects
- `started_at`: Thời gian bắt đầu
- `ended_at`: Thời gian kết thúc
- `status`: 'open' | 'closed'
- `duration_minutes`: Thời lượng
- `check_in_id`: FK→attendance (record check-in đầu tiên)
- `check_out_id`: FK→attendance (record check-out cuối cùng)

**Hooks:**
- `beforeCreate`: Kiểm tra không được phép check-in nếu đã có session open
- `afterCreate`: Ghi nhận lịch sử vào AttendanceSessionHistory
- `afterUpdate`: Khi session chuyển sang 'closed', cập nhật attendance records
- `beforeDestroy`: Ghi nhận lịch sử trước khi xóa

#### 3. **AttendanceSessionHistory** (attendance_session_histories)
Lưu lịch sử các phiên chấm công đã kết thúc
- Backup của AttendanceSession sau khi đóng
- `attendee_user_ids`: JSONB array của tất cả users tham gia

#### 4. **CheckInType** (attendance_type)
Các loại chấm công (e.g., regular, overtime, leave, etc.)
- `id`: PK
- `code`: Mã loại
- `name`: Tên loại
- `default_duration_minutes`: Thời lượng mặc định
- `start_time`: Giờ bắt đầu (HH:MM:SS)
- `end_time`: Giờ kết thúc (HH:MM:SS)
- `active`: Có còn sử dụng không

## Business Flow

### 1. Check-in Flow
```
User → POST /attendance/check-in
  ↓
Service validates:
  - User exists
  - Work exists (if provided)
  - Project exists (if provided)
  - CheckInType exists (if provided)
  - User không có session 'open'
  ↓
Create Attendance record
  ↓
Model hook beforeCreate:
  - Tạo AttendanceSession (status='open')
  ↓
Model hook afterCreate:
  - Ghi nhận lịch sử vào AttendanceSessionHistory
  - Nếu technicians > 1: tạo child records
  ↓
Return { Attendance record, sessionId }
```

### 2. Check-out Flow (By Attendance Record)
```
User → POST /attendance/check-out
  ↓
Body must contain `id` (attendance id)
  ↓
Service validates:
  - Attendance exists
  - Chưa check-out (check_out_time null)
  ↓
Update Attendance:
  - Set check_out_time
  - Set status = 'checked_out'
  - Calculate duration_minutes
  ↓
Return { Updated Attendance }
```

### 3. Check-out Flow (By Session)
```
User → POST /attendance/sessions/:sessionId/check-out
  ↓
Service validates:
  - Session exists
  - Session status = 'open'
  ↓
Update AttendanceSession:
  - Set ended_at
  - Set status = 'closed'
  ↓
Model hook afterUpdate:
  - Ghi nhận lịch sử vào AttendanceSessionHistory
  - Cập nhật tất cả attendance records (primary + co-technicians):
    - Set check_out_time = ended_at
    - Set status = 'checked_out'
  - Xóa session khỏi attendance_sessions
  ↓
Return { Closed Session }
```

### 4. Multi-Technician Check-in
Khi check-in với danh sách technicians > 1:
```
checkInData = {
  user_id: 1,
  work_id: 10,
  technicians: [1, 2, 3],
  ...
}
  ↓
Create primary Attendance (user_id=1, technicians=[1,2,3])
  ↓
Model hook afterCreate:
  - Tạo child Attendance records cho user_id=2,3
    - parent_attendance_id = primary.id
    - attendance_session_id = primary.attendance_session_id
    - status = 'checked_in'
  ↓
Khi check-out session:
  - Update tất cả records (primary + children) cùng lúc
  - Xóa session
```

## API Endpoints

### Check-in/Check-out

#### GET /attendance
Lấy danh sách tất cả attendance
```
Response:
{
  "status": "success",
  "data": [Attendance[]],
  "message": "Lấy danh sách attendance thành công"
}
```

#### GET /attendance/:id
Lấy attendance theo ID
```
Response:
{
  "status": "success",
  "data": {Attendance},
  "message": "Lấy thông tin attendance thành công"
}
```

#### POST /attendance/check-in
Check-in người dùng
```
Body:
{
  "user_id": 1,
  "work_id": 10,
  "project_id": 5,
  "latitude": 21.0285,
  "longitude": 105.8542,
  "location_name": "Hanoi Office",
  "address": "123 Le Loi St",
  "photo_urls": "https://...",
  "device_info": "iPhone 13",
  "ip_address": "192.168.1.1",
  "notes": "Check-in note",
  "check_in_type_id": 1,
  "violation_distance": 50,
  "technicians": [1, 2, 3]
}

Response:
{
  "status": "success",
  "data": {Attendance},
  "sessionId": 45,
  "message": "Check-in thành công"
}
```

#### POST /attendance/check-out
Check-out theo attendance ID (id truyền trong body)
```
Body:
{
  "id": 123,
  "location": { "lat": 21.0285, "lng": 105.8542 },
  "note": "Completed tasks"
}

Response:
{
  "status": "success",
  "data": {Attendance},
  "message": "Check-out thành công"
}
```

#### GET /attendance/user/:userId
Lấy lịch sử attendance của người dùng
```
Response:
{
  "status": "success",
  "data": [Attendance[]],
  "message": "Lấy lịch sử attendance thành công"
}
```

### Attendance Sessions

#### GET /attendance/sessions/all
Lấy danh sách tất cả attendance sessions
```
Response:
{
  "status": "success",
  "data": [AttendanceSession[]],
  "message": "Lấy danh sách phiên chấm công thành công"
}
```

#### GET /attendance/sessions/:id
Lấy attendance session theo ID
```
Response:
{
  "status": "success",
  "data": {AttendanceSession with Attendances},
  "message": "Lấy thông tin phiên chấm công thành công"
}
```

#### GET /attendance/sessions/user/:userId/active
Lấy phiên chấm công active của người dùng
```
Response:
{
  "status": "success",
  "data": {AttendanceSession} or null,
  "message": "Lấy phiên chấm công hiện tại thành công"
}
```

#### GET /attendance/sessions/closed?start_date=&end_date=&user_id=
Lấy các phiên chấm công đã đóng trong khoảng thời gian
```
Query params:
- start_date: ISO date (optional)
- end_date: ISO date (optional)
- user_id: integer (optional)

Response:
{
  "status": "success",
  "data": [AttendanceSession[]],
  "message": "Lấy danh sách phiên chấm công đã đóng thành công"
}
```

#### POST /attendance/sessions/:sessionId/check-out
Check-out từ phiên chấm công
```
Response:
{
  "status": "success",
  "data": {AttendanceSession},
  "message": "Check-out phiên chấm công thành công"
}
```

### Attendance Types

#### GET /attendance/types
Lấy danh sách tất cả loại chấm công (active)
```
Response:
{
  "status": "success",
  "data": [CheckInType[]],
  "message": "Lấy danh sách loại chấm công thành công"
}
```

#### GET /attendance/types/:id
Lấy loại chấm công theo ID
```
Response:
{
  "status": "success",
  "data": {CheckInType},
  "message": "Lấy thông tin loại chấm công thành công"
}
```

#### POST /attendance/types
Tạo loại chấm công mới
```
Body:
{
  "code": "OT",
  "name": "Overtime",
  "default_duration_minutes": 240,
  "start_time": "18:00:00",
  "end_time": "22:00:00",
  "description": "Overtime work"
}

Response:
{
  "status": "success",
  "data": {CheckInType},
  "message": "Tạo loại chấm công thành công"
}
```

#### PUT /attendance/types/:id
Cập nhật loại chấm công
```
Body:
{
  "name": "Updated Overtime",
  "description": "Updated description",
  "active": true
}

Response:
{
  "status": "success",
  "data": {CheckInType},
  "message": "Cập nhật loại chấm công thành công"
}
```

#### DELETE /attendance/types/:id
Xóa loại chấm công (soft delete)
```
Response:
{
  "status": "success",
  "message": "Xóa loại chấm công thành công"
}
```

### Locations

#### GET /attendance/locations/technicians?includeOffline=false&includeHistory=false
Lấy danh sách vị trí kỹ thuật viên hiện tại
```
Response:
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "lat": 21.0285,
      "lng": 105.8542,
      "online": true,
      "lastUpdate": "2025-12-20T10:30:00Z",
      "status": "online"
    }
  ],
  "message": "Lấy vị trí kỹ thuật viên thành công"
}
```

#### GET /attendance/locations/office
Lấy vị trí văn phòng
```
Response:
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Main Office",
    "lat": 21.0285,
    "lng": 105.8542,
    "address": "123 Le Loi St",
    "phone": "024-1234-5678",
    "workingHours": "8AM-5PM"
  },
  "message": "Lấy vị trí văn phòng thành công"
}
```

#### GET /attendance/locations/technicians/:technicianId/history?startDate=&endDate=&limit=100
Lấy lịch sử vị trí kỹ thuật viên
```
Response:
{
  "status": "success",
  "data": [
    {
      "lat": 21.0285,
      "lng": 105.8542,
      "timestamp": "2025-12-20T10:30:00Z",
      "status": "online"
    }
  ],
  "message": "Lấy lịch sử vị trí thành công"
}
```

#### GET /attendance/locations/job-items?status=active&includeArchived=false
Lấy vị trí công việc
```
Response:
{
  "status": "success",
  "data": [
    {
      "id": 10,
      "projectId": 5,
      "name": "Install equipment at site A",
      "lat": 21.0285,
      "lng": 105.8542,
      "status": "in_progress",
      "priority": "high",
      "address": "Site A, Hanoi"
    }
  ],
  "message": "Lấy vị trí công việc thành công"
}
```

#### GET /attendance/locations/geocoding/reverse?lat=21.0285&lng=105.8542&language=vi
Reverse geocoding (get address from coordinates)
```
Response:
{
  "status": "success",
  "data": {
    "displayName": "123 Le Loi Street, Hanoi, Vietnam",
    "fullAddress": "123 Le Loi Street, Hanoi, Vietnam",
    "district": "Hoan Kiem",
    "ward": "Dong Da",
    "city": "Hanoi",
    "road": "Le Loi Street"
  },
  "message": "Geocoding reverse thành công"
}
```

### Attendance Summary & Statistics

#### GET /attendance/reports/summary?start_date=&end_date=&department_id=&employee_id=
Lấy dữ liệu tổng quan chấm công
```
Query params:
- start_date: ISO date (e.g., 2025-12-01)
- end_date: ISO date (e.g., 2025-12-31)
- department_id: integer (optional)
- employee_id: integer (optional)

Response:
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "department": "Technical",
      "dates": {
        "2025-12-20": {
          "status": "present",
          "checkIn": "08:00",
          "checkOut": "17:30",
          "duration": "9h 30m",
          "location": "✓"
        },
        "2025-12-21": {
          "status": "late",
          "checkIn": "08:30",
          "checkOut": "17:30",
          "duration": "9h 0m",
          "location": "✓"
        }
      }
    }
  ],
  "message": "Lấy dữ liệu tổng quan chấm công thành công"
}
```

#### GET /attendance/reports/statistics?start_date=&end_date=&department_id=&employee_id=
Lấy thống kê chấm công
```
Response:
{
  "status": "success",
  "data": {
    "totalPresent": 20,
    "totalLate": 3,
    "totalAbsent": 2,
    "totalSick": 1
  },
  "message": "Lấy thống kê chấm công thành công"
}
```

## Key Features

### 1. Multi-Technician Support
- Một lần check-in có thể liên kết với nhiều kỹ thuật viên
- Tự động tạo child records cho mỗi kỹ thuật viên
- Khi check-out, tất cả records được cập nhật cùng lúc

### 2. Session Management
- Mỗi user chỉ có thể có 1 session 'open' ở một thời điểm
- Tự động kiểm tra trước khi check-in
- Lịch sử session được lưu vào AttendanceSessionHistory

### 3. Status Tracking
- Attendance status: 'checked_in', 'checked_out', 'on_leave'
- Session status: 'open', 'closed'

### 4. Location Tracking
- GPS coordinates validation
- Distance from work calculation
- Radius check support
- Reverse geocoding integration

### 5. Attendance Types
- Configurable check-in types
- Support for different work hours
- Default duration calculation

## Error Handling

Tất cả endpoints trả về error responses có format:
```json
{
  "error": "Error message"
}
```

Các HTTP status codes:
- 200: Success (GET, PUT)
- 201: Created (POST successful)
- 400: Bad request (validation error, business logic error)
- 404: Not found
- 500: Server error

## Notes

1. **Transactions**: Các operations check-in/check-out được thực hiện trong transaction để đảm bảo consistency
2. **Indexes**: Các indexes được tạo cho optimization queries
3. **Soft Delete**: AttendanceType được soft delete (set active=false)
4. **Historical Data**: AttendanceSessionHistory lưu trữ lịch sử tất cả sessions
