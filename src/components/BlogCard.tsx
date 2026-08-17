import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { BlogPost } from '@/types/post';
import { formatDate, getPostDate } from '@/lib/posts';
import { estimateReadTime } from '@/lib/readTime';
import { CoverImage } from './CoverImage';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col h-full rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
    >
      {post.cover_image && (
        <div className="aspect-video w-full shrink-0 overflow-hidden" style={{ backgroundColor: 'var(--bg-inset)' }}>
          <CoverImage
            src={post.cover_image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-mono text-[10px] tracking-widest px-2 py-1 rounded"
            style={{ color: 'var(--color-accent)', backgroundColor: 'color-mix(in srgb, var(--color-accent) 12%, transparent)' }}
          >
            {(post.category ?? 'UNCATEGORIZED').toUpperCase()}
          </span>
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: 'var(--text-faint)' }}
            aria-hidden="true"
          />
        </div>

        <h3 className="font-display text-lg font-semibold leading-snug mb-2" style={{ color: 'var(--text)' }}>
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
          {post.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: 'var(--border-soft)' }}>
          <span className="font-mono text-[11px]" style={{ color: 'var(--text-faint)' }}>
            {formatDate(getPostDate(post))} · {estimateReadTime(post.content)}
          </span>
        </div>
      </div>
    </Link>
  );
}
