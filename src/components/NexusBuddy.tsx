/**
 * A tiny pixel-art buddy that waddles and dances while we wait on the API.
 * Two hand-drawn sprite frames cross-toggle to animate the arms and legs,
 * while the whole sprite waddles side to side above a squashing shadow.
 */

// 12x12 sprite grids. '.' empty, '#' body, 'o' LED (eyes / antenna tip),
// '-' arm, '=' foot.
const FRAME_A = [
  '.....oo.....',
  '.....##.....',
  '..########..',
  '..#o####o#..',
  '..########..',
  '..########..',
  '....####....',
  '.-.######.-.',
  '...######...',
  '...######...',
  '...#...#....',
  '..==...==...',
];

const FRAME_B = [
  '.....oo.....',
  '.....##.....',
  '..########..',
  '..#o####o#..',
  '..########..',
  '..########..',
  '.-..####....',
  '...######...',
  '...######.-.',
  '...######...',
  '....#.#.....',
  '...==.==....',
];

const PIXEL_COLOR: Record<string, string> = {
  '#': 'var(--color-accent)',
  o: 'var(--color-led)',
  '-': 'var(--color-accent-dim)',
  '=': 'var(--color-accent-dim)',
};

function toRects(frame: string[]) {
  const rects: { x: number; y: number; fill: string }[] = [];
  frame.forEach((row, y) => {
    row.split('').forEach((ch, x) => {
      const fill = PIXEL_COLOR[ch];
      if (fill) rects.push({ x, y, fill });
    });
  });
  return rects;
}

const RECTS_A = toRects(FRAME_A);
const RECTS_B = toRects(FRAME_B);

interface NexusBuddyProps {
  size?: number;
  className?: string;
}

export function NexusBuddy({ size = 60, className = '' }: NexusBuddyProps) {
  return (
    <span
      className={`nexus-buddy ${className}`}
      style={{ width: size, height: size + 6 }}
      aria-hidden="true"
    >
      <span className="nexus-buddy__sprite" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 12 12"
          width={size}
          height={size}
          shapeRendering="crispEdges"
        >
          <g className="nexus-buddy__frame nexus-buddy__frame--a">
            {RECTS_A.map((r, i) => (
              <rect key={i} x={r.x} y={r.y} width="1" height="1" fill={r.fill} />
            ))}
          </g>
          <g className="nexus-buddy__frame nexus-buddy__frame--b">
            {RECTS_B.map((r, i) => (
              <rect key={i} x={r.x} y={r.y} width="1" height="1" fill={r.fill} />
            ))}
          </g>
        </svg>
      </span>
      <span className="nexus-buddy__shadow" />
    </span>
  );
}
