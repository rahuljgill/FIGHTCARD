import fightsData from "./fights.json";
import type { Fight } from "../types/fight";

export const fights: Fight[] = fightsData.fights as Fight[];

export function getFightById(id: string) {
  return fights.find((f) => f.id === id);
}
