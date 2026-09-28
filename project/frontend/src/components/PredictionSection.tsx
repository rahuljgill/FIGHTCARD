import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import bars2 from "../assets/bars2.svg";

import api from "../api/client";
import { useCurrentUser } from "../api/useCurrentUser";

interface PredictionSectionProps {
  fightId: string;
  fighter1Id: string;
  fighter2Id: string;
  fighter1Name: string;
  fighter2Name: string;
  readOnly?: boolean;
}

interface PredictionResponse {
  fighter1: {
    fighterId: string;
    votes: number;
    percentage: number;
  };
  fighter2: {
    fighterId: string;
    votes: number;
    percentage: number;
  };
  userVote: string | null;
}

function PredictionSection({
  fightId,
  fighter1Id,
  fighter2Id,
  fighter1Name,
  fighter2Name,
  readOnly = false,
}: PredictionSectionProps) {
  const [fighter1Pct, setFighter1Pct] = useState(0);
  const [fighter2Pct, setFighter2Pct] = useState(0);

  const [fighter1Votes, setFighter1Votes] = useState(0);
  const [fighter2Votes, setFighter2Votes] = useState(0);

  const [loading, setLoading] = useState(true);

  const [userVote, setUserVote] = useState<"fighter1" | "fighter2" | null>(
    null,
  );

  const [loginMessage, setLoginMessage] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(false);

  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  const currentUserVerified = currentUser?.email_verified === true;

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);

        const response = await api.get<PredictionResponse>(
          `/api/fights/${fightId}/predictions?fighter1=${fighter1Id}&fighter2=${fighter2Id}`,
        );

        const data = response.data;

        setFighter1Pct(data.fighter1.percentage);
        setFighter2Pct(data.fighter2.percentage);

        setFighter1Votes(data.fighter1.votes);
        setFighter2Votes(data.fighter2.votes);

        if (data.userVote === fighter1Id) {
          setUserVote("fighter1");
        } else if (data.userVote === fighter2Id) {
          setUserVote("fighter2");
        } else {
          setUserVote(null);
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [fightId, fighter1Id, fighter2Id]);

  const handleVote = async (choice: "fighter1" | "fighter2") => {
    if (readOnly || userVote) return;

    if (userLoading) return;

    if (!currentUser) {
      setLoginMessage(true);
      setVerificationMessage(false);
      return;
    }

    if (!currentUserVerified) {
      setVerificationMessage(true);
      setLoginMessage(false);
      return;
    }

    const fighterId = choice === "fighter1" ? fighter1Id : fighter2Id;

    try {
      await api.post(`/api/fights/${fightId}/predictions`, {
        fighter_id: fighterId,
      });

      setUserVote(choice);
      setLoginMessage(false);
      setVerificationMessage(false);

      // Add the new vote locally.
      if (choice === "fighter1") {
        setFighter1Votes((votes) => votes + 1);
      } else {
        setFighter2Votes((votes) => votes + 1);
      }

      // Calculate the new percentages immediately.
      const newFighter1Votes =
        choice === "fighter1" ? fighter1Votes + 1 : fighter1Votes;

      const newFighter2Votes =
        choice === "fighter2" ? fighter2Votes + 1 : fighter2Votes;

      const newTotalVotes = newFighter1Votes + newFighter2Votes;

      const newFighter1Pct =
        newTotalVotes > 0
          ? Math.round((newFighter1Votes / newTotalVotes) * 100)
          : 0;

      const newFighter2Pct = 100 - newFighter1Pct;

      setFighter1Pct(newFighter1Pct);
      setFighter2Pct(newFighter2Pct);
    } catch (error) {
      console.error("Error submitting prediction:", error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto mt-10 max-w-6xl px-6">
        <div className="rounded-md border border-purple/40 px-6 py-5 font-body">
          <p className="text-center text-sm uppercase tracking-widest text-text">
            Loading predictions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-6xl px-6">
      <div className="rounded-md border border-purple/40 px-6 py-5 font-body">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Left: icon + copy */}
          <div className="flex items-start gap-4 md:w-1/3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-purple/50">
              <img src={bars2} alt="" className="h-4.5 w-4.5" />
            </div>

            <div>
              <h2 className="font-heading text-lg uppercase tracking-widest text-purple">
                Fight Prediction
              </h2>

              <p
                className={`mt-1 text-sm ${
                  readOnly ? "text-red-400" : "text-white"
                }`}
              >
                {readOnly
                  ? "Predictions have been closed for this fight as it's over!."
                  : "Who do you think will win?"}
              </p>

              <p
                className={`mt-1 text-xs ${
                  userVote ? "text-red-400" : "text-text"
                }`}
              >
                {readOnly
                  ? ""
                  : userVote
                    ? "You have already voted for this."
                    : verificationMessage
                      ? "Please verify your email address before voting."
                      : loginMessage
                        ? "Log in to cast your vote."
                        : "Cast your vote and see what the community thinks."}
              </p>

              {verificationMessage && (
                <Link
                  to="/settings"
                  className="mt-2 inline-block text-sm font-semibold text-purple underline underline-offset-4 transition-opacity hover:opacity-80"
                >
                  Go to My Settings
                </Link>
              )}
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
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
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
      <span className="w-12 shrink-0 text-right text-sm font-bold text-white">
        {percent}%
      </span>
    </button>
  );
}

export default PredictionSection;
