# Hướng dẫn Tối ưu hóa Form và Persistence

## 1. Giới thiệu

Tài liệu này hướng dẫn các best practices để tối ưu hóa form React, đặc biệt là cơ chế lưu trữ dữ liệu (persistence) và quản lý trạng thái. Các nguyên tắc này được áp dụng thành công trong JobFormDrawer component.

---

## 2. Bài toán Cụ thể: Job Form Drawer

### 2.1 Yêu cầu Ban đầu
- Form với 20+ trường nhập liệu (text, select, autocomplete, date/time)
- Lưu draft tự động khi người dùng nhập dữ liệu
- Khôi phục draft khi mở lại form
- Tối ưu hiệu năng - không lag khi gõ

### 2.2 Các Thách thức
1. **Performance Lag**: Mỗi keystroke trigger save → localStorage write nhiều lần/giây
2. **Undefined Select Values**: Material-UI error khi select value là undefined
3. **React Warnings**: Key prop bị spread vào JSX không hợp lệ
4. **Draft Management**: Cân bằng giữa lưu dữ liệu và tránh saves không cần thiết

---

## 3. Giải Pháp Chi Tiết

### 3.1 Tiến hóa Cơ chế Lưu trữ

#### Phương pháp 1: onChange Save (❌ Không khuyến khích)
```javascript
// ❌ BAD: Saves on every keystroke
<TextField
  onChange={(e) => {
    const newData = {...formData, field: e.target.value};
    handleFormDataChange(newData);
    localStorage.setItem('draft', JSON.stringify(newData)); // Too frequent!
  }}
/>
```
**Vấn đề**:
- Ghi localStorage tại mỗi keystroke (10-20 lần/giây)
- Gây lag trên các form phức tạp
- Tiêu tốn tài nguyên không cần thiết

---

#### Phương pháp 2: Debounce Save (⚠️ Cân nhân)
```javascript
const debounceTimeoutRef = useRef(null);

const handleFormDataChange = (newFormData) => {
  setFormData(newFormData);
  setHasChanged(true);
  
  // Clear previous timeout
  if (debounceTimeoutRef.current) {
    clearTimeout(debounceTimeoutRef.current);
  }
  
  // Save after 500ms of inactivity
  debounceTimeoutRef.current = setTimeout(() => {
    if (hasChanged) {
      localStorage.setItem(draftKey, JSON.stringify(newFormData));
    }
  }, 500);
};
```
**Ưu điểm**:
- Giảm frequency của save operations
- Tốt cho forms phức tạp

**Nhược điểm**:
- Vẫn có delay 500ms trước khi save
- Có thể mất dữ liệu nếu user tắt tab trước khi debounce execute
- Codebase phức tạp hơn với refs quản lý

---

#### Phương pháp 3: Blur-based Save (✅ Khuyến khích)
```javascript
const handleBlur = () => {
  if (hasChanged && formData && Object.keys(formData).length > 0) {
    const key = editingId ? `jobFormDraft_edit_${editingId}` : 'jobFormDraft_new';
    localStorage.setItem(key, JSON.stringify(formData));
  }
};

// Áp dụng trên tất cả input fields:
<TextField
  value={formData.title}
  onChange={(e) => handleFormDataChange({...formData, title: e.target.value})}
  onBlur={handleBlur}  // ← Save on field blur
/>
```

**Ưu điểm**:
- ✅ Save ngay lập tức khi user rời khỏi field (không lag)
- ✅ Tự nhiên - đúng thời điểm user muốn save
- ✅ Đơn giản - không cần debounce ref hay timeout
- ✅ Hiệu năng cao - chỉ save ~20 lần/session thay vì 1000+
- ✅ User expectation aligned - save khi rời field

**Nhược điểm**:
- Không save nếu user không rời field (nhưng họ vẫn trong form)
- Cần clear draft sau save thành công

---

### 3.2 Change Tracking Pattern

```javascript
const [hasChanged, setHasChanged] = useState(false);

const handleFormDataChange = (newFormData) => {
  setFormData(newFormData);
  setHasChanged(true); // Flag để biết có thay đổi
};

const handleBlur = () => {
  // Chỉ save nếu có thay đổi VÀ có dữ liệu
  if (hasChanged && formData && Object.keys(formData).length > 0) {
    localStorage.setItem(draftKey, JSON.stringify(formData));
  }
};
```

**Tại sao cần hasChanged flag?**
- Tránh save khi form chỉ được open/close mà không edit
- Tránh ghi empty dữ liệu
- Rõ ràng về intent

---

### 3.3 Select Field Value Fallback

#### Problem
```javascript
// ❌ Causes Material-UI error: "The provided value is not in the list"
<Select value={formData.category_id}>
  <MenuItem value="cat1">Category 1</MenuItem>
</Select>
```

