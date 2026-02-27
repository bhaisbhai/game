import React from 'react';
import { WrongGuess } from '../types';

interface GuessFeedbackProps {
  guesses: WrongGuess[];
  newClueEmoji?: string; // the freshly revealed emoji, for the reveal flash
}

export function GuessFeedback({ guesses, newClueEmoji }: GuessFeedbackProps) {
  if (guesses.length === 0) return null;

  return (
    <div className="guess-feedback" aria-live="polite" aria-label="Guess history with AI hints">
      {[...guesses].reverse().map((g, i) => (
        <div key={i} className={`feedback-card ${i === 0 ? 'feedback-latest' : ''}`}>
          <div className="feedback-top">
            <span className="feedback-x" aria-hidden="true">❌</span>
            <span className="feedback-title">&ldquo;{g.title}&rdquo;</span>
            <span className="feedback-clues-seen" aria-label={`Seen ${g.cluesSeenWhenGuessed} clues`}>
              {Array(g.cluesSeenWhenGuessed).fill('🎬').join('')}
            </span>
          </div>
          {g.aiFeedback && (
            <div className="feedback-ai-hint">
              <span className="ai-icon" aria-hidden="true">🤖</span>
              <p className="ai-hint-text">{g.aiFeedback}</p>
            </div>
          )}
          {i === 0 && newClueEmoji && (
            <div className="new-clue-flash" aria-label={`New clue unlocked: ${newClueEmoji}`}>
              <span className="new-clue-label">New clue unlocked →</span>
              <span className="new-clue-emoji">{newClueEmoji}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
