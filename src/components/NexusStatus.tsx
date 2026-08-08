interface NexusStatusProps {
  compact?: boolean;
  className?: string;
}

const rows: Array<[string, string]> = [
  ['HARDWARE', 'Samsung Galaxy M31'],
  ['STACK', 'Termux / Nginx'],
  ['STATUS', '● ONLINE'],
];

export function NexusStatus({ compact = false, className = '' }: NexusStatusProps) {
  if (compact) {
    return (
      <div
        className={`font-mono text-[11px] leading-none inline-flex items-center gap-1.5 ${className}`}
        style={{ color: 'var(--text-faint)' }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: 'var(--color-online)' }}
          aria-hidden="true"
        />
        <span>NEXUS · ONLINE</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border font-mono text-xs overflow-hidden ${className}`}
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-inset)' }}
      role="status"
      aria-label="Nexus server status"
    >
      <div
        className="px-3 py-2 flex items-center justify-between border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="tracking-widest" style={{ color: 'var(--text-faint)' }}>
          NEXUS LOG
        </span>
        <span
          className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: 'var(--color-online)' }}
          aria-hidden="true"
        />
      </div>
      <div className="px-3 py-2.5 space-y-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <span style={{ color: 'var(--text-faint)' }}>{label}</span>
            <span
              style={{
                color: label === 'STATUS' ? 'var(--color-online)' : 'var(--text-muted)',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <div
        className="px-3 py-1.5 text-[10px] border-t"
        style={{ borderColor: 'var(--border)', color: 'var(--text-faint)' }}
      >
        Nexus appears to be alive. This is good.
      </div>
    </div>
  );
}
