# Audio Analysis Backend API Documentation

## Base URL
`http://localhost:8000` (or your deployed backend URL)

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User Management APIs](#user-management-apis)
3. [File & Data APIs](#file--data-apis)
4. [Transcript & Search APIs](#transcript--search-apis)
5. [Admin & Division APIs](#admin--division-apis)
6. [KPI & Analysis APIs](#kpi--analysis-apis)
7. [Upload & Sync APIs](#upload--sync-apis)
8. [Utility APIs](#utility-apis)

---

## Authentication APIs

### 1. Login
**Endpoint:** `POST /login`

**Description:** Authenticate user and create session

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "division": "string (optional, required for non-admin)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "username": "string",
  "is_admin": boolean,
  "is_super_admin": boolean,
  "division": "string | null"
}
```

**Status Codes:**
- `200`: Login successful
- `400`: Missing username/password or division required
- `401`: Invalid credentials or invalid division

---

### 2. Logout
**Endpoint:** `POST /logout`

**Description:** Invalidate session and clear cookies

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true
}
```

---

### 3. Get Current User
**Endpoint:** `GET /me`

**Description:** Retrieve current authenticated user information

**Authentication:** Required (Cookie-based)

**Response (200 OK):**
```json
{
  "id": "integer",
  "username": "string",
  "is_admin": boolean,
  "is_super_admin": boolean,
  "division": "string | null",
  "last_loggedin": "ISO 8601 timestamp"
}
```

---

## User Management APIs

### 4. Create User
**Endpoint:** `POST /create-user`

**Description:** Create new user account (Super Admin only)

**Authentication:** Required (Super Admin)

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "division": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user_id": "integer",
  "message": "User created successfully"
}
```

**Status Codes:**
- `200`: User created
- `400`: Username already exists or missing data
- `403`: Only super admin can create users
- `500`: Server error

---

### 5. List All Users
**Endpoint:** `GET /list-users`

**Description:** Get all users (Super Admin only)

**Authentication:** Required (Super Admin)

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "integer",
      "username": "string",
      "division": "string | null",
      "is_admin": boolean,
      "is_super_admin": boolean,
      "created_at": "ISO 8601 timestamp",
      "last_loggedin": "ISO 8601 timestamp | null"
    }
  ],
  "total": "integer"
}
```

---

### 6. Get All Users (Detailed)
**Endpoint:** `GET /users`

**Description:** Get all users with detailed information (Super Admin only)

**Authentication:** Required (Super Admin)

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "integer",
      "username": "string",
      "division": "string | null",
      "is_admin": boolean,
      "is_super_admin": boolean,
      "created_at": "ISO 8601 timestamp",
      "last_loggedin": "ISO 8601 timestamp | null"
    }
  ],
  "total": "integer"
}
```

---

### 7. Delete User
**Endpoint:** `DELETE /delete-user/{user_id}`

**Description:** Delete a user account (Super Admin only)

**Authentication:** Required (Super Admin)

**URL Parameters:**
- `user_id` (integer): ID of user to delete

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Status Codes:**
- `200`: User deleted
- `403`: Only super admin can delete users
- `400`: Cannot delete super admin
- `404`: User not found

---

## File & Data APIs

### 8. Get Files
**Endpoint:** `GET /files`

**Description:** Get all files from database (with S3 fallback)

**Authentication:** Not required

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "files": ["filename1.csv", "filename2.csv"],
  "source": "database | s3 | s3_fallback"
}
```

---

### 9. Get Database Files
**Endpoint:** `GET /database-files`

**Description:** Get files ingested into the database with filtering

**Authentication:** Optional (division filtering if authenticated)

**Query Parameters:**
- `division` (string, optional): Filter by division

**Response (200 OK):**
```json
{
  "files": [
    {
      "id": "integer",
      "file_name": "string",
      "division": "string",
      "file_size": "integer (bytes)",
      "uploaded_at": "ISO 8601 timestamp"
    }
  ],
  "total": "integer"
}
```

---

### 10. Get File Content
**Endpoint:** `GET /file-content`

**Description:** Get the content of a specific file from S3

**Authentication:** Not required

**Query Parameters:**
- `filename` (string, required): Name of the file to retrieve

**Response (200 OK):**
```json
{
  "filename": "string",
  "data": [
    {
      "column1": "value",
      "column2": "value"
    }
  ]
}
```

---

### 11. Get Database File Content
**Endpoint:** `GET /database-file-content`

**Description:** Get content of a file from the database

**Authentication:** Required

**Query Parameters:**
- `file_id` (integer, required): ID of the file
- `page` (integer, optional, default: 1): Pagination page
- `per_page` (integer, optional, default: 50): Items per page

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "integer",
      "file_name": "string",
      "timestamp": "ISO 8601",
      "column_name": "value"
    }
  ],
  "pagination": {
    "page": "integer",
    "per_page": "integer",
    "total": "integer"
  }
}
```

---

### 12. Get Combined Files
**Endpoint:** `GET /combined-files`

**Description:** Get combined data from multiple files

**Authentication:** Optional

**Query Parameters:**
- `divisions` (string, optional): Comma-separated divisions

**Response (200 OK):**
```json
{
  "files": [
    {
      "file_name": "string",
      "division": "string",
      "row_count": "integer"
    }
  ],
  "total_rows": "integer"
}
```

---

### 13. Get Combined File Content
**Endpoint:** `GET /combined-file-content`

**Description:** Get combined content from multiple files

**Authentication:** Required

**Query Parameters:**
- `file_ids` (string, required): Comma-separated file IDs

**Response (200 OK):**
```json
{
  "data": [
    {
      "file_name": "string",
      "row_data": {}
    }
  ],
  "total_records": "integer"
}
```

---

## Transcript & Search APIs

### 14. Search Transcripts
**Endpoint:** `GET /transcripts/search`

**Description:** Search transcripts by keywords or filters

**Authentication:** Required

**Query Parameters:**
- `keyword` (string, optional): Search keyword
- `division` (string, optional): Filter by division
- `loco_pilot` (string, optional): Filter by loco pilot name
- `date_from` (string, optional): Start date (YYYY-MM-DD)
- `date_to` (string, optional): End date (YYYY-MM-DD)
- `page` (integer, optional, default: 1): Page number
- `limit` (integer, optional, default: 50): Results per page

**Response (200 OK):**
```json
{
  "results": [
    {
      "id": "integer",
      "file_name": "string",
      "matched_text": "string",
      "timestamp": "ISO 8601",
      "division": "string"
    }
  ],
  "total": "integer",
  "page": "integer",
  "total_pages": "integer"
}
```

---

### 15. Get Transcript KPI
**Endpoint:** `GET /transcript-kpi`

**Description:** Get Key Performance Indicators from transcripts

**Authentication:** Required

**Query Parameters:**
- `division` (string, optional): Filter by division
- `start_date` (string, optional): Start date (YYYY-MM-DD)
- `end_date` (string, optional): End date (YYYY-MM-DD)
- `loco_pilot` (string, optional): Filter by loco pilot
- `section` (string, optional): Filter by section

**Response (200 OK):**
```json
{
  "total_files": "integer",
  "total_keywords_found": "integer",
  "breakdown_by_keyword": {
    "keyword_name": "count"
  },
  "breakdown_by_loco_pilot": {
    "pilot_name": "count"
  },
  "breakdown_by_section": {
    "section_name": "count"
  },
  "breakdown_by_loco_number": {
    "loco_number": "count"
  }
}
```

---

### 16. Violation Analysis
**Endpoint:** `GET /violation-analysis`

**Description:** Analyze violations/keywords found in transcripts

**Authentication:** Required

**Query Parameters:**
- `division` (string, optional): Filter by division
- `keyword` (string, optional): Specific keyword to analyze
- `start_date` (string, optional): Start date
- `end_date` (string, optional): End date

**Response (200 OK):**
```json
{
  "violation_summary": {
    "total_violations": "integer",
    "by_keyword": {
      "keyword": "count"
    },
    "by_loco_pilot": {
      "pilot_name": "count"
    }
  },
  "detailed_violations": [
    {
      "file_name": "string",
      "keyword": "string",
      "line_number": "integer",
      "context": "string"
    }
  ]
}
```

---

## Admin & Division APIs

### 17. Create Division
**Endpoint:** `POST /create-division`

**Description:** Create a new division (Super Admin only)

**Authentication:** Required (Super Admin)

**Request Body:**
```json
{
  "division_name": "string",
  "description": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "division_id": "integer",
  "message": "Division created and folders set up in S3"
}
```

**Status Codes:**
- `200`: Division created
- `400`: Division already exists or missing data
- `403`: Only super admin can create divisions

---

### 18. List Divisions
**Endpoint:** `GET /list-divisions`

**Description:** Get all divisions

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "divisions": ["Division1", "Division2", "Division3"],
  "total": "integer"
}
```

