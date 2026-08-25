import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";
import {
  fetchActivitySessions,
  type ActivityEvent,
  type ActivitySession,
} from "@/lib/adminApi";
import { AuthError, logout } from "@/lib/auth";
import { LoadingState, ErrorState } from "@/components/PageState";

const REFRESH_INTERVAL_MS = 30_000;

function formatTimestamp(utc: string): string {
  // Server sends "YYYY-MM-DD HH:MM:SS" UTC — parse it as such and render local.
  const date = new Date(`${utc.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return utc;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTime(utc: string): string {
  const date = new Date(`${utc.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return utc;
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function eventLabel(event: ActivityEvent): string {
  switch (event.type) {
    case "session_start":
      return "Visitor started";
    case "session_end":
      return "Session ended";
    case "post_view":
      return `Read "${event.postTitle ?? event.postSlug ?? "unknown post"}"`;
  }
}

function SessionCard({ session }: { session: ActivitySession }) {
  return (
    <div
      className="rounded-lg border font-mono text-xs overflow-hidden"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-inset)" }}
    >
      <div
        className="px-3 py-2 flex items-center justify-between gap-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full shrink-0 animate-pulse"
            style={{
              backgroundColor: session.active
                ? "var(--color-online)"
                : "var(--text-faint)",
            }}
            aria-hidden="true"
          />
          <span
            className="tracking-widest truncate"
            style={{ color: "var(--text-faint)" }}
            title={session.sessionId}
          >
            {session.sessionId.slice(0, 8)}…
          </span>
          <span
            className="px-1.5 py-0.5 rounded shrink-0"
            style={{
              color: session.active
                ? "var(--color-online)"
                : "var(--text-faint)",
              backgroundColor: session.active
                ? "color-mix(in srgb, var(--color-online) 15%, transparent)"
                : "color-mix(in srgb, var(--text-faint) 15%, transparent)",
            }}
          >
            {session.active ? "ACTIVE" : "ENDED"}
          </span>
        </div>
        <span className="shrink-0" style={{ color: "var(--text-faint)" }}>
          {formatTimestamp(session.startedAt)}
        </span>
      </div>

      <div className="px-3 py-2.5 space-y-1">
        {session.events.map((event, i) => (
          <div key={i} className="flex items-baseline gap-2">
            <span style={{ color: "var(--text-faint)" }}>
              {formatTime(event.createdAt)}
            </span>
            <span
              className="truncate"
              style={{
                color:
                  event.type === "post_view"
                    ? "var(--text)"
                    : "var(--text-muted)",
              }}
            >
              {eventLabel(event)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminActivity() {
  const [sessions, setSessions] = useState<ActivitySession[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);

  const loadSessions = useCallback(async () => {
    if (isFirstLoad.current) {
      setError(null);
    } else {
      setRefreshing(true);
    }

    try {
      const data = await fetchActivitySessions();
      setSessions(data);
      setError(null);
    } catch (err) {
      if (err instanceof AuthError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(
        err instanceof Error ? err.message : "Failed to load activity.",
      );
    } finally {
      isFirstLoad.current = false;
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadSessions]);

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <p
              className="font-mono text-xs tracking-widest mb-1"
              style={{ color: "var(--text-faint)" }}
            >
              NEXUS ADMIN
            </p>
            <h1
              className="font-display font-bold text-2xl"
              style={{ color: "var(--text)" }}
            >
              Activity
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              aria-label="Back to posts"
              title="Back to posts"
              className="rounded-lg border p-2"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <ArrowLeft size={16} />
            </Link>
            <Link
              to="/"
              aria-label="Go to home page"
              title="Go to home page"
              className="rounded-lg border p-2"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <Home size={16} />
            </Link>
            <button
              onClick={() => loadSessions()}
              disabled={refreshing}
              aria-label="Refresh"
              title="Refresh"
              className="rounded-lg border p-2 disabled:opacity-50"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border px-4 py-2 text-sm"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Log out
            </button>
          </div>
        </div>

        {sessions === null && !error && <LoadingState label="Loading activity" />}
        {error && <ErrorState message={error} />}

        {sessions && sessions.length === 0 && (
          <div
            className="rounded-xl border border-dashed p-10 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No visitor activity yet.
            </p>
          </div>
        )}

        {sessions && sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map((session) => (
              <SessionCard key={session.sessionId} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
