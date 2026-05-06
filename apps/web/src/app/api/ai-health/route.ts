import { NextResponse } from "next/server";
import {
  createOfflineHealthResponse,
  createRemoteHealthResponse,
  getAiServerHealth
} from "@/lib/api-bridge";

export const runtime = "nodejs";

export async function GET() {
  try {
    const remoteResponse = await getAiServerHealth();

    return NextResponse.json(createRemoteHealthResponse(remoteResponse), {
      headers: {
        "x-hungry-games-source": "remote"
      }
    });
  } catch (error) {
    return NextResponse.json(createOfflineHealthResponse(error), {
      headers: {
        "x-hungry-games-source": "mock"
      }
    });
  }
}
