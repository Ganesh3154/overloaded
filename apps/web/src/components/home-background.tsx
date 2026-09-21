interface SymbolItem {
  char: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

const SYMBOLS: SymbolItem[] = [
  // Left column
  { char: "O(n)",    x: 3,  y: 14, duration: 10, delay: 0,  color: "var(--lime-cs)",        opacity: 0.40 },
  { char: "[ ]",     x: 6,  y: 36, duration: 12, delay: 2,  color: "var(--grid-gray)",      opacity: 0.45 },
  { char: "=>",      x: 2,  y: 56, duration: 9,  delay: 4,  color: "var(--accent)",         opacity: 0.38 },
  { char: "{ }",     x: 8,  y: 74, duration: 11, delay: 1,  color: "var(--lime-cs)",        opacity: 0.36 },
  { char: "true",    x: 4,  y: 88, duration: 8,  delay: 6,  color: "var(--grid-gray)",      opacity: 0.42 },

  // Right column
  { char: "</>",     x: 88, y: 7,  duration: 11, delay: 1,  color: "var(--accent)",         opacity: 0.38 },
  { char: "===",     x: 92, y: 28, duration: 10, delay: 3,  color: "var(--lime-cs)",        opacity: 0.40 },
  { char: "fn()",    x: 87, y: 50, duration: 13, delay: 0,  color: "var(--grid-gray)",      opacity: 0.44 },
  { char: "null",    x: 91, y: 70, duration: 9,  delay: 5,  color: "var(--accent)",         opacity: 0.36 },
  { char: "&&",      x: 89, y: 87, duration: 12, delay: 2,  color: "var(--lime-cs)",        opacity: 0.40 },

  // Top strip
  { char: "dp[i]",   x: 22, y: 4,  duration: 13, delay: 3,  color: "var(--cat-new-skill)",  opacity: 0.36 },
  { char: "git",     x: 43, y: 2,  duration: 10, delay: 5,  color: "var(--grid-gray)",      opacity: 0.42 },
  { char: "O(log n)",x: 58, y: 5,  duration: 11, delay: 0,  color: "var(--lime-cs)",        opacity: 0.36 },
  { char: "void",    x: 78, y: 3,  duration: 9,  delay: 4,  color: "var(--accent)",         opacity: 0.36 },

  // Bottom strip
  { char: "++i",     x: 20, y: 90, duration: 12, delay: 1,  color: "var(--lime-cs)",        opacity: 0.40 },
  { char: "while",   x: 38, y: 92, duration: 10, delay: 7,  color: "var(--grid-gray)",      opacity: 0.42 },
  { char: "npm i",   x: 57, y: 88, duration: 9,  delay: 3,  color: "var(--accent)",         opacity: 0.36 },
  { char: "for",     x: 74, y: 91, duration: 13, delay: 0,  color: "var(--grid-gray)",      opacity: 0.44 },

  // Mid-edge accents
  { char: "$",       x: 14, y: 47, duration: 9,  delay: 7,  color: "var(--lime-cs)",        opacity: 0.48 },
  { char: "›",       x: 83, y: 43, duration: 11, delay: 2,  color: "var(--accent)",         opacity: 0.44 },
];

export function HomeBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden"
    >
      {SYMBOLS.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%`, opacity: s.opacity }}
        >
          <span
            className="font-mono text-xs whitespace-nowrap"
            style={{
              color: s.color,
              animation: `float-symbol ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          >
            {s.char}
          </span>
        </div>
      ))}
    </div>
  );
}
