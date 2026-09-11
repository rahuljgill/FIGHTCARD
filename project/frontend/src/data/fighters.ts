import fightersData from "./fighters.json";
import type { Fighter } from "../types/fighter";

export const fighters: Fighter[] = fightersData.fighters as Fighter[];

export function getFighterById(id: string) {
  return fighters.find((f) => f.id === id);
}
