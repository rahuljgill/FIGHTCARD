import type { Fight } from "../types/fight";

import type { Fighter } from "../types/fighter";

import { formatRecord } from "../types/fighter";

import { getFighterById } from "../data/fighters";

import { getFlagUrl } from "../utils/flags";

import { formatDateParts } from "../utils/date";

import leftSide from "../assets/genericSprites/leftHalf.png";

import rightSide from "../assets/genericSprites/rightHalf.png";

import { getFighterSprite } from "../utils/sprites";

import tickIcon from "../assets/tick.svg";

import crossIcon from "../assets/cross.svg";

import noContestIcon from "../assets/noContest.svg";

import Tooltip from "./Tooltip";

function ResultBox({
  result,
  size = "desktop",
}: {
  result: "W" | "L" | "NC";
  size?: "desktop" | "mobile";
}) {
  const icon =
    result === "W" ? tickIcon : result === "L" ? crossIcon : noContestIcon;

  const alt = result === "W" ? "Win" : result === "L" ? "Loss" : "No Contest";

  return (
    <img
      src={icon}
      alt={alt}
      className={size === "mobile" ? "h-5 w-5" : "h-6 w-6"}
    />
  );
}

function truncateName(name: string, maxChars: number): string {
  return name.length > maxChars ? `${name.slice(0, maxChars)}-` : name;
}

// Rough char-count heuristic for the title, since it uses CSS truncate
// (ellipsis) rather than manual slicing — the container is a fixed w-48,
// so anything longer than this reliably wraps/clips in that space.
const TITLE_MAX_CHARS = 20;

function FighterBlock({
  fighter,
  align,
}: {
  fighter: Fighter;
  align: "left" | "right";
}) {
  const genericImage = align === "left" ? leftSide : rightSide;
  const image = getFighterSprite(fighter.id) ?? genericImage;
  const displayLastName = truncateName(fighter.last_name, 11);
  const isTruncated = displayLastName !== fighter.last_name;

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
      <img
        src={image}
        alt={`${fighter.first_name} ${fighter.last_name}`}
        className="h-32 w-32 shrink-0 object-contain"
      />

      <p className="mt-1 truncate font-body text-sm uppercase tracking-widest text-text">
        {fighter.first_name}
      </p>

      {isTruncated ? (
        <Tooltip label={`${fighter.first_name} ${fighter.last_name}`}>
          <h3 className="whitespace-nowrap font-heading text-4xl uppercase tracking-wide text-white">
            {displayLastName}
          </h3>
        </Tooltip>
      ) : (
        <h3 className="whitespace-nowrap font-heading text-4xl uppercase tracking-wide text-white">
          {displayLastName}
        </h3>
      )}

      <p className="font-body text-sm text-text">
        {formatRecord(fighter.record)}
      </p>

      <div className="mt-1 flex gap-1">
        {fighter.last_5.map((r, i) => (
          <ResultBox key={i} result={r} />
        ))}
      </div>
    </div>
  );
}

function MobileFighterBlock({
  fighter,
  align,
}: {
  fighter: Fighter;
  align: "left" | "right";
}) {
  const genericImage = align === "left" ? leftSide : rightSide;
  const image = getFighterSprite(fighter.id) ?? genericImage;
  const displayLastName = truncateName(fighter.last_name, 9);
  const isTruncated = displayLastName !== fighter.last_name;

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
      <img
        src={image}
        alt={`${fighter.first_name} ${fighter.last_name}`}
        className="h-20 w-20 shrink-0 object-contain"
      />

      <p className="mt-0.5 max-w-full truncate font-body text-[10px] uppercase tracking-widest text-text">
        {fighter.first_name}
      </p>

      {isTruncated ? (
        <Tooltip label={`${fighter.first_name} ${fighter.last_name}`}>
          <h3 className="max-w-full whitespace-nowrap font-heading text-2xl uppercase tracking-wide text-white">
            {displayLastName}
          </h3>
        </Tooltip>
      ) : (
        <h3 className="max-w-full whitespace-nowrap font-heading text-2xl uppercase tracking-wide text-white">
          {displayLastName}
        </h3>
      )}

      <p className="font-body text-[10px] text-text">
        {formatRecord(fighter.record)}
      </p>

      <div className="mt-1 flex gap-1">
        {fighter.last_5.map((r, i) => (
          <ResultBox key={i} result={r} size="mobile" />
        ))}
      </div>
    </div>
  );
}

