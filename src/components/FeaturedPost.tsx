import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types/post';
import { formatDate, getPostDate } from '@/lib/posts';
import { estimateReadTime } from '@/lib/readTime';
import { CoverImage } from './CoverImage';

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glow-hover group relative block rounded-2xl border overflow-hidden"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
    >
      <div className="grid md:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 sm:p-9 flex flex-col justify-center order-2 md:order-1">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="font-mono text-[10px] tracking-widest px-2 py-1 rounded"
              style={{
                color: 'var(--color-accent)',
                backgroundColor: 'color-mix(in srgb, var(--color-accent) 12%, transparent)',
              }}
            >
              {(post.category ?? 'UNCATEGORIZED').toUpperCase()}
            </span>
            <span className="font-mono text-[11px]" style={{ color: 'var(--text-faint)' }}>
              LATEST
            </span>
          </div>

          <h2
            className="font-display text-2xl sm:text-3xl font-bold leading-tight mb-3"
            style={{ color: 'var(--text)' }}
          >
            {post.title}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
            {post.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
              {formatDate(getPostDate(post))} · {estimateReadTime(post.content)}
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: 'var(--color-accent)' }}
            >
              Read article
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>

        <div
          className="relative order-1 md:order-2 min-h-[180px]"
          style={{ backgroundColor: 'var(--bg-inset)' }}
        >
          {post.cover_image ? (
            <CoverImage
              src={post.cover_image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[180px] items-center justify-center p-8">
              <PhoneServerGraphic />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function PhoneServerGraphic() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-32 h-32 sm:w-40 sm:h-40"
      role="img"
      aria-label="Illustration of a phone acting as a server"
    >
      <rect
        x="70"
        y="20"
        width="60"
        height="140"
        rx="10"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
      />
      <rect x="80" y="34" width="40" height="94" rx="2" fill="var(--color-accent)" opacity="0.12" />
      <circle cx="100" cy="148" r="3" fill="var(--color-accent)" />
      <g stroke="var(--text-faint)" strokeWidth="1.5" opacity="0.6">
        <path d="M40 60 H70" />
        <path d="M40 100 H70" />
        <path d="M40 140 H70" />
        <path d="M130 60 H160" />
        <path d="M130 100 H160" />
        <path d="M130 140 H160" />
      </g>
      <g fill="var(--text-faint)" opacity="0.6">
        <circle cx="36" cy="60" r="3" />
        <circle cx="36" cy="100" r="3" />
        <circle cx="36" cy="140" r="3" />
        <circle cx="164" cy="60" r="3" />
        <circle cx="164" cy="100" r="3" />
        <circle cx="164" cy="140" r="3" />
      </g>
      <text
        x="100"
        y="90"
        textAnchor="middle"
        className="font-mono"
        fontSize="9"
        fill="var(--color-accent)"
      >
        NGINX
      </text>
      <text
        x="100"
        y="105"
        textAnchor="middle"
        className="font-mono"
        fontSize="7"
        fill="var(--text-faint)"
      >
        M31
      </text>
    </svg>
  );
}
