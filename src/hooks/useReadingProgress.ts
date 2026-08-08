import { useEffect, useState } from 'react';

export function useReadingProgress(targetRef?: React.RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const el = targetRef?.current;
      const scrollTop = window.scrollY;

      const top = el ? el.offsetTop : 0;
      const height = el ? el.offsetHeight : document.body.scrollHeight;
      const viewport = window.innerHeight;

      const total = Math.max(height - viewport, 1);
      const current = Math.min(Math.max(scrollTop - top, 0), total);
      setProgress((current / total) * 100);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [targetRef]);

  return progress;
}
