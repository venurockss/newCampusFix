from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
from schemas import Feedback, FeedbackCreate, MessageResponse
from firebase_init import get_firestore_db
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/feedback", tags=["Feedback"])

FEEDBACK_COLLECTION = "feedback"

@router.post("/create", response_model=Feedback, status_code=status.HTTP_201_CREATED)
async def create_feedback(user_id: str, feedback_data: FeedbackCreate):
    """
    Create feedback for an issue in Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        if feedback_data.rating < 1 or feedback_data.rating > 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rating must be between 1 and 5"
            )
        
        feedback_id = f"feedback_{datetime.now().timestamp()}"
        now = datetime.utcnow()
        
        feedback = Feedback(
            feedback_id=feedback_id,
            user_id=user_id,
            issue_id=feedback_data.issue_id,
            rating=feedback_data.rating,
            comment=feedback_data.comment,
            created_at=now
        )
        
        feedback_dict = feedback.dict()
        feedback_dict["created_at"] = now.isoformat()
        db.collection(FEEDBACK_COLLECTION).document(feedback_id).set(feedback_dict)
        logger.info(f"Feedback {feedback_id} created for issue {feedback_data.issue_id}")
        
        return feedback
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create feedback error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/issue/{issue_id}", response_model=List[Feedback])
async def get_issue_feedback(issue_id: str):
    """
    Get all feedback for a specific issue from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        docs = db.collection(FEEDBACK_COLLECTION).where("issue_id", "==", issue_id).stream()
        feedbacks = [Feedback(**doc.to_dict()) for doc in docs]
        return feedbacks
    except Exception as e:
        logger.error(f"Get issue feedback error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{feedback_id}", response_model=Feedback)
async def get_feedback(feedback_id: str):
    """
    Get specific feedback from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        doc = db.collection(FEEDBACK_COLLECTION).document(feedback_id).get()
        
        if not doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )
        
        return Feedback(**doc.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get feedback error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{feedback_id}", response_model=MessageResponse)
async def delete_feedback(feedback_id: str):
    """
    Delete feedback from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        feedback_ref = db.collection(FEEDBACK_COLLECTION).document(feedback_id)
        if not feedback_ref.get().exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )
        
        feedback_ref.delete()
        logger.info(f"Feedback {feedback_id} deleted")
        
        return MessageResponse(message="Feedback deleted successfully")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete feedback error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
