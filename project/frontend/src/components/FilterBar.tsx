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
    <div className="mx-auto mb-4 flex max-w-6xl flex-wrap justify-center gap-2 font-body sm:gap-3">
      {filters.map((f) => {
        const isActive = active === f.value;

        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`rounded-sm border px-3 py-2 text-xs uppercase tracking-widest transition-colors sm:px-4 sm:text-sm ${
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
