# AGENTS.md

## Project Summary

This is an AI-powered tribute arena simulator.

The weak web server hosts the frontend and stores game/session state.
The remote AI server performs all AI inference, simulation validation, pathfinding, and animation timeline generation.

## Repo Structure

- apps/web: Next.js frontend and lightweight web/API bridge
- apps/ai-server: FastAPI remote AI/simulation server
- packages/shared: shared schemas, examples, and API contracts
- docs: architecture and planning docs

## Core Rules

1. The web app must not run local AI models.
2. The frontend must not invent story events.
3. Game-changing events come from the AI/simulation server.
4. The AI server returns frontend-ready animation timelines.
5. All API shape changes must update docs/api-contract.md and packages/shared.
6. Keep changes small and focused.
7. Use separate branches/worktrees for separate agents.
8. Do not commit secrets, API keys, model files, uploaded user photos, or .env files.

## Local Dev Commands

Web app:
cd apps/web
npm install
npm run dev

AI server:
cd apps/ai-server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000