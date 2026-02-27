import React, { useEffect, useState, useCallback, useRef } from 'react';
import { TopBar } from './TopBar';
import { QuoteDisplay } from './QuoteDisplay';
import { LetterKeyboard } from './LetterKeyboard';
import { ResultsModal } from './ResultsModal';
import { useGameRun, MAX_WRONG, quoteLetterSet } from '../hooks/useGameRun';
import { useAudio } from '../hooks/useAudio';
import { QuoteEntry } from '../data/quotes';
import { PlayerProfile } from '../types';
import { getDailyNumber } from '../engine/puzzle';

interface GameScreenProps {
  quote: QuoteEntry;
  isDaily: boolean;
  profile: PlayerProfile;
  onHome: () => void;
  onShare: (text: string) => void;
  onPlayAgain: () => void;
  onResult: (wrongCount: number, solved: boolean) => void;
}

export function GameScreen({ quote, isDaily, profile, onHome, onShare, onPlayAgain, onResult }: GameScreenProps) {
  const { run, startGame, guessLetter, revealHints } = useGameRun();
  const { play } = useAudio(profile.settings.soundEnabled);
  const prevStatusRef = useRef<string | undefined>(undefined);
  const [shakeIdx, setShakeIdx] = useState<number>(-1);

  const reduceMotion =
    profile.settings.reduceMotion === 'on' ||
    (profile.settings.reduceMotion === 'system' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => { startGame(quote); }, [quote]); // eslint-disable-line

  // Handle game end sounds + result callback
  useEffect(() => {
    if (!run) return;
    if (prevStatusRef.current === run.status) return;
    prevStatusRef.current = run.status;

    if (run.status === 'won') {
      play('win');
      onResult(run.wrongLetters.length, true);
    } else if (run.status === 'lost') {
      play('lose');
      onResult(run.wrongLetters.length, false);
    }
  }, [run?.status]); // eslint-disable-line

  const handleLetter = useCallback((letter: string) => {
    if (!run || run.status !== 'playing') return;
    const L = letter.toUpperCase();
    if (run.guessedLetters.includes(L)) return;

    const inQuote = quoteLetterSet(run.quote.quote).has(L);
    if (inQuote) {
      play('reveal');
    } else {
      play('wrong');
      // Shake the newest wrong frame
      const newWrongIdx = run.wrongLetters.length; // index after this guess
      setShakeIdx(newWrongIdx);
      setTimeout(() => setShakeIdx(-1), 500);
    }

    guessLetter(L);
  }, [run, play, guessLetter]);

  // Physical keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        handleLetter(key);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleLetter]);

  if (!run) return null;

  const done = run.status !== 'playing';
  const wrongCount = run.wrongLetters.length;
  const puzzleLabel = isDaily ? `Daily #${getDailyNumber()}` : 'Practice';

  return (
    <div className="game-screen">
      <TopBar
        puzzleLabel={puzzleLabel}
        elapsedMs={run.elapsedMs}
        attempt={wrongCount + 1}
        maxAttempts={MAX_WRONG}
        onHome={onHome}
      />

      <div className="game-body">
        {/* Wrong guess tracker */}
        <div className="wrong-tracker" aria-label={`${wrongCount} of ${MAX_WRONG} wrong guesses`}>
          <span className="tracker-label">
            {wrongCount === 0
              ? 'No wrong letters yet'
              : `${wrongCount} wrong letter${wrongCount !== 1 ? 's' : ''}`}
          </span>
          <div className="tracker-frames">
            {Array(MAX_WRONG).fill(null).map((_, i) => (
              <div
                key={i}
                className={`tracker-frame ${i < wrongCount ? 'used' : ''} ${i === shakeIdx && !reduceMotion ? 'shake' : ''}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Quote source hint */}
        <p className="quote-source-hint">
          Famous quote · {run.quote.year}
        </p>

        {/* The quote with letter tiles */}
        <QuoteDisplay
          quote={run.quote.quote}
          guessedLetters={run.guessedLetters}
        />

        {/* Optional emoji hints */}
        {!run.hintsUsed ? (
          <button
            className="hints-reveal-btn"
            onClick={revealHints}
            disabled={done}
          >
            🎬 Show film hints
          </button>
        ) : (
          <div className="hints-area">
            <span className="hints-label">Film hints:</span>
            <div className="hints-emoji-row">
              {run.quote.emojis.map((e, i) => (
                <span key={i} className="hint-emoji" role="img">{e}</span>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard — hide when done */}
        {!done && (
          <LetterKeyboard
            quoteText={run.quote.quote}
            guessedLetters={run.guessedLetters}
            wrongLetters={run.wrongLetters}
            onGuess={handleLetter}
            disabled={done}
          />
        )}
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
