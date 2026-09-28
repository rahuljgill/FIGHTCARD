import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import gloves from "../assets/gloves.svg";

function EmailVerified() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const alreadyVerified = status === "already-verified";

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 font-body">
      <div className="mx-auto max-w-6xl px-6">
        <Link to="/" className="mb-8 inline-block text-sm text-purple">
          ← Back to Home
        </Link>

        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left side */}
          <div>
            <h1 className="text-center font-heading text-5xl uppercase tracking-widest text-purple md:text-6xl">
              {alreadyVerified ? "Already Verified" : "Email Verified"}
            </h1>

            <p className="mx-auto mt-6 max-w-md text-center text-text">
              {alreadyVerified
                ? "Your FightCard account email has already been verified."
                : "Your email address has been successfully verified. Welcome to FightCard!"}
            </p>

            <div className="mx-auto mt-6 h-1 w-16 bg-purple" />

            <img
              src={gloves}
              alt=""
              className="mx-auto mt-12 h-64 w-64 object-contain"
            />
          </div>

          {/* Right side */}
          <div className="rounded-md border border-purple/40 p-8 text-center">
            <CheckCircle
              size={64}
              strokeWidth={1.5}
              className="mx-auto text-purple"
            />

            <h2 className="mt-6 font-heading text-2xl uppercase tracking-widest text-purple">
              {alreadyVerified ? "You're All Set" : "Verification Complete"}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-text">
              {alreadyVerified
                ? "Your account is ready to use. You can return to FightCard whenever you're ready."
                : "Your email has been confirmed and your account is ready to use."}
            </p>

            <Link
              to="/"
              className="mt-8 flex items-center justify-center gap-2 rounded-sm border border-purple bg-purple/80 px-6 py-3 text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Return to FightCard
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerified;
