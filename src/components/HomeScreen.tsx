import React from 'react';
import { getDailyNumber, todayISO } from '../engine/puzzle';
import { PlayerStats } from '../types';

interface HomeScreenProps {
  stats: PlayerStats;
  alreadyPlayedToday: boolean;
  onPlayDaily: () => void;
  onPlayPractice: () => void;
  onTutorial: () => void;
  onStats: () => void;
}

export function HomeScreen({ stats, alreadyPlayedToday, onPlayDaily, onPlayPractice, onTutorial, onStats }: HomeScreenProps) {
  const solveRate = stats.gamesPlayed > 0
    ? Math.round((stats.solvedTotal / stats.gamesPlayed) * 100)
    : null;

  return (
    <div className="home-screen">
      <div className="home-hero">
        <div className="film-strip-logo" aria-hidden="true">
          <span className="logo-reel">🎬</span>
        </div>
        <h1 className="home-title">Reel Masala</h1>
        <p className="home-sub">
          Guess the famous film quote
        </p>
        <p className="home-sub2">
          Hollywood · Bollywood · UK · TV · 90s–00s
        </p>
      </div>

      <div className="home-actions">
        <button className="btn-primary" onClick={onPlayDaily}>
          {alreadyPlayedToday ? '📽️ View today\'s result' : `▶ Daily Quote #${getDailyNumber()}`}
          <span className="btn-sub">{todayISO()}</span>
        </button>
        <button className="btn-secondary" onClick={onPlayPractice}>
          🎲 Practice mode
          <span className="btn-sub">Random quote · Unlimited</span>
        </button>
      </div>

      {stats.gamesPlayed > 0 && (
        <button className="home-stats-btn" onClick={onStats} aria-label="View your stats">
          <div className="home-stats-row">
            <div className="home-stat">
              <span className="home-stat-val">{stats.dailyStreakCurrent}</span>
              <span className="home-stat-lbl">Streak 🔥</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-val">{stats.solvedTotal}</span>
              <span className="home-stat-lbl">Solved</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-val">{solveRate !== null ? `${solveRate}%` : '—'}</span>
              <span className="home-stat-lbl">Win rate</span>
            </div>
          </div>
        </button>
      )}

      <div className="home-links">
        <button className="btn-text" onClick={onTutorial}>❓ How to play</button>
      </div>

      <p className="home-tagline">40 quotes · New daily puzzle every midnight · No sign-up</p>
    </div>
  );
}
