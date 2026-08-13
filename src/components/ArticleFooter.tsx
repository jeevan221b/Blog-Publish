export function ArticleFooter() {
  return (
    <footer
      className="pt-8 mt-10 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
        You made it this far. Might as well come back.
      </p>
      <p className="font-display text-sm" style={{ color: "var(--text)" }}>
        — Raj
      </p>
    </footer>
  );
}
