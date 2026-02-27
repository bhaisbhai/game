import { FILMS, FilmEntry } from '../data/films';
import { ScoreResult, GameRun } from '../types';

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Deterministic daily film selection
export function getDailyFilm(dateISO?: string): FilmEntry {
  const date = dateISO ?? todayISO();
  const epoch = new Date('2026-02-27').getTime();
  const dayMs = new Date(date).setHours(0, 0, 0, 0);
  const dayIndex = Math.floor((dayMs - epoch) / 86400000);
  const idx = ((dayIndex % FILMS.length) + FILMS.length) % FILMS.length;
  return FILMS[idx];
}

export function getDailyNumber(dateISO?: string): number {
  const date = dateISO ?? todayISO();
  const epoch = new Date('2026-02-27').getTime();
  const dayMs = new Date(date).setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((dayMs - epoch) / 86400000) + 1);
}

export function getPracticeFilm(): FilmEntry {
  return FILMS[Math.floor(Math.random() * FILMS.length)];
}

export function computeScore(cluesUsed: number, solved: boolean): ScoreResult {
  if (!solved) return { cluesUsed: 6, label: 'Better luck tomorrow', emoji: '💀', points: 0 };
  const levels: ScoreResult[] = [
    { cluesUsed: 1, label: 'LEGENDARY',       emoji: '🔥', points: 1000 },
    { cluesUsed: 2, label: 'BRILLIANT',        emoji: '⚡', points: 800  },
    { cluesUsed: 3, label: 'GREAT',            emoji: '⭐', points: 600  },
    { cluesUsed: 4, label: 'DECENT',           emoji: '👍', points: 400  },
    { cluesUsed: 5, label: 'JUST MADE IT',     emoji: '😅', points: 200  },
  ];
  return levels[Math.min(cluesUsed - 1, 4)];
}

// Build spoiler-free share grid
export function buildShareText(run: GameRun, dailyNum?: number): string {
  const score = computeScore(run.cluesRevealed, run.solved);
  const label = dailyNum ? `#${dailyNum}` : 'Practice';
  const header = `Reel Masala ${label} 🎬`;
  const resultLine = run.solved
    ? `${score.emoji} Cracked in ${run.cluesRevealed}/5 clues!`
    : `💀 Stumped! (${run.wrongGuesses.length} wrong)`;

  // Grid: 🟥 = wrong, 🟩 = correct, ⬛ = unused
  const wrongCount = run.wrongGuesses.length;
  const grid = Array(5).fill(null).map((_, i) => {
    if (i < wrongCount) return '🟥';
    if (i === wrongCount && run.solved) return '🟩';
    return '⬛';
  }).join('');

  return `${header}\n${resultLine}\n${grid}\n\nhttps://fantastic-creponne-bc083b.netlify.app`;
}
