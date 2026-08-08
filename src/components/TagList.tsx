import { Link } from 'react-router-dom';

interface TagListProps {
  tags: string[];
  className?: string;
}

export function TagList({ tags, className = '' }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Link
          key={tag}
          to={`/blog/tag/${tag}`}
          className="font-mono text-[11px] px-2 py-1 rounded border transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
