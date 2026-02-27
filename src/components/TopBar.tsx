import React from 'react';

interface TopBarProps {
  puzzleLabel: string;
  elapsedMs: number;
  attempt: number;
  maxAttempts: number;
  onHome: () => void;
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function TopBar({ puzzleLabel, elapsedMs, attempt, maxAttempts, onHome }: TopBarProps) {
  return (
    <div className="top-bar">
      <button className="icon-btn" onClick={onHome} aria-label="Home">◀</button>
      <div className="top-bar-center">
        <span className="top-bar-title">🎬 REEL MASALA</span>
        <span className="top-bar-badge">{puzzleLabel}</span>
      </div>
      <div className="top-bar-right">
        <span className="stat-pill" aria-label="Time">{fmt(elapsedMs)}</span>
        <span className="stat-pill attempt-pill" aria-label="Attempt">
          {attempt}/{maxAttempts}
        </span>
      </div>
    </div>
  );
}
