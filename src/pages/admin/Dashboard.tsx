import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { BlogPost } from "@/types/post";
import { fetchAllPostsAdmin, deletePost } from "@/lib/adminApi";
import { AuthError, logout } from "@/lib/auth";
import { LoadingState, ErrorState } from "@/components/PageState";

export function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const navigate = useNavigate();

  async function loadPosts() {
    setError(null);
    try {
      const data = await fetchAllPostsAdmin();
      setPosts(data);
    } catch (err) {
      if (err instanceof AuthError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load posts.");
    }
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm(`Delete "${slug}"? This can't be undone.`)) return;

    setDeletingSlug(slug);
    try {
      await deletePost(slug);
      setPosts((prev) => prev?.filter((p) => p.slug !== slug) ?? null);
    } catch (err) {
      if (err instanceof AuthError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      alert(err instanceof Error ? err.message : "Failed to delete post.");
    } finally {
      setDeletingSlug(null);
    }
  }

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p
              className="font-mono text-xs tracking-widest mb-1"
              style={{ color: "var(--text-faint)" }}
            >
              NEXUS ADMIN
            </p>
            <h1
              className="font-display font-bold text-2xl"
              style={{ color: "var(--text)" }}
            >
              Posts
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/posts/new"
              className="rounded-lg px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#0b0d10",
              }}
            >
              New post
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg border px-4 py-2 text-sm"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Log out
            </button>
          </div>
        </div>

        {posts === null && !error && <LoadingState label="Loading posts" />}
        {error && <ErrorState message={error} />}

        {posts && posts.length === 0 && (
          <div
            className="rounded-xl border border-dashed p-10 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No posts yet. Create your first one.
            </p>
          </div>
        )}

        {posts && posts.length > 0 && (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-xl border p-4 flex items-center justify-between gap-4"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-mono text-[10px] tracking-widest px-1.5 py-0.5 rounded"
                      style={{
                        color: post.published
                          ? "var(--color-online)"
                          : "var(--color-led)",
                        backgroundColor: post.published
                          ? "color-mix(in srgb, var(--color-online) 15%, transparent)"
                          : "color-mix(in srgb, var(--color-led) 15%, transparent)",
                      }}
                    >
                      {post.published ? "PUBLISHED" : "DRAFT"}
                    </span>
                    <span
                      className="font-mono text-xs truncate"
                      style={{ color: "var(--text-faint)" }}
                    >
                      {post.slug}
                    </span>
                  </div>
                  <p
                    className="font-display font-medium truncate"
                    style={{ color: "var(--text)" }}
                  >
                    {post.title}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/admin/posts/${encodeURIComponent(post.slug)}/edit`}
                    className="rounded-lg border px-3 py-1.5 text-sm"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    disabled={deletingSlug === post.slug}
                    className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--color-danger)",
                    }}
                  >
                    {deletingSlug === post.slug ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
