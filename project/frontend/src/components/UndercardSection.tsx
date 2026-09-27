import type { Bout } from "../types/fight";
import { getFighterById } from "../data/fighters";

function UndercardRow({ bout }: { bout: Bout }) {
  const fighter1 = getFighterById(bout.fighter_1);
  const fighter2 = getFighterById(bout.fighter_2);

  const name1 = fighter1
    ? `${fighter1.first_name} ${fighter1.last_name}`
    : "TBA";

  const name2 = fighter2
    ? `${fighter2.first_name} ${fighter2.last_name}`
    : "TBA";

  const winner = bout.result?.winner ?? null;

  const fighter1Won = winner !== null && winner === bout.fighter_1;
  const fighter2Won = winner !== null && winner === bout.fighter_2;

  return (
    <div className="flex flex-col gap-2 border-t border-purple/20 px-3 py-3 font-body first:border-t-0 sm:gap-1 sm:px-4 sm:py-4">
      {/* Bout title */}
      {bout.title && (
        <p className="text-center text-[10px] uppercase text-purple sm:text-xs">
          {bout.title}
        </p>
      )}

      {/* Main row */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Order number */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-purple/40 text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm">
          {bout.order}
        </div>

        {/* Fighters + VS */}
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:ml-15.5 sm:gap-4">
          {/* Fighter 1 */}
          <div className="min-w-0 flex-1 text-right">
            <p
              className={`truncate text-xs uppercase sm:text-base ${
                fighter1Won ? "text-green-300 underline" : "text-white"
              }`}
            >
              {name1}
            </p>
          </div>

          {/* VS */}
          <div className="w-8 shrink-0 text-center text-sm font-bold text-purple sm:w-16 sm:text-lg">
            VS
          </div>

          {/* Fighter 2 */}
          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-xs uppercase sm:text-base  ${
                fighter2Won ? "text-green-300 underline" : "text-white"
              }`}
            >
              {name2}
            </p>
          </div>
        </div>

        {/* Rounds - desktop */}
        <div className="hidden w-24 shrink-0 text-right text-sm uppercase text-text sm:block">
          <p>{bout.scheduled_rounds} Rounds</p>
        </div>
      </div>

      {/* Rounds - mobile */}
      <p className="text-center text-[10px] uppercase text-text sm:hidden">
        {bout.scheduled_rounds} Rounds
      </p>
    </div>
  );
}

function UndercardSection({ bouts }: { bouts: Bout[] }) {
  const sorted = [...bouts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="mx-auto mt-7 max-w-6xl px-3 sm:mt-10 sm:px-6">
      {/* Header */}
      <div className="mb-3 flex items-center justify-center gap-3 sm:mb-4 sm:gap-4">
        <span className="h-px w-10 bg-purple/40 sm:w-16" />

        <h2 className="font-heading text-base uppercase tracking-widest text-purple sm:text-lg">
          Undercard
        </h2>

        <span className="h-px w-10 bg-purple/40 sm:w-16" />
      </div>

      {/* Bout list */}
      <div className="overflow-hidden rounded-md border border-purple/30 bg-[#0a0d1c]">
        {sorted.map((bout, i) => (
          <UndercardRow
            key={`${bout.fighter_1}-${bout.fighter_2}-${i}`}
            bout={bout}
          />
        ))}
      </div>
    </div>
  );
}

export default UndercardSection;
