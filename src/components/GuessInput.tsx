import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ALL_TITLES } from '../data/films';

interface GuessInputProps {
  onSubmit: (title: string) => void;
  disabled: boolean;
  attempt: number;
}

function fuzzyFilter(query: string, titles: string[]): string[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return titles
    .filter(t => t.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(q);
      const bStarts = b.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.localeCompare(b);
    })
    .slice(0, 8);
}

export function GuessInput({ onSubmit, disabled, attempt }: GuessInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Focus input on each new attempt
    if (!disabled) inputRef.current?.focus();
  }, [attempt, disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSuggestions(fuzzyFilter(val, ALL_TITLES));
    setActiveIdx(-1);
  };

  const triggerSubmit = useCallback((title: string) => {
    if (!title.trim()) return;
    onSubmit(title.trim());
    setQuery('');
    setSuggestions([]);
    setActiveIdx(-1);
  }, [onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        triggerSubmit(suggestions[activeIdx]);
      } else if (query.trim()) {
        // Try to find exact match or first suggestion
        const exact = ALL_TITLES.find(t => t.toLowerCase() === query.toLowerCase().trim());
        if (exact) { triggerSubmit(exact); }
        else if (suggestions.length > 0) { triggerSubmit(suggestions[0]); }
        else {
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setActiveIdx(-1);
    }
  };

  const handleSuggestionClick = (title: string) => {
    triggerSubmit(title);
    inputRef.current?.focus();
  };

  return (
    <div className="guess-input-wrap">
      <div className={`guess-input-row ${shake ? 'shake' : ''}`}>
        <input
          ref={inputRef}
          className="guess-input"
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a film or show title..."
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="Guess input"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
        />
        <button
          className="guess-submit-btn"
          onClick={() => {
            if (activeIdx >= 0) triggerSubmit(suggestions[activeIdx]);
            else if (suggestions.length > 0) triggerSubmit(suggestions[0]);
            else if (query.trim()) triggerSubmit(query.trim());
          }}
          disabled={disabled || !query.trim()}
          aria-label="Submit guess"
        >
          ▶
        </button>
      </div>

      {suggestions.length > 0 && !disabled && (
        <ul
          ref={listRef}
          className="suggestions-list"
          role="listbox"
          aria-label="Title suggestions"
        >
          {suggestions.map((s, i) => (
            <li
              key={s}
              className={`suggestion-item ${i === activeIdx ? 'active' : ''}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={e => { e.preventDefault(); handleSuggestionClick(s); }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
