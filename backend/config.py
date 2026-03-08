import os
from dotenv import load_dotenv

load_dotenv()

# Firebase Configuration
FIREBASE_CONFIG = {
    "apiKey": "AIzaSyAoHEJhw_6ZvY_pzXIMDToq5A77zm43hbw",
    "authDomain": "campusfix-88c4e.firebaseapp.com",
    "projectId": "campusfix-88c4e",
    "storageBucket": "campusfix-88c4e.firebasestorage.app",
    "messagingSenderId": "57975270958",
    "appId": "1:57975270958:web:77e7f9bde14be2da9ef9bf",
    "measurementId": "G-NTKM8XNHCS"
}

# API Configuration
API_VERSION = "v1"
API_TITLE = "CampusFix API"
API_DESCRIPTION = "Backend API for CampusFix - Campus Issue Reporting System"

# Server Configuration
DEBUG = True
HOST = "0.0.0.0"
PORT = 8000

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
]
