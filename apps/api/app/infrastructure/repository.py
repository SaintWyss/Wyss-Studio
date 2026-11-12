from __future__ import annotations

import hashlib
import json
import sqlite3
from dataclasses import dataclass
from pathlib import Path

from app.domain.models import PublicationResult, ReleaseSummary, StudioProject, utc_now


@dataclass(frozen=True)
class RepositorySettings:
    database_path: Path
    release_directory: Path


class ProjectRepository:
    def __init__(self, settings: RepositorySettings) -> None:
        self.settings = settings
        self.settings.database_path.parent.mkdir(parents=True, exist_ok=True)
        self.settings.release_directory.mkdir(parents=True, exist_ok=True)
        self._initialize()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.settings.database_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _initialize(self) -> None:
        with self._connect() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS projects (
                    id TEXT PRIMARY KEY,
                    payload TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS releases (
                    project_id TEXT NOT NULL,
                    version INTEGER NOT NULL,
                    checksum TEXT NOT NULL,
                    target TEXT NOT NULL,
                    payload TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    PRIMARY KEY (project_id, version)
                );
                """
            )

    def save_project(self, project: StudioProject) -> StudioProject:
        payload = project.model_dump_json(by_alias=True)
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO projects (id, payload, updated_at) VALUES (?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET payload=excluded.payload, updated_at=excluded.updated_at
                """,
                (project.id, payload, project.updatedAt.isoformat()),
            )
        return project

    def get_project(self, project_id: str) -> StudioProject | None:
        with self._connect() as connection:
            row = connection.execute("SELECT payload FROM projects WHERE id = ?", (project_id,)).fetchone()
        return StudioProject.model_validate_json(row["payload"]) if row else None

    def publish(self, project: StudioProject) -> PublicationResult:
        canonical = json.dumps(project.model_dump(mode="json"), sort_keys=True, separators=(",", ":"))
        checksum = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
        created_at = utc_now()

        with self._connect() as connection:
            row = connection.execute(
                "SELECT COALESCE(MAX(version), 0) AS current_version FROM releases WHERE project_id = ?",
                (project.id,),
            ).fetchone()
            version = int(row["current_version"]) + 1
            connection.execute(
                "INSERT INTO releases (project_id, version, checksum, target, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (project.id, version, checksum, project.device.target, canonical, created_at.isoformat()),
            )

        package = {
            "manifest": {
                "projectId": project.id,
                "schemaVersion": project.schemaVersion,
                "releaseVersion": version,
                "target": project.device.target,
                "checksum": checksum,
                "createdAt": created_at.isoformat(),
            },
            "interface": project.model_dump(mode="json"),
        }
        output = self.settings.release_directory / f"{project.id}-v{version}.json"
        output.write_text(json.dumps(package, ensure_ascii=False, indent=2), encoding="utf-8")

        self.save_project(project)
        return PublicationResult(
            project_id=project.id,
            version=version,
            checksum=checksum,
            created_at=created_at,
            target=project.device.target,
            download_path=f"/api/projects/{project.id}/releases/{version}/download",
        )

    def latest_release(self, project_id: str) -> ReleaseSummary | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT project_id, version, checksum, target, created_at
                FROM releases WHERE project_id = ? ORDER BY version DESC LIMIT 1
                """,
                (project_id,),
            ).fetchone()
        return ReleaseSummary(**dict(row)) if row else None

    def release_file(self, project_id: str, version: int) -> Path | None:
        path = self.settings.release_directory / f"{project_id}-v{version}.json"
        return path if path.exists() else None
