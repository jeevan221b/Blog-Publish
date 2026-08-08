import { useReadingProgress } from '@/hooks/useReadingProgress';

interface ReadingProgressProps {
  targetRef: React.RefObject<HTMLElement | null>;
}

export function ReadingProgress({ targetRef }: ReadingProgressProps) {
  const progress = useReadingProgress(targetRef);

  return (
    <div
      className="fixed top-16 left-0 right-0 z-30 h-[2px]"
      style={{ backgroundColor: 'var(--border-soft)' }}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          backgroundColor: 'var(--color-accent)',
          transition: 'width 80ms linear',
        }}
      />
    </div>
  );
}
