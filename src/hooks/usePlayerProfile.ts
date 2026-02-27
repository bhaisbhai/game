import { useState, useCallback } from 'react';
import { PlayerProfile, PlayerSettings, PlayerStats, ScoreBreakdown } from '../types';
import { todayISO } from '../engine/puzzle';

const STORAGE_KEY = 'mixtape_masala_profile_v1';

function defaultProfile(): PlayerProfile {
  return {
    playerId: crypto.randomUUID(),
    createdAtMs: Date.now(),
    settings: {
      soundEnabled: true,
      hapticsEnabled: true,
      reduceMotion: 'system',
      colourBlindMode: false,
      highContrast: false,
    },
    stats: {
      dailyStreakCurrent: 0,
      dailyStreakBest: 0,
      solvesTotal: 0,
      totalTimeMs: 0,
      shareCount: 0,
      gamesPlayed: 0,
    },
  };
}

function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PlayerProfile;
  } catch {}
  return defaultProfile();
}

function saveProfile(p: PlayerProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function usePlayerProfile() {
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);

  const updateSettings = useCallback((patch: Partial<PlayerSettings>) => {
    setProfile(prev => {
      const next = { ...prev, settings: { ...prev.settings, ...patch } };
      saveProfile(next);
      return next;
    });
  }, []);

  const recordSolve = useCallback((score: ScoreBreakdown, dateISO?: string) => {
    setProfile(prev => {
      const stats: PlayerStats = { ...prev.stats };
      const today = dateISO ?? todayISO();
      stats.solvesTotal += 1;
      stats.gamesPlayed += 1;
      stats.totalTimeMs += score.timeMs;

      if (stats.lastDailyPlayedDateISO) {
        const last = new Date(stats.lastDailyPlayedDateISO);
        const todayD = new Date(today);
        const diff = Math.round((todayD.getTime() - last.getTime()) / 86400000);
        if (diff === 1) stats.dailyStreakCurrent += 1;
        else if (diff > 1) stats.dailyStreakCurrent = 1;
      } else {
        stats.dailyStreakCurrent = 1;
      }
      stats.dailyStreakBest = Math.max(stats.dailyStreakBest, stats.dailyStreakCurrent);
      stats.lastDailyPlayedDateISO = today;

      const next = { ...prev, stats };
      saveProfile(next);
      return next;
    });
  }, []);

  const recordGamePlayed = useCallback(() => {
    setProfile(prev => {
      const next = { ...prev, stats: { ...prev.stats, gamesPlayed: prev.stats.gamesPlayed + 1 } };
      saveProfile(next);
      return next;
    });
  }, []);

  const recordShare = useCallback(() => {
    setProfile(prev => {
      const next = { ...prev, stats: { ...prev.stats, shareCount: prev.stats.shareCount + 1 } };
      saveProfile(next);
      return next;
    });
  }, []);

  return { profile, updateSettings, recordSolve, recordShare, recordGamePlayed };
}
