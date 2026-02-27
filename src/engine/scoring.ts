import { ScoreBreakdown } from '../types';

export function computeScore(
  attemptsUsed: number,
  elapsedMs: number,
  hintsUsed: number
): ScoreBreakdown {
  const base = 1000;
  const attemptPenalty = attemptsUsed * 80;
  const timePenalty = Math.floor(elapsedMs / 1000 / 5) * 10;
  const hintPenalty = hintsUsed * 120;
  const raw = Math.max(0, base - attemptPenalty - timePenalty - hintPenalty);

  let grade: ScoreBreakdown['grade'];
  if (raw >= 800) grade = 'S';
  else if (raw >= 650) grade = 'A';
  else if (raw >= 500) grade = 'B';
  else if (raw >= 350) grade = 'C';
  else grade = 'D';

  return { attemptsUsed, maxAttempts: 8, timeMs: elapsedMs, hintPenalty, raw, grade };
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
