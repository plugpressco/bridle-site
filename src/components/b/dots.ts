// Bridle's signature: its 7 by 7 dot face, from the app, and a few glyphs
// drawn on the same grid. `display` is the big dot display (lit dots in the
// accent, the rest as faint dots); `badge` is the small dark square with a
// white glyph that sits next to a page's name. Decorative: aria-hidden.
const g = (rows: string[]) => rows.flatMap((r, y) => [...r].flatMap((c, x) => (c === '#' ? [[x, y]] : []))) as [number, number][];

export const GLYPHS = {
  face: g(['.#...#.', '.......', '.##.##.', '.##.##.', '.......', '..###..', '.......']),
  wink: g(['.#...#.', '.......', '.##....', '.##.##.', '.......', '..###..', '.......']),
  envelope: g(['.......', '#######', '##...##', '#.#.#.#', '#..#..#', '#######', '.......']),
  bars: g(['.......', '.#####.', '.......', '.#####.', '.......', '.###...', '.......']),
  check: g(['.......', '......#', '.....#.', '#...#..', '.#.#...', '..#....', '.......']),
  bubble: g(['.#####.', '#.....#', '#.#.#.#', '#.....#', '.#####.', '..#....', '.#.....']),
  person: g(['...#...', '..###..', '...#...', '.......', '.#####.', '#######', '#######']),
  doc: g(['.#####.', '.#...#.', '.#.#.#.', '.#...#.', '.#.#.#.', '.#...#.', '.#####.']),
};
export type Glyph = keyof typeof GLYPHS;

export function display(name: Glyph, cls = ''): string {
  const lit = new Set(GLYPHS[name].map(([x, y]) => `${x},${y}`));
  let out = '';
  for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
    const on = lit.has(`${x},${y}`);
    out += `<circle cx="${10 + x * 20}" cy="${10 + y * 20}" r="${on ? 7.2 : 3}" fill="${on ? '#ff4500' : 'rgb(20 20 20 / .13)'}"/>`;
  }
  return `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 140 140" aria-hidden="true">${out}</svg>`;
}

export function badge(name: Glyph): string {
  const dots = GLYPHS[name].map(([x, y]) => `<circle cx="${4 + x * 4}" cy="${4 + y * 4}" r="1.3" fill="#fff"/>`).join('');
  return `<svg class="b-minibot" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#141414"/>${dots}</svg>`;
}
