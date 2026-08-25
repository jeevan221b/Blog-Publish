import { API_URL } from "./config";

// sessionStorage (not localStorage) is deliberate: an activity session should
// not survive the tab closing.
const SESSION_KEY = "activitySessionId";

// Dedupes concurrent callers (e.g. React StrictMode's double effect
// invocation, or a heartbeat and a view firing before the first session
// creation resolves) so we never POST two sessions for one tab.
let pendingSession: Promise<string | null> | null = null;

async function createSession(): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/api/activity/sessions`, {
      method: "POST",
    });
    if (!response.ok) return null;

    const data = await response.json();
    sessionStorage.setItem(SESSION_KEY, data.sessionId);
    return data.sessionId;
  } catch {
    // Best-effort analytics — network failures shouldn't affect the app.
    return null;
  }
}

/** Returns the current session id, creating one if none exists yet. */
function getSessionId(): Promise<string | null> {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return Promise.resolve(existing);

  if (!pendingSession) {
    pendingSession = createSession().finally(() => {
      pendingSession = null;
    });
  }
  return pendingSession;
}

/** Discards the current session id and creates a fresh one (404 recovery). */
function refreshSession(): Promise<string | null> {
  sessionStorage.removeItem(SESSION_KEY);
  pendingSession = null;
  return getSessionId();
}

/** Records a blog post page view against the current activity session. */
export async function recordPostView(slug: string): Promise<void> {
  const sessionId = await getSessionId();
  if (!sessionId) return;

  try {
    const response = await fetch(
      `${API_URL}/api/activity/sessions/${sessionId}/views`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      },
    );

    if (response.status === 404) {
      // Session expired server-side (inactivity sweep) — get a fresh one
      // and retry the view once.
      const freshId = await refreshSession();
      if (!freshId) return;

      await fetch(`${API_URL}/api/activity/sessions/${freshId}/views`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
    }
  } catch {
    // Best-effort analytics — ignore network errors.
  }
}

/** Pings the current activity session to keep it alive. */
export async function sendHeartbeat(): Promise<void> {
  const sessionId = await getSessionId();
  if (!sessionId) return;

  try {
    const response = await fetch(
      `${API_URL}/api/activity/sessions/${sessionId}/heartbeat`,
      { method: "POST" },
    );

    if (response.status === 404) {
      // Session expired server-side — just get a fresh one for next time,
      // no need to retry the heartbeat itself.
      await refreshSession();
    }
  } catch {
    // Best-effort analytics — ignore network errors.
  }
}

/** Ensures an activity session exists, creating one if needed. */
export function ensureSession(): void {
  void getSessionId();
}

/** Best-effort explicit session end, fired on tab/page close. */
export function endSession(): void {
  const sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) return;

  try {
    navigator.sendBeacon(`${API_URL}/api/activity/sessions/${sessionId}/end`);
  } catch {
    // Best-effort analytics — ignore errors.
  }
}
