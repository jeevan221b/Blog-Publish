import { useParams } from 'react-router-dom';
import { BlogCard } from '@/components/BlogCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { EmptyState } from './Blog';
import { getPostsByCategory, getAllCategories } from '@/lib/posts';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const posts = category ? getPostsByCategory(category) : [];
  const categories = getAllCategories();

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
