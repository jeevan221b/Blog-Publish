/**
 * Backend doesn't provide a read-time field, so we estimate it
 * client-side from the markdown content. ~200 words per minute,
 * always rounding up to at least 1 minute.
 */
export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
