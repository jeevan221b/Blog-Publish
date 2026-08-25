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

export interface ActivityEvent {
  type: "session_start" | "post_view" | "session_end";
  postSlug: string | null;
  postTitle: string | null;
  createdAt: string;
}

export interface ActivitySession {
  sessionId: string;
  startedAt: string;
  lastSeenAt: string;
  endedAt: string | null;
  active: boolean;
  tag: string | null;
  events: ActivityEvent[];
}

/** Sessions come back newest-first, each session's events chronological. */
export async function fetchActivitySessions(): Promise<ActivitySession[]> {
  const response = await fetch(`${API_URL}/api/admin/activity/sessions`, {
    headers: authHeaders(),
  });
  return handleAuthedResponse<ActivitySession[]>(response);
}

/** Thrown when a tag is rejected by the server (currently: over 40 chars). */
export class TagValidationError extends Error {}

/** Thrown when the session has aged out of the retention window (404). */
export class SessionGoneError extends Error {
  constructor(message = "This session is no longer available.") {
    super(message);
    this.name = "SessionGoneError";
  }
}

/** Sets or clears (pass null) the admin's own label for a visitor session. */
export async function updateSessionTag(
  sessionId: string,
  tag: string | null,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/admin/activity/sessions/${encodeURIComponent(sessionId)}/tag`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ tag }),
    },
  );

  if (response.status === 401) {
    logout();
    throw new AuthError();
  }
  if (response.status === 204) return;
  if (response.status === 400) {
    const data = await response.json().catch(() => null);
    throw new TagValidationError(
      data?.error ?? "Tag is too long (max 40 characters).",
    );
  }
  if (response.status === 404) {
    throw new SessionGoneError();
  }
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? `Request failed: ${response.status}`);
  }
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
