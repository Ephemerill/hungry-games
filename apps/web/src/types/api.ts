export type {
  ApiSource,
  NextRoundRequest,
  NextRoundResponse,
  StartSessionRequest,
  StartSessionResponse,
  TributeDraftInput
} from "../../../../packages/shared/src/api-contract";

export type AiHealthResponse = {
  source: "remote" | "mock";
  online: boolean;
  message: string;
  checkedAt: string;
  remote?: Record<string, unknown>;
};
