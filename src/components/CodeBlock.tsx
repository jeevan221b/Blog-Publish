import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  className?: string;
  children: ReactNode;
  rawText: string;
}

export function CodeBlock({ className, children, rawText }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lang = /language-(\w+)/.exec(className ?? '')?.[1] ?? 'text';

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — fail silently, nothing to recover.
    }
  }

  return (
    <div
      className="not-prose rounded-lg border overflow-hidden my-2"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-inset)' }}
    >
      <div
        className="flex items-center justify-between px-3.5 py-2 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="font-mono text-[11px] tracking-wide" style={{ color: 'var(--text-faint)' }}>
          {lang}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2 py-1 rounded hover:cursor-pointer"
          style={{ color: copied ? 'var(--color-online)' : 'var(--text-muted)' }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="nexus-scroll overflow-x-auto">
        <pre className="p-4 text-[13px] leading-relaxed font-mono">
          <code className={className}>{children}</code>
        </pre>
      </div>
    </div>
  );
}
