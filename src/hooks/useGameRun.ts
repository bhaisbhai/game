import { useState, useEffect, useRef, useCallback } from 'react';
import { GameRun } from '../types';
import { QuoteEntry } from '../data/quotes';

export const MAX_WRONG = 6;

export function quoteLetterSet(quote: string): Set<string> {
  return new Set(quote.toUpperCase().split('').filter(c => c >= 'A' && c <= 'Z'));
}

function isComplete(quote: string, guessedLetters: string[]): boolean {
  const needed = quoteLetterSet(quote);
  return [...needed].every(l => guessedLetters.includes(l));
}

function initRun(quote: QuoteEntry): GameRun {
  return {
    runId: crypto.randomUUID(),
    quote,
    status: 'playing',
    guessedLetters: [],
    wrongLetters: [],
    hintsUsed: false,
    startedAtMs: Date.now(),
    elapsedMs: 0,
    solved: false,
  };
}

export function useGameRun() {
  const [run, setRun] = useState<GameRun | null>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (run?.status === 'playing') {
      tickRef.current = window.setInterval(() => {
        setRun(r => r ? { ...r, elapsedMs: Date.now() - r.startedAtMs } : r);
      }, 1000);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [run?.status]);

  const startGame = useCallback((quote: QuoteEntry) => {
    setRun(initRun(quote));
  }, []);

  const guessLetter = useCallback((letter: string) => {
    setRun(r => {
      if (!r || r.status !== 'playing') return r;
      const L = letter.toUpperCase();
      if (r.guessedLetters.includes(L)) return r;

      const letters = quoteLetterSet(r.quote.quote);
      const isCorrect = letters.has(L);
      const newGuessed = [...r.guessedLetters, L];
      const newWrong = isCorrect ? r.wrongLetters : [...r.wrongLetters, L];

      const won = isCorrect && isComplete(r.quote.quote, newGuessed);
      const lost = newWrong.length >= MAX_WRONG;
      const status = won ? 'won' : lost ? 'lost' : 'playing';
      const endedAtMs = status !== 'playing' ? Date.now() : undefined;

      return {
        ...r,
        guessedLetters: newGuessed,
        wrongLetters: newWrong,
        status,
        solved: won,
        endedAtMs,
        elapsedMs: status !== 'playing' ? Date.now() - r.startedAtMs : r.elapsedMs,
      };
    });
  }, []);

  const revealHints = useCallback(() => {
    setRun(r => r ? { ...r, hintsUsed: true } : r);
  }, []);

  const reset = useCallback(() => setRun(null), []);

  return { run, startGame, guessLetter, revealHints, reset };
}
