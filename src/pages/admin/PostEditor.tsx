import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ArticleContent } from "@/components/ArticleContent";
import { LoadingState, ErrorState } from "@/components/PageState";
import {
  fetchAllPostsAdmin,
  fetchPostBySlugAdmin,
  createPost,
  updatePost,
  deletePost,
  uploadCoverImage,
  type PostInput,
} from "@/lib/adminApi";
import { getAllCategories } from "@/lib/posts";
import { estimateReadTime } from "@/lib/readTime";
import { AuthError } from "@/lib/auth";
import { useToast } from "@/hooks/useToast";
import { ConfirmDialog } from "@/components/ConfirmDialog";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const inputStyle = {
  borderColor: "var(--border)",
  backgroundColor: "var(--bg-inset)",
  color: "var(--text)",
};

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label
          htmlFor={htmlFor}
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </label>
        {hint && (
          <span
            className="font-mono text-[10px]"
            style={{ color: "var(--text-faint)" }}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function PostEditor() {
  const { slug: slugParam } = useParams<{ slug?: string }>();
  const isEditing = Boolean(slugParam);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    isEditing ? "loading" : "ready",
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageMode, setCoverImageMode] = useState<"link" | "upload">("link");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Suggestions for the category field — best-effort, never blocks the editor.
  useEffect(() => {
    let cancelled = false;
    fetchAllPostsAdmin()
      .then((posts) => {
        if (!cancelled) setCategoryOptions(getAllCategories(posts));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isEditing || !slugParam) return;
    let cancelled = false;
    setStatus("loading");
    fetchPostBySlugAdmin(slugParam)
      .then((post) => {
        if (cancelled) return;
        setTitle(post.title);
        setSlug(post.slug);
        setDescription(post.description ?? "");
        setContent(post.content);
        setCoverImage(post.cover_image ?? "");
        setCategory(post.category ?? "");
        setPublished(post.published);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof AuthError) {
          navigate("/admin/login", { replace: true });
          return;
        }
        setLoadError(
          err instanceof Error ? err.message : "Failed to load post.",
        );
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [isEditing, slugParam, navigate]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing && !slugEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleCoverImageFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    setUploadingImage(true);
    try {
      const url = await uploadCoverImage(file);
      setCoverImage(url);
    } catch (err) {
      if (err instanceof AuthError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload image.",
      );
    } finally {
      setUploadingImage(false);
    }
  }

  const canSave = title.trim() !== "" && slug.trim() !== "" && content.trim() !== "";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSave || saving) return;

    setSaving(true);

    try {
      const input: PostInput = {
        slug,
        title: title.trim(),
        description: description.trim() || null,
        content,
        cover_image: coverImage.trim() || null,
        category: category.trim() || null,
        published,
      };

      if (isEditing && slugParam) {
        await updatePost(slugParam, input);
        showToast("success", "Blog edited.");
      } else {
        await createPost(input);
        showToast(
          "success",
          published ? "Post published." : "Post saved as draft.",
        );
      }
      navigate("/admin");
    } catch (err) {
      if (err instanceof AuthError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to save post.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!slugParam) return;

    setDeleting(true);
    try {
      await deletePost(slugParam);
      showToast("success", "Post deleted.");
      navigate("/admin", { replace: true });
    } catch (err) {
      if (err instanceof AuthError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to delete post.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <LoadingState label="Loading post" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <ErrorState message={loadError ?? undefined} />
          <div className="mt-4">
            <Link
              to="/admin"
              className="text-sm underline"
              style={{ color: "var(--color-accent)" }}
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <form onSubmit={handleSubmit}>
        {/* Header bar */}
        <div
          className="sticky top-0 z-10 border-b backdrop-blur"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "color-mix(in srgb, var(--bg) 88%, transparent)",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/admin"
                className="shrink-0 inline-flex items-center gap-1.5 text-sm"
                style={{ color: "var(--text-faint)" }}
              >
                <ArrowLeft size={14} />
              </Link>
              <div className="min-w-0">
                <p
                  className="font-mono text-[10px] tracking-widest"
                  style={{ color: "var(--text-faint)" }}
                >
                  {isEditing ? "EDIT POST" : "NEW POST"}
                </p>
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--text)" }}
                >
                  {title || "Untitled post"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                role="switch"
                aria-checked={published}
                onClick={() => setPublished((p) => !p)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0"
                style={{
                  backgroundColor: published
                    ? "var(--color-online)"
                    : "var(--border)",
                }}
              >
                <span
                  className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
                  style={{
                    transform: published ? "translateX(22px)" : "translateX(4px)",
                  }}
                />
              </button>
              <span
                className="font-mono text-[10px] tracking-widest hidden sm:inline"
                style={{
                  color: published ? "var(--color-online)" : "var(--color-led)",
                }}
              >
                {published ? "PUBLISHED" : "DRAFT"}
              </span>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  disabled={deleting}
                  className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--color-danger)",
                  }}
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              )}

              <button
                type="submit"
                disabled={!canSave || saving}
                className="rounded-lg px-4 py-1.5 text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: "var(--color-accent)", color: "#0b0d10" }}
              >
                {saving ? "Saving…" : isEditing ? "Save changes" : "Create post"}
              </button>
            </div>
          </div>
        </div>

        {/* Meta fields */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="sm:col-span-2">
              <Field label="Title" htmlFor="title">
                <input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="w-full rounded-lg border px-3 py-2 text-base font-display font-medium outline-none"
                  style={inputStyle}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Slug" htmlFor="slug" hint={isEditing ? "locked" : undefined}>
                <input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(slugify(e.target.value));
                  }}
                  disabled={isEditing}
                  required
                  className="w-full rounded-lg border px-3 py-2 text-sm font-mono outline-none disabled:opacity-60"
                  style={inputStyle}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Description" htmlFor="description">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Category" htmlFor="category">
              <input
                id="category"
                list="category-options"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={inputStyle}
              />
              <datalist id="category-options">
                {categoryOptions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Cover image" htmlFor="cover_image">
                <div className="flex flex-col gap-2">
                  <div
                    className="inline-flex self-start rounded-lg border p-0.5 text-xs font-mono"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setCoverImageMode("link")}
                      className="px-3 py-1 rounded-md"
                      style={{
                        backgroundColor:
                          coverImageMode === "link" ? "var(--bg-inset)" : "transparent",
                        color:
                          coverImageMode === "link" ? "var(--text)" : "var(--text-faint)",
                      }}
                    >
                      Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverImageMode("upload")}
                      className="px-3 py-1 rounded-md"
                      style={{
                        backgroundColor:
                          coverImageMode === "upload" ? "var(--bg-inset)" : "transparent",
                        color:
                          coverImageMode === "upload" ? "var(--text)" : "var(--text-faint)",
                      }}
                    >
                      Upload
                    </button>
                  </div>

                  {coverImageMode === "link" ? (
                    <input
                      id="cover_image"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://…"
                      className="w-full rounded-lg border px-3 py-2 text-sm font-mono outline-none"
                      style={inputStyle}
                    />
                  ) : (
                    <input
                      id="cover_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCoverImageFile(e.target.files?.[0])}
                      disabled={uploadingImage}
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none disabled:opacity-60"
                      style={inputStyle}
                    />
                  )}

                  {uploadingImage && (
                    <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                      Uploading…
                    </p>
                  )}
                  {uploadError && (
                    <p className="text-xs" style={{ color: "var(--color-danger)" }} role="alert">
                      {uploadError}
                    </p>
                  )}

                  {coverImage && (
                    <div
                      className="flex items-center gap-3 rounded-lg border p-2"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <img
                        src={coverImage}
                        alt="Cover preview"
                        className="h-14 w-24 rounded-md object-cover shrink-0"
                        style={{ backgroundColor: "var(--bg-inset)" }}
                      />
                      <p
                        className="text-xs font-mono truncate"
                        style={{ color: "var(--text-faint)" }}
                      >
                        {coverImage}
                      </p>
                      <button
                        type="button"
                        onClick={() => setCoverImage("")}
                        className="ml-auto shrink-0 text-xs"
                        style={{ color: "var(--color-danger)" }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </Field>
            </div>
          </div>

          {/* Content: write + live preview */}
          <div className="flex items-center justify-between mb-2">
            <p
              className="font-mono text-xs tracking-widest"
              style={{ color: "var(--text-faint)" }}
            >
              CONTENT (MARKDOWN)
            </p>
            <div className="flex items-center gap-4">
              <span
                className="font-mono text-[10px] hidden sm:inline"
                style={{ color: "var(--text-faint)" }}
              >
                {content.trim() ? estimateReadTime(content) : "0 min read"}
              </span>
              <div
                className="flex lg:hidden rounded-lg border p-0.5 text-xs font-mono"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className="px-3 py-1 rounded-md"
                  style={{
                    backgroundColor:
                      activeTab === "write" ? "var(--bg-inset)" : "transparent",
                    color: activeTab === "write" ? "var(--text)" : "var(--text-faint)",
                  }}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className="px-3 py-1 rounded-md"
                  style={{
                    backgroundColor:
                      activeTab === "preview" ? "var(--bg-inset)" : "transparent",
                    color: activeTab === "preview" ? "var(--text)" : "var(--text-faint)",
                  }}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className={activeTab === "preview" ? "hidden lg:block" : "block"}>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                spellCheck={false}
                className="w-full rounded-xl border px-4 py-3 text-sm font-mono leading-relaxed outline-none resize-none"
                style={{ ...inputStyle, height: "70vh" }}
              />
            </div>

            <div className={activeTab === "write" ? "hidden lg:block" : "block"}>
              <div
                className="rounded-xl border overflow-y-auto"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-elevated)",
                  height: "70vh",
                }}
              >
                {content.trim() ? (
                  <div className="px-5 py-4">
                    <ArticleContent content={content} />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>
                      Nothing to preview yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmingDelete}
        title={`Delete "${slug}"?`}
        description="This can't be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
