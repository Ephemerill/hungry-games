import type { Arena, Round, Tribute } from "@/types/game";

type ArenaMapProps = {
  arena: Arena;
  tributes: Tribute[];
  round?: Round | null;
  compact?: boolean;
};

export function ArenaMap({ arena, tributes, round, compact = false }: ArenaMapProps) {
  const eventLocations = round?.events ?? [];

  return (
    <div className={compact ? "arena-map compact-map" : "arena-map"} aria-label={`${arena.name} map`}>
      <div className="map-surface">
        <div className="map-waterway" />
        <div className="map-road" />
        {arena.zones.map((zone) => (
          <div
            className={`map-zone risk-${zone.risk}`}
            key={zone.id}
            style={{
              left: `${zone.bounds.x}%`,
              top: `${zone.bounds.y}%`,
              width: `${zone.bounds.width}%`,
              height: `${zone.bounds.height}%`
            }}
          >
            <span>{zone.name}</span>
          </div>
        ))}

        {tributes.map((tribute) => (
          <div
            className={`tribute-pin status-${tribute.status}`}
            key={tribute.id}
            style={{
              left: `${tribute.location.x}%`,
              top: `${tribute.location.y}%`,
              backgroundColor: tribute.color
            }}
            title={`${tribute.name}, ${tribute.status}`}
          >
            {tribute.name.charAt(0)}
          </div>
        ))}

        {eventLocations.map((event) => (
          <div
            className={`event-marker event-${event.type}`}
            key={event.id}
            style={{
              left: `${event.location.x}%`,
              top: `${event.location.y}%`
            }}
            title={event.title}
          />
        ))}
      </div>
    </div>
  );
}
