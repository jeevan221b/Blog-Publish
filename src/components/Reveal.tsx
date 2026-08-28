import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type RevealTag = 'div' | 'section' | 'article' | 'ul' | 'li' | 'aside';

interface RevealProps {
  children: ReactNode;
  /** Element to render as the wrapper. Defaults to a <div>. */
  as?: RevealTag;
  /** Extra classes merged onto the wrapper. */
  className?: string;
  /** Stagger, in ms, before this element animates in once visible. */
  delay?: number;
  /** Fraction of the element that must be visible before it reveals. */
  threshold?: number;
  /** Forwarded to the wrapper element (e.g. for in-page anchors). */
  id?: string;
}

/**
 * Fades + rises + un-blurs its children the first time they scroll into
 * view. Renders children visible up-front (no hidden state) when reduced
 * motion is requested or IntersectionObserver is unavailable, so content
 * is never trapped invisible.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  threshold = 0.15,
  id,
}: RevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  const supported =
    typeof window !== 'undefined' && 'IntersectionObserver' in window;
  const [visible, setVisible] = useState(reducedMotion || !supported);
  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (visible) return;
    const node = nodeRef.current;
    if (!node) return;

    // If the element is already within the viewport on mount, reveal it
    // straight away. IntersectionObserver's first callback can be dropped
    // when StrictMode mounts, unmounts and remounts in quick succession,
    // which would otherwise leave above-the-fold content stuck hidden.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, threshold]);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        nodeRef.current = node;
      }}
      id={id}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={
        delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  );
}
