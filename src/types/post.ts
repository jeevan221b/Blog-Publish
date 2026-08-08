export interface BlogPostFrontmatter {
  title: string;
  description: string;
  date: string; // ISO date, e.g. "2026-08-08"
  category: string;
  tags: string[];
  readTime?: string;
  featured?: boolean;
  image?: string;
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  content: string; // raw markdown body
  readTime: string; // always resolved, computed if not provided
}

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}
