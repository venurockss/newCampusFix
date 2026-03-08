# CampusFix Backend API - Postman Testing Guide

## Base URL
```
http://127.0.0.1:8000
```

**Note:** Make sure the backend server is running before testing:
```
cd backend
python main.py
```

---

## 🔐 Authentication Endpoints

### 1. User Signup
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/auth/signup`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "email": "student1@example.com",
    "password": "SecurePassword123!",
    "full_name": "John Doe",
    "role": "student"
  }
  ```
- **Expected Response:** `201 Created`
  ```json
  {
    "access_token": "eyJhbGc...",
    "token_type": "bearer",
    "user": {
      "user_id": "firebase-uid",
      "email": "student1@example.com",
      "full_name": "John Doe",
      "role": "student",
      "avatar_url": null,
      "created_at": "2025-12-22T10:30:00"
    }
  }
  ```

### 2. User Login
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "email": "student1@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Expected Response:** `200 OK`
  ```json
  {
    "access_token": "eyJhbGc...",
    "token_type": "bearer",
    "user": {
      "user_id": "firebase-uid",
      "email": "student1@example.com",
      "full_name": "John Doe",
      "role": "student",
      "avatar_url": null
    }
  }
  ```

### 3. Get User Profile
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/auth/me/{user_id}`
- **Replace:** `{user_id}` with the user ID from login response
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Expected Response:** `200 OK`
  ```json
  {
    "user_id": "firebase-uid",
    "email": "student1@example.com",
    "full_name": "John Doe",
    "role": "student",
    "avatar_url": null,
    "created_at": "2025-12-22T10:30:00"
  }
  ```

### 4. Change Password
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/auth/change-password`
- **Query Parameters:**
  ```
  user_id: firebase-uid
  ```
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "old_password": "OldPassword123!",
    "new_password": "NewPassword456!"
  }
  ```
- **Expected Response:** `200 OK`
  ```json
  {
    "message": "Password changed successfully"
  }
  ```

### 5. Update User Profile
- **Method:** `PUT`
- **URL:** `http://127.0.0.1:8000/api/v1/auth/update-profile/{user_id}`
- **Replace:** `{user_id}` with the user ID
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "full_name": "John Updated Doe",
    "email": "newemail@example.com",
    "avatar_url": "https://example.com/avatar.jpg"
  }
  ```
- **Expected Response:** `200 OK`

---

## 📋 Issues Endpoints

### 1. Report New Issue
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/issues/report`
- **Query Parameters:**
  ```
  user_id: firebase-uid
  ```
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "title": "Water leak in bathroom",
    "description": "There's a water leak from the pipe in the bathroom near room 201",
    "location": "Block A, Floor 2, Room 201",
    "category": "water",
    "priority": "high",
    "image_urls": ["https://example.com/image1.jpg"]
  }
  ```
- **Valid Categories:** `water`, `electricity`, `sanitation`, `infrastructure`, `safety`, `maintenance`, `other`
- **Valid Priorities:** `low`, `medium`, `high`, `critical`
- **Expected Response:** `201 Created`

### 2. Get All Issues
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/issues/all`
- **Query Parameters (Optional):**
  ```
  status_filter: open|in_progress|resolved|closed|pending
  category_filter: water|electricity|sanitation|infrastructure|safety|maintenance|other
  priority_filter: low|medium|high|critical
  skip: 0
  limit: 10
  ```
- **Example URL:**
  ```
  http://127.0.0.1:8000/api/v1/issues/all?category_filter=water&priority_filter=high&skip=0&limit=10
  ```
- **Expected Response:** `200 OK` (List of issues)

