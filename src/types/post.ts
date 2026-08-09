// Matches the shape returned by the Nexus blog backend
// (GET /api/posts, GET /api/posts/:slug).
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string; // raw markdown body
  cover_image: string | null;
  category: string | null;
  published: boolean;
  created_at: string; // e.g. "2026-08-09 10:00:00"
  updated_at: string;
  published_at: string | null;
}

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}
