import React from 'react';
import { Guess, SlotMark, BEAT_MAP, BeatId } from '../types';

interface GuessGridProps {
  guesses: Guess[];
  maxAttempts: number;
  currentSlots: (BeatId | null)[];
  colourBlind: boolean;
}

const MARK_SYMBOL: Record<SlotMark, string> = {
  exact:   '🟩',
  present: '🟨',
  absent:  '⬛',
};

const MARK_CLASS: Record<SlotMark, string> = {
  exact:   'mark-exact',
  present: 'mark-present',
  absent:  'mark-absent',
};

const MARK_LABEL: Record<SlotMark, string> = {
  exact:   'correct position',
  present: 'wrong position',
  absent:  'not in mix',
};

function GuessRow({ guess, colourBlind }: { guess: Guess; colourBlind: boolean }) {
  return (
    <div className="guess-row" role="listitem">
      {guess.beats.map((beat, i) => {
        const meta = BEAT_MAP[beat];
        const mark = guess.marks[i];
        return (
          <div
            key={i}
            className={`guess-tile ${MARK_CLASS[mark]} ${colourBlind ? 'cb' : ''}`}
            aria-label={`${meta.label}: ${MARK_LABEL[mark]}`}
            title={`${meta.label} — ${MARK_LABEL[mark]}`}
          >
            <span className="tile-emoji" role="img" aria-hidden="true">{meta.emoji}</span>
            {colourBlind && <span className="cb-pattern">{MARK_SYMBOL[mark]}</span>}
          </div>
        );
      })}
    </div>
  );
}

function CurrentRow({ slots }: { slots: (BeatId | null)[] }) {
  return (
    <div className="guess-row current-row" role="listitem" aria-label="Current guess">
      {slots.map((beat, i) => (
        <div key={i} className={`guess-tile current-tile ${beat ? 'filled' : 'empty'}`}>
          {beat ? (
            <span className="tile-emoji" role="img" aria-hidden="true">{BEAT_MAP[beat].emoji}</span>
          ) : (
            <span className="tile-placeholder">·</span>
          )}
        </div>
      ))}
    </div>
  );
}

function EmptyRow() {
  return (
    <div className="guess-row empty-row" role="listitem" aria-hidden="true">
      {Array(5).fill(null).map((_, i) => (
        <div key={i} className="guess-tile empty-tile" />
      ))}
    </div>
  );
}

export function GuessGrid({ guesses, maxAttempts, currentSlots, colourBlind }: GuessGridProps) {
  const remaining = maxAttempts - guesses.length - 1;
  const showCurrent = guesses.length < maxAttempts;

  return (
    <div className="guess-grid" role="list" aria-label="Guess history">
      {guesses.map(g => (
        <GuessRow key={g.guessId} guess={g} colourBlind={colourBlind} />
      ))}
      {showCurrent && <CurrentRow slots={currentSlots} />}
      {Array(Math.max(0, remaining)).fill(null).map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  );
}
