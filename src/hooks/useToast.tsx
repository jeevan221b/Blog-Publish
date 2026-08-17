import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

type ToastType = "success" | "error";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 4000;

/**
 * Mounted once near the app root (above the router) so a toast queued right
 * before a `navigate()` call survives the route change instead of getting
 * unmounted with the page that queued it.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, type, message }]);
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-4 left-1/2 z-50 flex w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 flex-col items-center gap-2"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const isSuccess = toast.type === "success";
  const Icon = isSuccess ? CheckCircle2 : XCircle;
  const accentColor = isSuccess ? "var(--color-online)" : "var(--color-danger)";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className="toast-in flex items-start gap-2.5 rounded-lg border px-3.5 py-3 shadow-lg backdrop-blur"
      style={{
        borderColor: "var(--border)",
        borderLeft: `3px solid ${accentColor}`,
        backgroundColor: "color-mix(in srgb, var(--bg-elevated) 92%, transparent)",
      }}
    >
      <Icon size={18} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
      <p className="flex-1 text-sm" style={{ color: "var(--text)" }}>
        {toast.message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="-m-1 shrink-0 rounded p-1"
        style={{ color: "var(--text-faint)" }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
