# Shared API Contract

The canonical API shape is documented in `docs/api-contract.md`.

Current remote AI server endpoints:

- `GET /health`
- `POST /sessions/start`
- `POST /sessions/next-round`

The `next-round` response contains `round_number`, `round_title`, `narration`, `events`, `animation_timeline`, `state_after`, and `story_memory_after`.
