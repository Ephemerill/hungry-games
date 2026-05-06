import { CircleAlert, Radio } from "lucide-react";
import type { Round } from "@/types/game";

type NarrationPanelProps = {
  round: Round | null;
};

export function NarrationPanel({ round }: NarrationPanelProps) {
  return (
    <aside className="narration-panel" aria-label="Narration panel">
      <div className="panel-title">
        <Radio size={18} aria-hidden="true" />
        <h2>Narration</h2>
      </div>

      {round ? (
        <>
          <p className="round-kicker">Round {round.number}</p>
          <h3>{round.title}</h3>
          <p className="round-summary">{round.summary}</p>
          <ol className="event-list">
            {round.events.map((event) => (
              <li key={event.id}>
                <span className={`event-type event-type-${event.type}`}>{event.type}</span>
                <strong>{event.title}</strong>
                <p>{event.narration}</p>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className="empty-narration">
          <CircleAlert size={22} aria-hidden="true" />
          <p>Round data has not been loaded.</p>
        </div>
      )}
    </aside>
  );
}
