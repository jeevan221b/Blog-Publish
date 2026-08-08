import { parseFrontmatter } from './frontmatter';
import type { BlogPost, BlogPostFrontmatter } from '@/types/post';

// Vite auto-discovers every markdown file dropped into content/posts —
// adding a new .md file is enough to make it appear everywhere.
const rawPosts = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.md$/, '');
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function loadPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, raw] of Object.entries(rawPosts)) {
    const { data, content } = parseFrontmatter(raw);
    const fm = data as unknown as BlogPostFrontmatter;
    const slug = slugFromPath(path);

    if (!fm.title || !fm.date) {
      // Skip malformed posts rather than crash the whole site.
      console.warn(`[nexus] Skipping post "${slug}": missing title or date.`);
      continue;
    }

    posts.push({
      slug,
      title: fm.title,
      description: fm.description ?? '',
      date: fm.date,
      category: fm.category ?? 'uncategorized',
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      readTime: fm.readTime ?? estimateReadTime(content),
      featured: Boolean(fm.featured),
      image: fm.image,
      content,
    });
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export const allPosts: BlogPost[] = loadPosts();

export function getFeaturedPost(): BlogPost | undefined {
  return allPosts.find((p) => p.featured) ?? allPosts[0];
}

export function getRecentPosts(excludeSlug?: string, limit = 6): BlogPost[] {
  return allPosts.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return allPosts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getPostsByTag(tag: string): BlogPost[] {
  return allPosts.filter((p) =>
    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllCategories(): string[] {
  return Array.from(new Set(allPosts.map((p) => p.category)));
}

export function getAllTags(): string[] {
  return Array.from(new Set(allPosts.flatMap((p) => p.tags)));
}

export function getAdjacentPosts(slug: string): {
  prev: BlogPost | null;
  next: BlogPost | null;
} {
  const idx = allPosts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < allPosts.length - 1 ? allPosts[idx + 1] : null,
    next: idx > 0 ? allPosts[idx - 1] : null,
  };
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const scored = allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 2;
      score += p.tags.filter((t) => post.tags.includes(t)).length;
      return { post: p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const related = scored.slice(0, limit).map((s) => s.post);

  // Backfill with recent posts if there aren't enough related ones.
  if (related.length < limit) {
    for (const p of allPosts) {
      if (related.length >= limit) break;
      if (p.slug === post.slug) continue;
      if (related.find((r) => r.slug === p.slug)) continue;
      related.push(p);
    }
  }

  return related;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();
}
