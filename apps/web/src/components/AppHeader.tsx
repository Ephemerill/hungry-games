import Link from "next/link";
import { Map, Plus, Swords } from "lucide-react";

export function AppHeader() {
  return (
    <header className="app-header">
      <Link className="brand-link" href="/">
        <Swords size={22} aria-hidden="true" />
        <span>Hungry Games</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/create-session">
          <Plus size={16} aria-hidden="true" />
          Create
        </Link>
        <Link href="/game">
          <Map size={16} aria-hidden="true" />
          Game
        </Link>
      </nav>
    </header>
  );
}
