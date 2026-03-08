# CampusFix Backend API

## Overview
This is the FastAPI backend for the CampusFix campus issue reporting system. It provides REST API endpoints for user authentication, issue management, feedback, notifications, and admin/technician functionality.

## Project Structure
```
backend/
├── main.py                 # FastAPI application entry point
├── config.py              # Configuration settings
├── schemas.py             # Pydantic models for request/response validation
├── firebase_init.py       # Firebase initialization
├── requirements.txt       # Python dependencies
└── routes/                # API route handlers
    ├── auth.py           # Authentication endpoints
    ├── issues.py         # Issue management endpoints
    ├── feedback.py       # Feedback endpoints
    ├── notifications.py  # Notification endpoints
    ├── admin.py          # Admin endpoints
    ├── technician.py     # Technician endpoints
    └── analytics.py      # Analytics endpoints
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment** (optional but recommended)
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up Firebase credentials** (optional for testing)
   - Place your `serviceAccountKey.json` in the backend directory
   - Or set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable

## Running the Server

Start the development server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /signup` - Register a new user
- `POST /login` - Login user
- `POST /change-password` - Change user password
- `GET /me/{user_id}` - Get current user profile
- `PUT /update-profile/{user_id}` - Update user profile

### Issues (`/api/v1/issues`)
- `POST /report` - Create a new issue report
- `GET /all` - Get all issues with filters
- `GET /{issue_id}` - Get issue details
- `GET /user/{user_id}` - Get user's issues
- `PUT /{issue_id}` - Update issue
- `DELETE /{issue_id}` - Delete issue
- `POST /{issue_id}/upvote` - Upvote issue
- `POST /{issue_id}/downvote` - Downvote issue

### Feedback (`/api/v1/feedback`)
- `POST /create` - Create feedback
- `GET /issue/{issue_id}` - Get issue feedback
- `GET /{feedback_id}` - Get specific feedback
- `DELETE /{feedback_id}` - Delete feedback

### Notifications (`/api/v1/notifications`)
- `POST /create` - Create notification
- `GET /user/{user_id}` - Get user notifications
- `GET /{notification_id}` - Get notification
- `PUT /{notification_id}/mark-read` - Mark as read
- `DELETE /{notification_id}` - Delete notification

### Admin (`/api/v1/admin`)
- `GET /users` - Get all users
- `DELETE /users/{user_id}` - Delete user
- `PUT /users/{user_id}/role` - Update user role
- `GET /dashboard` - Admin dashboard

### Technician (`/api/v1/technician`)
- `GET /dashboard/{technician_id}` - Technician dashboard
- `GET /assignments/{technician_id}` - Get assignments
- `POST /assign/{issue_id}` - Assign issue to technician
- `PUT /assignment/{assignment_id}/update-status` - Update status
- `POST /assignment/{assignment_id}/add-notes` - Add notes

### Analytics (`/api/v1/analytics`)
- `GET /dashboard` - Analytics dashboard
- `GET /issues/by-status` - Issues by status
- `GET /issues/by-category` - Issues by category
- `GET /technician-performance` - Technician performance
- `GET /resolution-time` - Resolution time stats

## Testing Routes

### 1. Sign Up
```bash
curl -X POST "http://localhost:8000/api/v1/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "full_name": "John Doe",
    "password": "password123",
    "role": "student"
  }'
```

### 2. Report Issue
```bash
curl -X POST "http://localhost:8000/api/v1/issues/report?user_id=user_123" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Water Leak in Dormitory",
    "description": "Water is leaking from the ceiling",
    "location": "Dorm A, Room 101",
    "category": "water",
    "priority": "high"
  }'
```

### 3. Get All Issues
```bash
curl -X GET "http://localhost:8000/api/v1/issues/all" \
  -H "Content-Type: application/json"
```

### 4. Create Feedback
```bash
curl -X POST "http://localhost:8000/api/v1/feedback/create?user_id=user_123" \
  -H "Content-Type: application/json" \
  -d '{
    "issue_id": "issue_123",
    "rating": 5,
    "comment": "Issue was resolved quickly!"
  }'
```

## Database Integration

Currently, the backend uses in-memory storage for testing. To integrate with Firebase:

1. Update the service functions in each route file
2. Use `firebase_init.py` helper functions to interact with Firestore/Realtime DB
3. Connect to your Firebase project

## Configuration

Edit `config.py` to customize:
- Firebase credentials
- API settings
- Server host/port
- CORS allowed origins
- JWT settings

## Development Notes

- Routes are organized by feature
- Each route file is independent and can be tested separately
- Pydantic schemas handle validation
- In-memory storage can be replaced with database calls

## Next Steps

1. Integrate Firebase Firestore/Realtime Database
2. Add proper authentication/JWT tokens
3. Add input validation
4. Add error handling middleware
5. Add logging
6. Connect with frontend
7. Add unit tests

## Troubleshooting

**Port 8000 already in use?**
```bash
uvicorn main:app --port 8001
```

**Import errors?**
```bash
pip install -r requirements.txt --upgrade
```

**Firebase errors?**
- Check if `serviceAccountKey.json` exists
- Verify `GOOGLE_APPLICATION_CREDENTIALS` environment variable
- Check Firebase project credentials

---

For more information, visit: http://localhost:8000/docs
