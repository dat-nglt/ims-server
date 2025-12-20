# Tóm Tắt Các Thay Đổi - Attendance API Enhancement

**Ngày cập nhật:** 20/12/2025

## 📋 Tổng Quát

Đã hoàn thành việc điều chỉnh luồng nghiệp vụ chấm công và bổ sung các routes đầy đủ theo cấu trúc của các models (Attendance, AttendanceSession, AttendanceSessionHistory, CheckInType).

## 🔄 Luồng Nghiệp Vụ Chính

### 1. **Check-in Flow**
```
POST /attendance/check-in
  ↓
Validate user, work, project, checkInType
  ↓
Create Attendance record
  ↓
Auto-create AttendanceSession (status='open')
  ↓
If multi-technician: Create child Attendance records
  ↓
Return attendance + sessionId
```

### 2. **Check-out Flow (Option 1 - By Attendance)**
```
POST /attendance/:id/check-out
  ↓
Update Attendance: set check_out_time + status='checked_out'
  ↓
Calculate duration_minutes
  ↓
Model hook auto-updates related session
```

### 3. **Check-out Flow (Option 2 - By Session)**
```
POST /attendance/sessions/:sessionId/check-out
  ↓
Update Session: set ended_at + status='closed'
  ↓
Model hook auto-updates all attendance records
  ↓
Delete session from attendance_sessions
```

### 4. **Multi-Technician Support**
- Một lần check-in với nhiều kỹ thuật viên
- Tự động tạo child records liên kết qua `parent_attendance_id`
- Khi check-out session: cập nhật tất cả records cùng lúc

## 📝 Các Service Mới Được Thêm

### Attendance Session Services
- `getAllAttendanceSessionsService()` - Lấy tất cả sessions
- `getAttendanceSessionByIdService(id)` - Lấy session theo ID
- `getActiveSessionByUserService(userId)` - Lấy session active của user
- `getClosedSessionsService({startDate, endDate, userId})` - Lấy sessions đã đóng

### Attendance Type Services
- `getAllAttendanceTypesService()` - Lấy tất cả loại chấm công
- `getAttendanceTypeByIdService(id)` - Lấy loại theo ID
- `createAttendanceTypeService(typeData)` - Tạo loại mới
- `updateAttendanceTypeService(id, typeData)` - Cập nhật loại
- `deleteAttendanceTypeService(id)` - Xóa loại (soft delete)

### Check-in/Check-out Services Cải Tiến
- `checkInService()` - Cập nhật hỗ trợ check_in_type_id + validation tốt hơn
- `checkOutSessionService(sessionId)` - Check-out từ session

## 🎯 Các Controller Mới Được Thêm

### Attendance Session Controllers
- `getAllAttendanceSessionsController`
- `getAttendanceSessionByIdController`
- `getActiveSessionByUserController`
- `getClosedSessionsController`
- `checkOutSessionController`

### Attendance Type Controllers
- `getAllAttendanceTypesController`
- `getAttendanceTypeByIdController`
- `createAttendanceTypeController`
- `updateAttendanceTypeController`
- `deleteAttendanceTypeController`

## 🛣️ Các Routes Mới Được Thêm

### Check-in/Check-out Routes
```
GET    /attendance
POST   /attendance/check-in
POST   /attendance/:id/check-out
GET    /attendance/:id
GET    /attendance/user/:userId
```

### Attendance Session Routes
```
GET    /attendance/sessions/all
GET    /attendance/sessions/:id
GET    /attendance/sessions/user/:userId/active
GET    /attendance/sessions/closed?start_date=&end_date=&user_id=
POST   /attendance/sessions/:sessionId/check-out
```

### Attendance Type Routes
```
GET    /attendance/types
POST   /attendance/types
GET    /attendance/types/:id
PUT    /attendance/types/:id
DELETE /attendance/types/:id
```

### Location Routes
```
GET    /attendance/locations/technicians?includeOffline=false
GET    /attendance/locations/office
GET    /attendance/locations/technicians/:technicianId/history
GET    /attendance/locations/job-items?status=&includeArchived=false
GET    /attendance/locations/geocoding/reverse?lat=&lng=&language=vi
```

### Report Routes
```
GET    /attendance/reports/summary?start_date=&end_date=&department_id=&employee_id=
GET    /attendance/reports/statistics?start_date=&end_date=&department_id=&employee_id=
```

## 📦 Files Được Sửa