### 3. Get Issue Detail
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/issues/{issue_id}`
- **Replace:** `{issue_id}` with the issue ID from report response
- **Expected Response:** `200 OK`

### 4. Get User's Issues
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/issues/user/{user_id}`
- **Replace:** `{user_id}` with the user ID
- **Expected Response:** `200 OK` (List of user's issues)

### 5. Update Issue
- **Method:** `PUT`
- **URL:** `http://127.0.0.1:8000/api/v1/issues/{issue_id}`
- **Replace:** `{issue_id}` with the issue ID
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body (All fields optional):**
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "location": "Updated location",
    "category": "electricity",
    "priority": "medium",
    "status": "in_progress"
  }
  ```
- **Expected Response:** `200 OK`

### 6. Delete Issue
- **Method:** `DELETE`
- **URL:** `http://127.0.0.1:8000/api/v1/issues/{issue_id}`
- **Expected Response:** `200 OK`
  ```json
  {
    "message": "Issue deleted successfully"
  }
  ```

### 7. Upvote Issue
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/issues/{issue_id}/upvote`
- **Expected Response:** `200 OK` (Updated issue with increased upvotes)

### 8. Downvote Issue
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/issues/{issue_id}/downvote`
- **Expected Response:** `200 OK` (Updated issue with increased downvotes)

---

## 🔔 Notifications Endpoints

### 1. Create Notification
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/notifications/create`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "user_id": "firebase-uid",
    "title": "Issue Status Updated",
    "message": "Your issue has been assigned to a technician",
    "type": "issue_update",
    "related_issue_id": "issue_123"
  }
  ```
- **Expected Response:** `201 Created`

### 2. Get User Notifications
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/notifications/user/{user_id}`
- **Expected Response:** `200 OK` (List of notifications)

### 3. Get Notification Detail
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/notifications/{notification_id}`
- **Expected Response:** `200 OK`

### 4. Mark Notification as Read
- **Method:** `PUT`
- **URL:** `http://127.0.0.1:8000/api/v1/notifications/{notification_id}/mark-read`
- **Expected Response:** `200 OK`

### 5. Delete Notification
- **Method:** `DELETE`
- **URL:** `http://127.0.0.1:8000/api/v1/notifications/{notification_id}`
- **Expected Response:** `200 OK`

---

## 🛠️ Admin Endpoints

### 1. Get All Users
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/admin/users`
- **Query Params (optional):** `skip`, `limit`
- **Expected Response:** `200 OK` (List of users)

### 2. Delete User
- **Method:** `DELETE`
- **URL:** `http://127.0.0.1:8000/api/v1/admin/users/{user_id}`
- **Replace:** `{user_id}` with the user's ID
- **Expected Response:** `200 OK`
  ```json
  { "message": "User deleted successfully" }
  ```

### 3. Update User Role
- **Method:** `PUT`
- **URL:** `http://127.0.0.1:8000/api/v1/admin/users/{user_id}/role`
- **Replace:** `{user_id}` with the user's ID
- **Request Body:**
  ```json
  "new_role": "technician"
  ```
- **Expected Response:** `200 OK` (Updated user object)

### 4. Admin Dashboard
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/admin/dashboard`
- **Expected Response:** `200 OK` (Admin statistics summary)

---

## 📊 Analytics Endpoints

### 1. Analytics Dashboard
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/analytics/dashboard`
- **Expected Response:** `200 OK`
  ```json
  {
    "total_users": 0,
    "total_issues": 0,
    "issue_stats": {
      "total_issues": 0,
      "open_issues": 0,
      "in_progress_issues": 0,
      "resolved_issues": 0,
      "closed_issues": 0,
      "average_resolution_time": 0.0
    },
    "category_breakdown": [],
    "technician_performance": {}
  }
  ```

### 2. Issues by Status
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/analytics/issues/by-status`
- **Expected Response:** `200 OK`
  ```json
  {
    "open": 0,
    "in_progress": 0,
    "resolved": 0,
    "closed": 0
  }
  ```

### 3. Issues by Category
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/analytics/issues/by-category`
- **Expected Response:** `200 OK`
  ```json
  {
    "water": 0,
    "electricity": 0,
    "sanitation": 0,
    "infrastructure": 0,
    "safety": 0,
    "maintenance": 0,
    "other": 0
  }
  ```

