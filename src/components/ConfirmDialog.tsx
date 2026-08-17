import { useEffect, useRef, useState } from "react";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm button as a destructive (red) action. Defaults to true. */
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TRANSITION_MS = 180;

/**
 * A small confirm/cancel modal used in place of `window.confirm`, styled to
 * match the rest of the admin UI. Stays mounted for `TRANSITION_MS` after
 * `open` goes false so the exit transition can play, then unmounts fully
 * (no lingering focusable elements once closed).
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timeout = setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    cancelRef.current?.focus();
  }, [visible]);

  useEffect(() => {
    if (!mounted) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mounted, onCancel]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity"
      style={{
        transitionDuration: `${TRANSITION_MS}ms`,
        opacity: visible ? 1 : 0,
        backgroundColor: "color-mix(in srgb, #000 55%, transparent)",
      }}
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? "confirm-dialog-description" : undefined}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-xl border p-5 shadow-xl transition-all"
        style={{
          transitionDuration: `${TRANSITION_MS}ms`,
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-elevated)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(6px)",
        }}
      >
        <h2
          id="confirm-dialog-title"
          className="font-display font-semibold text-base mb-1.5"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h2>
        {description && (
          <p
            id="confirm-dialog-description"
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {description}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-5">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-3.5 py-1.5 text-sm disabled:opacity-50"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg px-3.5 py-1.5 text-sm font-medium disabled:opacity-50"
            style={{
              backgroundColor: destructive ? "var(--color-danger)" : "var(--color-accent)",
              color: "#0b0d10",
            }}
          >
            {loading ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
