from fastapi import FastAPI

from app.models import (
    HealthResponse,
    NextRoundRequest,
    NextRoundResponse,
    StartSessionRequest,
    StartSessionResponse,
)
from app.round_planner import plan_round
from app.session_service import start_session

app = FastAPI(
    title="Arena AI Simulation Server",
    version="0.1.0",
    description="Remote AI/simulation server for deterministic arena placeholders.",
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/sessions/start", response_model=StartSessionResponse)
def sessions_start(request: StartSessionRequest) -> StartSessionResponse:
    return start_session(request)


@app.post("/sessions/next-round", response_model=NextRoundResponse)
def sessions_next_round(request: NextRoundRequest) -> NextRoundResponse:
    return plan_round(request)
