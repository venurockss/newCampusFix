from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
from schemas import User, MessageResponse
from firebase_init import get_firestore_db, get_auth
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])


@router.get("/users", response_model=List[User])
async def get_all_users(skip: int = 0, limit: int = 10):
    """
    Get all users (admin only).
    Reads from Firestore `users` collection; falls back to Firebase Auth list if Firestore unavailable.
    """
    try:
        db = get_firestore_db()
        users_list = []

        if db is not None:
            docs = list(db.collection("users").stream())
            # Apply pagination
            docs = docs[skip: skip + limit]
            for doc in docs:
                data = doc.to_dict()
                users_list.append({
                    "user_id": data.get("user_id", doc.id),
                    "email": data.get("email"),
                    "full_name": data.get("full_name"),
                    "role": data.get("role"),
                    "avatar_url": data.get("avatar_url"),
                    "created_at": data.get("created_at"),
                    "updated_at": data.get("updated_at"),
                })
            return [User(**u) for u in users_list]

        # Firestore unavailable: fallback to Firebase Auth
        auth = get_auth()
        if auth is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="User datastore unavailable (no Firestore or Auth)."
            )

        # list_users returns an iterator; collect and paginate
        all_users = list(auth.list_users().iterate_all())
        selected = all_users[skip: skip + limit]
        for user_rec in selected:
            users_list.append({
                "user_id": user_rec.uid,
                "email": user_rec.email,
                "full_name": getattr(user_rec, "display_name", None),
                "role": None,
                "avatar_url": None,
                "created_at": None,
                "updated_at": None,
            })

        return [User(**u) for u in users_list]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get all users error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/users/{user_id}", response_model=MessageResponse)
async def delete_user(user_id: str):
    """
    Delete a user (admin only)
    """
    try:
        db = get_firestore_db()
        auth = get_auth()

        # Try Firestore deletion first
        if db is not None:
            user_ref = db.collection("users").document(user_id)
            if user_ref.get().exists:
                user_ref.delete()
                # also delete from auth if available
                if auth is not None:
                    try:
                        auth.delete_user(user_id)
                    except Exception:
                        # ignore auth deletion errors
                        pass
                return MessageResponse(message="User deleted successfully")

        # Fallback: try deleting via Firebase Auth
        if auth is not None:
            try:
                auth.delete_user(user_id)
                return MessageResponse(message="User deleted successfully")
            except Exception as e:
                logger.error(f"Auth delete user error: {e}")

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/users/{user_id}/role", response_model=User)
async def update_user_role(user_id: str, new_role: str):
    """
    Update user role (admin only)
    """
    try:
        db = get_firestore_db()
        auth = get_auth()

        # Update role in Firestore if available
        if db is not None:
            user_ref = db.collection("users").document(user_id)
            if not user_ref.get().exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            user_ref.update({"role": new_role, "updated_at": datetime.now().isoformat()})
            updated = user_ref.get().to_dict()
            return User(**updated)

        # Fallback: set custom claims in Auth
        if auth is not None:
            try:
                auth.set_custom_user_claims(user_id, {"role": new_role})
                # fetch user record
                user_rec = auth.get_user(user_id)
                return User(
                    user_id=user_rec.uid,
                    email=user_rec.email,
                    full_name=getattr(user_rec, "display_name", None) or "",
                    role=new_role,
                    avatar_url=None,
                    created_at=None,
                    updated_at=datetime.now()
                )
            except Exception as e:
                logger.error(f"Auth set role error: {e}")

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/dashboard", response_model=dict)
async def get_admin_dashboard():
    """
    Get admin dashboard statistics
    """
    try:
        db = get_firestore_db()
        stats = {
            "total_users": 0,
            "total_issues": 0,
            "resolved_issues": 0,
            "pending_issues": 0,
            "new_reports_today": 0
        }

        # Users count
        if db is not None:
            users = list(db.collection("users").stream())
            stats["total_users"] = len(users)
        else:
            auth = get_auth()
            if auth is not None:
                try:
                    stats["total_users"] = sum(1 for _ in auth.list_users().iterate_all())
                except Exception:
                    stats["total_users"] = 0

        # Issues stats from Firestore
        if db is not None:
            issues = list(db.collection("issues").stream())
            stats["total_issues"] = len(issues)
            for doc in issues:
                d = doc.to_dict()
                status_val = d.get("status")
                if status_val == "resolved":
                    stats["resolved_issues"] += 1
                if status_val == "in_progress":
                    stats["pending_issues"] += 1
                # count new reports today
                created = d.get("created_at")
                if created:
                    try:
                        created_date = datetime.fromisoformat(created).date()
                        if created_date == datetime.now().date():
                            stats["new_reports_today"] += 1
                    except Exception:
                        pass

        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
