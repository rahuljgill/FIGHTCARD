export function formatDateParts(iso: string) {
  const date = new Date(iso + "T00:00:00");
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    weekday: date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
  };
}

export type DateFilter = "all" | "today" | "week" | "month";

export function matchesFilter(iso: string, filter: DateFilter): boolean {
  if (filter === "all") return true;

  const fightDate = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (filter === "today") {
    return fightDate.getTime() === today.getTime();
  }

  if (filter === "week") {
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);
    return fightDate >= today && fightDate <= weekFromNow;
  }

  if (filter === "month") {
    return (
      fightDate.getFullYear() === today.getFullYear() &&
      fightDate.getMonth() === today.getMonth()
    );
  }

  return true;
}
