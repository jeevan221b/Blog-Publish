import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlogCard } from '@/components/BlogCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { LoadingState, ErrorState } from '@/components/PageState';
import { EmptyState } from './Blog';
import { getAllPosts, getAllCategories } from '@/lib/posts';
import type { BlogPost } from '@/types/post';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
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

  const categories = posts ? getAllCategories(posts) : [];
  const filtered =
    posts && category
      ? posts.filter((p) => (p.category ?? '').toLowerCase() === category.toLowerCase())
      : [];

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-24">
      <header className="pt-14 sm:pt-20 pb-10">
        <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>
          CATEGORY
        </p>
        <h1
          className="font-display font-bold text-4xl sm:text-5xl tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          {category?.replace(/-/g, ' ').toUpperCase()}
        </h1>
      </header>

      <section className="mb-10">
        <CategoryFilter categories={categories} active={category} />
      </section>

      {error ? (
        <ErrorState message={error} />
      ) : !posts ? (
        <LoadingState label="Loading posts" />
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
