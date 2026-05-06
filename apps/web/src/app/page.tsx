import Link from "next/link";
import { ChevronRight, Map, Play, Radio, Users } from "lucide-react";
import { ArenaMap } from "@/components/ArenaMap";
import { mockArena, mockTributes } from "@/lib/mock-data";

export default function HomePage() {
  const aliveCount = mockTributes.filter((tribute) => tribute.status === "alive").length;
  const injuredCount = mockTributes.filter((tribute) => tribute.status === "injured").length;

  return (
    <main className="page-shell">
      <section className="dashboard-hero">
        <div className="hero-copy">
          <p className="eyebrow">Arena control</p>
          <h1>Tribute Arena Control</h1>
          <p className="lede">
            Configure mock tributes, open the arena shell, and load the first local round without AI calls.
          </p>
          <div className="action-row">
            <Link className="button button-primary" href="/create-session">
              <Play size={18} aria-hidden="true" />
              Create Session
            </Link>
            <Link className="button button-secondary" href="/game">
              <Map size={18} aria-hidden="true" />
              Open Mock Game
            </Link>
          </div>
        </div>

        <div className="status-board" aria-label="Mock session snapshot">
          <div className="status-item">
            <Users size={20} aria-hidden="true" />
            <span className="status-value">{mockTributes.length}</span>
            <span className="status-label">Tributes</span>
          </div>
          <div className="status-item">
            <Radio size={20} aria-hidden="true" />
            <span className="status-value">{aliveCount}</span>
            <span className="status-label">Active</span>
          </div>
          <div className="status-item">
            <ChevronRight size={20} aria-hidden="true" />
            <span className="status-value">{injuredCount}</span>
            <span className="status-label">Injured</span>
          </div>
        </div>
      </section>

      <section className="split-layout" aria-label="Arena overview">
        <div>
          <p className="eyebrow">Current arena</p>
          <h2>{mockArena.name}</h2>
          <dl className="detail-grid">
            <div>
              <dt>Biome</dt>
              <dd>{mockArena.biome}</dd>
            </div>
            <div>
              <dt>Weather</dt>
              <dd>{mockArena.weather}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{mockArena.timeOfDay}</dd>
            </div>
          </dl>
        </div>
        <ArenaMap arena={mockArena} tributes={mockTributes} compact />
      </section>
    </main>
  );
}