function FightCard({ fight }: { fight: Fight }) {
  const { month, day, weekday } = formatDateParts(fight.date);

  const fighter1 = getFighterById(fight.main_event.fighter_1);
  const fighter2 = getFighterById(fight.main_event.fighter_2);

  const venueFlag = getFlagUrl(fight.venue.country);

  if (!fighter1 || !fighter2) return null;

  const mainEventTitle = fight.main_event.title ?? "Main Event";
  const isTitleTruncated = mainEventTitle.length > TITLE_MAX_CHARS;

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP FIGHT CARD */}
      {/* ========================================================= */}

      <div className="mx-auto hidden w-350 max-w-full items-center gap-8 rounded-md border border-purple/30 bg-[#0a0d1c] px-10 py-3 font-body md:flex">
        {/* Date */}
        <div className="flex shrink-0 flex-col items-center border-r border-purple/20 pr-6 text-center">
          <span className="text-sm uppercase tracking-widest text-purple">
            {month}
          </span>

          <span className="text-4xl font-bold leading-none text-white">
            {day}
          </span>

          <span className="text-sm uppercase text-text">{weekday}</span>
        </div>

        {/* Title / venue info */}
        <div className="flex w-48 shrink-0 flex-col gap-1 border-r border-purple/20 pr-6">
          {isTitleTruncated ? (
            <Tooltip label={mainEventTitle}>
              <p className="truncate text-base uppercase tracking-wide text-purple">
                {mainEventTitle}
              </p>
            </Tooltip>
          ) : (
            <p className="truncate text-base uppercase tracking-wide text-purple">
              {mainEventTitle}
            </p>
          )}

          <p className="truncate text-sm uppercase text-text">
            {fight.venue.name}
          </p>

          <div className="flex items-center gap-2 text-sm uppercase text-text">
            <span className="min-w-0 truncate">
              {fight.venue.city}, {fight.venue.country}
            </span>

            {venueFlag && (
              <img
                src={venueFlag}
                alt={fight.venue.country}
                className="h-4 w-6 shrink-0 object-cover"
              />
            )}
          </div>
        </div>

        {/* Fighters */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-8 px-6">
          <FighterBlock fighter={fighter1} align="left" />

          <span className="shrink-0 px-14 text-4xl font-bold text-purple">
            VS
          </span>

          <FighterBlock fighter={fighter2} align="right" />
        </div>

        {/* View Fight */}
        <a
          href={`/fights/${fight.id}`}
          className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-sm border border-purple px-4 py-2 text-sm uppercase tracking-widest text-purple transition-colors hover:bg-purple/10"
        >
          Full Card
          <span aria-hidden>›</span>
        </a>
      </div>

      {/* ========================================================= */}
      {/* MOBILE FIGHT CARD */}
      {/* ========================================================= */}

      <div className="mx-auto flex w-full max-w-full items-stretch rounded-md border border-purple/30 bg-[#0a0d1c] font-body md:hidden">
        {/* Date */}
        <div className="flex w-16 shrink-0 flex-col items-center justify-start border-r border-purple/20 pt-1 text-center">
          <span className="text-xs font-bold uppercase tracking-wide text-purple">
            {month}
          </span>

          <span className="text-3xl font-bold leading-none text-white">
            {day}
          </span>

          <span className="mt-1 text-xs font-bold uppercase text-text">
            {weekday}
          </span>
        </div>

        {/* Main mobile content */}
        <div className="min-w-0 flex-1 pb-2 ">
          {/* Event information */}
          <div className="flex items-start justify-between gap-2 px-4 py-2.5">
            <div className="min-w-0 flex-1">
              {isTitleTruncated ? (
                <Tooltip label={mainEventTitle}>
                  <p className="truncate text-sm uppercase tracking-wide text-purple">
                    {mainEventTitle}
                  </p>
                </Tooltip>
              ) : (
                <p className="truncate text-sm uppercase tracking-wide text-purple">
                  {mainEventTitle}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs uppercase text-text">
                <span className="truncate">
                  {fight.venue.city}, {fight.venue.country}
                </span>

                {venueFlag && (
                  <img
                    src={venueFlag}
                    alt={fight.venue.country}
                    className="h-4 w-6 shrink-0 object-cover"
                  />
                )}
              </div>
            </div>

            {/* Full Card */}
            <a
              href={`/fights/${fight.id}`}
              className="flex shrink-0 items-center gap-1 rounded-sm border border-purple px-2 py-2 text-xs uppercase tracking-widest text-purple transition-colors hover:bg-purple/10"
            >
              Full Card
              <span aria-hidden>›</span>
            </a>
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-purple/20" />

          {/* Fighters */}
          <div className="flex items-center px-3 pt-2">
            <MobileFighterBlock fighter={fighter1} align="left" />

            <div className="flex w-12 shrink-0 items-center justify-center">
              <span className="text-2xl font-bold text-purple">VS</span>
            </div>

            <MobileFighterBlock fighter={fighter2} align="right" />
          </div>
        </div>
      </div>
    </>
  );
}

export default FightCard;
