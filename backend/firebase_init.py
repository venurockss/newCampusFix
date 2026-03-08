import firebase_admin
from firebase_admin import credentials, db, auth as firebase_auth, storage, firestore
from config import FIREBASE_CONFIG
import os
import logging

logger = logging.getLogger(__name__)

# Global Firebase app instance and services
_app = None
_firestore_db = None
_realtime_db = None
_storage_bucket = None
_auth = None

def initialize_firebase():
    """Initialize Firebase Admin SDK with proper error handling."""
    global _app, _firestore_db, _realtime_db, _storage_bucket, _auth
    
    try:
        # Check if already initialized
        if _app is not None:
            logger.info("Firebase already initialized")
            return True
        
        # Try to initialize with service account key
        service_account_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "serviceAccountKey.json")
        
        if os.path.exists(service_account_path):
            logger.info(f"Initializing Firebase with service account: {service_account_path}")
            cred = credentials.Certificate(service_account_path)
            _app = firebase_admin.initialize_app(cred, {
                "projectId": FIREBASE_CONFIG["projectId"],
                "databaseURL": f"https://{FIREBASE_CONFIG['projectId']}.firebaseio.com",
                "storageBucket": FIREBASE_CONFIG["storageBucket"]
            })
        else:
            logger.warning(f"Service account key not found at {service_account_path}")
            logger.info("Attempting to initialize with default credentials (e.g., GOOGLE_APPLICATION_CREDENTIALS env var)")
            _app = firebase_admin.initialize_app(options={
                "projectId": FIREBASE_CONFIG["projectId"],
                "databaseURL": f"https://{FIREBASE_CONFIG['projectId']}.firebaseio.com",
                "storageBucket": FIREBASE_CONFIG["storageBucket"]
            })
        
        # Initialize services
        _firestore_db = firestore.client(app=_app)
        _realtime_db = db.reference(app=_app)
        _storage_bucket = storage.bucket(app=_app)
        _auth = firebase_auth
        
        logger.info("Firebase initialized successfully")
        return True
        
    except ValueError as e:
        if "already initialized" in str(e):
            logger.info("Firebase app already initialized (expected on reload)")
            return True
        logger.error(f"Firebase initialization error: {e}")
        return False
    except Exception as e:
        logger.error(f"Firebase initialization failed: {e}")
        logger.error("Ensure GOOGLE_APPLICATION_CREDENTIALS is set or serviceAccountKey.json exists")
        return False


def get_firestore_db():
    """Get Firestore client instance."""
    if _firestore_db is None:
        initialize_firebase()
    return _firestore_db


def get_realtime_db():
    """Get Realtime Database reference."""
    if _realtime_db is None:
        initialize_firebase()
    return _realtime_db


def get_storage_bucket():
    """Get Cloud Storage bucket."""
    if _storage_bucket is None:
        initialize_firebase()
    return _storage_bucket


def get_auth():
    """Get Firebase Auth service."""
    if _auth is None:
        initialize_firebase()
    return _auth


# Initialize on module import
initialize_firebase()
