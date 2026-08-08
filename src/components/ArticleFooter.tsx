import { TagList } from "./TagList";

interface ArticleFooterProps {
  tags: string[];
}

export function ArticleFooter({ tags }: ArticleFooterProps) {
  return (
    <footer
      className="pt-8 mt-10 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
        That's it for this experiment. Thanks for reading this far. If you
        enjoyed it, great. If you didn't... well, at least my Samsung M31 got
        some traffic. Until next time,
      </p>
      <p className="font-display text-sm mb-6" style={{ color: "var(--text)" }}>
        — Raj (and Nexus, probably)
      </p>
      <p
        className="font-mono text-[11px] tracking-widest mb-2"
        style={{ color: "var(--text-faint)" }}
      >
        TAGS
      </p>
      <TagList tags={tags} />
    </footer>
  );
}
