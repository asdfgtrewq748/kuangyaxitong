"""
API路由模块
"""
from app.routes.mpi import router as mpi_router
from app.routes.rock_params import router as rock_params_router

__all__ = ["mpi_router", "rock_params_router"]