Material-UI expects value để là một trong các MenuItem values hoặc falsy value (null, undefined).

#### Solution
```javascript
// ✅ Use empty string as fallback
<Select 
  value={formData.category_id || ""}
  onChange={(e) => handleFormDataChange({...formData, category_id: e.target.value})}
  onBlur={handleBlur}
>
  <MenuItem value="">-- Chọn danh mục --</MenuItem>
  <MenuItem value="cat1">Category 1</MenuItem>
  <MenuItem value="cat2">Category 2</MenuItem>
</Select>
```

**Áp dụng cho**:
- Tất cả Select fields
- Autocomplete fields  
- Bất kỳ component nào có controlled value

---

### 3.4 React Key Warning Fix

#### Problem
```javascript
// ❌ Key prop được spread vào JSX - React warning
<Autocomplete
  renderOption={(props, option) => (
    <Box {...props} sx={{...}}>
      {option.name}
    </Box>
  )}
/>
```

Material-UI's Autocomplete renderOption nhận `props` gồm: `key`, `data-option-index`, `data-popper-placement`, vv.

#### Solution
```javascript
// ✅ Extract key trước khi spread
<Autocomplete
  renderOption={(props, option) => {
    const { key, ...restProps } = props;
    return (
      <Box key={key} {...restProps} sx={{...}}>
        {option.name}
      </Box>
    );
  }}
/>
```

---

### 3.5 Draft Storage Keys Management

```javascript
// Constants
const DRAFT_STORAGE_KEY = 'jobFormDraft_new';
const DRAFT_STORAGE_KEY_EDIT = (id) => `jobFormDraft_edit_${id}`;

// Determine key based on mode
const draftKey = editingId 
  ? DRAFT_STORAGE_KEY_EDIT(editingId) 
  : DRAFT_STORAGE_KEY;

// Restore draft on open
useEffect(() => {
  const saved = localStorage.getItem(draftKey);
  if (saved) {
    setFormData(JSON.parse(saved));
  } else {
    // Initialize with defaults
    setFormData({work_code: `lqd_work_${Date.now()}${randomNum}`});
  }
}, [open, editingId]);

// Clear draft on save/cancel
const handleSave = async () => {
  // ... API call
  localStorage.removeItem(draftKey); // Clear after success
};

const handleCancel = () => {
  localStorage.removeItem(draftKey);
  onClose();
};
```

**Lợi ích**:
- Tách biệt draft cho new vs edit mode
- Khôi phục lại khi user quay lại
- Clean up sau khi submit

---

## 4. Implementation Checklist

### 4.1 Basic Form Setup
- [ ] Define form state với useState
- [ ] Create handleFormDataChange function với hasChanged flag
- [ ] Add onBlur={handleBlur} trên **tất cả** input fields
- [ ] Add fallback values cho select: `value={field || ""}`

### 4.2 Storage Implementation
- [ ] Define DRAFT_STORAGE_KEY constants
- [ ] Implement draft restore logic trong useEffect
- [ ] Implement handleBlur để save draft
- [ ] Clear draft on save/cancel

### 4.3 UI Components
- [ ] Use TextField cho text inputs
- [ ] Use Select + MenuItem cho dropdowns
- [ ] Use Autocomplete cho combobox
- [ ] Use FormControlLabel + Checkbox cho booleans
- [ ] Add proper labels và error messages

### 4.4 Bug Fixes
- [ ] Fix Select undefined values: `value={field || ""}`
- [ ] Fix Autocomplete key warning: Extract key từ props
- [ ] Test form submission flow
- [ ] Test draft restoration

---

## 5. Performance Metrics

| Metric | onChange Save | Debounce Save | Blur-based Save |
|--------|---------------|---------------|-----------------|
| Saves per session (20 fields) | 1000+ | 150-200 | 20-30 |
| Input lag | High ⚠️ | Low ✅ | None ✅ |
| Data loss risk | Low | Medium | Low |
| Code complexity | Simple | Medium | Simple |
| User experience | Laggy | Smooth | Smooth |
| **Recommended** | ❌ | ⚠️ | ✅ |

---

## 6. Real-world Example: JobFormDrawer

### 6.1 Form Sections
```
┌─ Header (Title + Close) ─────────────────────┐
│  Thông tin công việc (Job Info)             │
├─────────────────────────────────────────────┤
│  Giao nhiệm vụ (Assignment)                 │
├─────────────────────────────────────────────┤
│  Thông tin khách hàng (Customer Info)       │
├─────────────────────────────────────────────┤
│  Ngày được yêu cầu (Schedule & Cost)        │
├─────────────────────────────────────────────┤
│ [Cancel] [Add/Update]                       │
└─────────────────────────────────────────────┘
```

