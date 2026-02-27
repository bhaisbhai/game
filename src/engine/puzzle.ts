import { BeatId, BEATS, PuzzleDefinition } from '../types';

// Simple seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleWithSeed<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function generateDailyPuzzle(dateISO?: string): PuzzleDefinition {
  const date = dateISO ?? todayISO();
  const puzzleId = `daily:${date}`;
  const seed = hashStr(puzzleId + 'mixtape-masala-v1');
  const rand = mulberry32(seed);

  const allowedBeats = BEATS.map(b => b.id) as BeatId[];
  const shuffled = shuffleWithSeed(allowedBeats, rand);
  const secret = shuffled.slice(0, 5) as BeatId[];

  return {
    puzzleId,
    mode: 'daily',
    dateISO: date,
    seed: seed.toString(16),
    allowedBeats,
    secretLength: 5,
    maxAttempts: 8,
    secret,
  };
}

export function generatePracticePuzzle(): PuzzleDefinition {
  const seed = Math.floor(Math.random() * 0xffffffff);
  const rand = mulberry32(seed);
  const allowedBeats = BEATS.map(b => b.id) as BeatId[];
  const shuffled = shuffleWithSeed(allowedBeats, rand);
  const secret = shuffled.slice(0, 5) as BeatId[];

  return {
    puzzleId: `practice:${seed.toString(16)}`,
    mode: 'practice',
    seed: seed.toString(16),
    allowedBeats,
    secretLength: 5,
    maxAttempts: 8,
    secret,
  };
}

export function getDailyNumber(): number {
  const epoch = new Date('2026-02-27').getTime();
  const now = new Date().setHours(0, 0, 0, 0);
  return Math.floor((now - epoch) / 86400000) + 1;
}
