"use client";

import { RefreshCw, ServerCrash, Wifi } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { AiHealthResponse } from "@/types/api";

type AiHealthNoticeProps = {
  compact?: boolean;
};

export function AiHealthNotice({ compact = false }: AiHealthNoticeProps) {
  const [health, setHealth] = useState<AiHealthResponse | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);

    try {
      const response = await fetch("/api/ai-health", {
        cache: "no-store"
      });
      const data = (await response.json()) as AiHealthResponse;

      setHealth(data);
    } catch {
      setHealth({
        source: "mock",
        online: false,
        message: "AI server status is unavailable because the local API route could not be reached.",
        checkedAt: new Date().toISOString()
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

  const hasHealth = health !== null;
  const online = health?.online === true;
  const message =
    health?.message ??
    (isChecking ? "Checking AI server status through the local API bridge." : "AI status unknown.");
  const title = !hasHealth ? "Checking AI Server" : online ? "AI Server Online" : "AI Server Offline";

  return (
    <section
      className={`ai-health ${!hasHealth ? "ai-health-checking" : ""} ${
        online ? "ai-health-online" : "ai-health-offline"
      } ${
        compact ? "ai-health-compact" : ""
      }`}
      role={!hasHealth || online ? "status" : "alert"}
      aria-live="polite"
    >
      <div className="ai-health-icon">{online ? <Wifi size={18} /> : <ServerCrash size={18} />}</div>
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      <button
        className="icon-button"
        type="button"
        onClick={() => void checkHealth()}
        aria-label="Refresh AI server status"
        title="Refresh AI server status"
        disabled={isChecking}
      >
        <RefreshCw size={17} aria-hidden="true" />
      </button>
    </section>
  );
}
