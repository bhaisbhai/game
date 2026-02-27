import React from 'react';
import { PlayerProfile, PlayerSettings } from '../types';

interface StatsModalProps {
  profile: PlayerProfile;
  onUpdateSettings: (p: Partial<PlayerSettings>) => void;
  onClose: () => void;
}

export function StatsModal({ profile, onUpdateSettings, onClose }: StatsModalProps) {
  const { stats, settings } = profile;
  const dist = stats.clueDistribution;
  const maxVal = Math.max(...dist, 1);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Stats & Settings">
      <div className="stats-modal">
        <div className="modal-header">
          <h2>📊 Stats</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="stats-row-top">
          <div className="stat-box"><span className="stat-val">{stats.gamesPlayed}</span><span className="stat-lbl">Played</span></div>
          <div className="stat-box"><span className="stat-val">{stats.solvedTotal}</span><span className="stat-lbl">Solved</span></div>
          <div className="stat-box"><span className="stat-val">{stats.dailyStreakCurrent}🔥</span><span className="stat-lbl">Streak</span></div>
          <div className="stat-box"><span className="stat-val">{stats.dailyStreakBest}</span><span className="stat-lbl">Best</span></div>
        </div>

        <div className="dist-section">
          <p className="dist-title">Clue distribution</p>
          {['1','2','3','4','5','X'].map((label, i) => (
            <div key={i} className="dist-row">
              <span className="dist-label">{label}</span>
              <div className="dist-bar-wrap">
                <div
                  className="dist-bar"
                  style={{ width: `${(dist[i] / maxVal) * 100}%` }}
                  aria-label={`${label} clues: ${dist[i]}`}
                >
                  {dist[i] > 0 && <span className="dist-val">{dist[i]}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="settings-section">
          <p className="settings-title">⚙️ Settings</p>
          <label className="setting-row">
            <span>🔊 Sound</span>
            <input type="checkbox" checked={settings.soundEnabled}
              onChange={e => onUpdateSettings({ soundEnabled: e.target.checked })} />
          </label>
          <label className="setting-row">
            <span>🎨 High contrast</span>
            <input type="checkbox" checked={settings.highContrast}
              onChange={e => onUpdateSettings({ highContrast: e.target.checked })} />
          </label>
          <div className="setting-row">
            <span>🎞️ Motion</span>
            <select value={settings.reduceMotion}
              onChange={e => onUpdateSettings({ reduceMotion: e.target.value as PlayerSettings['reduceMotion'] })}>
              <option value="system">System</option>
              <option value="on">Reduce</option>
              <option value="off">Full</option>
            </select>
          </div>
        </div>

        <p className="privacy-note">🔒 All data stored locally on your device. No account needed.</p>
      </div>
    </div>
  );
}
