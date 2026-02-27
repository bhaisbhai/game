import { useState, useEffect, useRef, useCallback } from 'react';
import { GameRun, WrongGuess } from '../types';
import { FilmEntry } from '../data/films';

const MAX_WRONG = 5;

function initRun(film: FilmEntry): GameRun {
  return {
    runId: crypto.randomUUID(),
    film,
    status: 'playing',
    cluesRevealed: 1,
    wrongGuesses: [],
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

  const startGame = useCallback((film: FilmEntry) => {
    setRun(initRun(film));
  }, []);

  // Called after Gemini has evaluated the guess
  const recordGuessResult = useCallback((
    guessTitle: string,
    isCorrect: boolean,
    aiFeedback: string | null
  ) => {
    setRun(r => {
      if (!r || r.status !== 'playing') return r;

      if (isCorrect) {
        const endedAtMs = Date.now();
        return {
          ...r, status: 'won', solved: true,
          endedAtMs, elapsedMs: endedAtMs - r.startedAtMs,
        };
      }

      const wrong: WrongGuess = {
        title: guessTitle,
        cluesSeenWhenGuessed: r.cluesRevealed,
        aiFeedback,
      };
      const newWrong = [...r.wrongGuesses, wrong];
      const nextClues = Math.min(r.cluesRevealed + 1, 5);
      const isLost = newWrong.length >= MAX_WRONG;
      const endedAtMs = isLost ? Date.now() : undefined;

      return {
        ...r,
        wrongGuesses: newWrong,
        cluesRevealed: nextClues,
        status: isLost ? 'lost' : 'playing',
        endedAtMs,
        elapsedMs: isLost ? Date.now() - r.startedAtMs : r.elapsedMs,
      };
    });
  }, []);

  const reset = useCallback(() => setRun(null), []);

  return { run, startGame, recordGuessResult, reset };
}
