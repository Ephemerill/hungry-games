"use client";

import { ChevronRight, Radio, RotateCcw, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArenaMap } from "@/components/ArenaMap";
import { NarrationPanel } from "@/components/NarrationPanel";
import { mockArena, mockRounds, mockTributes } from "@/lib/mock-data";
import type { ApiSource, NextRoundRequest, NextRoundResponse, StartSessionResponse } from "@/types/api";
import type { Arena, Round, Tribute } from "@/types/game";

const SESSION_STORAGE_KEY = "hungry-games-session";
const MOCK_SESSION_ID = "mock-session-hydro-basin";

export function GameShell() {
  const [arena, setArena] = useState<Arena>(mockArena);
  const [tributes, setTributes] = useState<Tribute[]>(mockTributes);
  const [round, setRound] = useState<Round | null>(null);
  const [sessionId, setSessionId] = useState(MOCK_SESSION_ID);
  const [source, setSource] = useState<ApiSource>("mock");
  const [isLoadingRound, setIsLoadingRound] = useState(false);
  const [bridgeMessage, setBridgeMessage] = useState(
    "Awaiting the next round from the local API bridge."
  );

  useEffect(() => {
    const storedSession = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSession) {
      return;
    }

    try {
      const data = JSON.parse(storedSession) as StartSessionResponse;

      setSessionId(data.sessionId || MOCK_SESSION_ID);
      setSource(data.source || "mock");
      setArena(data.arena ?? mockArena);
      setTributes(data.tributes ?? mockTributes);
      setBridgeMessage(data.message ?? "Session loaded through the local API bridge.");
    } catch {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  const activeTributes = useMemo(
    () => tributes.filter((tribute) => tribute.status !== "out"),
    [tributes]
  );

  const loadNextRound = async () => {
    const payload: NextRoundRequest = {
      sessionId,
      currentRoundNumber: round?.number ?? null
    };

    setIsLoadingRound(true);
    setBridgeMessage("Requesting the next round from the local API bridge.");

    try {
      const response = await fetch("/api/sessions/next-round", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Next round failed with ${response.status}`);
      }

      const data = (await response.json()) as NextRoundResponse;

      setSessionId(data.sessionId || sessionId);
      setSource(data.source || "mock");
      setArena(data.arena ?? mockArena);
      setTributes(data.tributes ?? mockTributes);
      setRound(data.round ?? mockRounds[0]);
      setBridgeMessage(data.message ?? "Loaded the next round through the local API bridge.");
      window.sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          source: data.source,
          sessionId: data.sessionId,
          arena: data.arena,
          tributes: data.tributes,
          nextRoundAvailable: true,
          message: data.message
        } satisfies StartSessionResponse)
      );
    } catch {
      setSource("mock");
      setArena(mockArena);
      setTributes(mockTributes);
      setRound(mockRounds[0]);
      setBridgeMessage("Local API route unavailable; loaded the local mock round.");
    } finally {
      setIsLoadingRound(false);
    }
  };

  const resetRound = () => {
    setRound(null);
    setBridgeMessage("Awaiting the next round from the local API bridge.");
  };

  return (
    <section className="game-shell">
      <div className="game-toolbar" aria-label="Game controls">
        <div>
          <p className="eyebrow">Game shell</p>
          <h1>{arena.name}</h1>
        </div>
        <div className="toolbar-actions">
          <button className="button button-secondary" type="button" onClick={resetRound}>
            <RotateCcw size={18} aria-hidden="true" />
            Reset
          </button>
          <button
            className="button button-primary"
            type="button"
            onClick={() => void loadNextRound()}
            disabled={round !== null || isLoadingRound}
          >
            <ChevronRight size={18} aria-hidden="true" />
            {isLoadingRound ? "Loading" : "Next Round"}
          </button>
        </div>
      </div>

      <div className="game-layout">
        <section className="map-panel" aria-label="Arena map">
          <div className="map-heading">
            <div>
              <p className="eyebrow">{arena.weather}</p>
              <h2>{arena.timeOfDay}</h2>
            </div>
            <span className="mock-badge">{source === "remote" ? "Remote AI" : "Mock fallback"}</span>
          </div>
          <ArenaMap arena={arena} tributes={tributes} round={round} />
        </section>

        <section className="roster-panel" aria-label="Tribute roster">
          <div className="panel-title">
            <Users size={18} aria-hidden="true" />
            <h2>Tributes</h2>
          </div>
          <div className="roster-list">
            {activeTributes.map((tribute) => (
              <article className="roster-row" key={tribute.id}>
                <span className="roster-color" style={{ backgroundColor: tribute.color }} />
                <div>
                  <h3>{tribute.name}</h3>
                  <p>{tribute.district}</p>
                </div>
                <span className={`status-pill status-${tribute.status}`}>{tribute.status}</span>
              </article>
            ))}
          </div>
          <div className="signal-panel">
            <Radio size={18} aria-hidden="true" />
            <span>{round ? `${round.events.length} events loaded` : bridgeMessage}</span>
          </div>
        </section>

        <NarrationPanel round={round} />
      </div>
    </section>
  );
}