---

### 19. Delete Division
**Endpoint:** `DELETE /delete-division/{division_id}`

**Description:** Delete a division (Super Admin only)

**Authentication:** Required (Super Admin)

**URL Parameters:**
- `division_id` (integer): ID of division to delete

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Division deleted successfully"
}
```

---

### 20. Get User Division
**Endpoint:** `GET /user-division`

**Description:** Get division of current authenticated user

**Authentication:** Required

**Response (200 OK):**
```json
{
  "division": "string",
  "user_id": "integer"
}
```

---

### 21. Admin File Counts
**Endpoint:** `GET /admin/file-counts-summary`

**Description:** Get file upload counts summary for admin dashboard

**Authentication:** Required (Admin)

**Query Parameters:**
- `division` (string, optional): Filter by division
- `start_date` (string, optional): Start date
- `end_date` (string, optional): End date

**Response (200 OK):**
```json
{
  "total_files": "integer",
  "by_division": {
    "division_name": "count"
  },
  "by_date": {
    "YYYY-MM-DD": "count"
  }
}
```

---

### 22. Real-Time File Counts (Admin)
**Endpoint:** `GET /admin/real-time-file-counts`

**Description:** Get real-time file count updates for admin dashboard

**Authentication:** Required (Admin)

**Response (200 OK):**
```json
{
  "total_files": "integer",
  "files_today": "integer",
  "pending_ingestion": "integer",
  "by_division": {
    "division_name": {
      "total": "integer",
      "today": "integer"
    }
  }
}
```

---

## KPI & Analysis APIs

### 23. Database Statistics
**Endpoint:** `GET /database-stats`

**Description:** Get overall database statistics

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "total_transcripts": "integer",
  "total_files": "integer",
  "date_range": {
    "earliest": "ISO 8601",
    "latest": "ISO 8601"
  },
  "divisions_count": "integer",
  "by_division": {
    "division_name": "count"
  }
}
```

