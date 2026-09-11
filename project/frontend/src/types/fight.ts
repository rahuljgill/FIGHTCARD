export interface FightResult {
  winner: string | null;
  loser: string | null;
  method: string | null;
}

export interface Bout {
  order?: number;
  fighter_1: string;
  fighter_2: string;
  scheduled_rounds: number;
  title: string | null;
  result: FightResult;
}

export interface Venue {
  name: string;
  city: string;
  country: string;
}

export interface Fight {
  id: string;
  status: "open" | "closed";
  date: string;
  time: string;
  timezone: string;
  venue: Venue;
  main_event: Bout;
  undercard: Bout[];
}
