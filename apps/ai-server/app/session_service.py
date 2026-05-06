from app.map_generator import generate_map
from app.models import GameState, StartSessionRequest, StartSessionResponse
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

    return StartSessionResponse(
        session_id=state.session_id,
        state=state,
        story_memory=[],
        profiles=profiles,
        map=arena_map,
    )
