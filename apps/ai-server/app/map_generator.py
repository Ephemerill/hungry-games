from app.models import ArenaMap, ArenaZone


def generate_map(seed: str) -> ArenaMap:
    zones = [
        ArenaZone(
            id="cornucopia",
            name="Cornucopia",
            terrain="metal platform",
            danger_level=5,
            resources=["medkit", "rope", "water flask"],
        ),
        ArenaZone(
            id="pine-ridge",
            name="Pine Ridge",
            terrain="forest ridge",
            danger_level=3,
            resources=["branches", "berries"],
        ),
        ArenaZone(
            id="dry-creek",
            name="Dry Creek",
            terrain="stone creek bed",
            danger_level=2,
            resources=["smooth stones", "shade"],
        ),
        ArenaZone(
            id="signal-hill",
            name="Signal Hill",
            terrain="open high ground",
            danger_level=4,
            resources=["viewpoint", "scrap metal"],
        ),
    ]

    return ArenaMap(
        seed=seed,
        zones=zones,
        adjacency={
            "cornucopia": ["pine-ridge", "dry-creek", "signal-hill"],
            "pine-ridge": ["cornucopia", "dry-creek"],
            "dry-creek": ["cornucopia", "pine-ridge", "signal-hill"],
            "signal-hill": ["cornucopia", "dry-creek"],
        },
    )
