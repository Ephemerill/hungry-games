from app.models import GameEvent, TimelineStep


def build_timeline(events: list[GameEvent], paths: dict[str, list[str]]) -> list[TimelineStep]:
    timeline: list[TimelineStep] = []
    cursor_ms = 0

    for event in events:
        for actor_id in event.actor_ids:
            path = paths.get(f"{event.id}:{actor_id}", [])
            if len(path) > 1:
                timeline.append(
                    TimelineStep(
                        at_ms=cursor_ms,
                        duration_ms=800,
                        type="move",
                        target_ids=[actor_id],
                        zone_id=path[-1],
                        payload={"path": path},
                    )
                )
                cursor_ms += 900

        timeline.append(
            TimelineStep(
                at_ms=cursor_ms,
                duration_ms=1200,
                type=event.type,
                target_ids=event.actor_ids,
                zone_id=event.zone_id,
                payload={"event_id": event.id, "description": event.description},
            )
        )
        cursor_ms += 1300

    return timeline
