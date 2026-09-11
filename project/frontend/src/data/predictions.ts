import type { Prediction } from "../types/prediction";

export const predictions: Prediction[] = [
  { fightId: "haney-paro-1", fighter1Votes: 68, fighter2Votes: 32 },
];

export function getPredictionByFightId(fightId: string) {
  return predictions.find((p) => p.fightId === fightId);
}
