import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        <div className="flex flex-col items-center text-center gap-3">
          <p
            className="font-mono text-[11px] tracking-widest"
            style={{ color: 'var(--text-faint)' }}
          >
            THIS WEBSITE IS SELF-HOSTED
          </p>
          <p
            className="font-display text-sm font-medium flex items-center gap-1.5"
            style={{ color: 'var(--text)' }}
          >
            <span aria-hidden="true">⚡</span> Served by NEXUS — Samsung M31 · Termux · Nginx
          </p>
          <p className="text-xs max-w-sm" style={{ color: 'var(--text-muted)' }}>
            No fancy cloud infrastructure was harmed in the making of this website.
          </p>
        </div>

        <div
          className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: 'var(--border-soft)', color: 'var(--text-faint)' }}
        >
          <span>© {new Date().getFullYear()} Raj Diwakar. Built, broken, and rebuilt.</span>
          <nav className="flex items-center gap-4" aria-label="Footer">
            <Link
              to="/admin"
              aria-label="Admin"
              title="Admin"
              className="inline-flex items-center gap-1 hover:underline"
              style={{ color: 'var(--text-faint)' }}
            >
              <Lock size={12} aria-hidden="true" />
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
