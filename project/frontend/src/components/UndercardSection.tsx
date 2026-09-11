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
    <div className="flex flex-col gap-1 border-t border-purple/20 px-4 py-4 font-body first:border-t-0">
      {/* Bout title — centered above the whole row */}
      {bout.title && (
        <p className="text-center text-xs uppercase text-purple">
          {bout.title}
        </p>
      )}

      <div className="flex items-center gap-4">
        {/* Order number */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-purple/40 text-sm font-bold text-white">
          {bout.order}
        </div>

        {/* Fighters + VS group */}
        <div className="ml-15.5 flex flex-1 items-center gap-4">
          {/* Fighter 1 */}
          <div className="flex-1 text-right">
            <p
              className={`text-base uppercase ${
                fighter1Won ? "text-green-300 underline" : "text-white"
              }`}
            >
              {name1}
            </p>
          </div>

          {/* VS */}
          <div className="w-16 shrink-0 text-center text-lg font-bold text-purple">
            VS
          </div>

          {/* Fighter 2 */}
          <div className="flex-1">
            <p
              className={`text-base uppercase ${
                fighter2Won ? "text-green-300 underline" : "text-white"
              }`}
            >
              {name2}
            </p>
          </div>
        </div>

        {/* Rounds*/}
        <div className="w-24 shrink-0 text-right text-sm uppercase text-text">
          <p>{bout.scheduled_rounds} Rounds</p>
        </div>
      </div>
    </div>
  );
}

function UndercardSection({ bouts }: { bouts: Bout[] }) {
  const sorted = [...bouts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="mx-auto mt-10 max-w-6xl px-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-center gap-4">
        <span className="h-px w-16 bg-purple/40" />
        <h2 className="font-heading text-lg uppercase tracking-widest text-purple">
          Undercard
        </h2>
        <span className="h-px w-16 bg-purple/40" />
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
