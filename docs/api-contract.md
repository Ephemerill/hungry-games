# API Contract

## Overview

The browser should only call the local Next.js web app routes.

The Next.js route handlers read `AI_SERVER_BASE_URL` from `apps/web/.env.local` and forward requests to the remote AI/simulation server over Tailscale.

The remote AI/simulation server owns game-changing events, validation, pathfinding, and frontend-ready animation timelines.

The current implementation uses deterministic placeholder logic and does not call local or remote model inference yet.

```text
Browser
  ↓
Next.js API route
  ↓
Remote AI/simulation server
```

---

## Web API Bridge

These are browser-facing routes handled by the Next.js app.

The browser must not call the remote AI server directly.

If `AI_SERVER_BASE_URL` is missing, the remote server is unreachable, the remote server returns a non-2xx response, or the next-round response is not usable, the web app may fall back to local mock data with:

```json
{
  "source": "mock"
}
```

Shared TypeScript shapes live in:

```text
packages/shared/src/api-contract.ts
```

---

## GET `/api/ai-health`

Browser-facing route. Checks whether the remote AI server is reachable.

Forwards to:

```text
GET {AI_SERVER_BASE_URL}/health
```

### Response

```ts
type AiHealthResponse = {
  source: "remote" | "mock";
  status: "ok" | "unreachable" | string;
  message?: string;
};
```

---

## POST `/api/sessions/start`

Browser-facing route. Starts a new game session.

Forwards to:

```text
POST {AI_SERVER_BASE_URL}/sessions/start
```

### Request

```ts
type StartSessionRequest = {
  sessionId?: string;
  sessionName?: string;
  arenaId?: string;
  tributes?: Array<{
    id?: string;
    name: string;
    district?: string | number;
    skill?: string;
    description?: string;
    imageUrl?: string;
    attributes?: Record<string, unknown>;
  }>;
  setting?: string;
  tone?: string;
  instructions?: string;
};
```

### Response

```ts
type StartSessionResponse = {
  source: "remote" | "mock";
  sessionId: string;
  arena: Arena;
  tributes: Tribute[];
  nextRoundAvailable: boolean;
  message?: string;
};
```

---

## POST `/api/sessions/next-round`

Browser-facing route. Generates or retrieves the next round for display.

Forwards to:

```text
POST {AI_SERVER_BASE_URL}/sessions/next-round
```

### Request

```ts
type NextRoundRequest = {
  sessionId?: string;
  currentRoundNumber?: number | null;
  current_state?: Record<string, unknown>;
  story_memory?: unknown[];
  recent_rounds?: unknown[];
};
```

### Response

```ts
type NextRoundResponse = {
  source: "remote" | "mock";
  sessionId: string;
  arena: Arena;
  tributes: Tribute[];
  round: Round;
  message?: string;
};
```

---

# Remote AI/Simulation Server

These are internal routes exposed by the remote FastAPI AI/simulation server.

They are called by the Next.js API bridge over Tailscale.

---

## GET `/health`

Checks whether the remote AI server is online.

### Response

```json
{
  "status": "ok"
}
```

---

## POST `/sessions/start`

Initializes a new game session.

### Request

```json
{
  "session_id": "optional-client-id",
  "arena_seed": "training-arena",
  "tributes": [
    {
      "id": "optional-tribute-id",
      "name": "Aster Vale",
      "district": 3,
      "attributes": {}
    }
  ],
  "setting": "Abandoned futuristic city",
  "tone": "cinematic, non-graphic",
  "instructions": "Make alliances important."
}
```

### Response includes

```text
session_id
state
story_memory
profiles
map
```

---

## POST `/sessions/next-round`

Generates the next round from the current game state.

During early development, the backend may accept an empty `state` or `current_state` and fill in placeholder data.

### Minimal development request

```json
{
  "session_id": "session-placeholder-001",
  "state": {},
  "story_memory": []
}
```

### Alternative development request

```json
{
  "session_id": "session-placeholder-001",
  "current_state": {},
  "story_memory": [],
  "recent_rounds": []
}
```

### Response includes

```text
round_number
round_title
narration
events
animation_timeline
state_after
story_memory_after
```

---

# Shared Domain Types

These are the core shapes used by both sides.

```ts
type Arena = {
  id?: string;
  name?: string;
  width?: number;
  height?: number;
  zones?: unknown[];
  landmarks?: unknown[];
};

type Tribute = {
  id: string;
  name: string;
  district?: string | number;
  status?: "alive" | "dead" | string;
  position?: [number, number];
  health?: number;
  inventory?: string[];
  imageUrl?: string;
  profile?: Record<string, unknown>;
};

type Round = {
  number: number;
  title?: string;
  narration: string;
  events: unknown[];
  animationTimeline?: unknown[];
};
```