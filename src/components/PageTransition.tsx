import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

/**
 * Replays a short fade / rise / un-blur whenever the route changes by
 * remounting its subtree on pathname change. Under reduced motion the
 * `page-in` animation collapses to ~0ms via the global media query, so
 * this stays inert without extra branching.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-in">
      {children}
    </div>
  );
}
