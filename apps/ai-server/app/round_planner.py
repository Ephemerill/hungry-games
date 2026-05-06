from copy import deepcopy

from app.models import GameEvent, GameState, NextRoundRequest, NextRoundResponse, StoryMemoryEntry
from app.pathfinding import build_event_paths
from app.timeline import build_timeline
from app.validator import validate_events


ROUND_TITLES = [
    "Opening Moves",
    "Signals in the Trees",
    "The Creek Runs Quiet",
    "High Ground",
]


def plan_round(request: NextRoundRequest) -> NextRoundResponse:
    state_before = request.state
    round_number = state_before.round_number + 1
    round_title = ROUND_TITLES[(round_number - 1) % len(ROUND_TITLES)]

    planned_events = _draft_events(state_before, round_number)
    events = validate_events(planned_events, state_before)
    paths = build_event_paths(events, state_before, state_before.map)
    animation_timeline = build_timeline(events, paths)
    state_after = _apply_events(state_before, events, round_number)
    narration = _narrate(round_title, events)
    story_memory_after = [
        *request.story_memory,
        StoryMemoryEntry(
            round_number=round_number,
            summary=narration,
            event_ids=[event.id for event in events],
        ),
    ]

    return NextRoundResponse(
        round_number=round_number,
        round_title=round_title,
        narration=narration,
        events=events,
        animation_timeline=animation_timeline,
        state_after=state_after,
        story_memory_after=story_memory_after,
    )


def _draft_events(state: GameState, round_number: int) -> list[GameEvent]:
    living_tributes = [tribute for tribute in state.tributes if tribute.status != "eliminated"]
    if not living_tributes:
        return []

    zones = state.map.zones
    scout = living_tributes[(round_number - 1) % len(living_tributes)]
    target_zone = zones[round_number % len(zones)]
    resource = target_zone.resources[0] if target_zone.resources else "useful supplies"

    events = [
        GameEvent(
            id=f"round-{round_number}-movement",
            type="movement",
            actor_ids=[scout.id],
            zone_id=target_zone.id,
            description=f"{scout.name} moves toward {target_zone.name} to get a better read on the arena.",
            impact={"location_updates": {scout.id: target_zone.id}},
        ),
        GameEvent(
            id=f"round-{round_number}-resource",
            type="resource_found",
            actor_ids=[scout.id],
            zone_id=target_zone.id,
            description=f"{scout.name} finds {resource} near {target_zone.name}.",
            impact={"inventory_add": {scout.id: [resource]}},
        ),
    ]

    if len(living_tributes) > 1:
        counterpart = living_tributes[round_number % len(living_tributes)]
        events.append(
            GameEvent(
                id=f"round-{round_number}-tension",
                type="encounter",
                actor_ids=[scout.id, counterpart.id],
                zone_id=target_zone.id,
                description=(
                    f"{scout.name} spots signs of {counterpart.name}, but both tributes avoid a direct fight."
                ),
                impact={"morale": "tense"},
            )
        )

    return events


def _apply_events(state: GameState, events: list[GameEvent], round_number: int) -> GameState:
    state_after = deepcopy(state)
    state_after.round_number = round_number

    for event in events:
        location_updates = event.impact.get("location_updates", {})
        for tribute_id, zone_id in location_updates.items():
            state_after.tribute_locations[tribute_id] = zone_id

        inventory_add = event.impact.get("inventory_add", {})
        for tribute_id, items in inventory_add.items():
            state_after.inventory.setdefault(tribute_id, [])
            for item in items:
                if item not in state_after.inventory[tribute_id]:
                    state_after.inventory[tribute_id].append(item)

    return state_after


def _narrate(round_title: str, events: list[GameEvent]) -> str:
    if not events:
        return f"{round_title}: the arena holds still while the remaining story waits for motion."
    return f"{round_title}: " + " ".join(event.description for event in events)
