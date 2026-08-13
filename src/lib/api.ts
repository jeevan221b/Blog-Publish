import type { BlogPost } from "@/types/post";
import { API_URL } from "./config";

export async function fetchPosts(): Promise<BlogPost[]> {
  const response = await fetch(`${API_URL}/api/posts`);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  return response.json();
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost> {
  const response = await fetch(
    `${API_URL}/api/posts/${encodeURIComponent(slug)}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Post not found");
    }

    throw new Error(`Failed to fetch post: ${response.status}`);
  }

  return response.json();
}
