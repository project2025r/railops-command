# API Quick Reference Guide

## 🚀 Endpoints by Category

### 🔐 Authentication (3 endpoints)
- `POST /login` - User login
- `POST /logout` - User logout  
- `GET /me` - Get current user info

### 👤 User Management (4 endpoints)
- `POST /create-user` - Create new user
- `GET /users` - List all users (detailed)
- `GET /list-users` - List all users
- `DELETE /delete-user/{user_id}` - Delete user

### 📁 Files (6 endpoints)
- `GET /files` - Get all files
- `GET /database-files` - Get database files
- `GET /file-content` - Get file content from S3
- `GET /database-file-content` - Get file content from DB
- `GET /combined-files` - Get combined files
- `GET /combined-file-content` - Get combined file content

### 📝 Transcripts & Search (3 endpoints)
- `GET /transcripts/search` - Search transcripts
- `GET /transcript-kpi` - Get transcript KPIs
- `GET /violation-analysis` - Analyze violations

### 🏢 Divisions (3 endpoints)
- `POST /create-division` - Create division
- `GET /list-divisions` - List divisions
- `DELETE /delete-division/{division_id}` - Delete division

### 📊 Dashboard & Analytics (4 endpoints)
- `GET /dashboard-data` - Get dashboard data
- `GET /database-stats` - Get DB statistics
- `GET /admin/file-counts-summary` - Get file counts
- `GET /admin/real-time-file-counts` - Real-time counts

### 📢 Keywords (3 endpoints)
- `GET /keywords` - Get all keywords
- `POST /keywords/update` - Update keyword
- `POST /keywords/add` - Add keyword

### 📤 Upload & Sync (9 endpoints)
- `POST /upload-audio` - Upload audio file
- `POST /upload-audio-with-metadata` - Upload with metadata
- `POST /sync-s3-to-database` - Manual S3 sync
- `POST /auto-sync/start` - Start auto-sync
- `POST /auto-sync/stop` - Stop auto-sync
- `GET /auto-sync/status` - Get sync status
- `POST /initialize-database` - Initialize DB
- `POST /fix-audio-urls` - Fix audio URLs
- `POST /migrate-database` - Run migrations

### 🎯 Data & Dropdowns (4 endpoints)
- `GET /lp-alp-section-data` - Get LP/ALP/Section data
- `GET /lp-alp-section-combinations` - Get combinations
- `GET /new-dropdown-data` - Get dropdown options
- `GET /upload-history` - Get upload history

### 🎵 Audio & Utilities (3 endpoints)
- `GET /audio-file` - Get audio file
- `GET /lp-files/{lp_name}` - Get LP's files
- `GET /test-parsing` - Test filename parsing
- `GET /ingestion/status` - Get ingestion status
- `GET /user-division` - Get user's division

---

## 🔑 Authentication Status Required

### 🔓 Public (No Auth Required)
- `GET /files`
- `GET /list-divisions`
- `GET /file-content`
- `GET /database-stats`
- `POST /login`
- `POST /logout`

### 🔒 Authenticated Users
- `GET /me`
- `GET /user-division`
- `GET /lp-alp-section-data`
- `GET /lp-alp-section-combinations`
- `GET /new-dropdown-data`
- `GET /upload-history`
- `POST /upload-audio`
- `POST /upload-audio-with-metadata`
- `GET /audio-file`
- `GET /dashboard-data`
- `GET /lp-files/{lp_name}`
- `GET /transcripts/search`
- `GET /transcript-kpi`
- `GET /violation-analysis`
- `GET /keywords`
- `GET /ingestion/status`
- `GET /test-parsing`
- `GET /database-file-content`
- `GET /combined-file-content`
- `GET /database-files`

### 👮 Admin Only
- `GET /admin/file-counts-summary`
- `GET /admin/real-time-file-counts`
- `POST /sync-s3-to-database`
- `POST /auto-sync/start`
- `POST /auto-sync/stop`
- `GET /auto-sync/status`
- `POST /initialize-database`
- `POST /fix-audio-urls`
- `POST /migrate-database`
- `POST /keywords/update`
- `POST /keywords/add`

### 👤 Super Admin Only
- `POST /create-user`
- `GET /users`
- `GET /list-users`
- `DELETE /delete-user/{user_id}`
- `POST /create-division`
- `DELETE /delete-division/{division_id}`

---

## 📋 Common Query Parameters

