from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    TECHNICIAN = "technician"
    ADMIN = "admin"

class IssueStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    PENDING = "pending"

class IssuePriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class IssueCategory(str, Enum):
    WATER = "water"
    ELECTRICITY = "electricity"
    SANITATION = "sanitation"
    INFRASTRUCTURE = "infrastructure"
    SAFETY = "safety"
    MAINTENANCE = "maintenance"
    OTHER = "other"

# User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.STUDENT

class UserCreate(UserBase):
    password: str
    specialization: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    student_id: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None

class ChangePassword(BaseModel):
    old_password: str
    new_password: str

class User(UserBase):
    user_id: str
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Issue Models
class IssueBase(BaseModel):
    title: str
    description: str
    location: str
    category: IssueCategory
    priority: IssuePriority = IssuePriority.MEDIUM

class IssueCreate(IssueBase):
    image_urls: Optional[List[str]] = []

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    category: Optional[IssueCategory] = None
    priority: Optional[IssuePriority] = None
    assigned_to: Optional[str] = None
    status: Optional[IssueStatus] = None

class Issue(IssueBase):
    issue_id: str
    reporter_id: str
    status: IssueStatus = IssueStatus.OPEN
    assigned_to: Optional[str] = None
    image_urls: Optional[List[str]] = []
    upvotes: int = 0
    downvotes: int = 0
    created_at: datetime
    updated_at: datetime
    resolution_notes: Optional[str] = None

    class Config:
        from_attributes = True

# Feedback Model
class FeedbackCreate(BaseModel):
    issue_id: str
    rating: int
    comment: Optional[str] = None

class Feedback(FeedbackCreate):
    feedback_id: str
    user_id: str
    created_at: datetime

# Notification Model
class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    issue_id: Optional[str] = None

class Notification(NotificationCreate):
    notification_id: str
    is_read: bool = False
    created_at: datetime

# Analytics Models
class IssueStats(BaseModel):
    total_issues: int
    open_issues: int
    in_progress_issues: int
    resolved_issues: int
    closed_issues: int
    average_resolution_time: float

class CategoryStats(BaseModel):
    category: IssueCategory
    total_count: int
    resolved_count: int
    average_resolution_time: float

class Analytics(BaseModel):
    total_users: int
    total_issues: int
    issue_stats: IssueStats
    category_breakdown: List[CategoryStats]
    technician_performance: dict

# Response Models
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

class MessageResponse(BaseModel):
    message: str
    status: str = "success"

class ErrorResponse(BaseModel):
    error: str
    status: str = "error"
