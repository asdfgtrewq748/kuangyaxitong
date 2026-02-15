"""
Simple health check endpoint for monitoring
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str
    backend: bool
    database: bool
    data_dir_exists: bool
    message: str


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Basic health check endpoint"""
    backend_running = True  # Placeholder - in real scenario, check actual backend status

    return HealthResponse(
        status="ok" if backend_running else "error",
        backend=backend_running,
        database=True,  # Placeholder
        data_dir_exists=True,  # Placeholder
        message="System operational"
    )


@router.get("/api/health", response_model=HealthResponse)
async def api_health() -> HealthResponse:
    """API health check endpoint"""
    try:
        import requests
        response = requests.get("http://localhost:8001/api/health", timeout=2)
        response.raise_for_status()
    return HealthResponse(
            status="ok",
            backend=response.status_code == 200,
            database=True,
            data_dir_exists=True,
            message="API operational"
        )
    except Exception as e:
        return HealthResponse(
            status="error",
            backend=False,
            database=False,
            data_dir_exists=True,
            message=str(e)
        )


@router.get("/api/status", response_model=HealthResponse)
async def status_check() -> HealthResponse:
    """Status check endpoint"""
    return HealthResponse(
        status="ok",
        backend=True,
        database=True,
        data_dir_exists=True,
        message="System operational"
    )
