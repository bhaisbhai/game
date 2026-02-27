import React from 'react';
import { quoteLetterSet } from '../hooks/useGameRun';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

interface LetterKeyboardProps {
  quoteText: string;
  guessedLetters: string[];
  wrongLetters: string[];
  onGuess: (letter: string) => void;
  disabled: boolean;
}

export function LetterKeyboard({
  quoteText,
  guessedLetters,
  wrongLetters,
  onGuess,
  disabled,
}: LetterKeyboardProps) {
  const quoteLetters = quoteLetterSet(quoteText);

  return (
    <div className="letter-keyboard" aria-label="Letter keyboard">
      {ROWS.map((row, ri) => (
        <div key={ri} className="kb-row">
          {row.map(letter => {
            const isWrong = wrongLetters.includes(letter);
            const isCorrect = guessedLetters.includes(letter) && !isWrong;
            const isGuessed = guessedLetters.includes(letter);

            let keyClass = '';
            if (isWrong) keyClass = 'wrong';
            else if (isCorrect) keyClass = 'correct';

            // Visual check: is this letter in the quote at all?
            const inQuote = quoteLetters.has(letter);

            return (
              <button
                key={letter}
                className={`kb-key ${keyClass}`}
                onClick={() => onGuess(letter)}
                disabled={disabled || isGuessed}
                aria-label={`Guess letter ${letter}`}
                aria-pressed={isGuessed}
                data-in-quote={inQuote}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
