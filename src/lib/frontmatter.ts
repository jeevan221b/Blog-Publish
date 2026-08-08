/**
 * A tiny, dependency-free YAML-ish frontmatter parser.
 * Handles the subset of YAML our post frontmatter actually uses:
 * strings, quoted strings, booleans, and simple string lists.
 * This keeps the client bundle small — important since Nexus
 * eventually serves this from a phone.
 */
export function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw };
  }
  const [, fmBlock, content] = match;
  const data: Record<string, unknown> = {};

  const lines = fmBlock.split('\n');
  let currentListKey: string | null = null;

  for (const line of lines) {
    if (/^\s*-\s+/.test(line) && currentListKey) {
      const item = line.replace(/^\s*-\s+/, '').trim();
      (data[currentListKey] as string[]).push(stripQuotes(item));
      continue;
    }

    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    const value = rawValue.trim();

    if (value === '') {
      // Might be the start of a list on following lines.
      currentListKey = key;
      data[key] = [];
      continue;
    }

    currentListKey = null;
    if (value === 'true' || value === 'false') {
      data[key] = value === 'true';
    } else if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => stripQuotes(s.trim()))
        .filter(Boolean);
    } else {
      data[key] = stripQuotes(value);
    }
  }

  return { data, content: content.trim() };
}

function stripQuotes(s: string): string {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}
