import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TocItem } from '@/types/post';
import { useActiveHeading } from '@/hooks/useActiveHeading';

interface TableOfContentsProps {
  items: TocItem[];
  variant?: 'both' | 'desktop' | 'mobile';
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 84;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

export function TableOfContents({ items, variant = 'both' }: TableOfContentsProps) {
  const activeId = useActiveHeading(items.map((i) => i.id));
  const [mobileOpen, setMobileOpen] = useState(false);

  if (items.length === 0) return null;

  const activeItem = items.find((i) => i.id === activeId);
  const showDesktop = variant === 'both' || variant === 'desktop';
  const showMobile = variant === 'both' || variant === 'mobile';

  return (
    <>
      {/* Desktop: sticky sidebar */}
      {showDesktop && (
      <nav
        className={variant === 'desktop' ? 'sticky top-24 self-start' : 'hidden lg:block sticky top-24 self-start'}
        aria-label="Table of contents"
      >
        <p className="font-mono text-[11px] tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>
          ON THIS PAGE
        </p>
        <ol className="space-y-2.5 border-l" style={{ borderColor: 'var(--border)' }}>
          {items.map((item, i) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id} style={{ paddingLeft: item.depth === 3 ? '1.75rem' : '1rem' }}>
                <button
                  type="button"
                  onClick={() => scrollToId(item.id)}
                  className="text-left text-sm leading-snug hover:cursor-pointer transition-colors"
                  style={{
                    color: isActive ? 'var(--color-accent)' : 'var(--text-muted)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <span className="font-mono text-xs mr-1.5" style={{ color: 'var(--text-faint)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.text}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      )}

      {/* Mobile: collapsible */}
      {showMobile && (
      <div className={variant === 'mobile' ? '' : 'lg:hidden'}>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          className="w-full flex items-center justify-between rounded-lg border px-4 py-3 hover:cursor-pointer"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
        >
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--text-faint)' }}>
            ON THIS PAGE{activeItem ? ` · ${activeItem.text}` : ''}
          </span>
          <ChevronDown
            size={16}
            style={{
              color: 'var(--text-muted)',
              transform: mobileOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 150ms ease',
            }}
          />
        </button>
        {mobileOpen && (
          <ol
            className="mt-2 rounded-lg border p-4 space-y-3"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
          >
            {items.map((item, i) => (
              <li key={item.id} style={{ paddingLeft: item.depth === 3 ? '1rem' : 0 }}>
                <button
                  type="button"
                  onClick={() => {
                    scrollToId(item.id);
                    setMobileOpen(false);
                  }}
                  className="text-left text-sm hover:cursor-pointer"
                  style={{ color: item.id === activeId ? 'var(--color-accent)' : 'var(--text-muted)' }}
                >
                  <span className="font-mono text-xs mr-1.5" style={{ color: 'var(--text-faint)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.text}
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
      )}
    </>
  );
}
