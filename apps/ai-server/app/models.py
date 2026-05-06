from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field, model_validator


class TributeInput(BaseModel):
    id: str | None = None
    name: str
    district: int | None = Field(default=None, ge=1, le=12)
    attributes: dict[str, Any] = Field(default_factory=dict)


class TributeProfile(BaseModel):
    id: str
    name: str
    district: int | None = None
    strengths: list[str]
    weakness: str
    temperament: str
    status: Literal["alive", "injured", "eliminated"] = "alive"


class ArenaZone(BaseModel):
    id: str
    name: str
    terrain: str
    danger_level: int = Field(ge=1, le=5)
    resources: list[str]


class ArenaMap(BaseModel):
    seed: str
    zones: list[ArenaZone]
    adjacency: dict[str, list[str]]


class GameEvent(BaseModel):
    id: str
    type: str
    actor_ids: list[str]
    zone_id: str | None = None
    description: str
    impact: dict[str, Any] = Field(default_factory=dict)


class TimelineStep(BaseModel):
    at_ms: int = Field(ge=0)
    duration_ms: int = Field(ge=0)
    type: str
    target_ids: list[str]
    zone_id: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)


class InitialRenderPackage(BaseModel):
    scene_id: str
    arena: ArenaMap
    tribute_locations: dict[str, str]
    tribute_status: dict[str, Literal["alive", "injured", "eliminated"]]
    animation_timeline: list[TimelineStep]
    camera: dict[str, Any] = Field(default_factory=dict)
    overlays: dict[str, Any] = Field(default_factory=dict)


class GameState(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid4()))
    round_number: int = Field(default=0, ge=0)
    tributes: list[TributeProfile]
    map: ArenaMap
    tribute_locations: dict[str, str]
    inventory: dict[str, list[str]] = Field(default_factory=dict)
    eliminated_tribute_ids: list[str] = Field(default_factory=list)


class StoryMemoryEntry(BaseModel):
    round_number: int
    summary: str
    event_ids: list[str] = Field(default_factory=list)


class StartSessionRequest(BaseModel):
    session_id: str | None = None
    tributes: list[TributeInput] = Field(default_factory=list)
    arena_seed: str = "training-arena"


class StartSessionResponse(BaseModel):
    session_id: str
    tributes: list[TributeProfile]
    arena: ArenaMap
    initial_state: GameState
    initial_render_package: InitialRenderPackage
    story_memory: list[StoryMemoryEntry]
    state: GameState
    profiles: list[TributeProfile]
    map: ArenaMap


class NextRoundRequest(BaseModel):
    session_id: str | None = None
    state: GameState | None = None
    current_state: GameState | dict[str, Any] | None = None
    story_memory: list[StoryMemoryEntry] = Field(default_factory=list)
    recent_rounds: list[dict[str, Any]] = Field(default_factory=list)

    @model_validator(mode="after")
    def use_current_state_alias(self) -> "NextRoundRequest":
        if self.state is None and isinstance(self.current_state, GameState):
            self.state = self.current_state
        return self


class NextRoundResponse(BaseModel):
    round_number: int
    round_title: str
    narration: str
    events: list[GameEvent]
    animation_timeline: list[TimelineStep]
    state_after: GameState
    story_memory_after: list[StoryMemoryEntry]


class HealthResponse(BaseModel):
    status: Literal["ok"]
