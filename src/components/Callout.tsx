import type { ReactNode } from 'react';
import { Info, Lightbulb, TriangleAlert, Sparkles } from 'lucide-react';

export type CalloutType = 'tip' | 'note' | 'warning' | 'fun fact';

interface CalloutProps {
  type: CalloutType;
  children: ReactNode;
}

const config: Record<CalloutType, { label: string; icon: typeof Info; color: string }> = {
  tip: { label: 'TIP', icon: Lightbulb, color: 'var(--color-online)' },
  note: { label: 'NOTE', icon: Info, color: 'var(--color-accent)' },
  warning: { label: 'WARNING', icon: TriangleAlert, color: 'var(--color-danger)' },
  'fun fact': { label: 'FUN FACT', icon: Sparkles, color: 'var(--color-led)' },
};

export function Callout({ type, children }: CalloutProps) {
  const { label, icon: Icon, color } = config[type];

  return (
    <div
      className="not-prose rounded-lg border pl-4 pr-4 py-3.5 my-2 flex gap-3"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'color-mix(in srgb, ' + color + ' 8%, var(--bg-elevated))',
      }}
    >
      <Icon size={17} style={{ color, flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
        <p
          className="font-mono text-[10px] tracking-widest mb-1"
          style={{ color }}
        >
          {label}
        </p>
        <div className="[&>p]:m-0">{children}</div>
      </div>
    </div>
  );
}

