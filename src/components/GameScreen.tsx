import React, { useEffect, useState, useCallback, useRef } from 'react';
import { TopBar } from './TopBar';
import { EmojiClues } from './EmojiClues';
import { GuessInput } from './GuessInput';
import { GuessFeedback } from './GuessFeedback';
import { ResultsModal } from './ResultsModal';
import { useGameRun } from '../hooks/useGameRun';
import { useAudio } from '../hooks/useAudio';
import { evaluateGuess } from '../services/gemini';
import { FilmEntry } from '../data/films';
import { PlayerProfile } from '../types';
import { getDailyNumber } from '../engine/puzzle';

interface GameScreenProps {
  film: FilmEntry;
  isDaily: boolean;
  profile: PlayerProfile;
  onHome: () => void;
  onShare: (text: string) => void;
  onPlayAgain: () => void;
  onResult: (cluesUsed: number, solved: boolean) => void;
}

export function GameScreen({ film, isDaily, profile, onHome, onShare, onPlayAgain, onResult }: GameScreenProps) {
  const { run, startGame, recordGuessResult } = useGameRun();
  const { play } = useAudio(profile.settings.soundEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [latestNewClue, setLatestNewClue] = useState<string | undefined>(undefined);
  const prevStatusRef = useRef<string | undefined>(undefined);

  const reduceMotion =
    profile.settings.reduceMotion === 'on' ||
    (profile.settings.reduceMotion === 'system' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => { startGame(film); }, [film]);

  // Handle game end
  useEffect(() => {
    if (!run) return;
    if (prevStatusRef.current === run.status) return;
    prevStatusRef.current = run.status;

    if (run.status === 'won') {
      play('win');
      onResult(run.cluesRevealed, true);
    } else if (run.status === 'lost') {
      play('lose');
      onResult(run.wrongGuesses.length, false);
    }
  }, [run?.status]); // eslint-disable-line

  const handleSubmit = useCallback(async (guess: string) => {
    if (!run || run.status !== 'playing' || isLoading) return;

    setIsLoading(true);
    setLatestNewClue(undefined);
    play('select');

    try {
      const result = await evaluateGuess(
        guess,
        run.film,
        run.cluesRevealed,
        run.wrongGuesses.length
      );

      if (result.correct) {
        play('win');
        recordGuessResult(guess, true, null);
      } else {
        play('wrong');
        // Show the next clue that will unlock
        const nextClueIdx = Math.min(run.cluesRevealed, 4); // 0-indexed
        const nextEmoji = run.film.clues[nextClueIdx];
        if (run.cluesRevealed < 5) {
          setTimeout(() => {
            play('reveal');
            setLatestNewClue(nextEmoji);
          }, 400);
        }
        recordGuessResult(guess, false, result.hint);
      }
    } finally {
      setIsLoading(false);
    }
  }, [run, isLoading, play, recordGuessResult]);

  if (!run) return null;
  const done = run.status !== 'playing';
  const puzzleLabel = isDaily ? `Daily #${getDailyNumber()}` : 'Practice';

  return (
    <div className="game-screen">
      <TopBar
        puzzleLabel={puzzleLabel}
        elapsedMs={run.elapsedMs}
        attempt={run.wrongGuesses.length + 1}
        maxAttempts={5}
        onHome={onHome}
      />

      <div className="game-body">
        <EmojiClues
          clues={run.film.clues}
          revealed={run.cluesRevealed}
          reduceMotion={reduceMotion}
        />

        {!done && (
          <GuessInput
            onSubmit={handleSubmit}
            disabled={done}
            isLoading={isLoading}
            attempt={run.wrongGuesses.length + 1}
          />
        )}

        <GuessFeedback
          guesses={run.wrongGuesses}
          newClueEmoji={latestNewClue}
        />
      </div>

      {done && (
        <ResultsModal
          run={run}
          isDaily={isDaily}
          onShare={onShare}
          onPlayAgain={onPlayAgain}
          reduceMotion={reduceMotion}
        />
      )}
    </div>
  );
}
