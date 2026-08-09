import type { BlogPost } from '@/types/post';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchPosts(): Promise<BlogPost[]> {
  const response = await fetch(`${API_URL}/api/posts`);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  return response.json();
}

export async function fetchPostBySlug(
  slug: string,
): Promise<BlogPost> {
  const response = await fetch(
    `${API_URL}/api/posts/${encodeURIComponent(slug)}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Post not found');
    }

    throw new Error(`Failed to fetch post: ${response.status}`);
  }

  return response.json();
}
