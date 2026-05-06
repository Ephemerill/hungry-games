export type ApiSource = "remote" | "mock";

export type TributeStatus = "alive" | "injured" | "out";

export type RoundEventType = "movement" | "hazard" | "discovery" | "alliance";

export type MapCoordinate = {
  x: number;
  y: number;
};

export type ArenaZone = {
  id: string;
  name: string;
  terrain: string;
  risk: "low" | "medium" | "high";
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type Arena = {
  id: string;
  name: string;
  biome: string;
  weather: string;
  timeOfDay: string;
  zones: ArenaZone[];
};

export type Tribute = {
  id: string;
  name: string;
  district: string;
  status: TributeStatus;
  skills: string[];
  location: MapCoordinate;
  color: string;
};

export type RoundEvent = {
  id: string;
  type: RoundEventType;
  title: string;
  tributeIds: string[];
  location: MapCoordinate;
  narration: string;
};

export type Round = {
  id: string;
  number: number;
  title: string;
  summary: string;
  events: RoundEvent[];
};

export type TributeDraftInput = {
  name: string;
  district: string;
  skill: string;
};

export type StartSessionRequest = {
  sessionName?: string;
  arenaId?: string;
  tributes?: TributeDraftInput[];
};

export type StartSessionResponse = {
  source: ApiSource;
  sessionId: string;
  arena: Arena;
  tributes: Tribute[];
  nextRoundAvailable: boolean;
  message?: string;
};

export type NextRoundRequest = {
  sessionId?: string;
  currentRoundNumber?: number | null;
};

export type NextRoundResponse = {
  source: ApiSource;
  sessionId: string;
  arena: Arena;
  tributes: Tribute[];
  round: Round;
  message?: string;
};
