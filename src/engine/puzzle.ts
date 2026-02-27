import { QUOTES, QuoteEntry } from '../data/quotes';
import { ScoreResult, GameRun } from '../types';
import { MAX_WRONG } from '../hooks/useGameRun';

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDailyQuote(dateISO?: string): QuoteEntry {
  const date = dateISO ?? todayISO();
  const epoch = new Date('2026-02-27').getTime();
  const dayMs = new Date(date).setHours(0, 0, 0, 0);
  const dayIndex = Math.floor((dayMs - epoch) / 86400000);
  const idx = ((dayIndex % QUOTES.length) + QUOTES.length) % QUOTES.length;
  return QUOTES[idx];
}

export function getDailyNumber(dateISO?: string): number {
  const date = dateISO ?? todayISO();
  const epoch = new Date('2026-02-27').getTime();
  const dayMs = new Date(date).setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((dayMs - epoch) / 86400000) + 1);
}

export function getPracticeQuote(): QuoteEntry {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export function computeScore(wrongCount: number, solved: boolean): ScoreResult {
  if (!solved) return { label: 'Better luck tomorrow', emoji: '💀', points: 0 };
  if (wrongCount === 0) return { label: 'FLAWLESS',    emoji: '🔥', points: 1000 };
  if (wrongCount === 1) return { label: 'BRILLIANT',   emoji: '⚡', points: 800 };
  if (wrongCount === 2) return { label: 'GREAT',       emoji: '⭐', points: 600 };
  if (wrongCount === 3) return { label: 'DECENT',      emoji: '👍', points: 400 };
  if (wrongCount <= 5)  return { label: 'CLOSE CALL',  emoji: '😅', points: 200 };
  return                       { label: 'SURVIVED',    emoji: '😰', points: 100 };
}

export function buildShareText(run: GameRun, dailyNum?: number): string {
  const wrongCount = run.wrongLetters.length;
  const score = computeScore(wrongCount, run.solved);
  const label = dailyNum ? `#${dailyNum}` : 'Practice';
  const header = `Reel Masala ${label} 🎬`;
  const resultLine = run.solved
    ? `${score.emoji} ${score.label} — ${wrongCount} wrong letter${wrongCount !== 1 ? 's' : ''}!`
    : `💀 Couldn't crack it! (${wrongCount} wrong letters)`;

  // 6 squares: 🟥 = wrong guess used, 🟩 = life remaining, ⬛ = unused
  const grid = Array(MAX_WRONG).fill(null).map((_, i) => {
    if (i < wrongCount) return '🟥';
    if (run.solved) return '🟩';
    return '⬛';
  }).join('');

  const hintNote = run.hintsUsed ? ' (used hints)' : '';
  return `${header}\n${resultLine}${hintNote}\n${grid}\n\nhttps://fantastic-creponne-bc083b.netlify.app`;
}
