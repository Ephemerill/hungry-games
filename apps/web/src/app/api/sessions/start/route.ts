import { NextResponse } from "next/server";
import {
  createMockStartSessionResponse,
  normalizeStartSessionResponse,
  postToAiServer,
  readJsonRequest
} from "@/lib/api-bridge";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await readJsonRequest(request);

  try {
    const remoteResponse = await postToAiServer("/sessions/start", payload);

    return NextResponse.json(normalizeStartSessionResponse(remoteResponse), {
      headers: {
        "x-hungry-games-source": "remote"
      }
    });
  } catch (error) {
    return NextResponse.json(createMockStartSessionResponse(error), {
      headers: {
        "x-hungry-games-source": "mock"
      }
    });
  }
}
