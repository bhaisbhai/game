import React, { useEffect, useCallback } from 'react';
import { TopBar } from './TopBar';
import { EmojiClues } from './EmojiClues';
import { GuessInput } from './GuessInput';
import { GuessFeedback } from './GuessFeedback';
import { ResultsModal } from './ResultsModal';
import { useGameRun } from '../hooks/useGameRun';
import { useAudio } from '../hooks/useAudio';
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
  const { run, startGame, submitGuess } = useGameRun();
  const { play } = useAudio(profile.settings.soundEnabled);

  const reduceMotion =
    profile.settings.reduceMotion === 'on' ||
    (profile.settings.reduceMotion === 'system' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => { startGame(film); }, [film]);

  // Detect status change → record result + play sound
  useEffect(() => {
    if (!run) return;
    if (run.status === 'won') { play('win'); onResult(run.cluesRevealed, true); }
    else if (run.status === 'lost') { play('lose'); onResult(run.cluesRevealed, false); }
  }, [run?.status]); // eslint-disable-line

  const handleGuess = useCallback((title: string) => {
    const result = submitGuess(title);
    if (result === 'correct') play('win');
    else if (result === 'wrong') {
      play('wrong');
      setTimeout(() => play('reveal'), 350);
    } else {
      play('tick'); // already guessed
    }
  }, [submitGuess, play]);

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
            onSubmit={handleGuess}
            disabled={done}
            attempt={run.wrongGuesses.length}
          />
        )}

        <GuessFeedback guesses={run.wrongGuesses} />
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
