import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types/post';

interface PostNavigationProps {
  prev: BlogPost | null;
  next: BlogPost | null;
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className="grid sm:grid-cols-2 gap-3 mt-4"
      aria-label="More articles"
    >
      {prev ? (
        <Link
          to={`/blog/${prev.slug}`}
          className="group rounded-xl border p-4 flex flex-col justify-center transition-colors"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
        >
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[11px] mb-1.5"
            style={{ color: 'var(--text-faint)' }}
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            PREVIOUS
          </span>
          <span className="font-display font-medium text-sm leading-snug" style={{ color: 'var(--text)' }}>
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to={`/blog/${next.slug}`}
          className="group rounded-xl border p-4 flex flex-col justify-center items-start sm:items-end text-left sm:text-right transition-colors"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
        >
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[11px] mb-1.5"
            style={{ color: 'var(--text-faint)' }}
          >
            NEXT
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="font-display font-medium text-sm leading-snug" style={{ color: 'var(--text)' }}>
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
