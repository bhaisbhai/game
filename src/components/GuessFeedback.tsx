import React from 'react';
import { WrongGuess } from '../types';

interface GuessFeedbackProps {
  guesses: WrongGuess[];
}

export function GuessFeedback({ guesses }: GuessFeedbackProps) {
  if (guesses.length === 0) return null;

  return (
    <div className="guess-feedback" aria-label="Previous wrong guesses">
      <p className="feedback-header">Wrong guesses</p>
      <ul className="feedback-list">
        {guesses.map((g, i) => (
          <li key={i} className="feedback-item">
            <span className="feedback-x" aria-hidden="true">❌</span>
            <span className="feedback-title">{g.title}</span>
            <span className="feedback-clue-note">({g.cluesSeenWhenGuessed} clue{g.cluesSeenWhenGuessed !== 1 ? 's' : ''} seen)</span>
            <div className="feedback-tags">
              <span className={`tag ${g.eraMatch ? 'tag-yes' : 'tag-no'}`}
                title={g.eraMatch ? 'Same era' : 'Different era'}>
                {g.eraMatch ? '✓' : '✗'} Era
              </span>
              <span className={`tag ${g.originMatch ? 'tag-yes' : 'tag-no'}`}
                title={g.originMatch ? 'Same origin' : 'Different origin'}>
                {g.originMatch ? '✓' : '✗'} Origin
              </span>
              <span className={`tag ${g.genreMatch ? 'tag-yes' : 'tag-no'}`}
                title={g.genreMatch ? 'Same genre' : 'Different genre'}>
                {g.genreMatch ? '✓' : '✗'} Genre
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
