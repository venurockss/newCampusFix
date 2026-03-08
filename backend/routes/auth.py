from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from google.cloud.firestore import FieldFilter
from schemas import UserCreate, UserLogin, User, TokenResponse, ChangePassword, UserUpdate, MessageResponse
# from schemas import UserCreate, MessageResponse
from firebase_init import get_firestore_db, get_auth
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

USERS_COLLECTION = "users"


# @router.post(
#     "/signup",
#     response_model=MessageResponse,
#     status_code=status.HTTP_201_CREATED
# )
# async def signup(user_data: UserCreate):
#     """
#     Register a new user using Firebase Auth
#     and store profile data in Firestore
#     """
#     try:
#         db = get_firestore_db()
#         auth = get_auth()

#         if not db or not auth:
#             raise HTTPException(
#                 status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
#                 detail="Firebase not initialized"
#             )

#         # 1️⃣ Check if email already exists (Firestore)
#         existing_user = (
#             db.collection(USERS_COLLECTION)
#             .where(filter=("email", "==", user_data.email))
#             .stream()
#         )

#         if any(existing_user):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Email already registered"
#             )

#         # 2️⃣ Create user in Firebase Auth
#         firebase_user = auth.create_user(
#             email=user_data.email,
#             password=user_data.password,
#             display_name=user_data.full_name
#         )

#         # 3️⃣ Store user profile in Firestore
#         user_doc = {
#             "user_id": firebase_user.uid,
#             "email": user_data.email,
#             "full_name": user_data.full_name,
#             "role": user_data.role.value,
#             "avatar_url": None,
#             "created_at": datetime.utcnow().isoformat(),
#             "updated_at": datetime.utcnow().isoformat()
#         }

#         db.collection(USERS_COLLECTION).document(firebase_user.uid).set(user_doc)

#         return MessageResponse(
#             message="Signup successful. Please login to continue."
#         )

#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Signup error: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Signup failed"
#         )
@router.post("/signup", response_model=MessageResponse, status_code=201)
async def signup(user_data: UserCreate):
    try:
        db = get_firestore_db()
        auth = get_auth()

        # Check email exists
        existing_user = (
            db.collection(USERS_COLLECTION)
            .where(filter=FieldFilter("email", "==", user_data.email))
            .stream()
        )

        if any(existing_user):
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        firebase_user = auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=user_data.full_name
        )

        now = datetime.utcnow()

        user_doc = {
            "user_id": firebase_user.uid,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "role": user_data.role.value,
            "avatar_url": None,
            "specialization": getattr(user_data, 'specialization', None),
            "created_at": now,
            "updated_at": now
        }

        db.collection(USERS_COLLECTION).document(firebase_user.uid).set(user_doc)

        return MessageResponse(message="Signup successful")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Signup failed")

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """
    Login user with Firebase Auth and return access token
    """
    try:
        db = get_firestore_db()
        auth = get_auth()
        
        if db is None or auth is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Firebase not initialized. Check server logs."
            )
        
        # Get user by email from Firestore
        user_docs = db.collection(USERS_COLLECTION).where("email", "==", credentials.email).stream()
        user_list = list(user_docs)
        
        if not user_list:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user_doc = user_list[0]
        user_data = user_doc.to_dict()
        user_id = user_doc.id

        
        # Verify password with Firebase Auth (in production, use proper auth flow)
        # For now, generate custom token for the user
        custom_token = auth.create_custom_token(user_id)
        logger.info(f"User {credentials.email} logged in successfully.")
        logger.info(f"Custom token generated: {custom_token}")
        
        return TokenResponse(
            access_token=custom_token.decode() if isinstance(custom_token, bytes) else custom_token,
            token_type="bearer",
            user=User(**user_data)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/change-password", response_model=MessageResponse)
async def change_password(user_id: str, pwd_data: ChangePassword):
    """
    Change user password in Firebase Auth
    """
    try:
        db = get_firestore_db()
        auth = get_auth()
        
        if db is None or auth is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Firebase not initialized. Check server logs."
            )
        
        # Get user from Firestore
        user_ref = db.collection(USERS_COLLECTION).document(user_id)
        user_snap = user_ref.get()
        
        if not user_snap.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update password in Firebase Auth
        auth.update_user(user_id, password=pwd_data.new_password)
        
        # Update timestamp in Firestore
        user_ref.update({"updated_at": datetime.now().isoformat()})
        
        return MessageResponse(message="Password changed successfully")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Change password error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/me/{user_id}", response_model=User)
async def get_current_user(user_id: str):
    """
    Get current user profile from Firestore
    """
    try:
        db = get_firestore_db()
        
        if db is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Firebase not initialized. Check server logs."
            )
        
        user_snap = db.collection(USERS_COLLECTION).document(user_id).get()
        
        if not user_snap.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return User(**user_snap.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/update-profile/{user_id}", response_model=User)
async def update_profile(user_id: str, user_update: UserUpdate):
    """
    Update user profile using Firebase UID
    """
    try:
        db = get_firestore_db()
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        update_data = {}

        if user_update.full_name is not None:
            update_data["full_name"] = user_update.full_name
        if user_update.avatar_url is not None:
            update_data["avatar_url"] = user_update.avatar_url
            if getattr(user_update, 'email', None) is not None:
                update_data["email"] = user_update.email
            if getattr(user_update, 'phone', None) is not None:
                update_data["phone"] = user_update.phone
            if getattr(user_update, 'student_id', None) is not None:
                update_data["student_id"] = user_update.student_id
            if getattr(user_update, 'department', None) is not None:
                update_data["department"] = user_update.department
            if getattr(user_update, 'year', None) is not None:
                update_data["year"] = user_update.year

        update_data["updated_at"] = datetime.utcnow().isoformat()

        user_ref.update(update_data)

        updated_user = user_ref.get().to_dict()
        return User(**updated_user)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