---

### 24. Dashboard Data
**Endpoint:** `GET /dashboard-data`

**Description:** Get comprehensive dashboard data with filters

**Authentication:** Required

**Query Parameters:**
- `division` (string, optional): Filter by division
- `start_date` (string, optional): Start date
- `end_date` (string, optional): End date
- `loco_pilot` (string, optional): Filter by loco pilot

**Response (200 OK):**
```json
{
  "total_files": "integer",
  "total_records": "integer",
  "keywords_found": "integer",
  "charts_data": {
    "by_division": {},
    "by_loco_pilot": {},
    "by_date": {},
    "keyword_distribution": {}
  },
  "top_performers": [],
  "recent_activity": []
}
```

---

### 25. Loco Pilot Files
**Endpoint:** `GET /lp-files/{lp_name}`

**Description:** Get all files uploaded by a specific loco pilot

**Authentication:** Required

**URL Parameters:**
- `lp_name` (string): Name of the loco pilot

**Query Parameters:**
- `division` (string, optional): Filter by division

**Response (200 OK):**
```json
{
  "lp_name": "string",
  "files": [
    {
      "file_name": "string",
      "upload_date": "ISO 8601",
      "division": "string",
      "records_count": "integer"
    }
  ],
  "total_files": "integer",
  "total_records": "integer"
}
```

---

## Upload & Sync APIs

### 26. Upload Audio
**Endpoint:** `POST /upload-audio`

**Description:** Upload audio files

**Authentication:** Required

**Headers:**
- `Content-Type: multipart/form-data`

**Form Data:**
- `file` (file, required): Audio file to upload
- `division` (string, required): Division name

**Response (200 OK):**
```json
{
  "success": true,
  "file_name": "string",
  "size": "integer (bytes)",
  "message": "File uploaded successfully"
}
```

**Status Codes:**
- `200`: Upload successful
- `400`: Invalid file or missing division
- `413`: File too large

