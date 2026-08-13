import type { BlogPost } from "@/types/post";
import { authHeaders, AuthError, logout } from "./auth";
import { API_URL } from "./config";

export interface PostInput {
  slug: string;
  title: string;
  description?: string | null;
  content: string;
  cover_image?: string | null;
  category?: string | null;
  published?: boolean;
}

async function handleAuthedResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    // Stored token is missing/invalid/expired — clear it so the UI knows to re-prompt login.
    logout();
    throw new AuthError();
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function fetchAllPostsAdmin(): Promise<BlogPost[]> {
  const response = await fetch(`${API_URL}/api/admin/posts`, {
    headers: authHeaders(),
  });
  return handleAuthedResponse<BlogPost[]>(response);
}

export async function fetchPostBySlugAdmin(slug: string): Promise<BlogPost> {
  const response = await fetch(
    `${API_URL}/api/admin/posts/${encodeURIComponent(slug)}`,
    { headers: authHeaders() },
  );
  return handleAuthedResponse<BlogPost>(response);
}

export async function createPost(input: PostInput): Promise<BlogPost> {
  const response = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
  return handleAuthedResponse<BlogPost>(response);
}

export async function updatePost(
  slug: string,
  input: Partial<PostInput>,
): Promise<BlogPost> {
  const response = await fetch(
    `${API_URL}/api/posts/${encodeURIComponent(slug)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(input),
    },
  );
  return handleAuthedResponse<BlogPost>(response);
}

export async function deletePost(slug: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/posts/${encodeURIComponent(slug)}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  return handleAuthedResponse<void>(response);
}
