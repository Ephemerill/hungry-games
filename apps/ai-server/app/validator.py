from app.models import GameEvent, GameState


def validate_events(events: list[GameEvent], state: GameState) -> list[GameEvent]:
    alive_ids = {tribute.id for tribute in state.tributes if tribute.status != "eliminated"}
    valid_zone_ids = {zone.id for zone in state.map.zones}

    validated: list[GameEvent] = []
    for event in events:
        if any(actor_id not in alive_ids for actor_id in event.actor_ids):
            continue
        if event.zone_id is not None and event.zone_id not in valid_zone_ids:
            continue
        validated.append(event)

    return validated
