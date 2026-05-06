from collections import deque

from app.models import ArenaMap, GameEvent, GameState


def build_event_paths(
    events: list[GameEvent], state: GameState, arena_map: ArenaMap
) -> dict[str, list[str]]:
    paths: dict[str, list[str]] = {}

    for event in events:
        if event.zone_id is None:
            continue
        for actor_id in event.actor_ids:
            start_zone = state.tribute_locations.get(actor_id)
            if start_zone is None:
                continue
            paths[f"{event.id}:{actor_id}"] = shortest_path(arena_map, start_zone, event.zone_id)

    return paths


def shortest_path(arena_map: ArenaMap, start_zone: str, end_zone: str) -> list[str]:
    if start_zone == end_zone:
        return [start_zone]

    queue: deque[tuple[str, list[str]]] = deque([(start_zone, [start_zone])])
    visited = {start_zone}

    while queue:
        zone_id, path = queue.popleft()
        for neighbor_id in arena_map.adjacency.get(zone_id, []):
            if neighbor_id in visited:
                continue
            next_path = [*path, neighbor_id]
            if neighbor_id == end_zone:
                return next_path
            visited.add(neighbor_id)
            queue.append((neighbor_id, next_path))

    return [start_zone]
