import { API_URL } from "./config";

const TOKEN_KEY = "nexus_admin_token";

/** Thrown when a request fails because the stored token is missing, invalid, or expired. */
export class AuthError extends Error {
  constructor(message = "Not authenticated.") {
    super(message);
    this.name = "AuthError";
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(password: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? `Login failed: ${response.status}`);
  }

  const data = await response.json();
  localStorage.setItem(TOKEN_KEY, data.token);
}

/** Authorization header for authenticated requests, or {} if not logged in. */
export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
