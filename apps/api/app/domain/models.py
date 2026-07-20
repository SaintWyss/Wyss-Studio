from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class DeviceProfile(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    name: str
    width: Annotated[int, Field(ge=240, le=3840)]
    height: Annotated[int, Field(ge=240, le=2160)]
    target: Literal["esp32", "mobile", "desktop"]


class ComponentAction(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["none", "navigate", "wyss.command"] = "none"
    value: str | None = None

    @model_validator(mode="after")
    def require_value_for_active_action(self) -> ComponentAction:
        if self.type != "none" and not self.value:
            raise ValueError("Actions other than 'none' require a value")
        return self


class StudioComponent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    type: Literal["text", "button", "switch", "card", "status", "progress"]
    name: str
    x: Annotated[int, Field(ge=0)]
    y: Annotated[int, Field(ge=0)]
    width: Annotated[int, Field(ge=32)]
    height: Annotated[int, Field(ge=24)]
    text: str
    background: str
    color: str
    borderRadius: Annotated[int, Field(ge=0, le=100)]
    fontSize: Annotated[int, Field(ge=8, le=96)]
    value: int | bool | str | None = None
    action: ComponentAction


class StudioScreen(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    name: str
    background: str
    components: list[StudioComponent]


class StudioProject(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    name: str
    schemaVersion: Literal["1.0.0"]
    device: DeviceProfile
    screens: Annotated[list[StudioScreen], Field(min_length=1)]
    activeScreenId: str
    updatedAt: datetime

    @field_validator("screens")
    @classmethod
    def require_unique_screen_ids(cls, screens: list[StudioScreen]) -> list[StudioScreen]:
        ids = [screen.id for screen in screens]
        if len(ids) != len(set(ids)):
            raise ValueError("Screen ids must be unique")
        return screens

    @model_validator(mode="after")
    def validate_references_and_bounds(self) -> StudioProject:
        screen_ids = {screen.id for screen in self.screens}
        if self.activeScreenId not in screen_ids:
            raise ValueError("activeScreenId must reference an existing screen")

        for screen in self.screens:
            component_ids: set[str] = set()
            for component in screen.components:
                if component.id in component_ids:
                    raise ValueError(f"Duplicate component id in screen {screen.id}")
                component_ids.add(component.id)
                if component.x + component.width > self.device.width:
                    raise ValueError(f"Component {component.id} exceeds device width")
                if component.y + component.height > self.device.height:
                    raise ValueError(f"Component {component.id} exceeds device height")
                if component.action.type == "navigate" and component.action.value not in screen_ids:
                    raise ValueError(f"Component {component.id} navigates to an unknown screen")
        return self


class ReleaseSummary(BaseModel):
    project_id: str
    version: int
    checksum: str
    created_at: datetime
    target: Literal["esp32", "mobile", "desktop"]


class PublicationResult(ReleaseSummary):
    download_path: str


def utc_now() -> datetime:
    return datetime.now(timezone.utc)
