import { Link } from 'react-router-dom';

interface CategoryFilterProps {
  categories: string[];
  active?: string; // undefined = "all"
}

export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  const isAll = !active;

  return (
    <nav
      className="flex flex-wrap items-center gap-2 font-mono text-xs"
      aria-label="Filter by category"
    >
      <Link
        to="/blog"
        aria-current={isAll ? 'page' : undefined}
        className="px-3 py-1.5 rounded-full border transition-colors"
        style={{
          borderColor: isAll ? 'var(--color-accent)' : 'var(--border)',
          color: isAll ? 'var(--color-accent)' : 'var(--text-muted)',
          backgroundColor: isAll
            ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)'
            : 'transparent',
        }}
      >
        ALL
      </Link>
      {categories.map((cat) => {
        const isActive = active?.toLowerCase() === cat.toLowerCase();
        return (
          <Link
            key={cat}
            to={`/blog/category/${cat}`}
            aria-current={isActive ? 'page' : undefined}
            className="px-3 py-1.5 rounded-full border transition-colors"
            style={{
              borderColor: isActive ? 'var(--color-accent)' : 'var(--border)',
              color: isActive ? 'var(--color-accent)' : 'var(--text-muted)',
              backgroundColor: isActive
                ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)'
                : 'transparent',
            }}
          >
            {cat.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
