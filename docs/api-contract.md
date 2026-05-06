# API Contract

The remote AI/simulation server owns game-changing events, validation, pathfinding, and frontend-ready animation timelines. The current implementation is deterministic placeholder logic and does not call local or remote model inference.

## GET /health

Response:

```json
{
  "status": "ok"
}
```

## POST /sessions/start

Request:

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
  ]
}
```

Response includes:

- `session_id`
- `state`
- `story_memory`
- `profiles`
- `map`

## POST /sessions/next-round

Request:

```json
{
  "session_id": "session-placeholder-001",
  "state": {},
  "story_memory": []
}
```

Response includes:

- `round_number`
- `round_title`
- `narration`
- `events`
- `animation_timeline`
- `state_after`
- `story_memory_after`
