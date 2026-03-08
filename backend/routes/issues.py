from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime
from schemas import (
    Issue, IssueCreate, IssueUpdate, IssueStatus, IssuePriority, 
    IssueCategory, MessageResponse
)
from firebase_init import get_firestore_db
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/issues", tags=["Issues"])

ISSUES_COLLECTION = "issues"

@router.post("/report", response_model=Issue, status_code=status.HTTP_201_CREATED)
async def report_issue(user_id: str, issue_data: IssueCreate):
    """
    Create a new issue report and store in Firebase Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        issue_id = f"issue_{datetime.now().timestamp()}"
        now = datetime.utcnow()
        
        issue = Issue(
            issue_id=issue_id,
            reporter_id=user_id,
            title=issue_data.title,
            description=issue_data.description,
            location=issue_data.location,
            category=issue_data.category,
            priority=issue_data.priority,
            status=IssueStatus.PENDING,
            image_urls=issue_data.image_urls or [],
            upvotes=0,
            downvotes=0,
            created_at=now,
            updated_at=now
        )
        
        issue_dict = issue.dict()
        issue_dict["created_at"] = now.isoformat()
        issue_dict["updated_at"] = now.isoformat()
        
        # Store in Firestore
        db.collection(ISSUES_COLLECTION).document(issue_id).set(issue_dict)
        logger.info(f"Issue {issue_id} created by {user_id}")
        
        return issue
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Report issue error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/all", response_model=List[Issue])
async def get_all_issues(
    status_filter: Optional[IssueStatus] = None,
    category_filter: Optional[IssueCategory] = None,
    priority_filter: Optional[IssuePriority] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    """
    Get all issues from Firestore with optional filters
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        query = db.collection(ISSUES_COLLECTION)
        
        if status_filter:
            query = query.where("status", "==", status_filter.value)
        if category_filter:
            query = query.where("category", "==", category_filter.value)
        if priority_filter:
            query = query.where("priority", "==", priority_filter.value)
        
        # Fetch and paginate
        docs = list(query.stream())
        total = len(docs)
        paginated_docs = docs[skip : skip + limit]
        
        issues = []
        for doc in paginated_docs:
            data = doc.to_dict()
            issues.append(Issue(**data))
        
        return issues
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get all issues error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{issue_id}", response_model=Issue)
async def get_issue_detail(issue_id: str):
    """
    Get detailed information about a specific issue from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        doc = db.collection(ISSUES_COLLECTION).document(issue_id).get()
        
        if not doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Issue not found"
            )
        
        return Issue(**doc.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get issue detail error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/user/{user_id}", response_model=List[Issue])
async def get_user_issues(user_id: str):
    """
    Get all issues reported by a specific user from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        docs = db.collection(ISSUES_COLLECTION).where("reporter_id", "==", user_id).stream()
        user_issues = [Issue(**doc.to_dict()) for doc in docs]
        return user_issues
    except Exception as e:
        logger.error(f"Get user issues error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/{issue_id}", response_model=Issue)
async def update_issue(issue_id: str, issue_update: IssueUpdate):
    """
    Update an issue in Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        issue_ref = db.collection(ISSUES_COLLECTION).document(issue_id)
        issue_doc = issue_ref.get()
        
        if not issue_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Issue not found"
            )
        
        update_data = {}
        if issue_update.title:
            update_data["title"] = issue_update.title
        if issue_update.description:
            update_data["description"] = issue_update.description
        if issue_update.location:
            update_data["location"] = issue_update.location
        if issue_update.category:
            update_data["category"] = issue_update.category.value
        if issue_update.priority:
            update_data["priority"] = issue_update.priority.value
        # allow assigning technician
        if getattr(issue_update, "assigned_to", None):
            update_data["assigned_to"] = issue_update.assigned_to
        if issue_update.status:
            update_data["status"] = issue_update.status.value
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        issue_ref.update(update_data)
        
        updated_doc = issue_ref.get()
        return Issue(**updated_doc.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update issue error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{issue_id}", response_model=MessageResponse)
async def delete_issue(issue_id: str):
    """
    Delete an issue from Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        issue_ref = db.collection(ISSUES_COLLECTION).document(issue_id)
        if not issue_ref.get().exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Issue not found"
            )
        
        issue_ref.delete()
        logger.info(f"Issue {issue_id} deleted")
        
        return MessageResponse(message="Issue deleted successfully")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete issue error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{issue_id}/upvote", response_model=Issue)
async def upvote_issue(issue_id: str):
    """
    Upvote an issue in Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        issue_ref = db.collection(ISSUES_COLLECTION).document(issue_id)
        issue_doc = issue_ref.get()
        
        if not issue_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Issue not found"
            )
        
        current_upvotes = issue_doc.get("upvotes") or 0
        issue_ref.update({
            "upvotes": current_upvotes + 1,
            "updated_at": datetime.utcnow().isoformat()
        })
        
        updated_doc = issue_ref.get()
        return Issue(**updated_doc.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upvote issue error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{issue_id}/downvote", response_model=Issue)
async def downvote_issue(issue_id: str):
    """
    Downvote an issue in Firestore
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")
        
        issue_ref = db.collection(ISSUES_COLLECTION).document(issue_id)
        issue_doc = issue_ref.get()
        
        if not issue_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Issue not found"
            )
        
        current_downvotes = issue_doc.get("downvotes") or 0
        issue_ref.update({
            "downvotes": current_downvotes + 1,
            "updated_at": datetime.utcnow().isoformat()
        })
        
        updated_doc = issue_ref.get()
        return Issue(**updated_doc.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Downvote issue error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
