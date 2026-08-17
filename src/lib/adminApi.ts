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

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // keep in sync with the BE limit

/**
 * Uploads a local image file for use as a post cover image and returns the
 * hosted URL to store on the post. Kept separate from create/update so the
 * post payload always deals in plain `cover_image` URL strings, whether the
 * image was pasted as a link or uploaded from disk.
 */
export async function uploadCoverImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large (max 5MB).");
  }

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(`${API_URL}/api/admin/uploads`, {
    method: "POST",
    // No Content-Type here — the browser sets the multipart boundary itself.
    headers: authHeaders(),
    body,
  });
  const data = await handleAuthedResponse<{ url: string }>(response);
  return data.url;
}
