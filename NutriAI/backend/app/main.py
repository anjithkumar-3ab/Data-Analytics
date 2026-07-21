"""
NutriAI FastAPI Application.

AI-Based Personalized Diet Planning & Recommendation System.

Provides REST API endpoints for user authentication, health profile
management, food database queries, and AI-assisted diet plan recommendations.
"""

from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError

from app.database.database import client, db
from app.routes.food import router as food_router
from app.routes.profile import router as profile_router
from app.routes.recommendation import router as recommendation_router

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger("nutriai")

# Quiet down noisy third-party loggers.
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
logging.getLogger("pymongo").setLevel(logging.WARNING)


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.

    Startup:
        - Verify MongoDB connectivity via ``ping``.
        - Log successful startup with database status.

    Shutdown:
        - Close the MongoDB client connection.
        - Log clean shutdown.
    """
    # --- Startup -----------------------------------------------------------
    logger.info("NutriAI API v1.0.0 starting up ...")

    try:
        client.admin.command("ping")
        logger.info("MongoDB Atlas connection verified successfully")
    except PyMongoError as exc:
        logger.critical("MongoDB connection failed: %s", exc)
        raise RuntimeError("Database connection failed – aborting startup") from exc

    logger.info("All routers registered – application is ready")

    # --- Yield control to the application ----------------------------------
    yield

    # --- Shutdown ----------------------------------------------------------
    logger.info("NutriAI API shutting down ...")
    try:
        client.close()
        logger.info("MongoDB connection closed")
    except PyMongoError as exc:
        logger.warning("Error closing MongoDB connection: %s", exc)

    logger.info("NutriAI API shutdown complete")


# ---------------------------------------------------------------------------
# Application instance
# ---------------------------------------------------------------------------

app = FastAPI(
    title="NutriAI API",
    version="1.0.0",
    description=(
        "AI-Based Personalized Diet Planning & Recommendation System.  "
        "Generates intelligent daily meal plans from a curated food "
        "database, respecting dietary preferences, allergies, and "
        "medical conditions."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------

ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server (legacy)
    "http://localhost:3000",  # Alternate React dev server (legacy)
    "http://localhost:8501",  # Streamlit dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------------

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """
    Return a clean 422 response for Pydantic validation errors.

    Args:
        request: The incoming HTTP request.
        exc: The validation error raised by FastAPI / Pydantic.

    Returns:
        JSONResponse with structured error details.
    """
    logger.warning(
        "Validation error on %s %s: %s",
        request.method,
        request.url.path,
        exc.errors(),
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={
            "success": False,
            "error": "Validation Error",
            "message": "One or more request fields are invalid.",
            "details": exc.errors(),
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    """
    Normalise HTTPException responses into a consistent JSON shape.

    Args:
        request: The incoming HTTP request.
        exc: The HTTP exception raised by a route or dependency.

    Returns:
        JSONResponse with ``success``, ``error``, and ``detail`` keys.
    """
    logger.warning(
        "HTTP %d on %s %s: %s",
        exc.status_code,
        request.method,
        request.url.path,
        exc.detail,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": _http_status_phrase(exc.status_code),
            "detail": exc.detail,
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """
    Catch-all handler for any unhandled exception.

    Logs the full traceback and returns a generic 500 response to avoid
    leaking internal details to clients.

    Args:
        request: The incoming HTTP request.
        exc: The uncaught exception.

    Returns:
        JSONResponse with a 500 status and a generic error message.
    """
    logger.exception(
        "Unhandled exception on %s %s: %s",
        request.method,
        request.url.path,
        exc,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later.",
        },
    )


# ---------------------------------------------------------------------------
# Middleware: request logging
# ---------------------------------------------------------------------------

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Log every incoming HTTP request along with its status code and duration.

    Args:
        request: The incoming request.
        call_next: ASGI callable for the next middleware / route handler.

    Returns:
        The HTTP response.
    """
    start_time = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - start_time) * 1000

    logger.info(
        "%s %s → %d (%.2f ms)",
        request.method,
        request.url.path,
        response.status_code,
        elapsed_ms,
    )
    return response


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _http_status_phrase(code: int) -> str:
    """Map an HTTP status code to a human-readable phrase.

    Args:
        code: HTTP status code.

    Returns:
        Standard reason phrase (e.g. ``"Not Found"`` for 404).
    """
    from http import HTTPStatus

    try:
        return HTTPStatus(code).phrase
    except ValueError:
        return "Unknown Error"


# ---------------------------------------------------------------------------
# Root endpoint
# ---------------------------------------------------------------------------

@app.get("/", include_in_schema=False)
async def root() -> Dict[str, Any]:
    """
    Application root – returns basic metadata.

    Returns:
        dict with application name, version, and status.
    """
    return {
        "application": "NutriAI",
        "version": "1.0.0",
        "status": "running",
    }


# ---------------------------------------------------------------------------
# Health endpoint
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Health"])
async def health_check() -> Dict[str, Any]:
    """
    Liveness / readiness probe.

    Returns the application health status and a live MongoDB connectivity
    check.

    Returns:
        dict with ``status``, ``database``, and ``service`` keys.
    """
    db_status = "disconnected"
    try:
        client.admin.command("ping")
        db_status = "connected"
    except PyMongoError:
        logger.warning("Health check: MongoDB ping failed")

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "service": "NutriAI Backend",
    }


# ---------------------------------------------------------------------------
# Router registration
# ---------------------------------------------------------------------------

app.include_router(profile_router)
app.include_router(food_router)
app.include_router(recommendation_router)

logger.info("Routers registered: profile, food, recommendation")