---

### 27. Upload Audio with Metadata
**Endpoint:** `POST /upload-audio-with-metadata`

**Description:** Upload audio with metadata information

**Authentication:** Required

**Headers:**
- `Content-Type: multipart/form-data`

**Form Data:**
- `file` (file, required): Audio file
- `division` (string, required): Division
- `train_number` (string, optional): Train number
- `loco_number` (string, optional): Loco number
- `loco_pilot` (string, optional): Loco pilot name
- `alp_name` (string, optional): ALP name
- `section` (string, optional): Section
- `designation` (string, optional): Designation

**Response (200 OK):**
```json
{
  "success": true,
  "file_name": "string",
  "metadata": {
    "train_number": "string",
    "loco_number": "string"
  },
  "message": "File uploaded with metadata"
}
```

---

### 28. Sync S3 to Database
**Endpoint:** `POST /sync-s3-to-database`

**Description:** Manually sync files from S3 to database

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "division": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "files_synced": "integer",
  "message": "Sync started in background"
}
```

---

### 29. Auto-Sync Start
**Endpoint:** `POST /auto-sync/start`

**Description:** Start automatic S3 to database sync

**Authentication:** Required (Admin)

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Auto-sync started"
}
```

---

### 30. Auto-Sync Stop
**Endpoint:** `POST /auto-sync/stop`

**Description:** Stop automatic sync

**Authentication:** Required (Admin)

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Auto-sync stopped"
}
```

---

### 31. Auto-Sync Status
**Endpoint:** `GET /auto-sync/status`

**Description:** Get auto-sync status

**Authentication:** Required (Admin)

**Response (200 OK):**
```json
{
  "is_running": boolean,
  "last_sync": "ISO 8601 timestamp | null",
  "next_sync": "ISO 8601 timestamp | null"
}
```

---

### 32. Lambda Ingestion Status
**Endpoint:** `GET /ingestion/status`

**Description:** Get status of CSV ingestion process

**Authentication:** Required

**Response (200 OK):**
```json
{
  "status": "idle | processing | completed | failed",
  "files_processed": "integer",
  "files_pending": "integer",
  "last_update": "ISO 8601 timestamp"
}
```

---

### 33. Initialize Database
**Endpoint:** `POST /initialize-database`

**Description:** Initialize database tables (Admin only)

**Authentication:** Required (Admin)

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Database initialized successfully"
}
```

---

## Data Retrieval APIs

### 34. Get LP/ALP/Section Data
**Endpoint:** `GET /lp-alp-section-data`

**Description:** Get loco pilot, ALP, and section data

**Authentication:** Required

**Query Parameters:**
- `division` (string, optional): Filter by division

**Response (200 OK):**
```json
{
  "loco_pilots": ["Name1", "Name2"],
  "alps": ["ALP1", "ALP2"],
  "sections": ["Section1", "Section2"]
}
```

---

### 35. Get LP/ALP/Section Combinations
**Endpoint:** `GET /lp-alp-section-combinations`

**Description:** Get valid combinations of loco pilots, ALPs, and sections

**Authentication:** Required

**Query Parameters:**
- `division` (string, optional): Filter by division

**Response (200 OK):**
```json
{
  "combinations": [
    {
      "loco_pilot": "string",
      "alp": "string",
      "section": "string"
    }
  ],
  "total": "integer"
}
```

---

### 36. New Dropdown Data
**Endpoint:** `GET /new-dropdown-data`

**Description:** Get dropdown options for forms

**Authentication:** Required

**Query Parameters:**
- `division` (string, optional): Filter by division

**Response (200 OK):**
```json
{
  "divisions": ["Division1", "Division2"],
  "loco_pilots": ["Pilot1", "Pilot2"],
  "sections": ["Section1", "Section2"],
  "designations": ["Designation1", "Designation2"]
}
```

---

### 37. Upload History
**Endpoint:** `GET /upload-history`

**Description:** Get user's upload history

**Authentication:** Required

**Query Parameters:**
- `limit` (integer, optional, default: 50): Number of records

**Response (200 OK):**
```json
{
  "uploads": [
    {
      "id": "integer",
      "file_name": "string",
      "upload_date": "ISO 8601",
      "division": "string",
      "status": "success | failed"
    }
  ],
  "total": "integer"
}
```

