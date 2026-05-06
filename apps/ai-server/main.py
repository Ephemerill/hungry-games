import hmac
import os
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


def require_internal_api_key(
    authorization: Annotated[str | None, Header()] = None,
) -> None:
    expected_key = os.getenv("INTERNAL_API_KEY")
    if not expected_key:
        return

    scheme, _, token = (authorization or "").partition(" ")
    if scheme.lower() != "bearer" or not hmac.compare_digest(token, expected_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing internal API key.",
        )


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post(
    "/sessions/start",
    response_model=StartSessionResponse,
    dependencies=[Depends(require_internal_api_key)],
)
def sessions_start(request: StartSessionRequest) -> StartSessionResponse:
    return start_session(request)


@app.post(
    "/sessions/next-round",
    response_model=NextRoundResponse,
    dependencies=[Depends(require_internal_api_key)],
)
def sessions_next_round(request: NextRoundRequest) -> NextRoundResponse:
    return plan_round(request)
