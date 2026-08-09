interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  return (
    <div
      className="rounded-xl border border-dashed p-10 text-center"
      style={{ borderColor: 'var(--border)' }}
      role="status"
      aria-live="polite"
    >
      <p
        className="font-mono text-xs tracking-widest mb-1"
        style={{ color: 'var(--text-faint)' }}
      >
        {label.toUpperCase()}…
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Talking to Nexus.
      </p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div
      className="rounded-xl border border-dashed p-10 text-center"
      style={{ borderColor: 'var(--border)' }}
      role="alert"
    >
      <p
        className="font-display font-medium mb-1"
        style={{ color: 'var(--text)' }}
      >
        Couldn't reach Nexus.
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {message ?? "The API didn't respond. Check that the backend is running and try again."}
      </p>
    </div>
  );
}