### 1. **Service File** - `src/services/operations/attendance.service.js`
- ✅ Cải tiến `checkInService()` - thêm validation cho `check_in_type_id` + kiểm tra session open
- ✅ Cải tiến `checkOutService()` - tối ưu logic
- ✅ Thêm `checkOutSessionService()` - check-out từ session
- ✅ Thêm 4 session services
- ✅ Thêm 5 attendance type services
- **Total lines:** 753 (từ 502)

### 2. **Controller File** - `src/controllers/operations/attendance.controller.js`
- ✅ Thêm 5 session controllers
- ✅ Thêm 5 attendance type controllers
- **Total lines:** 523 (từ 301)

### 3. **Route File** - `src/routes/operations/attendance.route.js`
- ✅ Tổ chức lại routes theo nhóm logic
- ✅ Thêm routes cho sessions
- ✅ Thêm routes cho attendance types
- ✅ Tổ chức location routes tốt hơn
- ✅ Tổ chức report routes tốt hơn
- **Total routes:** 22 (từ 14)

### 4. **Documentation** - `src/docs/attendance-api.md` (NEW)
- 📖 Chi tiết Architecture
- 📖 Models & Data Structure
- 📖 Business Flow Diagrams
- 📖 Tất cả API Endpoints với request/response examples
- 📖 Key Features & Error Handling

## 🔑 Key Improvements

### Validation & Error Handling
- ✅ Kiểm tra user, work, project, checkInType tồn tại
- ✅ Kiểm tra session open trước check-in
- ✅ Kiểm tra status trước check-out
- ✅ Consistent error messages

### Data Consistency
- ✅ Transactions cho check-in/check-out
- ✅ Auto-calculate duration_minutes
- ✅ Model hooks xử lý logic phức tạp
- ✅ Soft delete cho AttendanceType

### Multi-Technician Support
- ✅ JSONB array technicians trong Attendance
- ✅ Auto-create child records
- ✅ Update tất cả records khi check-out session
- ✅ Track parent-child relationship via parent_attendance_id

### History Tracking
- ✅ AttendanceSessionHistory lưu lịch sử tất cả sessions
- ✅ Archive khi session close
- ✅ Track attendee_user_ids (tất cả who attended)

## 🧪 Testing Notes

### Recommended Test Cases

**1. Basic Check-in/Check-out**
```bash
# Check-in
POST /attendance/check-in
{
  "user_id": 1,
  "work_id": 10,
  "latitude": 21.0285,
  "longitude": 105.8542,
  "check_in_type_id": 1
}

# Check-out by session
POST /attendance/sessions/:sessionId/check-out

# Verify session is closed and deleted
GET /attendance/sessions/:sessionId  # Should return 404 or null
```

**2. Multi-Technician Check-in**
```bash
POST /attendance/check-in
{
  "user_id": 1,
  "work_id": 10,
  "latitude": 21.0285,
  "longitude": 105.8542,
  "technicians": [1, 2, 3]
}

# Verify child records created
GET /attendance/sessions/:sessionId
# Should see 3 attendance records with same session
```

**3. Attendance Type Management**
```bash
# Create
POST /attendance/types
{
  "code": "OT",
  "name": "Overtime",
  "start_time": "18:00:00",
  "end_time": "22:00:00"
}

# Use in check-in
POST /attendance/check-in
{
  ...,
  "check_in_type_id": 2
}

# Delete (soft)
DELETE /attendance/types/2

# Verify active=false
GET /attendance/types/2
```

**4. Session Queries**
```bash
# Get active session
GET /attendance/sessions/user/1/active

# Get closed sessions
GET /attendance/sessions/closed?start_date=2025-12-01&end_date=2025-12-31&user_id=1
```

## 📊 Database Impact

No schema changes needed - all new functionality uses existing tables:
- `attendance` - Enhanced with check_in_type_id support
- `attendance_sessions` - Full implementation
- `attendance_session_histories` - Full implementation
- `attendance_type` - Full utilization

## 🚀 Deployment Checklist

- [ ] Review và test tất cả endpoints
- [ ] Verify model hooks hoạt động đúng
- [ ] Test multi-technician flow
- [ ] Test session close + cascade updates
- [ ] Load test location endpoints
- [ ] Verify historical data tracking
- [ ] Update API documentation cho clients

## 📚 Useful Resources

- API Documentation: `src/docs/attendance-api.md`
- Models: 
  - `src/models/operations/attendance.model.js`
  - `src/models/operations/attendanceSession.model.js`
  - `src/models/operations/attendanceSessionHistory.model.js`
  - `src/models/operations/attendance-type.model.js`
- Services: `src/services/operations/attendance.service.js`
- Controllers: `src/controllers/operations/attendance.controller.js`
- Routes: `src/routes/operations/attendance.route.js`
