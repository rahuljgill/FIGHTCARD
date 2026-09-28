import { Link, useSearchParams } from "react-router-dom";

function EmailVerified() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const alreadyVerified = status === "already-verified";

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md border border-[#AABAFF] bg-[#190F40] p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-[#AABAFF]">
          {alreadyVerified ? "Email Already Verified" : "Email Verified!"}
        </h1>

        <p className="mb-6 text-white">
          {alreadyVerified
            ? "Your FightCard account email has already been verified."
            : "Your email address has been successfully verified. Welcome to FightCard!"}
        </p>

        <Link
          to="/"
          className="inline-block bg-[#AABAFF] px-6 py-3 font-bold text-[#050711] transition hover:opacity-80"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

export default EmailVerified;
