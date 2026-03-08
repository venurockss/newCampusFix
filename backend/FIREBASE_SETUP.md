# Firebase Backend Setup Guide

## Overview
The CampusFix backend is now fully integrated with **Firebase Admin SDK**. It uses:
- **Firebase Auth** for user authentication
- **Firestore** for user data and issue storage
- **Realtime Database** (optional, for real-time notifications)
- **Cloud Storage** (optional, for image uploads)

---

## Prerequisites
- Firebase project created at [firebase.google.com](https://firebase.google.com)
- Firebase Admin SDK credentials (service account key)
- Python 3.8+ with pip installed

---

## Step 1: Download Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `campusfix-88c4e` project
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `serviceAccountKey.json` in the `backend/` folder

**⚠️ Security Note:** Never commit `serviceAccountKey.json` to git. Add it to `.gitignore`:
```
# backend/.gitignore
serviceAccountKey.json
.env
__pycache__/
```

---

## Step 2: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

If `firebase-admin` is missing from `requirements.txt`, add it:
```bash
pip install firebase-admin
```

---

## Step 3: Set Environment Variables (Optional)

Set the service account key path:
```powershell
# Windows PowerShell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\venug\OneDrive\Desktop\CampusFix\backend\serviceAccountKey.json"
```

Or let the code auto-discover it from the default location (`backend/serviceAccountKey.json`).

---

## Step 4: Run the Backend

```bash
cd backend
python main.py
```

Or with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
Initializing Firebase with service account: serviceAccountKey.json
Firebase initialized successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## Step 5: Test Firebase Integration

### Using the Interactive API Docs
Open: http://127.0.0.1:8000/docs

### Signup a User
**POST** `/api/v1/auth/signup`
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "full_name": "John Doe",
  "role": "student"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "user_id": "abc123xyz...",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "student",
    "avatar_url": null,
    "created_at": "2025-12-22T10:30:00"
  }
}
```

### Login a User
**POST** `/api/v1/auth/login`
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

### Get User Profile
**GET** `/api/v1/auth/me/{user_id}`
- Replace `{user_id}` with the user ID from signup/login response

---

## File Changes Summary

### 1. `firebase_init.py` - Improved Firebase Initialization
- ✅ Proper error handling and logging
- ✅ Global service instances (prevents re-initialization)
- ✅ Exported functions: `get_firestore_db()`, `get_auth()`, `get_realtime_db()`, `get_storage_bucket()`
- ✅ Auto-initializes on module import

### 2. `routes/auth.py` - Firebase Auth Integration
- ✅ **Signup**: Creates user in Firebase Auth + stores profile in Firestore
- ✅ **Login**: Verifies email, retrieves from Firestore, generates custom token
- ✅ **Change Password**: Updates password in Firebase Auth
- ✅ **Get Profile**: Fetches user data from Firestore
- ✅ Removed in-memory `users_db` dictionary

---

## Troubleshooting

### ❌ Error: `No module named 'firebase_admin'`
```bash
pip install firebase-admin
```

### ❌ Error: `GOOGLE_APPLICATION_CREDENTIALS not set`
Make sure `serviceAccountKey.json` exists in the `backend/` folder.

### ❌ Error: `Firebase initialization failed`
1. Check service account key is valid JSON
2. Verify Firebase project ID in key matches `config.py`
3. Enable these APIs in Firebase Console:
   - Cloud Firestore
   - Firebase Authentication
   - Cloud Storage
   - Realtime Database

### ❌ Error: `Failed to create user (already exists)`
The email is already registered in Firebase Auth. Use a different email or delete the user from Firebase Console.

---

## Database Collections Structure

### Firestore: `users` collection
```json
{
  "user_id": "firebase-uid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "student | admin | technician",
  "avatar_url": null,
  "created_at": "2025-12-22T10:30:00",
  "updated_at": "2025-12-22T10:30:00"
}
```

### Future Collections (to implement):
- `issues` - Campus issue reports
- `feedback` - User feedback
- `notifications` - Push notifications
- `analytics` - Usage statistics

---

## Next Steps

1. **Secure password validation** - Use Firebase Auth's built-in password verification
2. **JWT token management** - Implement proper JWT token handling
3. **Role-based access control (RBAC)** - Restrict endpoints by user role
4. **Issue management routes** - Implement issues, feedback, notifications routes with Firestore
5. **Image uploads** - Store avatars and issue photos in Cloud Storage

---

## References
- [Firebase Admin SDK for Python](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
