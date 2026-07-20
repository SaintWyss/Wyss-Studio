from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from app.domain.models import PublicationResult, ReleaseSummary, StudioProject
from app.infrastructure.repository import ProjectRepository

router = APIRouter(prefix="/api/projects", tags=["projects"])


def get_repository() -> ProjectRepository:
    from app.main import repository

    return repository


@router.get("/{project_id}", response_model=StudioProject)
def get_project(project_id: str, repository: ProjectRepository = Depends(get_repository)) -> StudioProject:
    project = repository.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=StudioProject)
def save_project(project_id: str, project: StudioProject, repository: ProjectRepository = Depends(get_repository)) -> StudioProject:
    if project_id != project.id:
        raise HTTPException(status_code=409, detail="Path project id does not match payload")
    return repository.save_project(project)


@router.post("/{project_id}/publish", response_model=PublicationResult, status_code=201)
def publish_project(project_id: str, project: StudioProject, repository: ProjectRepository = Depends(get_repository)) -> PublicationResult:
    if project_id != project.id:
        raise HTTPException(status_code=409, detail="Path project id does not match payload")
    return repository.publish(project)


@router.get("/{project_id}/releases/latest", response_model=ReleaseSummary)
def latest_release(project_id: str, repository: ProjectRepository = Depends(get_repository)) -> ReleaseSummary:
    release = repository.latest_release(project_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    return release


@router.get("/{project_id}/releases/{version}/download", response_class=FileResponse)
def download_release(project_id: str, version: int, repository: ProjectRepository = Depends(get_repository)) -> FileResponse:
    path = repository.release_file(project_id, version)
    if not path:
        raise HTTPException(status_code=404, detail="Release not found")
    return FileResponse(path, media_type="application/json", filename=path.name)
