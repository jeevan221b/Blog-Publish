import { Link, useParams } from 'react-router-dom';
import { EmptyState } from './Blog';

// The Nexus backend doesn't provide tag data (posts only carry a
// single `category`), so this page no longer filters real posts.
// The route is kept alive so existing /blog/tag/:tag links don't 404.
export function TagPage() {
  const { tag } = useParams<{ tag: string }>();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-24">
      <header className="pt-14 sm:pt-20 pb-10">
        <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>
          TAG
        </p>
        <h1
          className="font-display font-bold text-4xl sm:text-5xl tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          #{tag}
        </h1>
        <Link
          to="/blog"
          className="inline-block mt-4 text-sm"
          style={{ color: 'var(--color-accent)' }}
        >
          ← Back to all posts
        </Link>
      </header>

      <EmptyState />
    </div>
  );
}
