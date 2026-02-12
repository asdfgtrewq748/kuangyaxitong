"""
API路由模块
"""
from app.routes.mpi import router as mpi_router
from app.routes.rock_params import router as rock_params_router
from app.routes.algorithm_validation import router as validation_router
from app.routes.research import router as research_router
from app.routes.geomodel import router as geomodel_router

__all__ = ["mpi_router", "rock_params_router", "validation_router", "research_router", "geomodel_router"]
