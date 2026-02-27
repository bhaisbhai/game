import { FilmEntry } from '../data/films';

export interface GeminiResult {
  correct: boolean;
  hint: string | null;
  fallback?: boolean; // true if we fell back to string matching
}

// Fallback string matching if the API is unavailable
function localEvaluate(guess: string, film: FilmEntry): boolean {
  const g = guess.toLowerCase().trim();
  const t = film.title.toLowerCase();

  if (g === t) return true;
  // Common abbreviations
  const abbrev = film.title
    .split(/\s+/)
    .filter(w => w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase() === false || w.length > 3)
    .map(w => w[0])
    .join('').toLowerCase();
  if (g === abbrev) return true;
  // Partial match (contains significant part)
  if (t.includes(g) && g.length > 4) return true;
  return false;
}

export async function evaluateGuess(
  guess: string,
  film: FilmEntry,
  cluesSeen: number,
  wrongGuessCount: number
): Promise<GeminiResult> {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filmTitle: film.title,
        userGuess: guess,
        cluesSeen,
        year: film.year,
        origin: film.origin,
        genre: film.genre,
        wrongGuessCount,
      }),
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!res.ok) throw new Error(`API ${res.status}`);

    const data: GeminiResult = await res.json();
    return data;

  } catch (err) {
    console.warn('Gemini unavailable, falling back to local evaluation:', err);
    // Graceful fallback: do simple string match, no AI hint
    const correct = localEvaluate(guess, film);
    return {
      correct,
      hint: correct
        ? null
        : "The AI critic is catching their breath — but that guess was off the mark. Try again...",
      fallback: true,
    };
  }
}
