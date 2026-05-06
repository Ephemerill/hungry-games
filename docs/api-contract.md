# API Contract

## Web API Bridge

The browser calls only the Next.js app routes below. The browser must not call the remote AI
server directly.

The Next.js route handlers read `AI_SERVER_BASE_URL` from `apps/web/.env.local` and forward to the
remote AI server. If `AI_SERVER_BASE_URL` is missing, the remote server is unreachable, the remote
server returns a non-2xx response, or the next-round response is not usable, the handlers return the
existing local mock data with `source: "mock"`.

Shared TypeScript shapes live in `packages/shared/src/api-contract.ts`.

## POST `/api/sessions/start`

Local browser-facing route. The route forwards the request to:

`POST {AI_SERVER_BASE_URL}/sessions/start`

Request:

```ts
type StartSessionRequest = {
  sessionName?: string;
  arenaId?: string;
  tributes?: Array<{
    name: string;
    district: string;
    skill: string;
  }>;
};
```

Response:

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

## POST `/api/sessions/next-round`

Local browser-facing route. The route forwards the request to:

`POST {AI_SERVER_BASE_URL}/sessions/next-round`

Request:

```ts
type NextRoundRequest = {
  sessionId?: string;
  currentRoundNumber?: number | null;
};
```

Response:

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
