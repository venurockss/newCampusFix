from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
from schemas import Analytics, IssueStats, CategoryStats
from firebase_init import get_firestore_db
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=dict)
async def get_analytics_dashboard():
    """
    Get overall analytics dashboard
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")

        issues = list(db.collection("issues").stream())
        total_issues = len(issues)

        counts = {
            "open": 0,
            "in_progress": 0,
            "resolved": 0,
            "closed": 0,
            "pending": 0,
        }

        # category & location tallies
        categories = {
            "water": 0,
            "electricity": 0,
            "sanitation": 0,
            "infrastructure": 0,
            "safety": 0,
            "maintenance": 0,
            "other": 0,
        }
        locations = {}

        # resolution times per category and for top issues
        resolution_times_by_category = {}
        counts_by_category_for_resolution = {}
        top_issue_map = {}

        monthly_trends = {}

        now = datetime.utcnow()

        for doc in issues:
            try:
                data = doc.to_dict() or {}
                status_val = (data.get("status") or "").lower()
                if status_val in ("open", "opened"):
                    counts["open"] += 1
                elif status_val in ("in_progress", "in-progress", "in progress", "inprogress"):
                    counts["in_progress"] += 1
                elif status_val in ("resolved", "resolve"):
                    counts["resolved"] += 1
                elif status_val in ("closed",):
                    counts["closed"] += 1
                elif status_val in ("pending", "pending_review", "pending-review"):
                    counts["pending"] += 1
                else:
                    counts["open"] += 1

                # category tally
                cat = (data.get("category") or "other").lower()
                if cat not in categories:
                    cat = "other"
                categories[cat] = categories.get(cat, 0) + 1

                # location tally
                loc = data.get("location") or data.get("campus_location") or "Unknown"
                locations[loc] = locations.get(loc, 0) + 1

                # resolution time
                created_at = data.get("created_at")
                updated_at = data.get("updated_at")
                resolved_time_days = None
                if isinstance(created_at, datetime) and isinstance(updated_at, datetime):
                    # consider resolved when status is resolved/closed
                    if status_val in ("resolved", "closed"):
                        delta = updated_at - created_at
                        resolved_time_days = max(0.0, delta.total_seconds() / 86400.0)

                if resolved_time_days is not None:
                    resolution_times_by_category.setdefault(cat, 0.0)
                    counts_by_category_for_resolution.setdefault(cat, 0)
                    resolution_times_by_category[cat] += resolved_time_days
                    counts_by_category_for_resolution[cat] += 1

                # top issues by title
                title = (data.get("title") or "(untitled)").strip()
                top = top_issue_map.setdefault(title, {"count": 0, "total_days": 0.0})
                top["count"] += 1
                if resolved_time_days is not None:
                    top["total_days"] += resolved_time_days

                # monthly trends
                if isinstance(created_at, datetime):
                    key = created_at.strftime("%Y-%m")
                    mt = monthly_trends.setdefault(key, {"issues": 0, "resolved": 0})
                    mt["issues"] += 1
                    if status_val in ("resolved", "closed"):
                        mt["resolved"] += 1
            except Exception:
                logger.exception("Failed to parse issue doc for analytics")

        # compute averages and top lists
        resolution_time_by_category = {}
        for c, total_days in resolution_times_by_category.items():
            denom = counts_by_category_for_resolution.get(c, 1)
            resolution_time_by_category[c] = round(total_days / denom, 2) if denom else 0.0

        top_issues = []
        for title, info in top_issue_map.items():
            avg_time = round((info["total_days"] / info["count"]), 2) if info["count"] else 0.0
            top_issues.append({"title": title, "count": info["count"], "avgTime": avg_time})
        top_issues = sorted(top_issues, key=lambda x: x["count"], reverse=True)[:10]

        # monthly trends -> convert to sorted list
        monthly_trends_list = []
        for k in sorted(monthly_trends.keys()):
            monthly_trends_list.append({"month": k, "issues": monthly_trends[k]["issues"], "resolved": monthly_trends[k]["resolved"]})

        analytics = {
            "totalIssues": total_issues,
            "resolvedIssues": counts.get("resolved", 0) + counts.get("closed", 0),
            "pendingIssues": counts.get("pending", 0),
            "avgResolutionTime": round(sum(resolution_times_by_category.values()) / (sum(counts_by_category_for_resolution.values()) or 1), 2) if resolution_times_by_category else 0.0,
            "userSatisfaction": 0,
            "issuesByCategory": categories,
            "issuesByLocation": locations,
            "resolutionTimeByCategory": resolution_time_by_category,
            "topIssues": top_issues,
            "monthlyTrends": monthly_trends_list,
        }

        # return a plain dict that matches what frontend expects
        return analytics
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/issues/by-status", response_model=dict)
async def get_issues_by_status():
    """
    Get issue count breakdown by status
    """
    try:
        db = get_firestore_db()
        if db is None:
            raise HTTPException(status_code=503, detail="Firebase not initialized")

        docs = db.collection("issues").stream()
        counts = {
            "open": 0,
            "in_progress": 0,
            "resolved": 0,
            "closed": 0,
            "pending": 0,
        }

        for doc in docs:
            try:
                data = doc.to_dict() or {}
                status_val = (data.get("status") or "").lower()
                # normalize common variants
                if status_val in ("open", "opened"):
                    counts["open"] += 1
                elif status_val in ("in_progress", "in-progress", "in progress", "inprogress"):
                    counts["in_progress"] += 1
                elif status_val in ("resolved", "resolve"):
                    counts["resolved"] += 1
                elif status_val in ("closed",):
                    counts["closed"] += 1
                elif status_val in ("pending", "pending_review", "pending-review"):
                    counts["pending"] += 1
                else:
                    # if unknown status, count as open fallback
                    counts["open"] += 1
            except Exception:
                logger.exception("Failed to parse issue doc for analytics")

        return counts
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/issues/by-category", response_model=dict)
async def get_issues_by_category():
    """
    Get issue count breakdown by category
    """
    try:
        return {
            "water": 0,
            "electricity": 0,
            "sanitation": 0,
            "infrastructure": 0,
            "safety": 0,
            "maintenance": 0,
            "other": 0
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/technician-performance", response_model=dict)
async def get_technician_performance():
    """
    Get technician performance metrics
    """
    try:
        return {
            "total_technicians": 0,
            "average_resolution_time": 0.0,
            "resolution_rate": 0.0,
            "top_performers": []
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/resolution-time", response_model=dict)
async def get_average_resolution_time():
    """
    Get average issue resolution time
    """
    try:
        return {
            "average_days": 0.0,
            "median_days": 0.0,
            "by_category": {}
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
