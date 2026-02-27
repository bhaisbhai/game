import { useState, useEffect, useRef, useCallback } from 'react';
import { GameRun, WrongGuess } from '../types';
import { FilmEntry, FILMS } from '../data/films';

const MAX_CLUES = 5;

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

function getDecade(year: number): string {
  return year >= 2000 ? '00s' : '90s';
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

  const submitGuess = useCallback((guessTitle: string): 'correct' | 'wrong' | 'already_guessed' => {
    if (!run || run.status !== 'playing') return 'wrong';

    // Check for duplicate guess
    const alreadyGuessed = run.wrongGuesses.some(
      g => g.title.toLowerCase() === guessTitle.toLowerCase()
    );
    if (alreadyGuessed) return 'already_guessed';

    const isCorrect = guessTitle.toLowerCase().trim() === run.film.title.toLowerCase().trim();

    if (isCorrect) {
      const endedAtMs = Date.now();
      setRun(r => r ? {
        ...r,
        status: 'won',
        solved: true,
        endedAtMs,
        elapsedMs: endedAtMs - r.startedAtMs,
      } : r);
      return 'correct';
    }

    // Build feedback by looking up the guessed film in our database
    const guessedFilm = FILMS.find(f => f.title.toLowerCase() === guessTitle.toLowerCase());
    const wrong: WrongGuess = {
      title: guessTitle,
      cluesSeenWhenGuessed: run.cluesRevealed,
      eraMatch: guessedFilm ? getDecade(guessedFilm.year) === getDecade(run.film.year) : false,
      originMatch: guessedFilm ? guessedFilm.origin === run.film.origin : false,
      genreMatch: guessedFilm ? guessedFilm.genre === run.film.genre : false,
    };

    setRun(r => {
      if (!r) return r;
      const newWrong = [...r.wrongGuesses, wrong];
      const nextClues = Math.min(r.cluesRevealed + 1, MAX_CLUES);
      const isLost = newWrong.length >= MAX_CLUES;
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
    return 'wrong';
  }, [run]);

  const reset = useCallback(() => setRun(null), []);

  return { run, startGame, submitGuess, reset };
}
