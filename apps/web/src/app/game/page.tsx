import { AiHealthNotice } from "@/components/AiHealthNotice";
import { GameShell } from "@/components/GameShell";

export default function GamePage() {
  return (
    <main className="game-page">
      <AiHealthNotice compact />
      <GameShell />
    </main>
  );
}
