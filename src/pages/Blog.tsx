import { useEffect, useState } from 'react';
import { FeaturedPost } from '@/components/FeaturedPost';
import { BlogCard } from '@/components/BlogCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { LoadingState, ErrorState } from '@/components/PageState';
import { getAllPosts, getFeaturedPost, getAllCategories } from '@/lib/posts';
import type { BlogPost } from '@/types/post';

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAllPosts()
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load posts.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = posts ? getFeaturedPost(posts) : undefined;
  const categories = posts ? getAllCategories(posts) : [];
  const recent = posts ? posts.filter((p) => p.slug !== featured?.slug) : [];

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-24">
      <header className="relative pt-14 sm:pt-20 pb-10">
        <svg
          className="absolute -top-2 right-0 opacity-[0.35] pointer-events-none hidden sm:block"
          width="180"
          height="120"
          viewBox="0 0 180 120"
          aria-hidden="true"
        >
          <g stroke="var(--color-accent)" strokeWidth="1" fill="none">
            <path d="M10 60 H60 V20 H140" />
            <path d="M10 90 H40 V100 H170" />
            <circle cx="140" cy="20" r="3" fill="var(--color-accent)" />
            <circle cx="170" cy="100" r="3" fill="var(--color-accent)" />
            <circle cx="10" cy="60" r="3" fill="var(--color-accent)" />
          </g>
        </svg>
        <h1
          className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-4"
          style={{ color: 'var(--text)' }}
        >
          BLOG
        </h1>
        <p className="text-base sm:text-lg max-w-lg" style={{ color: 'var(--text-muted)' }}>
          Things I build, break, fix, and occasionally pretend I understood
          the first time.
        </p>
      </header>

      {error ? (
        <ErrorState message={error} />
      ) : !posts ? (
        <LoadingState label="Loading posts" />
      ) : (
        <>
          {featured && (
            <section className="mb-14">
              <FeaturedPost post={featured} />
            </section>
          )}

          <section className="mb-8">
            <CategoryFilter categories={categories} />
          </section>

          <section aria-labelledby="recent-heading">
            <h2
              id="recent-heading"
              className="font-mono text-xs tracking-widest mb-6"
              style={{ color: 'var(--text-faint)' }}
            >
              RECENT WRITING
            </h2>
            {recent.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recent.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>
        </>
      )}
    </div>
  );
}

export function EmptyState() {
  return (
    <div
      className="rounded-xl border border-dashed p-10 text-center"
      style={{ borderColor: 'var(--border)' }}
    >
      <p className="font-display font-medium mb-1" style={{ color: 'var(--text)' }}>
        Nothing here yet.
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        The server is ready. The writer is not.
      </p>
    </div>
  );
}
