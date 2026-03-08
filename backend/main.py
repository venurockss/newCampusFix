from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import API_TITLE, API_DESCRIPTION, API_VERSION, ALLOWED_ORIGINS
from routes import auth, issues, feedback, notifications, admin, technician, analytics

# Initialize FastAPI app
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(issues.router)
app.include_router(feedback.router)
app.include_router(notifications.router)
app.include_router(admin.router)
app.include_router(technician.router)
app.include_router(analytics.router)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "CampusFix API"}

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": API_TITLE,
        "version": API_VERSION,
        "description": API_DESCRIPTION,
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

# 404 handler
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "path": request.url.path}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
