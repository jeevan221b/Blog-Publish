import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SmokeLayer } from '@/components/SmokeLayer';

export function NotFound() {
  return (
    <div className="relative mx-auto max-w-xl px-5 sm:px-8 py-28 text-center">
      <SmokeLayer />
      <div className="relative z-10">
        <p className="font-mono text-sm mb-6" style={{ color: 'var(--text-faint)' }}>
          404
        </p>
        <h1
          className="font-display font-bold text-3xl sm:text-4xl mb-4"
          style={{ color: 'var(--text)' }}
        >
          Nexus couldn't find that page.
        </h1>
        <p className="text-base mb-1" style={{ color: 'var(--text-muted)' }}>
          It looked everywhere.
        </p>
        <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>
          It is now pretending this never happened.
        </p>
        <Link
          to="/blog"
          className="glow-hover inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
          style={{ backgroundColor: 'var(--color-accent)', color: '#0b0d10' }}
        >
          <ArrowLeft size={15} />
          Back to blog
        </Link>
      </div>
    </div>
  );
}