### 4. Technician Performance
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/analytics/technician-performance`
- **Expected Response:** `200 OK`
  ```json
  {
    "total_technicians": 0,
    "average_resolution_time": 0.0,
    "resolution_rate": 0.0,
    "top_performers": []
  }
  ```

### 5. Resolution Time Stats
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/analytics/resolution-time`
- **Expected Response:** `200 OK`
  ```json
  {
    "average_days": 0.0,
    "median_days": 0.0,
    "by_category": {}
  }
  ```

---

## 👨‍🔧 Technician Endpoints

### 1. Technician Dashboard
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/technician/dashboard/{technician_id}`
- **Expected Response:** `200 OK`

### 2. Get Technician Assignments
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/technician/assignments/{technician_id}`
- **Expected Response:** `200 OK` (List of assigned issues)

### 3. Assign Issue to Technician
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/technician/assign/{issue_id}`
- **Query Parameters:**
  ```
  technician_id: firebase-uid
  ```
- **Expected Response:** `200 OK`

---

## 🧪 Health Check & Root

### 1. Health Check
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/health`
- **Expected Response:** `200 OK`
  ```json
  {
    "status": "healthy",
    "service": "CampusFix API"
  }
  ```

### 2. API Root Info
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/`
- **Expected Response:** `200 OK`
  ```json
  {
    "name": "CampusFix API",
    "version": "v1",
    "description": "Backend API for CampusFix - Campus Issue Reporting System",
    "docs_url": "/docs",
    "redoc_url": "/redoc"
  }
  ```

---

## 📝 Testing Steps in Postman

### Step 1: Test Health Check
1. Create a new request in Postman
2. Set method to `GET`
3. Enter URL: `http://127.0.0.1:8000/health`
4. Click Send
5. Should return `200 OK` with status: "healthy"

### Step 2: Test Signup
1. Create new request, method `POST`
2. URL: `http://127.0.0.1:8000/api/v1/auth/signup`
3. Go to Body → raw → JSON
4. Paste the signup request body
5. Click Send
6. **Save the `user_id` from response** - you'll need it for other tests

### Step 3: Test Login
1. Create new request, method `POST`
2. URL: `http://127.0.0.1:8000/api/v1/auth/login`
3. Use the same email/password from signup
4. Click Send
5. Should get access token

### Step 4: Test Other Endpoints
1. For endpoints with `{user_id}` or `{issue_id}`, replace with actual IDs from previous responses
2. For POST requests, add JSON body in Body tab
3. For GET with query params, add them in Params tab

---

## ✅ Expected Status Codes

| Status | Meaning |
|--------|---------|
| **200** | Success (GET, PUT, POST without creation) |
| **201** | Created (POST with new resource) |
| **400** | Bad Request (Invalid data) |
| **401** | Unauthorized (Invalid credentials) |
| **404** | Not Found (Resource doesn't exist) |
| **500** | Server Error |
| **503** | Service Unavailable (Firebase not initialized) |

---

## 🔗 Quick Links

- **Interactive API Docs:** http://127.0.0.1:8000/docs
- **ReDoc Documentation:** http://127.0.0.1:8000/redoc
- **Backend Code:** `c:\Users\venug\OneDrive\Desktop\CampusFix\backend\`

---

## 💡 Tips for Testing

1. **Use Environment Variables in Postman:** Store `base_url`, `user_id`, `issue_id` as variables to reuse across requests
2. **Save Responses:** Use Post-request scripts to automatically extract and save IDs from responses
3. **Test Order:** Health → Signup → Login → Other endpoints
4. **Firebase:** If you get `503 Service Unavailable`, it means Firebase credentials aren't set up (download serviceAccountKey.json)
5. **Check Logs:** Watch the terminal where `python main.py` is running for any errors
