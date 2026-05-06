import type { Arena, Round, Tribute } from "@/types/game";

export const mockArena: Arena = {
  id: "arena-hydro-basin",
  name: "Hydro Basin",
  biome: "Overgrown dam ruins",
  weather: "Cold mist",
  timeOfDay: "First light",
  zones: [
    {
      id: "spillway",
      name: "Spillway",
      terrain: "slick concrete",
      risk: "high",
      bounds: { x: 8, y: 16, width: 30, height: 28 }
    },
    {
      id: "cedar-rise",
      name: "Cedar Rise",
      terrain: "dense timber",
      risk: "medium",
      bounds: { x: 48, y: 8, width: 38, height: 32 }
    },
    {
      id: "service-tunnels",
      name: "Service Tunnels",
      terrain: "submerged access halls",
      risk: "high",
      bounds: { x: 56, y: 58, width: 32, height: 26 }
    },
    {
      id: "silt-flats",
      name: "Silt Flats",
      terrain: "open mud bank",
      risk: "low",
      bounds: { x: 12, y: 58, width: 34, height: 24 }
    }
  ]
};

export const mockTributes: Tribute[] = [
  {
    id: "tribute-mara",
    name: "Mara Vale",
    district: "District 2",
    status: "alive",
    skills: ["climbing", "knots"],
    location: { x: 22, y: 30 },
    color: "#b95b38"
  },
  {
    id: "tribute-oren",
    name: "Oren Pike",
    district: "District 6",
    status: "alive",
    skills: ["tracking", "first aid"],
    location: { x: 66, y: 22 },
    color: "#4f6f52"
  },
  {
    id: "tribute-sable",
    name: "Sable Rhys",
    district: "District 9",
    status: "injured",
    skills: ["foraging", "stealth"],
    location: { x: 74, y: 70 },
    color: "#7b435b"
  },
  {
    id: "tribute-tavi",
    name: "Tavi Cross",
    district: "District 11",
    status: "alive",
    skills: ["snares", "endurance"],
    location: { x: 28, y: 68 },
    color: "#4d8fa3"
  }
];

export const mockRounds: Round[] = [
  {
    id: "round-001",
    number: 1,
    title: "Round 1: Siren at the Spillway",
    summary:
      "The mock simulation opens with scattered movement, one environmental hazard, and a short-lived supply discovery.",
    events: [
      {
        id: "event-001",
        type: "movement",
        title: "Mara reaches the spillway",
        tributeIds: ["tribute-mara"],
        location: { x: 30, y: 34 },
        narration:
          "Mara crosses the spillway ledge and keeps low while loose gravel slides into the basin below."
      },
      {
        id: "event-002",
        type: "alliance",
        title: "Oren and Tavi signal a truce",
        tributeIds: ["tribute-oren", "tribute-tavi"],
        location: { x: 52, y: 48 },
        narration:
          "Oren spots Tavi near the old turbine road. They trade hand signals and split the route between them."
      },
      {
        id: "event-003",
        type: "hazard",
        title: "A sluice gate drops",
        tributeIds: ["tribute-sable"],
        location: { x: 73, y: 67 },
        narration:
          "A corroded sluice gate slams shut behind Sable, forcing her into the service tunnel runoff."
      },
      {
        id: "event-004",
        type: "discovery",
        title: "Dry rations found in a tool locker",
        tributeIds: ["tribute-oren"],
        location: { x: 62, y: 28 },
        narration:
          "Oren pries open a rusted tool locker and finds a sealed ration tin tucked behind survey flags."
      }
    ]
  }
];
