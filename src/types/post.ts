export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  cover_image: string | null;
  category: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}
