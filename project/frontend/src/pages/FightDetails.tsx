import { useParams, Link } from "react-router-dom";
import { getFightById } from "../data/fights";
import { getFighterById } from "../data/fighters";
import { formatRecord, calculateAge } from "../types/fighter";
import { getFlagUrl } from "../utils/flags";
import { getFighterSprite } from "../utils/sprites";

import ring from "../assets/ring.png";
import standingLeft from "../assets/genericSprites/leftStanding.png";
import standingRight from "../assets/genericSprites/rightStanding.png";
import crown from "../assets/crown.svg";
import tickIcon from "../assets/tick.svg";
import crossIcon from "../assets/cross.svg";
import noContestIcon from "../assets/noContest.svg";

import UndercardSection from "../components/UndercardSection";
import DiscussionSection from "../components/DiscussionSection";
import PredictionSection from "../components/PredictionSection";

function ResultBox({ result }: { result: "W" | "L" | "NC" }) {
  const icon =
    result === "W" ? tickIcon : result === "L" ? crossIcon : noContestIcon;

  const alt = result === "W" ? "Win" : result === "L" ? "Loss" : "No Contest";

  return <img src={icon} alt={alt} className="h-5 w-5 sm:h-6 sm:w-6" />;
}

function FightDetail() {
  const { id } = useParams();

  const fight = id ? getFightById(id) : undefined;

  const fighter1 = fight
    ? getFighterById(fight.main_event.fighter_1)
    : undefined;

  const fighter2 = fight
    ? getFighterById(fight.main_event.fighter_2)
    : undefined;

  if (!fight || !fighter1 || !fighter2) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-text">
        Fight not found.
      </div>
    );
  }

  const isClosed = fight.status === "closed";

  const { winner, method } = fight.main_event.result;

  const winnerFighter = winner ? getFighterById(winner) : undefined;

  const resultLine =
    isClosed && winnerFighter
      ? `${winnerFighter.first_name} ${winnerFighter.last_name} won${
          method ? ` via ${method}` : ""
        }`
      : null;

  const dateLabel = new Date(fight.date + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    },
  );

  const flag1 = getFlagUrl(fighter1.country);

  const flag2 = getFlagUrl(fighter2.country);

  const sprite1 = getFighterSprite(fighter1.id) ?? standingLeft;

  const sprite2 = getFighterSprite(fighter2.id) ?? standingRight;

  const displayStat = (value: string | null | undefined) => {
    return value?.trim() ? value : "N/A";
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 font-body">
      <div className="mx-auto max-w-5xl px-3 sm:px-6">
        {/* Back link */}
        <Link to="/" className="mb-4 inline-block text-sm text-purple sm:mb-4">
          ← Back to Events
        </Link>

        {/* Ring section */}
        <div
          className="relative overflow-hidden rounded-md border border-purple/30 bg-cover"
          style={{
            backgroundImage: `url(${ring})`,
            backgroundPosition: "center 0%",
          }}
        >
          {/* Darkening overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-10 px-3 pt-4 pb-5 sm:px-6 sm:pt-6 sm:pb-8">
            {/* Fight title */}
            <h1 className="text-center text-base uppercase tracking-wide text-purple sm:text-xl">
              {fight.main_event.title ?? "Main Event"}
            </h1>

            {/* Fight information */}
            <p className="mt-1 text-center text-[10px] uppercase text-text sm:text-sm">
              {dateLabel} • {fight.venue.name}, {fight.venue.city},{" "}
              {fight.venue.country}
            </p>

            {/* Result banner */}
            {resultLine && (
              <div className="mx-auto mt-3 max-w-md rounded-md border border-purple bg-purple/10 px-3 py-2 text-center sm:mt-4 sm:px-4">
                <p className="text-xs uppercase tracking-wide text-white sm:text-sm">
                  Final Result
                </p>

                <p className="text-sm uppercase text-green-300 sm:text-base">
                  {resultLine}
                </p>
              </div>
            )}

            {/* ===================================================== */}
            {/* FIGHTERS */}
            {/* ===================================================== */}

            <div className="mt-5 flex items-center justify-between gap-1 sm:mt-8 sm:gap-6">
              {/* Fighter 1 */}
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <img
                  src={sprite1}
                  alt={fighter1.last_name}
                  className="h-28 w-auto object-contain sm:h-48"
                />

                <p className="mt-1 max-w-full truncate font-body text-xs uppercase text-text sm:mt-2 sm:text-sm">
                  {fighter1.first_name}
                </p>

                <h2 className="max-w-full truncate font-heading text-2xl uppercase text-white sm:text-3xl">
                  {fighter1.last_name}
                </h2>

                <p className="max-w-full truncate text-xs uppercase text-purple sm:text-sm">
                  {fighter1.nickname}
                </p>

                <p className="text-xs text-text sm:text-sm">
                  {formatRecord(fighter1.record)}
                </p>

                {flag1 && (
                  <img
                    src={flag1}
                    alt={fighter1.country}
                    className="mt-1 h-3 w-5 object-cover sm:h-4 sm:w-6"
                  />
                )}

                <p className="mt-1 mb-1 text-[10px] uppercase text-white sm:mt-2 sm:mb-2 sm:text-xs">
                  Last 5
                </p>

                <div className="flex justify-center gap-0.5 sm:gap-1">
                  {fighter1.last_5.map((r, i) => (
                    <ResultBox key={i} result={r} />
                  ))}
                </div>
              </div>

              {/* Center */}
              <div className="flex w-16 shrink-0 flex-col items-center gap-0.5 sm:w-auto sm:gap-1">
                <img src={crown} alt="" className="h-8 w-8 sm:h-12 sm:w-12" />

                <p className="text-[9px] uppercase tracking-widest text-purple sm:text-xs">
                  Main Event
                </p>

                <p className="text-[9px] uppercase text-text sm:text-xs">
                  {fight.main_event.scheduled_rounds} Rounds
                </p>

                <span className="mt-1 text-4xl font-bold text-purple sm:text-6xl">
                  VS
                </span>
              </div>

              {/* Fighter 2 */}
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <img
                  src={sprite2}
                  alt={fighter2.last_name}
                  className="h-28 w-auto object-contain sm:h-48"
                />

                <p className="mt-1 max-w-full truncate font-body text-xs uppercase text-text sm:mt-2 sm:text-sm">
                  {fighter2.first_name}
                </p>

                <h2 className="max-w-full truncate font-heading text-2xl uppercase text-white sm:text-3xl">
                  {fighter2.last_name}
                </h2>

                <p className="max-w-full truncate text-xs uppercase text-purple sm:text-sm">
                  {fighter2.nickname}
                </p>

                <p className="text-xs text-text sm:text-sm">
                  {formatRecord(fighter2.record)}
                </p>

                {flag2 && (
                  <img
                    src={flag2}
                    alt={fighter2.country}
                    className="mt-1 h-3 w-5 object-cover sm:h-4 sm:w-6"
                  />
                )}

                <p className="mt-1 mb-1 text-[10px] uppercase text-white sm:mt-2 sm:mb-2 sm:text-xs">
                  Last 5
                </p>

                <div className="flex justify-center gap-0.5 sm:gap-1">
                  {fighter2.last_5.map((r, i) => (
                    <ResultBox key={i} result={r} />
                  ))}
                </div>
              </div>
            </div>

            {/* ===================================================== */}
            {/* STAT COMPARISON */}
            {/* ===================================================== */}

            <div className="mt-5 grid min-w-0 grid-cols-3 gap-1 rounded-md border border-purple/30 bg-background p-3 sm:mt-8 sm:gap-4 sm:p-6">
              {/* Fighter 1 stats */}
              <div className="flex min-w-0 flex-col gap-2 text-center text-[10px] uppercase text-white sm:gap-2 sm:text-sm">
                <p className="whitespace-nowrap">
                  {calculateAge(fighter1.date_of_birth)}
                </p>
                <p className="whitespace-nowrap">
                  {displayStat(fighter1.height)}
                </p>
                <p className="whitespace-nowrap">
                  {displayStat(fighter1.reach)}
                </p>
                <p className="whitespace-nowrap">
                  {displayStat(fighter1.stance)}
                </p>
                <p className="whitespace-nowrap">
                  {displayStat(fighter1.weight)}
                </p>
                <p className="truncate">{displayStat(fighter1.hometown)}</p>
              </div>

              {/* Stat labels */}
              <div className="flex min-w-0 flex-col gap-2 text-center text-[10px] uppercase text-purple sm:gap-2 sm:text-sm">
                <p className="whitespace-nowrap">Age</p>
                <p className="whitespace-nowrap">Height</p>
                <p className="whitespace-nowrap">Reach</p>
                <p className="whitespace-nowrap">Stance</p>
                <p className="whitespace-nowrap">Weight</p>
                <p className="whitespace-nowrap">Hometown</p>
              </div>

              {/* Fighter 2 stats */}
              <div className="flex min-w-0 flex-col gap-2 text-center text-[10px] uppercase text-white sm:gap-2 sm:text-sm">
                <p className="whitespace-nowrap">
                  {calculateAge(fighter2.date_of_birth)}
                </p>
                <p className="whitespace-nowrap">
                  {displayStat(fighter2.height)}
                </p>
                <p className="whitespace-nowrap">
                  {displayStat(fighter2.reach)}
                </p>
                <p className="whitespace-nowrap">
                  {displayStat(fighter2.stance)}
                </p>
                <p className="whitespace-nowrap">
                  {displayStat(fighter2.weight)}
                </p>
                <p className="truncate">{displayStat(fighter2.hometown)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Undercard */}
        <UndercardSection bouts={fight.undercard} />

        {/* Prediction */}
        <PredictionSection
          fightId={fight.id}
          fighter1Id={fight.main_event.fighter_1}
          fighter2Id={fight.main_event.fighter_2}
          fighter1Name={`${fighter1.first_name} ${fighter1.last_name}`}
          fighter2Name={`${fighter2.first_name} ${fighter2.last_name}`}
          readOnly={isClosed}
        />

        {/* Discussion */}
        <DiscussionSection fightId={fight.id} readOnly={isClosed} />
      </div>
    </div>
  );
}

export default FightDetail;
