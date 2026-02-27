import React, { useState, useRef, useEffect } from 'react';

interface GuessInputProps {
  onSubmit: (title: string) => void;
  disabled: boolean;
  isLoading: boolean;
  attempt: number;
}

export function GuessInput({ onSubmit, disabled, isLoading, attempt }: GuessInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && !isLoading) {
      setValue('');
      inputRef.current?.focus();
    }
  }, [attempt, disabled, isLoading]);

  const handleSubmit = () => {
    const v = value.trim();
    if (!v || disabled || isLoading) return;
    onSubmit(v);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="guess-input-wrap">
      <div className="guess-input-label">
        {isLoading
          ? '🎬 The critic is thinking...'
          : `Guess ${attempt} — type anything, abbreviations ok`}
      </div>
      <div className={`guess-input-row ${isLoading ? 'loading' : ''}`}>
        <input
          ref={inputRef}
          className="guess-input"
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={isLoading ? '' : 'e.g. "DDLJ", "that ship film", "matrix"…'}
          disabled={disabled || isLoading}
          autoComplete="off"
          autoCapitalize="on"
          spellCheck={false}
          aria-label="Film title guess"
        />
        <button
          className={`guess-submit-btn ${isLoading ? 'btn-loading' : ''}`}
          onClick={handleSubmit}
          disabled={disabled || isLoading || !value.trim()}
          aria-label={isLoading ? 'Evaluating...' : 'Submit guess'}
        >
          {isLoading ? <span className="spinner" aria-hidden="true" /> : '▶'}
        </button>
      </div>
      <p className="guess-hint-text">
        No dropdown — Gemini reads your mind. Typos, alternate titles, vibes all work.
      </p>
    </div>
  );
}
