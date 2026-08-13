import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "@/lib/auth";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from ?? "/admin";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(password);
      navigate(from as string, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div
        className="w-full max-w-sm rounded-xl border p-8"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-elevated)",
        }}
      >
        <p
          className="font-mono text-xs tracking-widest mb-2"
          style={{ color: "var(--text-faint)" }}
        >
          NEXUS ADMIN
        </p>
        <h1
          className="font-display font-bold text-2xl mb-6"
          style={{ color: "var(--text)" }}
        >
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-inset)",
                color: "var(--text)",
              }}
            />
          </div>

          {error && (
            <p
              className="text-sm"
              style={{ color: "var(--color-danger)" }}
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || password === ""}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "var(--color-accent)", color: "#0b0d10" }}
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
