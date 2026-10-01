export interface FighterRecord {
  wins: number;
  losses: number;
  draws: number;
}

export interface Fighter {
  id: string;
  first_name: string;
  last_name: string;
  nickname: string;
  date_of_birth: string;
  country: string; // 3-letter code, e.g. "USA", "GBR", "UKR"
  height: string;
  reach: string;
  weight: string;
  stance: string;
  hometown: string;
  record: FighterRecord;
  last_5: ("W" | "L" | "NC")[];
}

export function formatRecord(record: FighterRecord): string {
  return record.draws > 0
    ? `${record.wins}-${record.losses}-${record.draws}`
    : `${record.wins}-${record.losses}`;
}

export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hasHadBirthdayThisYear) age--;
  return age;
}
