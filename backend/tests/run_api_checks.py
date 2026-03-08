from fastapi import FastAPI
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Ensure backend root is on sys.path so top-level `routes` package can be imported
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from routes import analytics as analytics_module


def run_checks():
    # Create a minimal app that includes only the analytics router to avoid initializing optional deps
    app = FastAPI()
    app.include_router(analytics_module.router)

    # add simple health and root endpoints similar to main.py
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "CampusFix API"}

    @app.get("/")
    async def root():
        return {"name": "CampusFix (test)", "version": "test"}

    client = TestClient(app)

    endpoints = [
        "/health",
        "/",
        "/api/v1/analytics/dashboard",
        "/api/v1/analytics/issues/by-status",
        "/api/v1/analytics/issues/by-category",
        "/api/v1/analytics/technician-performance",
        "/api/v1/analytics/resolution-time",
    ]

    all_ok = True
    for ep in endpoints:
        r = client.get(ep)
        status = r.status_code
        print(f"{ep} -> {status}")
        try:
            print(r.json())
        except Exception:
            print(r.text)
        if status != 200:
            all_ok = False

    if all_ok:
        print("\nAll route checks passed.")
        return 0
    else:
        print("\nSome route checks failed.")
        return 2


if __name__ == "__main__":
    try:
        exit_code = run_checks()
        sys.exit(exit_code)
    except ImportError as e:
        print("ImportError:", e)
        print("Make sure dependencies from requirements.txt are installed, especially 'fastapi' and 'requests'.")
        sys.exit(3)
