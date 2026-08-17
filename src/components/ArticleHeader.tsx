import { Link } from 'react-router-dom';
import type { BlogPost } from '@/types/post';
import { formatDate, getPostDate } from '@/lib/posts';
import { estimateReadTime } from '@/lib/readTime';
import { CoverImage } from './CoverImage';

interface ArticleHeaderProps {
  post: BlogPost;
}

export function ArticleHeader({ post }: ArticleHeaderProps) {
  return (
    <header className="max-w-[760px] mx-auto px-5 sm:px-0 pt-10 sm:pt-14 pb-8">
      <div className="flex items-center gap-3 mb-5">
        {post.category && (
          <Link
            to={`/blog/category/${post.category}`}
            className="font-mono text-[10px] tracking-widest px-2 py-1 rounded"
            style={{
              color: 'var(--color-accent)',
              backgroundColor: 'color-mix(in srgb, var(--color-accent) 12%, transparent)',
            }}
          >
            {post.category.toUpperCase()}
          </Link>
        )}
        <span className="font-mono text-[11px]" style={{ color: 'var(--text-faint)' }}>
          ARTICLE
        </span>
      </div>

      <h1
        className="font-display font-bold text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.12] mb-4"
        style={{ color: 'var(--text)' }}
      >
        {post.title}
      </h1>

      <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
        {post.description}
      </p>

      <p className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
        {formatDate(getPostDate(post))} · {estimateReadTime(post.content).toUpperCase()}
      </p>

      {post.cover_image && (
        <div
          className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border sm:aspect-[21/9]"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-inset)' }}
        >
          <CoverImage src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}
    </header>
  );
}
