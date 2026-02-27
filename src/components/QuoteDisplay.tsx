import React from 'react';

interface QuoteDisplayProps {
  quote: string;
  guessedLetters: string[]; // uppercase A-Z
}

function isAlpha(c: string): boolean {
  return (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');
}

// Split quote into words, preserving the text exactly
// Returns array of {chars: Array<{char, isAlpha}>}
function parseWords(quote: string) {
  return quote.split(' ').map(word => ({
    chars: word.split('').map(c => ({ char: c, alpha: isAlpha(c) })),
  }));
}

export function QuoteDisplay({ quote, guessedLetters }: QuoteDisplayProps) {
  const words = parseWords(quote);

  return (
    <div className="quote-display" aria-label="Quote to complete">
      <div className="quote-words">
        {words.map((word, wi) => (
          <span key={wi} className="quote-word">
            {word.chars.map((item, ci) => {
              if (item.alpha) {
                const upper = item.char.toUpperCase();
                const revealed = guessedLetters.includes(upper);
                return (
                  <span
                    key={ci}
                    className={`letter-tile ${revealed ? 'revealed' : 'hidden'}`}
                    aria-label={revealed ? item.char.toUpperCase() : 'blank'}
                  >
                    {revealed ? upper : ''}
                  </span>
                );
              }
              return (
                <span key={ci} className="quote-punct" aria-hidden="true">
                  {item.char}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
}