### 6.2 Fields & Types
- **Text fields**: title, description, notes, customer_name, location
- **Select fields**: category_id, priority, project_id, status
- **Autocomplete**: assigned_to_technician_id (multi-select)
- **Date/Time**: required_date, required_time_hour, required_time_minute
- **Number**: estimated_cost
- **Computed**: work_code (auto-generated), time display (readonly)

### 6.3 Storage Keys
- New form: `jobFormDraft_new`
- Edit form: `jobFormDraft_edit_{jobId}`

---

## 7. Common Pitfalls & Solutions

### 7.1 "Value mismatch" Error in Select
**Problem**: Select value không khớp với bất kỳ MenuItem nào
```javascript
// ❌ Causes error
<Select value={undefined}>
  <MenuItem value="opt1">Option 1</MenuItem>
</Select>
```

**Solution**: Always provide fallback empty string
```javascript
// ✅ Correct
<Select value={formData.status || ""}>
  <MenuItem value="">-- Chọn --</MenuItem>
  <MenuItem value="opt1">Option 1</MenuItem>
</Select>
```

---

### 7.2 Unsaved Data on Page Unload
**Problem**: User closes tab/window trước khi blur save được execute

**Solution**: Add beforeunload listener
```javascript
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (hasChanged && formData && Object.keys(formData).length > 0) {
      localStorage.setItem(draftKey, JSON.stringify(formData));
      e.preventDefault();
      e.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hasChanged, formData, draftKey]);
```

---

### 7.3 Draft Not Clearing on Submit
**Problem**: Cũ draft vẫn còn sau khi submit

**Solution**: Clear draft after successful API call
```javascript
const handleSave = async () => {
  try {
    const response = await api.createJob(formData);
    // ✅ Clear draft on success
    localStorage.removeItem(draftKey);
    onClose();
  } catch (error) {
    // ⚠️ Keep draft on error so user can retry
    console.error(error);
  }
};
```

---

## 8. Testing Checklist

- [ ] Open form → Enter data → Close form
- [ ] Re-open form → Verify draft is restored
- [ ] Edit form → Change field → Close → Re-open → Verify changes
- [ ] Submit form → Verify draft is cleared
- [ ] Click Cancel → Verify draft is cleared and form resets
- [ ] Multiple select (Autocomplete) → Add/remove items → Verify saves
- [ ] Date/Time fields → Enter values → Blur → Verify saves
- [ ] Close browser tab during input → Re-open form → Verify recovery

---

## 9. Code Template

```javascript
// ==================== STATE ====================
const [formData, setFormData] = useState({
  // Initialize fields
  work_code: '',
  title: '',
  // ... other fields
});
const [hasChanged, setHasChanged] = useState(false);

// ==================== HANDLERS ====================
const handleFormDataChange = (newFormData) => {
  setFormData(newFormData);
  setHasChanged(true);
};

const handleBlur = () => {
  if (hasChanged && formData && Object.keys(formData).length > 0) {
    const key = editingId 
      ? `jobFormDraft_edit_${editingId}` 
      : 'jobFormDraft_new';
    localStorage.setItem(key, JSON.stringify(formData));
  }
};

// ==================== EFFECTS ====================
useEffect(() => {
  const draftKey = editingId 
    ? `jobFormDraft_edit_${editingId}` 
    : 'jobFormDraft_new';
  const saved = localStorage.getItem(draftKey);
  
  if (saved) {
    setFormData(JSON.parse(saved));
  }
}, [open, editingId]);

// ==================== RENDER ====================
<TextField
  value={formData.title}
  onChange={(e) => handleFormDataChange({
    ...formData, 
    title: e.target.value
  })}
  onBlur={handleBlur}
/>

<Select
  value={formData.status || ""}
  onChange={(e) => handleFormDataChange({
    ...formData,
    status: e.target.value
  })}
  onBlur={handleBlur}
>
  <MenuItem value="">-- Chọn --</MenuItem>
  <MenuItem value="pending">Pending</MenuItem>
</Select>
```

---

## 10. References

- [React Hooks Documentation](https://react.dev/reference/react)
- [Material-UI TextField](https://mui.com/api/text-field/)
- [Material-UI Select](https://mui.com/api/select/)
- [Material-UI Autocomplete](https://mui.com/api/autocomplete/)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [React Best Practices](https://react.dev/learn)

---

## 11. Tóm Tắt

| Khía cạnh | Khuyến nghị |
|-----------|----------|
| **Cơ chế Save** | Blur-based (không debounce) |
| **Tần suất Storage Write** | 20-30 lần/session |
| **Change Tracking** | Sử dụng hasChanged flag |
| **Select Fallback** | Luôn dùng `value \|\| ""` |
| **Draft Keys** | Tách biệt new vs edit |
| **Cleanup** | Clear draft sau success |
| **Error Handling** | Giữ draft nếu submit fail |

---

**Cập nhật cuối**: 23/12/2025
**Phiên bản**: 1.0
