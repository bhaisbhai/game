import React from 'react';
import { getDailyNumber, todayISO } from '../engine/puzzle';
import { PlayerStats } from '../types';

interface HomeScreenProps {
  stats: PlayerStats;
  alreadyPlayedToday: boolean;
  onPlayDaily: () => void;
  onPlayPractice: () => void;
  onTutorial: () => void;
}

export function HomeScreen({ stats, alreadyPlayedToday, onPlayDaily, onPlayPractice, onTutorial }: HomeScreenProps) {
  return (
    <div className="home-screen">
      <div className="home-hero">
        <div className="cassette-logo" aria-hidden="true">
          <span className="cassette-big">📼</span>
          <div className="cassette-reels">
            <span className="reel reel-left" />
            <span className="reel reel-right" />
          </div>
        </div>
        <h1 className="home-title">Mixtape Masala</h1>
        <p className="home-sub">Daily film &amp; TV puzzle · Decode the 5-title watchlist</p>
      </div>

      <div className="home-actions">
        <button
          className="btn-primary"
          onClick={onPlayDaily}
          aria-label={alreadyPlayedToday ? 'View today\'s result' : `Play Daily Mix #${getDailyNumber()}`}
        >
          {alreadyPlayedToday ? '📼 View today\'s result' : `▶ Daily Mix #${getDailyNumber()}`}
          <span className="btn-sub">{todayISO()}</span>
        </button>

        <button className="btn-secondary" onClick={onPlayPractice} aria-label="Play practice mode">
          🎛️ Practice mode
          <span className="btn-sub">Unlimited plays</span>
        </button>
      </div>

      {stats.gamesPlayed > 0 && (
        <div className="home-stats">
          <div className="home-stat">
            <span className="home-stat-val">{stats.dailyStreakCurrent}</span>
            <span className="home-stat-lbl">Day streak 🔥</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-val">{stats.solvesTotal}</span>
            <span className="home-stat-lbl">Solved</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-val">{stats.dailyStreakBest}</span>
            <span className="home-stat-lbl">Best streak</span>
          </div>
        </div>
      )}

      <button className="btn-how" onClick={onTutorial} aria-label="How to play">
        ❓ How to play
      </button>

      <p className="home-tagline">
        90s &amp; 00s films, Bollywood &amp; TV · New watchlist every day · No sign-up needed
      </p>
    </div>
  );
}
