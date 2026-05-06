from app.map_generator import generate_map
from app.models import GameState, InitialRenderPackage, StartSessionRequest, StartSessionResponse
from app.profile_generator import generate_profiles


def start_session(request: StartSessionRequest) -> StartSessionResponse:
    profiles = generate_profiles(request.tributes)
    arena_map = generate_map(request.arena_seed)
    zone_ids = [zone.id for zone in arena_map.zones]

    tribute_locations = {
        profile.id: zone_ids[index % len(zone_ids)] for index, profile in enumerate(profiles)
    }

    state = GameState(
        session_id=request.session_id or "session-placeholder-001",
        round_number=0,
        tributes=profiles,
        map=arena_map,
        tribute_locations=tribute_locations,
        inventory={profile.id: [] for profile in profiles},
    )
    initial_render_package = InitialRenderPackage(
        scene_id=f"{state.session_id}:round-0",
        arena=arena_map,
        tribute_locations=tribute_locations,
        tribute_status={profile.id: profile.status for profile in profiles},
        animation_timeline=[],
        camera={"focus_zone_id": "cornucopia", "mode": "arena-overview"},
        overlays={
            "title": "The arena opens",
            "round_number": 0,
            "visible_zone_ids": zone_ids,
        },
    )

    return StartSessionResponse(
        session_id=state.session_id,
        tributes=profiles,
        arena=arena_map,
        initial_state=state,
        initial_render_package=initial_render_package,
        story_memory=[],
        state=state,
        profiles=profiles,
        map=arena_map,
    )
