import type { BlogPost } from '@/types/post';

// Nexus backend base URL. Never hardcode localhost:3000 elsewhere —
// this is the only place that should read the env var.
const API_URL = import.meta.env.VITE_API_URL || '';

/** Raw shape returned by the Express/SQLite backend. */
interface ApiPost {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  published: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export class PostNotFoundError extends Error {
  constructor(slug: string) {
    super(`Post "${slug}" was not found.`);
    this.name = 'PostNotFoundError';
  }
}

function normalizePost(raw: ApiPost): BlogPost {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description ?? '',
    content: raw.content,
    cover_image: raw.cover_image,
    category: raw.category,
    published: Boolean(raw.published),
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    published_at: raw.published_at,
  };
}

/** SQLite datetimes come back as "YYYY-MM-DD HH:mm:ss" (no "T"/timezone). */
function toParsableDate(value: string): string {
  return value.includes(' ') && !value.includes('T')
    ? value.replace(' ', 'T')
    : value;
}

async function apiRequest<T>(path: string, notFoundSlug?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`);
  } catch {
    throw new Error(
      `Could not reach the Nexus API at ${API_URL}. Is the backend running?`
    );
  }

  if (response.status === 404) {
    throw new PostNotFoundError(notFoundSlug ?? path);
  }

  if (!response.ok) {
    throw new Error(`Nexus API request failed (${response.status}).`);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error('Received a malformed response from the Nexus API.');
  }
}

// --- Network calls -------------------------------------------------------

export async function getAllPosts(): Promise<BlogPost[]> {
  const raw = await apiRequest<ApiPost[]>('/api/posts');
  return raw
    .map(normalizePost)
    .sort(
      (a, b) =>
        new Date(toParsableDate(getPostDate(b))).getTime() -
        new Date(toParsableDate(getPostDate(a))).getTime()
    );
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const raw = await apiRequest<ApiPost>(
    `/api/posts/${encodeURIComponent(slug)}`,
    slug
  );
  return normalizePost(raw);
}

/** Convenience wrapper matching the old API shape. Prefer filtering an
 * already-fetched `getAllPosts()` result on pages that also need the
 * full category list, to avoid a second round trip. */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter(
    (p) => (p.category ?? '').toLowerCase() === category.toLowerCase()
  );
}

// --- Derived helpers (operate on an already-fetched posts array) ---------

export function getPostDate(post: BlogPost): string {
  return post.published_at ?? post.created_at;
}

export function getFeaturedPost(posts: BlogPost[]): BlogPost | undefined {
  return posts[0];
}

export function getRecentPosts(
  posts: BlogPost[],
  excludeSlug?: string,
  limit = 6
): BlogPost[] {
  return posts.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export function getAllCategories(posts: BlogPost[]): string[] {
  return Array.from(
    new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))
  );
}

export function getAdjacentPosts(
  posts: BlogPost[],
  slug: string
): { prev: BlogPost | null; next: BlogPost | null } {
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  };
}

export function getRelatedPosts(
  posts: BlogPost[],
  post: BlogPost,
  limit = 3
): BlogPost[] {
  const scored = posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score: p.category && p.category === post.category ? 1 : 0,
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const related = scored.slice(0, limit).map((s) => s.post);

  // Backfill with recent posts if there aren't enough related ones.
  if (related.length < limit) {
    for (const p of posts) {
      if (related.length >= limit) break;
      if (p.slug === post.slug) continue;
      if (related.find((r) => r.slug === p.slug)) continue;
      related.push(p);
    }
  }

  return related;
}

export function formatDate(value: string): string {
  const d = new Date(toParsableDate(value));
  return d
    .toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();
}
