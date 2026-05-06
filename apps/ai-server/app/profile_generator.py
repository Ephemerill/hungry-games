from app.models import TributeInput, TributeProfile


DEFAULT_TRIBUTES = [
    TributeInput(name="Aster Vale", district=3, attributes={"focus": "logic"}),
    TributeInput(name="Bryn Sol", district=7, attributes={"focus": "endurance"}),
    TributeInput(name="Cato Reed", district=11, attributes={"focus": "foraging"}),
    TributeInput(name="Demi Flint", district=2, attributes={"focus": "tactics"}),
]

STRENGTH_ROTATION = [
    ["observation", "quick planning"],
    ["endurance", "steady hands"],
    ["foraging", "quiet movement"],
    ["tactics", "decisive timing"],
]

WEAKNESS_ROTATION = ["overthinks risks", "avoids deep water", "trusts too slowly", "moves too boldly"]
TEMPERAMENT_ROTATION = ["watchful", "resolute", "patient", "competitive"]


def generate_profiles(tributes: list[TributeInput]) -> list[TributeProfile]:
    source = tributes or DEFAULT_TRIBUTES

    profiles: list[TributeProfile] = []
    for index, tribute in enumerate(source):
        tribute_id = tribute.id or _stable_id(tribute.name, index)
        profiles.append(
            TributeProfile(
                id=tribute_id,
                name=tribute.name,
                district=tribute.district,
                strengths=STRENGTH_ROTATION[index % len(STRENGTH_ROTATION)],
                weakness=WEAKNESS_ROTATION[index % len(WEAKNESS_ROTATION)],
                temperament=TEMPERAMENT_ROTATION[index % len(TEMPERAMENT_ROTATION)],
            )
        )

    return profiles


def _stable_id(name: str, index: int) -> str:
    slug = "".join(character.lower() if character.isalnum() else "-" for character in name)
    slug = "-".join(part for part in slug.split("-") if part)
    return f"tribute-{index + 1}-{slug or 'unnamed'}"
