import React, { useEffect, useRef } from 'react';

interface EmojiCluesProps {
  clues: [string, string, string, string, string];
  revealed: number; // 1..5
  reduceMotion: boolean;
}

export function EmojiClues({ clues, revealed, reduceMotion }: EmojiCluesProps) {
  const prevRevealedRef = useRef(revealed);
  const newReveal = revealed > prevRevealedRef.current;

  useEffect(() => {
    prevRevealedRef.current = revealed;
  }, [revealed]);

  return (
    <div className="emoji-clues" aria-label={`${revealed} of 5 clues revealed`}>
      <p className="clues-header">🎬 What film or show is this?</p>
      <div className="clues-track">
        {clues.map((clue, i) => {
          const isRevealed = i < revealed;
          const isNew = isRevealed && i === revealed - 1;
          return (
            <div
              key={i}
              className={`clue-tile ${isRevealed ? 'revealed' : 'hidden'} ${isNew && !reduceMotion ? 'pop-in' : ''}`}
              aria-label={isRevealed ? `Clue ${i + 1}: ${clue}` : `Clue ${i + 1}: hidden`}
            >
              {isRevealed ? (
                <span className="clue-emoji" role="img">{clue}</span>
              ) : (
                <span className="clue-lock" aria-hidden="true">?</span>
              )}
              <span className="clue-num">{i + 1}</span>
            </div>
          );
        })}
      </div>
      <p className="clues-sub">
        {revealed < 5
          ? `${5 - revealed} more clue${5 - revealed !== 1 ? 's' : ''} unlock on wrong guesses`
          : 'All clues revealed — final chance!'}
      </p>
    </div>
  );
}
