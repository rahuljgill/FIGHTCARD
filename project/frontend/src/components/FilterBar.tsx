import type { DateFilter } from "../utils/date";

const filters: { label: string; value: DateFilter }[] = [
  { label: "All Events", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

function FilterBar({
  active,
  onChange,
}: {
  active: DateFilter;
  onChange: (filter: DateFilter) => void;
}) {
  return (
    <div className="mx-auto mb-4 flex max-w-6xl gap-3 font-body">
      {filters.map((f) => {
        const isActive = active === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`rounded-sm border px-4 py-2 text-sm uppercase tracking-widest transition-colors ${
              isActive
                ? "border-purple bg-purple/20 text-purple"
                : "border-purple/30 text-text hover:border-purple/60"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;