| Parameter | Type | Used In | Example |
|-----------|------|---------|---------|
| `division` | string | Most | `?division=Headquarters` |
| `page` | int | Search/List | `?page=2` |
| `limit` / `per_page` | int | Search/List | `?limit=100` |
| `keyword` | string | Search | `?keyword=safety` |
| `start_date` | string | Filters | `?start_date=2024-01-01` |
| `end_date` | string | Filters | `?end_date=2024-12-31` |
| `loco_pilot` | string | Filters | `?loco_pilot=John%20Doe` |
| `section` | string | Filters | `?section=North` |
| `filename` | string | Files | `?filename=data.csv` |
| `file_id` | int | Files | `?file_id=123` |
| `file_ids` | string | Combined | `?file_ids=1,2,3` |

---

## 🎨 HTTP Methods Quick View

| Method | Count | Purpose |
|--------|-------|---------|
| `GET` | 26 | Retrieve data |
| `POST` | 14 | Create data / Execute action |
| `DELETE` | 2 | Remove data |
| **TOTAL** | **42** | **Endpoints** |

---

## ⚠️ Error Codes

```
200 - Success
400 - Bad Request (missing/invalid params)
401 - Unauthorized (invalid login)
403 - Forbidden (insufficient permissions)
404 - Not Found
413 - File Too Large
500 - Server Error
```

---

## 🔄 Workflow Examples

### Example 1: User Login & View Dashboard
```
1. POST /login (with username, password, division)
2. GET /me (verify login - uses cookie)
3. GET /dashboard-data (get dashboard stats)
4. GET /admin/file-counts-summary (if admin)
```

### Example 2: Search Transcripts
```
1. GET /transcripts/search?keyword=violation&division=HQ
2. GET /transcript-kpi (for statistics)
3. GET /violation-analysis (detailed analysis)
```

### Example 3: Upload File with Metadata
```
1. GET /new-dropdown-data (get options for form)
2. POST /upload-audio-with-metadata (upload file)
3. GET /ingestion/status (check progress)
```

### Example 4: Manage Divisions (Super Admin)
```
1. GET /list-divisions (view all divisions)
2. POST /create-division (create new)
3. DELETE /delete-division/{id} (remove)
```

### Example 5: Keyword Management (Admin)
```
1. GET /keywords (list current keywords)
2. POST /keywords/add (add new keyword)
3. POST /keywords/update (modify keyword)
4. GET /transcript-kpi (see keyword hits)
```

---

## 🛠️ Frontend Integration Checklist

- [ ] Implement login form (POST /login)
- [ ] Store authentication cookie
- [ ] Create protected route wrapper
- [ ] Build user profile page (GET /me)
- [ ] Implement dashboard (GET /dashboard-data)
- [ ] Create file browser (GET /files, GET /database-files)
- [ ] Build search functionality (GET /transcripts/search)
- [ ] Add file upload form (POST /upload-audio-with-metadata)
- [ ] Implement KPI charts (GET /transcript-kpi)
- [ ] Create admin panel (GET /admin/*)
- [ ] Build user management (GET /users, POST /create-user, DELETE /delete-user)
- [ ] Add division management (GET /list-divisions, POST /create-division)
- [ ] Implement keyword management (GET /keywords, POST /keywords/*)
- [ ] Add violation analysis view (GET /violation-analysis)
- [ ] Create loco pilot profile page (GET /lp-files/{lp_name})
- [ ] Build settings page (user preferences, password change if needed)
- [ ] Add logout functionality (POST /logout)
- [ ] Implement error handling for all API calls
- [ ] Add loading states and UI feedback
- [ ] Test with different user roles (user, admin, super admin)

---

## 🚀 Quick Integration Example

### React/JavaScript Setup
```javascript
// api.js - Centralized API configuration
const API_BASE = 'http://localhost:8000';

export const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include', // Important: Include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...defaultOptions,
    ...options
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API Error');
  }

  return response.json();
};

// Usage examples
async function login(username, password, division) {
  return apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, division })
  });
}

async function getDashboardData() {
  return apiCall('/dashboard-data');
}

async function searchTranscripts(keyword, filters = {}) {
  const params = new URLSearchParams({ keyword, ...filters });
  return apiCall(`/transcripts/search?${params}`);
}
```

---

## 📞 Important Notes

1. **All timestamps** are in ISO 8601 format (UTC)
2. **Date parameters** should be `YYYY-MM-DD` format
3. **File uploads** must use `multipart/form-data`
4. **Cookies** are HTTP-only - include `credentials: 'include'` in fetch
5. **Division** filtering is available on most endpoints
6. **Pagination** defaults: page=1, limit=50
7. **Search** is case-insensitive for keywords
8. **Rate limiting** may be in place - handle 429 errors
9. **CORS** is enabled for your frontend origin
10. **Session timeout** is configurable (check backend config)





