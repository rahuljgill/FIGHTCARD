import { useState } from "react";
import { fights } from "../data/fights";
import { matchesFilter, type DateFilter } from "../utils/date";
import FightCard from "./FightCard";
import FilterBar from "./FilterBar";

function FightList() {
  const [filter, setFilter] = useState<DateFilter>("all");

  const visibleFights = fights
    .filter((fight) => matchesFilter(fight.date, filter))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="flex flex-col gap-4 px-6">
      <FilterBar active={filter} onChange={setFilter} />

      {visibleFights.map((fight) => (
        <FightCard key={fight.id} fight={fight} />
      ))}
    </div>
  );
}

export default FightList;
