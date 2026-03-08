from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
from schemas import Notification, NotificationCreate, MessageResponse
from firebase_init import get_firestore_db
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])

NOTIFICATIONS_COLLECTION = "notifications"

@router.post("/create", response_model=Notification, status_code=status.HTTP_201_CREATED)
async def create_notification(notification_data: NotificationCreate):
    """
    Create a new notification in Firestore (admin/system use)
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        notification_id = f"notif_{datetime.now().timestamp()}"
        now = datetime.utcnow()
        
        notification = Notification(
            notification_id=notification_id,
            user_id=notification_data.user_id,
            title=notification_data.title,
            message=notification_data.message,
            issue_id=notification_data.issue_id,
            is_read=False,
            created_at=now
        )
        
        notification_dict = notification.dict()
        notification_dict["created_at"] = now.isoformat()
        db.collection(NOTIFICATIONS_COLLECTION).document(notification_id).set(notification_dict)
        logger.info(f"Notification {notification_id} created for user {notification_data.user_id}")
        
        return notification
    except Exception as e:
        logger.error(f"Create notification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/user/{user_id}", response_model=List[Notification])
async def get_user_notifications(user_id: str, unread_only: bool = False):
    """
    Get notifications for a user from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        query = db.collection(NOTIFICATIONS_COLLECTION).where("user_id", "==", user_id)
        if unread_only:
            query = query.where("is_read", "==", False)
        
        docs = query.order_by("created_at", direction="DESCENDING").stream()
        notifications = [Notification(**doc.to_dict()) for doc in docs]
        return notifications
    except Exception as e:
        logger.error(f"Get user notifications error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{notification_id}", response_model=Notification)
async def get_notification(notification_id: str):
    """
    Get specific notification from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        doc = db.collection(NOTIFICATIONS_COLLECTION).document(notification_id).get()
        
        if not doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        return Notification(**doc.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get notification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/{notification_id}/mark-read", response_model=Notification)
async def mark_notification_as_read(notification_id: str):
    """
    Mark notification as read in Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        notification_ref = db.collection(NOTIFICATIONS_COLLECTION).document(notification_id)
        notification_doc = notification_ref.get()
        
        if not notification_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        notification_ref.update({"is_read": True})
        updated_doc = notification_ref.get()
        logger.info(f"Notification {notification_id} marked as read")
        
        return Notification(**updated_doc.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Mark notification as read error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{notification_id}", response_model=MessageResponse)
async def delete_notification(notification_id: str):
    """
    Delete notification from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        notification_ref = db.collection(NOTIFICATIONS_COLLECTION).document(notification_id)
        if not notification_ref.get().exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        notification_ref.delete()
        logger.info(f"Notification {notification_id} deleted")
        
        return MessageResponse(message="Notification deleted successfully")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete notification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
