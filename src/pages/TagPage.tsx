import { Link, useParams } from 'react-router-dom';
import { BlogCard } from '@/components/BlogCard';
import { EmptyState } from './Blog';
import { getPostsByTag } from '@/lib/posts';

export function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const posts = tag ? getPostsByTag(tag) : [];

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

      {posts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
