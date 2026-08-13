import { Link, useParams } from "react-router-dom";

export function PostEditor() {
  const { slug } = useParams();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div
        className="w-full max-w-md rounded-xl border border-dashed p-10 text-center"
        style={{ borderColor: "var(--border)" }}
      >
        <p
          className="font-mono text-xs tracking-widest mb-2"
          style={{ color: "var(--text-faint)" }}
        >
          {slug ? `EDITING: ${slug}` : "NEW POST"}
        </p>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          The post editor is coming next.
        </p>
        <Link
          to="/admin"
          className="text-sm underline"
          style={{ color: "var(--color-accent)" }}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
