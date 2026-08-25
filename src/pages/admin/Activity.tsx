import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, RefreshCw, Pencil, Tag } from "lucide-react";
import {
  fetchActivitySessions,
  updateSessionTag,
  TagValidationError,
  SessionGoneError,
  type ActivityEvent,
  type ActivitySession,
} from "@/lib/adminApi";
import { AuthError, logout } from "@/lib/auth";
import { LoadingState, ErrorState } from "@/components/PageState";
import { useToast } from "@/hooks/useToast";

const REFRESH_INTERVAL_MS = 30_000;
const TAG_MAX_LENGTH = 40;

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

interface SessionTagEditorProps {
  session: ActivitySession;
  onTagSaved: (sessionId: string, tag: string | null) => void;
  onSessionGone: (sessionId: string) => void;
}

function SessionTagEditor({
  session,
  onTagSaved,
  onSessionGone,
}: SessionTagEditorProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(session.tag ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipSaveRef = useRef(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  // Stay in sync with background refreshes, but not mid-edit.
  useEffect(() => {
    if (!editing) setValue(session.tag ?? "");
  }, [session.tag, editing]);

  async function save() {
    const trimmed = value.trim();
    const newTag = trimmed === "" ? null : trimmed;

    if (newTag === (session.tag ?? null)) {
      setEditing(false);
      setError(null);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await updateSessionTag(session.sessionId, newTag);
      onTagSaved(session.sessionId, newTag);
      setEditing(false);
    } catch (err) {
      if (err instanceof AuthError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      if (err instanceof SessionGoneError) {
        showToast("error", "That session is no longer available.");
        onSessionGone(session.sessionId);
        return;
      }
      if (err instanceof TagValidationError) {
        setError(err.message);
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to save tag.");
    } finally {
      setSaving(false);
    }
  }

  function handleBlur() {
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      setValue(session.tag ?? "");
      setError(null);
      setEditing(false);
      return;
    }
    void save();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      skipSaveRef.current = true;
      e.currentTarget.blur();
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={inputRef}
          type="text"
          value={value}
          maxLength={TAG_MAX_LENGTH}
          placeholder="Who was this?"
          disabled={saving}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="font-sans rounded border px-2 py-1 text-xs w-40 max-w-full disabled:opacity-50"
          style={{
            borderColor: "var(--border)",
            color: "var(--text)",
            backgroundColor: "var(--bg-elevated)",
          }}
        />
        {error && (
          <span className="font-sans" style={{ color: "var(--color-danger)" }}>
            {error}
          </span>
        )}
      </div>
    );
  }

  if (session.tag) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Edit tag "${session.tag}"`}
        title="Edit tag"
        className="font-sans inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
        style={{
          color: "var(--color-accent)",
          backgroundColor:
            "color-mix(in srgb, var(--color-accent) 15%, transparent)",
        }}
      >
        <Tag size={10} />
        {session.tag}
        <Pencil size={10} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="font-sans text-xs"
      style={{ color: "var(--text-faint)" }}
    >
      + Add tag
    </button>
  );
}

interface SessionCardProps {
  session: ActivitySession;
  onTagSaved: (sessionId: string, tag: string | null) => void;
  onSessionGone: (sessionId: string) => void;
}

function SessionCard({ session, onTagSaved, onSessionGone }: SessionCardProps) {
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

      <div
        className="px-3 py-2 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <SessionTagEditor
          session={session}
          onTagSaved={onTagSaved}
          onSessionGone={onSessionGone}
        />
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

  function handleTagSaved(sessionId: string, tag: string | null) {
    setSessions(
      (prev) =>
        prev?.map((s) => (s.sessionId === sessionId ? { ...s, tag } : s)) ??
        null,
    );
  }

  function handleSessionGone(sessionId: string) {
    setSessions(
      (prev) => prev?.filter((s) => s.sessionId !== sessionId) ?? null,
    );
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
              <SessionCard
                key={session.sessionId}
                session={session}
                onTagSaved={handleTagSaved}
                onSessionGone={handleSessionGone}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
