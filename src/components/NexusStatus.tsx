import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';

interface NexusStatusProps {
  compact?: boolean;
  className?: string;
}

type HealthState = 'checking' | 'online' | 'offline';

const NEXUS_BIRTHDAY = new Date('2026-08-09T00:00:00');
const HEALTH_CHECK_INTERVAL_MS = 30_000;
const HEALTH_CHECK_TIMEOUT_MS = 5_000;

function getDaysSurvived(): number {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfBirthday = new Date(
    NEXUS_BIRTHDAY.getFullYear(),
    NEXUS_BIRTHDAY.getMonth(),
    NEXUS_BIRTHDAY.getDate()
  );
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfBirthday.getTime()) / 86_400_000
  );
  return Math.max(diffDays + 1, 1);
}

function useNexusHealth(): HealthState {
  const [status, setStatus] = useState<HealthState>('checking');

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);

      try {
        const response = await fetch(`${API_URL}/api/health`, {
          signal: controller.signal,
        });
        if (!cancelled) {
          setStatus(response.ok ? 'online' : 'offline');
        }
      } catch {
        if (!cancelled) {
          setStatus('offline');
        }
      } finally {
        clearTimeout(timeout);
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}

const STATUS_COPY: Record<HealthState, { label: string; color: string; tagline: string }> = {
  checking: {
    label: '● CHECKING',
    color: 'var(--color-led)',
    tagline: 'Pinging Nexus…',
  },
  online: {
    label: '● ONLINE',
    color: 'var(--color-online)',
    tagline: 'Nexus appears to be alive. This is good.',
  },
  offline: {
    label: '● OFFLINE',
    color: 'var(--color-danger)',
    tagline: "Nexus isn't responding. Might be taking a nap.",
  },
};

export function NexusStatus({ compact = false, className = '' }: NexusStatusProps) {
  const health = useNexusHealth();
  const { label, color, tagline } = STATUS_COPY[health];

  const rows: Array<[string, string]> = [
    ['HARDWARE', 'Samsung Galaxy M31'],
    ['STACK', 'Termux / Nginx'],
    ['UPTIME', `${getDaysSurvived()} days`],
    ['STATUS', label],
  ];

  if (compact) {
    return (
      <div
        className={`font-mono text-[11px] leading-none inline-flex items-center gap-1.5 ${className}`}
        style={{ color: 'var(--text-faint)' }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <span>NEXUS · {health === 'checking' ? 'CHECKING' : health.toUpperCase()}</span>
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
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      </div>
      <div className="px-3 py-2.5 space-y-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <span style={{ color: 'var(--text-faint)' }}>{label}</span>
            <span
              style={{
                color: label === 'STATUS' ? color : 'var(--text-muted)',
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
        {tagline}
      </div>
    </div>
  );
}
