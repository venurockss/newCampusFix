from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import datetime
from schemas import Issue, MessageResponse, IssueStatus
from firebase_init import get_firestore_db
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/technician", tags=["Technician"])

ASSIGNMENTS_COLLECTION = "assignments"

@router.get("/dashboard/{technician_id}", response_model=dict)
async def get_technician_dashboard(technician_id: str):
    """
    Get technician dashboard with assigned issues from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        docs = db.collection(ASSIGNMENTS_COLLECTION).where("technician_id", "==", technician_id).stream()
        assigned_issues = [doc.to_dict() for doc in docs]
        
        return {
            "technician_id": technician_id,
            "assigned_count": len(assigned_issues),
            "completed_count": len([a for a in assigned_issues if a.get("status") == "resolved"]),
            "pending_count": len([a for a in assigned_issues if a.get("status") == "in_progress"]),
            "assignments": assigned_issues
        }
    except Exception as e:
        logger.error(f"Get technician dashboard error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/assignments/{technician_id}", response_model=List[dict])
async def get_technician_assignments(
    technician_id: str,
    status_filter: Optional[str] = None
):
    """
    Get all assignments for a technician from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        query = db.collection(ASSIGNMENTS_COLLECTION).where("technician_id", "==", technician_id)
        if status_filter:
            query = query.where("status", "==", status_filter)
        
        docs = query.stream()
        assignments = [doc.to_dict() for doc in docs]
        return assignments
    except Exception as e:
        logger.error(f"Get technician assignments error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/assign/{issue_id}", response_model=MessageResponse)
async def assign_issue(issue_id: str, technician_id: str):
    """
    Assign issue to technician in Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        assignment_id = f"assign_{datetime.now().timestamp()}"
        now = datetime.utcnow()
        
        assignment = {
            "assignment_id": assignment_id,
            "issue_id": issue_id,
            "technician_id": technician_id,
            "status": "in_progress",
            "assigned_at": now.isoformat(),
            "updated_at": now.isoformat()
        }
        
        db.collection(ASSIGNMENTS_COLLECTION).document(assignment_id).set(assignment)
        logger.info(f"Issue {issue_id} assigned to technician {technician_id}")
        
        return MessageResponse(message=f"Issue {issue_id} assigned to technician {technician_id}")
    except Exception as e:
        logger.error(f"Assign issue error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/assignment/{assignment_id}/update-status", response_model=MessageResponse)
async def update_assignment_status(assignment_id: str, new_status: str):
    """
    Update assignment status in Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        assignment_ref = db.collection(ASSIGNMENTS_COLLECTION).document(assignment_id)
        if not assignment_ref.get().exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )
        
        assignment_ref.update({
            "status": new_status,
            "updated_at": datetime.utcnow().isoformat()
        })
        logger.info(f"Assignment {assignment_id} status updated to {new_status}")
        
        return MessageResponse(message="Assignment status updated")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update assignment status error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/assignment/{assignment_id}/add-notes", response_model=MessageResponse)
async def add_resolution_notes(assignment_id: str, notes: str):
    """
    Add resolution notes to an assignment in Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        assignment_ref = db.collection(ASSIGNMENTS_COLLECTION).document(assignment_id)
        if not assignment_ref.get().exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )
        
        assignment_ref.update({
            "resolution_notes": notes,
            "updated_at": datetime.utcnow().isoformat()
        })
        logger.info(f"Resolution notes added to assignment {assignment_id}")
        
        return MessageResponse(message="Resolution notes added")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Add resolution notes error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
