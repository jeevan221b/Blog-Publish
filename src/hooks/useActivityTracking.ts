import { useEffect } from "react";
import { ensureSession, sendHeartbeat, endSession } from "@/lib/activity";

const HEARTBEAT_INTERVAL_MS = 60_000;

/**
 * Sets up the visitor activity session for the current tab: creates the
 * session on mount, heartbeats every ~60s while the tab is visible, and
 * fires a best-effort end when the tab/page closes.
 */
export function useActivityTracking(): void {
  useEffect(() => {
    ensureSession();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        void sendHeartbeat();
      }
    }, HEARTBEAT_INTERVAL_MS);

    // pagehide fires reliably on tab close, navigation, and refresh
    // (including on mobile, unlike beforeunload) and is the recommended
    // event to pair with sendBeacon.
    window.addEventListener("pagehide", endSession);

    return () => {
      clearInterval(interval);
      window.removeEventListener("pagehide", endSession);
    };
  }, []);
}
