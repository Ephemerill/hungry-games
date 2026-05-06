import { mockArena, mockRounds, mockTributes } from "@/lib/mock-data";
import type { NextRoundResponse, StartSessionResponse } from "@/types/api";
import type { Arena, Round, Tribute } from "@/types/game";

const DEFAULT_SESSION_ID = "mock-session-hydro-basin";
const REMOTE_TIMEOUT_MS = 4000;

type JsonRecord = Record<string, unknown>;

export async function readJsonRequest(request: Request): Promise<JsonRecord> {
  try {
    const body = (await request.json()) as unknown;
    return isRecord(body) ? body : {};
  } catch {
    return {};
  }
}

export async function postToAiServer(path: string, payload: unknown): Promise<JsonRecord> {
  const baseUrl = getAiServerBaseUrl();

  if (!baseUrl) {
    throw new Error("AI_SERVER_BASE_URL is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(payload ?? {}),
      cache: "no-store",
      signal: controller.signal
    });

    const data = await parseJsonResponse(response);

    if (!response.ok) {
      throw new Error(`AI server returned ${response.status}`);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export function normalizeStartSessionResponse(remote: JsonRecord): StartSessionResponse {
  return {
    source: "remote",
    sessionId: readString(remote, "sessionId", "session_id") ?? DEFAULT_SESSION_ID,
    arena: readArena(remote.arena) ?? mockArena,
    tributes: readTributes(remote.tributes) ?? mockTributes,
    nextRoundAvailable: readBoolean(remote, "nextRoundAvailable", "next_round_available") ?? true,
    message: readString(remote, "message") ?? "Connected to the remote AI server."
  };
}

export function normalizeNextRoundResponse(
  remote: JsonRecord,
  sessionId = DEFAULT_SESSION_ID
): NextRoundResponse {
  const round = readRound(remote.round) ?? readRound(remote);

  if (!round) {
    throw new Error("AI server response did not include a valid round");
  }

  return {
    source: "remote",
    sessionId: readString(remote, "sessionId", "session_id") ?? sessionId,
    arena: readArena(remote.arena) ?? mockArena,
    tributes: readTributes(remote.tributes) ?? mockTributes,
    round,
    message: readString(remote, "message") ?? "Loaded the next round from the remote AI server."
  };
}

export function createMockStartSessionResponse(): StartSessionResponse {
  return {
    source: "mock",
    sessionId: DEFAULT_SESSION_ID,
    arena: mockArena,
    tributes: mockTributes,
    nextRoundAvailable: true,
    message: "Remote AI server unavailable; using local mock session data."
  };
}

export function createMockNextRoundResponse(sessionId = DEFAULT_SESSION_ID): NextRoundResponse {
  return {
    source: "mock",
    sessionId,
    arena: mockArena,
    tributes: mockTributes,
    round: mockRounds[0],
    message: "Remote AI server unavailable; loaded the local mock round."
  };
}

function getAiServerBaseUrl(): string | null {
  const rawBaseUrl = process.env.AI_SERVER_BASE_URL?.trim();

  if (!rawBaseUrl) {
    return null;
  }

  return rawBaseUrl.replace(/\/+$/, "");
}

async function parseJsonResponse(response: Response): Promise<JsonRecord> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    return isRecord(parsed) ? parsed : {};
  } catch {
    throw new Error("AI server returned invalid JSON");
  }
}

function readString(record: JsonRecord, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
}

function readBoolean(record: JsonRecord, ...keys: string[]): boolean | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "boolean") {
      return value;
    }
  }

  return undefined;
}

function readArena(value: unknown): Arena | undefined {
  if (!isRecord(value) || !Array.isArray(value.zones)) {
    return undefined;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.biome !== "string" ||
    typeof value.weather !== "string" ||
    typeof value.timeOfDay !== "string"
  ) {
    return undefined;
  }

  return value as Arena;
}

function readTributes(value: unknown): Tribute[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const allValid = value.every(
    (tribute) =>
      isRecord(tribute) &&
      typeof tribute.id === "string" &&
      typeof tribute.name === "string" &&
      typeof tribute.district === "string"
  );

  return allValid ? (value as Tribute[]) : undefined;
}

function readRound(value: unknown): Round | undefined {
  if (!isRecord(value) || !Array.isArray(value.events)) {
    return undefined;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.number !== "number" ||
    typeof value.title !== "string" ||
    typeof value.summary !== "string"
  ) {
    return undefined;
  }

  return value as Round;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
