import { NextResponse } from "next/server";
import {
  createMockNextRoundResponse,
  normalizeNextRoundResponse,
  postToAiServer,
  readJsonRequest
} from "@/lib/api-bridge";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await readJsonRequest(request);
  const sessionId = typeof payload.sessionId === "string" ? payload.sessionId : undefined;

  try {
    const remoteResponse = await postToAiServer("/sessions/next-round", payload);

    return NextResponse.json(normalizeNextRoundResponse(remoteResponse, sessionId), {
      headers: {
        "x-hungry-games-source": "remote"
      }
    });
  } catch {
    return NextResponse.json(createMockNextRoundResponse(sessionId), {
      headers: {
        "x-hungry-games-source": "mock"
      }
    });
  }
}
