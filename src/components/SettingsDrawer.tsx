import React from 'react';
import { PlayerProfile, PlayerSettings } from '../types';

interface SettingsDrawerProps {
  profile: PlayerProfile;
  onUpdateSettings: (patch: Partial<PlayerSettings>) => void;
  onClose: () => void;
}

export function SettingsDrawer({ profile, onUpdateSettings, onClose }: SettingsDrawerProps) {
  const s = profile.settings;

  return (
    <div className="settings-overlay" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="settings-drawer">
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">✕</button>
        </div>

        <div className="settings-body">
          <label className="setting-row">
            <span>🔊 Sound</span>
            <input
              type="checkbox"
              checked={s.soundEnabled}
              onChange={e => onUpdateSettings({ soundEnabled: e.target.checked })}
              aria-label="Toggle sound"
            />
          </label>

          <label className="setting-row">
            <span>📳 Haptics</span>
            <input
              type="checkbox"
              checked={s.hapticsEnabled}
              onChange={e => onUpdateSettings({ hapticsEnabled: e.target.checked })}
              aria-label="Toggle haptics"
            />
          </label>

          <label className="setting-row">
            <span>♿ Colour-blind mode</span>
            <input
              type="checkbox"
              checked={s.colourBlindMode}
              onChange={e => onUpdateSettings({ colourBlindMode: e.target.checked })}
              aria-label="Toggle colour-blind mode"
            />
          </label>

          <label className="setting-row">
            <span>🎨 High contrast</span>
            <input
              type="checkbox"
              checked={s.highContrast}
              onChange={e => onUpdateSettings({ highContrast: e.target.checked })}
              aria-label="Toggle high contrast"
            />
          </label>

          <div className="setting-row">
            <span>🎞️ Motion</span>
            <select
              value={s.reduceMotion}
              onChange={e => onUpdateSettings({ reduceMotion: e.target.value as PlayerSettings['reduceMotion'] })}
              aria-label="Motion preference"
            >
              <option value="system">System default</option>
              <option value="on">Reduce motion</option>
              <option value="off">Full motion</option>
            </select>
          </div>
        </div>

        <div className="settings-stats">
          <h3>📊 Your stats</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-val">{profile.stats.solvesTotal}</span>
              <span className="stat-lbl">Solves</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{profile.stats.dailyStreakCurrent}</span>
              <span className="stat-lbl">Streak</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{profile.stats.dailyStreakBest}</span>
              <span className="stat-lbl">Best streak</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{profile.stats.shareCount}</span>
              <span className="stat-lbl">Shares</span>
            </div>
          </div>
        </div>

        <p className="settings-privacy">
          🔒 No account needed. All data stays on your device.
        </p>
      </div>
    </div>
  );
}
