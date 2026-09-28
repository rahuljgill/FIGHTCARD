import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, MessageSquare, ArrowRight } from "lucide-react";
import gloves from "../assets/gloves.svg";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("https://formspree.io/f/xkjgkgkb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 font-body">
      <div className="mx-auto max-w-6xl px-6">
        <Link to="/" className="mb-8 inline-block text-sm text-purple">
          ← Back to Home
        </Link>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left side */}
          <div>
            <h1 className="text-center font-heading text-6xl uppercase tracking-widest text-purple">
              Contact Us
            </h1>
            <p className="mx-auto mt-6 max-w-md text-center text-text">
              Have a question, spotted incorrect information, or want to report
              an issue?
            </p>
            <div className="mx-auto mt-6 h-1 w-16 bg-purple" />

            <img
              src={gloves}
              alt=""
              className="mx-auto mt-12 h-64 w-64 object-contain"
            />
          </div>

          {/* Right side — form */}
          <div className="rounded-md border border-purple/40 p-8">
            <h2 className="font-heading text-2xl uppercase tracking-widest text-purple">
              Get In Touch
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
              <div>
                <label className="text-sm uppercase text-white">Name</label>
                <div className="mt-2 flex items-center gap-3 rounded-sm border border-purple/40 bg-transparent px-4 py-3">
                  <User size={18} className="text-purple" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
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
                    required
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-text focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm uppercase text-white">Message</label>
                <div className="mt-2 flex items-start gap-3 rounded-sm border border-purple/40 bg-transparent px-4 py-3">
                  <MessageSquare size={18} className="mt-1 text-purple" />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={5}
                    required
                    className="flex-1 resize-y bg-transparent text-sm text-white placeholder:text-text focus:outline-none"
                  />
                </div>
              </div>

              {status === "success" && (
                <p className="text-sm text-green-400" role="status">
                  Your message has been sent successfully. Thank you for getting
                  in touch!
                </p>
              )}

              {status === "error" && (
                <p className="text-sm text-red-400" role="alert">
                  Something went wrong while sending your message. Please try
                  again.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex items-center justify-center gap-2 rounded-sm border border-purple bg-purple/80 px-6 py-3 text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