---

## Keyword Management APIs

### 38. Get Keywords
**Endpoint:** `GET /keywords`

**Description:** Get all tracked keywords

**Authentication:** Required

**Query Parameters:**
- `division` (string, optional): Filter by division

**Response (200 OK):**
```json
{
  "keywords": [
    {
      "id": "integer",
      "keyword": "string",
      "category": "string",
      "is_active": boolean,
      "created_at": "ISO 8601"
    }
  ],
  "total": "integer"
}
```

---

### 39. Update Keywords
**Endpoint:** `POST /keywords/update`

**Description:** Update keyword information

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "keyword_id": "integer",
  "keyword": "string",
  "category": "string",
  "is_active": boolean
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Keyword updated successfully"
}
```

---

### 40. Add Keyword
**Endpoint:** `POST /keywords/add`

**Description:** Add new keyword to be tracked

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "keyword": "string",
  "category": "string (optional)",
  "is_active": boolean
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "keyword_id": "integer",
  "message": "Keyword added successfully"
}
```

---

## Utility APIs

### 41. Get Audio File
**Endpoint:** `GET /audio-file`

**Description:** Get audio file from database or S3

**Authentication:** Required

**Query Parameters:**
- `file_id` (integer, optional): Database file ID
- `filename` (string, optional): S3 filename

**Response:** Binary audio file (audio/wav, audio/mp3)

**Status Codes:**
- `200`: File returned
- `404`: File not found
- `400`: Missing file identifier

---

### 42. Fix Audio URLs
**Endpoint:** `POST /fix-audio-urls`

**Description:** Regenerate/fix audio file URLs in database

**Authentication:** Required (Admin)

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "urls_fixed": "integer"
}
```

---

### 43. Migrate Database
**Endpoint:** `POST /migrate-database`

**Description:** Run database migrations

**Authentication:** Required (Admin)

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Migration completed"
}
```

---

### 44. Test Parsing
**Endpoint:** `GET /test-parsing`

**Description:** Test filename parsing functionality

**Authentication:** Required

**Query Parameters:**
- `filename` (string, required): Filename to parse

**Response (200 OK):**
```json
{
  "filename": "string",
  "parsed_data": {
    "division": "string",
    "date": "string",
    "time": "string",
    "train_number": "string",
    "loco_number": "string",
    "loco_pilot": "string",
    "alp_name": "string",
    "designation": "string",
    "hq": "string",
    "section": "string"
  }
}
```

---

## Common Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (missing params, validation error) |
| 401 | Unauthorized (invalid credentials) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 413 | Payload Too Large |
| 500 | Internal Server Error |

---

## Authentication

Most endpoints require **Cookie-based Authentication**. The authentication token is stored in the `SESSION_COOKIE` cookie after login.

**Steps:**
1. Call `/login` with credentials
2. The response sets a secure HTTP-only cookie
3. All subsequent requests automatically include this cookie
4. Call `/logout` to invalidate the session

---

## Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## Notes for Frontend Team

1. **CORS** is enabled for frontend origin
2. **Cookies** are HTTP-only and secure (use `credentials: 'include'` in fetch)
3. **Pagination**: Use `page` and `limit`/`per_page` parameters
4. **Date Format**: Use `YYYY-MM-DD` for all date parameters
5. **Timestamps**: All timestamps are in ISO 8601 format with UTC timezone
6. **File Uploads**: Use `multipart/form-data` for file endpoints
7. **Division Filtering**: Most endpoints support optional division filter
8. **Fallback**: Database-first APIs fall back to S3 if database is unavailable

---

## Quick Start Example (JavaScript/Fetch)

```javascript
// 1. Login
const loginRes = await fetch('http://localhost:8000/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'password',
    division: 'Division1'
  })
});

// 2. Get current user
const meRes = await fetch('http://localhost:8000/me', {
  credentials: 'include'
});

// 3. Get files
const filesRes = await fetch('http://localhost:8000/files', {
  credentials: 'include'
});

// 4. Search transcripts
const searchRes = await fetch('http://localhost:8000/transcripts/search?keyword=safety&division=Division1', {
  credentials: 'include'
});

// 5. Logout
await fetch('http://localhost:8000/logout', {
  method: 'POST',
  credentials: 'include'
});
```


