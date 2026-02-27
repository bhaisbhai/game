import React from 'react';
import { formatElapsed } from '../engine/scoring';
import { getDailyNumber } from '../engine/puzzle';

interface TopBarProps {
  elapsedMs: number;
  attemptsUsed: number;
  maxAttempts: number;
  mode: string;
  onSettings: () => void;
  onHome: () => void;
}

export function TopBar({ elapsedMs, attemptsUsed, maxAttempts, mode, onSettings, onHome }: TopBarProps) {
  return (
    <div className="top-bar">
      <button className="icon-btn" onClick={onHome} aria-label="Home" title="Home">⏮</button>
      <div className="top-bar-center">
        <span className="top-bar-title">📼 Mixtape Masala</span>
        {mode === 'daily' && <span className="top-bar-badge">Mix #{getDailyNumber()}</span>}
        {mode === 'practice' && <span className="top-bar-badge practice">Practice</span>}
      </div>
      <div className="top-bar-stats">
        <span className="stat-pill" aria-label="Time elapsed">{formatElapsed(elapsedMs)}</span>
        <span className="stat-pill" aria-label={`${attemptsUsed} of ${maxAttempts} attempts`}>
          {attemptsUsed}/{maxAttempts}
        </span>
        <button className="icon-btn" onClick={onSettings} aria-label="Settings">⚙️</button>
      </div>
    </div>
  );
}
