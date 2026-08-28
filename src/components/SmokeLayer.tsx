import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface SmokeLayerProps {
  /**
   * When true, a soft accent glow trails the pointer across the layer's
   * containing block (desktop / fine-pointer devices only).
   */
  pointerGlow?: boolean;
  className?: string;
}

/**
 * Decorative drifting-smoke backdrop. Render it as the first child of a
 * `position: relative` container and give the real content a higher
 * stacking context (`relative z-10`). Renders nothing when the user has
 * asked for reduced motion.
 */
export function SmokeLayer({ pointerGlow = false, className = '' }: SmokeLayerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const glowRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion || !pointerGlow) return;
    if (!window.matchMedia?.('(pointer: fine)').matches) return;

    const layer = layerRef.current;
    const glow = glowRef.current;
    if (!layer || !glow) return;

    let raf = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let active = false;

    const onMove = (e: PointerEvent) => {
      const rect = layer.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (!active) {
        active = true;
        current.x = target.x;
        current.y = target.y;
        glow.classList.add('is-active');
      }
    };
    const onLeave = () => {
      active = false;
      glow.classList.remove('is-active');
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      glow.style.setProperty('--gx', `${current.x}px`);
      glow.style.setProperty('--gy', `${current.y}px`);
      raf = requestAnimationFrame(tick);
    };

    const parent = layer.parentElement ?? layer;
    parent.addEventListener('pointermove', onMove);
    parent.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, pointerGlow]);

  if (reducedMotion) return null;

  return (
    <div ref={layerRef} className={`smoke-layer ${className}`.trim()} aria-hidden="true">
      <span className="smoke-blob" />
      <span className="smoke-blob" />
      <span className="smoke-blob" />
      {pointerGlow && <div ref={glowRef} className="hero-glow" />}
    </div>
  );
}
