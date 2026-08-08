import type { TocItem } from '@/types/post';

// Mirrors github-slugger's basic behavior (used internally by rehype-slug)
// closely enough for our heading text: lowercase, strip punctuation,
// collapse whitespace to hyphens, dedupe.
function slugify(text: string, seen: Map<string, number>): string {
  let base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  if (count > 0) base = `${base}-${count}`;
  return base;
}

export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];
  const seen = new Map<string, number>();
  let inCodeFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);

    if (h2) {
      const text = h2[1].trim();
      items.push({ id: slugify(text, seen), text, depth: 2 });
    } else if (h3) {
      const text = h3[1].trim();
      items.push({ id: slugify(text, seen), text, depth: 3 });
    }
  }

  return items;
}
