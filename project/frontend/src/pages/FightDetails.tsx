import { useParams, Link } from "react-router-dom";
import { getFightById } from "../data/fights";
import { getFighterById } from "../data/fighters";
import { formatRecord, calculateAge } from "../types/fighter";
import type { Fighter } from "../types/fighter";
import { getFlagUrl } from "../utils/flags";
import { getFighterSprite } from "../utils/sprites";
import ring from "../assets/ring.png";
import standingLeft from "../assets/genericSprites/leftStanding.png";
import standingRight from "../assets/genericSprites/rightStanding.png";
import crown from "../assets/crown.svg";
import tickIcon from "../assets/tick.svg";
import crossIcon from "../assets/cross.svg";
import UndercardSection from "../components/UndercardSection";
import DiscussionSection from "../components/DiscussionSection";
import PredictionSection from "../components/PredictionSection";

function LastFive({ results }: { results: ("W" | "L")[] }) {
  return (
    <div className="flex justify-center gap-1">
      {results.map((r, i) => (
        <img
          key={i}
          src={r === "W" ? tickIcon : crossIcon}
          alt={r === "W" ? "Win" : "Loss"}
          className="h-6 w-6"
        />
      ))}
    </div>
  );
}

function StatColumn({ fighter }: { fighter: Fighter }) {
  return (
    <div className="flex flex-col gap-2 text-center text-sm uppercase text-white">
      <p>{calculateAge(fighter.date_of_birth)}</p>
      <p>{fighter.height}</p>
      <p>{fighter.reach}</p>
      <p>{fighter.stance}</p>
      <p>{fighter.weight}</p>
      <p>{fighter.hometown}</p>
    </div>
  );
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
    { weekday: "short", month: "short", day: "2-digit", year: "numeric" },
  );

  const flag1 = getFlagUrl(fighter1.country);
  const flag2 = getFlagUrl(fighter2.country);

  const sprite1 = getFighterSprite(fighter1.id) ?? standingLeft;
  const sprite2 = getFighterSprite(fighter2.id) ?? standingRight;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 font-body">
      <div className="mx-auto max-w-5xl px-6">
        <Link to="/" className="mb-4 inline-block text-sm text-purple">
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

          {/* Content sits above the overlay */}
          <div className="relative z-10 px-6 pt-6 pb-8">
            <h1 className="text-center text-xl uppercase tracking-wide text-purple">
              {fight.main_event.title ?? "Main Event"}
            </h1>
            <p className="mt-1 text-center text-sm uppercase text-text">
              {dateLabel} • {fight.venue.name}, {fight.venue.city},{" "}
              {fight.venue.country}
            </p>

            {/* Result banner — only shown once the fight is closed */}
            {resultLine && (
              <div className="mx-auto mt-4 max-w-md rounded-md border border-purple bg-purple/10 px-4 py-2 text-center">
                <p className="text-sm uppercase tracking-wide text-white">
                  Final Result
                </p>
                <p className="text-base uppercase text-green-300">
                  {resultLine}
                </p>
              </div>
            )}

            {/* Fighters + VS */}
            <div className="mt-8 flex items-center justify-between gap-6">
              <div className="flex flex-1 flex-col items-center text-center">
                <img
                  src={sprite1}
                  alt={fighter1.last_name}
                  className="h-48 w-auto object-contain"
                />
                <p className="mt-2 font-body text-sm uppercase text-text">
                  {fighter1.first_name}
                </p>
                <h2 className="font-heading text-3xl uppercase text-white">
                  {fighter1.last_name}
                </h2>
                <p className="text-sm uppercase text-purple">
                  {fighter1.nickname}
                </p>
                <p className="text-sm text-text">
                  {formatRecord(fighter1.record)}
                </p>
                {flag1 && (
                  <img
                    src={flag1}
                    alt={fighter1.country}
                    className="mt-1 h-4 w-6 object-cover"
                  />
                )}
                <p className="mt-2 mb-2 text-xs uppercase text-white">Last 5</p>
                <LastFive results={fighter1.last_5} />
              </div>

              <div className="flex flex-col items-center gap-1">
                <img src={crown} alt="" className="h-12 w-12" />
                <p className="text-xs uppercase tracking-widest text-purple">
                  Main Event
                </p>
                <p className="text-xs uppercase text-text">
                  {fight.main_event.scheduled_rounds} Rounds
                </p>
                <span className="mt-1 text-6xl font-bold text-purple">VS</span>
              </div>

              <div className="flex flex-1 flex-col items-center text-center">
                <img
                  src={sprite2}
                  alt={fighter2.last_name}
                  className="h-48 w-auto object-contain"
                />
                <p className="mt-2 font-body text-sm uppercase text-text">
                  {fighter2.first_name}
                </p>
                <h2 className="font-heading text-3xl uppercase text-white">
                  {fighter2.last_name}
                </h2>
                <p className="text-sm uppercase text-purple">
                  {fighter2.nickname}
                </p>
                <p className="text-sm text-text">
                  {formatRecord(fighter2.record)}
                </p>
                {flag2 && (
                  <img
                    src={flag2}
                    alt={fighter2.country}
                    className="mt-1 h-4 w-6 object-cover"
                  />
                )}
                <p className="mt-2 mb-2 text-xs uppercase text-white">Last 5</p>
                <LastFive results={fighter2.last_5} />
              </div>
            </div>

            {/* Stat comparison — its own box, inside the ring section */}
            <div className="mt-8 grid grid-cols-3 gap-4 rounded-md border border-purple/30 bg-background p-6">
              <StatColumn fighter={fighter1} />
              <div className="flex flex-col gap-2 text-center text-sm uppercase text-purple">
                <p>Age</p>
                <p>Height</p>
                <p>Reach</p>
                <p>Stance</p>
                <p>Weight</p>
                <p>Hometown</p>
              </div>
              <StatColumn fighter={fighter2} />
            </div>
          </div>
        </div>

        <UndercardSection bouts={fight.undercard} />

        <PredictionSection
          fightId={fight.id}
          fighter1Name={`${fighter1.first_name} ${fighter1.last_name}`}
          fighter2Name={`${fighter2.first_name} ${fighter2.last_name}`}
          readOnly={isClosed}
        />

        <DiscussionSection readOnly={isClosed} />
      </div>
    </div>
  );
}

export default FightDetail;
