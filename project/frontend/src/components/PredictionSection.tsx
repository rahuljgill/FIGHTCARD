import { useState } from "react";
import bars2 from "../assets/bars2.svg";
import { getPredictionByFightId } from "../data/predictions";

interface PredictionSectionProps {
  fightId: string;
  fighter1Name: string;
  fighter2Name: string;
  readOnly?: boolean;
}

function PredictionSection({
  fightId,
  fighter1Name,
  fighter2Name,
  readOnly = false,
}: PredictionSectionProps) {
  const base = getPredictionByFightId(fightId);

  const [fighter1Votes, setFighter1Votes] = useState(base?.fighter1Votes ?? 50);
  const [fighter2Votes, setFighter2Votes] = useState(base?.fighter2Votes ?? 50);
  const [userVote, setUserVote] = useState<"fighter1" | "fighter2" | null>(
    null,
  );

  const total = fighter1Votes + fighter2Votes;
  const fighter1Pct = total > 0 ? Math.round((fighter1Votes / total) * 100) : 0;
  const fighter2Pct = 100 - fighter1Pct;

  const handleVote = (choice: "fighter1" | "fighter2") => {
    if (readOnly || userVote) return; // one vote only, per fight, per session

    if (choice === "fighter1") setFighter1Votes((v) => v + 1);
    else setFighter2Votes((v) => v + 1);

    setUserVote(choice);
  };

  return (
    <div className="mx-auto mt-10 max-w-6xl px-6">
      <div className="rounded-md border border-purple/40 px-6 py-5 font-body">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Left: icon + copy */}
          <div className="flex items-start gap-4 md:w-1/3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm border border-purple/50">
              <img src={bars2} alt="" className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="font-heading text-lg uppercase tracking-widest text-purple">
                Fight Prediction
              </h2>
              <p
                className={`mt-1 text-sm ${readOnly ? "text-red-400" : "text-white"}`}
              >
                {readOnly
                  ? "Predictions have been closed for this fight as it's over!."
                  : "Who do you think will win?"}
              </p>
              <p className="mt-1 text-xs text-text">
                {readOnly
                  ? ""
                  : "Cast your vote and see what the community thinks."}
              </p>
            </div>
          </div>

          {/* Right: voting rows */}
          <div className="flex flex-1 flex-col gap-4">
            <PredictionRow
              label={fighter1Name}
              percent={fighter1Pct}
              isSelected={userVote === "fighter1"}
              disabled={readOnly || userVote !== null}
              onSelect={() => handleVote("fighter1")}
            />
            <PredictionRow
              label={fighter2Name}
              percent={fighter2Pct}
              isSelected={userVote === "fighter2"}
              disabled={readOnly || userVote !== null}
              onSelect={() => handleVote("fighter2")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictionRow({
  label,
  percent,
  isSelected,
  disabled,
  onSelect,
}: {
  label: string;
  percent: number;
  isSelected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className="group flex items-center gap-4 text-left disabled:cursor-default enabled:cursor-pointer"
    >
      {/* Radio */}
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          isSelected
            ? "border-purple shadow-[0_0_8px_2px_rgba(111,92,194,0.7)]"
            : "border-purple/40 group-hover:border-purple group-hover:shadow-[0_0_6px_2px_rgba(111,92,194,0.5)]"
        }`}
      >
        {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-purple" />}
      </span>

      {/* Name + bar */}
      <div className="flex-1">
        <p className="text-sm text-white">{label}</p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-purple/15">
          <div
            className="h-full rounded-full bg-purple transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Percent */}
      <span className="w-12 flex-shrink-0 text-right text-sm font-bold text-white">
        {percent}%
      </span>
    </button>
  );
}

export default PredictionSection;
