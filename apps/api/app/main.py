from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.infrastructure.repository import ProjectRepository, RepositorySettings
from app.routers.projects import router as projects_router

_data_directory = Path(os.getenv("WYSS_STUDIO_DATA", "data"))
repository = ProjectRepository(
    RepositorySettings(
        database_path=_data_directory / "wyss-studio.db",
        release_directory=_data_directory / "releases",
    )
)

app = FastAPI(
    title="Wyss Studio API",
    version="0.1.0",
    description="Stores, validates and publishes versioned Wyss interface packages.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "PUT", "POST"],
    allow_headers=["Content-Type"],
)
app.include_router(projects_router)


@app.get("/api/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "wyss-studio-api"}
