import { useState, type CSSProperties } from 'react';

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Cover images can come from anywhere (a pasted link or an upload) — this
 * renders nothing rather than a broken-image icon if the URL 404s or the
 * link rots, so callers can lay out around it unconditionally.
 */
export function CoverImage({ src, alt, className, style }: CoverImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) return null;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      className={className}
      style={style}
    />
  );
}
