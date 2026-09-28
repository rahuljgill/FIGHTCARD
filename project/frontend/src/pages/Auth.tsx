import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import gloves from "../assets/gloves.svg";
import api from "../api/client";
import axios from "axios";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-sm bg-white py-3 text-sm font-semibold text-gray-800 transition-opacity hover:opacity-90"
    >
      <GoogleIcon />
      {label}
    </button>
  );
}

function PasswordInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center gap-3 rounded-sm border border-purple/40 bg-transparent px-4 py-3">
      <Lock size={18} className="text-purple" />
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-white placeholder:text-text focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-text hover:text-white"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function AuthGlovesHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <img src={gloves} alt="" className="mx-auto h-38 w-38 object-contain" />
      <h1 className="mt-4 font-heading text-3xl uppercase tracking-widest text-purple">
        {title}
      </h1>
      <p className="mt-2 text-sm text-text">{subtitle}</p>
    </div>
  );
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // Get a fresh CSRF token
      await api.get("/sanctum/csrf-cookie");

      // Log the user in
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);

      // User is now authenticated through the Laravel session
      window.location.href = "/";
    } catch (error: unknown) {
      console.error("Login error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          setError(
            error.response.data?.message || "The login details are incorrect.",
          );
        } else if (error.response?.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthGlovesHeader
        title="Welcome Back"
        subtitle="Log in to continue to Fight Night Boxing."
      />

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label className="text-sm uppercase text-white">Email</label>
          <div className="mt-2 flex items-center gap-3 rounded-sm border border-purple/40 bg-transparent px-4 py-3">
            <Mail size={18} className="text-purple" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-text focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm uppercase text-white">Password</label>
          <div className="mt-2">
            <PasswordInput
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-sm border border-purple bg-purple/80 py-3 text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="my-2 flex items-center gap-4">
          <span className="h-px flex-1 bg-purple/30" />
          <span className="text-xs uppercase text-text">Or</span>
          <span className="h-px flex-1 bg-purple/30" />
        </div>

        <GoogleButton label="Continue with Google" />

        <p className="mt-2 text-center text-sm text-text">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-purple underline hover:opacity-80"
          >
            Register here
          </button>
        </p>
      </form>
    </>
  );
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [registered, setRegistered] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Get the CSRF cookie before making the POST request
      await api.get("/sanctum/csrf-cookie");

      // Register the user
      const response = await api.post("/api/auth/register", {
        name: username,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      console.log("Registration successful:", response.data);

      // Show the email verification screen
      setRegistered(true);
    } catch (error: unknown) {
      console.error("Registration error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors) {
          const firstError = Object.values(error.response.data.errors)[0];

          if (Array.isArray(firstError)) {
            setError(firstError[0]);
          } else {
            setError("Registration failed.");
          }
        } else {
          setError(
            error.response?.data?.message ||
              "Something went wrong. Please try again.",
          );
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendMessage("");

    try {
      setResending(true);

      await api.post("/api/email/verification-notification");

      setResendMessage("A new verification email has been sent.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setResendMessage(
          error.response?.data?.message ||
            "Could not resend the email. Please try again.",
        );
      } else {
        setResendMessage("Something went wrong. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };

  if (registered) {
    return (
      <div className="text-center">
        <AuthGlovesHeader
          title="Check Your Email"
          subtitle="You're nearly ready to join FightCard."
        />

        <div className="mt-8">
          <Mail size={40} className="mx-auto text-purple" />

          <p className="mt-5 text-white">We've sent a verification link to:</p>

          <p className="mt-2 break-all font-semibold text-purple">{email}</p>

          <p className="mt-5 text-sm text-text">
            Click the link in the email to verify your account. You can close
            this page after receiving it.
          </p>

          <button
            type="button"
            onClick={handleResendVerification}
            disabled={resending}
            className="mt-6 w-full rounded-sm border border-purple bg-purple/80 py-3 text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Verification Email"}
          </button>

          {resendMessage && (
            <p className="mt-4 text-sm text-text">{resendMessage}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthGlovesHeader
        title="Create Your Account"
        subtitle="Join Fight Night Boxing and be part of the community."
      />

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label className="text-sm uppercase text-white">Username</label>

          <div className="mt-2 flex items-center gap-3 rounded-sm border border-purple/40 bg-transparent px-4 py-3">
            <User size={18} className="text-purple" />

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-text focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm uppercase text-white">Email</label>

          <div className="mt-2 flex items-center gap-3 rounded-sm border border-purple/40 bg-transparent px-4 py-3">
            <Mail size={18} className="text-purple" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-text focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm uppercase text-white">Password</label>

          <div className="mt-2">
            <PasswordInput
              placeholder="Create a password"
              value={password}
              onChange={setPassword}
            />
          </div>

          <p className="mt-3 text-xs text-text">
            Note: Password must be at least 8 characters long and include
            letters, numbers, and symbols.
          </p>
        </div>

        <div>
          <label className="text-sm uppercase text-white">
            Confirm Password
          </label>

          <div className="mt-2">
            <PasswordInput
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-sm border border-purple bg-purple/80 py-3 text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="my-2 flex items-center gap-4">
          <span className="h-px flex-1 bg-purple/30" />
          <span className="text-xs uppercase text-text">Or</span>
          <span className="h-px flex-1 bg-purple/30" />
        </div>

        <GoogleButton label="Continue with Google" />

        <p className="mt-2 text-center text-sm text-text">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-purple underline hover:opacity-80"
          >
            Login here
          </button>
        </p>
      </form>
    </>
  );
}

function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-32 pb-16 font-body">
      <div className="w-full max-w-2xl rounded-md border border-purple/40 p-10">
        {mode === "login" ? (
          <LoginForm onSwitch={() => setMode("register")} />
        ) : (
          <RegisterForm onSwitch={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}

export default Auth;
