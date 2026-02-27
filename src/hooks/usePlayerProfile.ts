import { useState, useCallback } from 'react';
import { PlayerProfile, PlayerSettings, PlayerStats } from '../types';
import { todayISO } from '../engine/puzzle';

const KEY = 'reel_masala_profile_v1';

function defaultProfile(): PlayerProfile {
  return {
    playerId: crypto.randomUUID(),
    createdAtMs: Date.now(),
    settings: { soundEnabled: true, reduceMotion: 'system', highContrast: false },
    stats: {
      dailyStreakCurrent: 0, dailyStreakBest: 0,
      solvedTotal: 0, gamesPlayed: 0, shareCount: 0,
      clueDistribution: [0, 0, 0, 0, 0, 0],
    },
  };
}

function load(): PlayerProfile {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch {}
  return defaultProfile();
}

function save(p: PlayerProfile) { localStorage.setItem(KEY, JSON.stringify(p)); }

export function usePlayerProfile() {
  const [profile, setProfile] = useState<PlayerProfile>(load);

  const updateSettings = useCallback((patch: Partial<PlayerSettings>) => {
    setProfile(prev => { const n = { ...prev, settings: { ...prev.settings, ...patch } }; save(n); return n; });
  }, []);

  // wrongCount: number of wrong guesses (0 = perfect, 5 = barely survived)
  const recordResult = useCallback((wrongCount: number, solved: boolean, dateISO?: string) => {
    setProfile(prev => {
      const s: PlayerStats = { ...prev.stats };
      const dist: [number,number,number,number,number,number] = [...s.clueDistribution] as [number,number,number,number,number,number];
      // dist[0]=0wrong, [1]=1wrong, [2]=2wrong, [3]=3wrong, [4]=4-5wrong, [5]=failed
      if (solved) { dist[Math.min(wrongCount, 4)]++; s.solvedTotal++; } else { dist[5]++; }
      s.gamesPlayed++;
      s.clueDistribution = dist;

      if (dateISO) {
        const today = dateISO ?? todayISO();
        if (s.lastDailyPlayedDateISO) {
          const last = new Date(s.lastDailyPlayedDateISO);
          const diff = Math.round((new Date(today).getTime() - last.getTime()) / 86400000);
          s.dailyStreakCurrent = diff === 1 ? s.dailyStreakCurrent + 1 : 1;
        } else { s.dailyStreakCurrent = 1; }
        s.dailyStreakBest = Math.max(s.dailyStreakBest, s.dailyStreakCurrent);
        s.lastDailyPlayedDateISO = today;
      }

      const n = { ...prev, stats: s }; save(n); return n;
    });
  }, []);

  const recordShare = useCallback(() => {
    setProfile(prev => { const n = { ...prev, stats: { ...prev.stats, shareCount: prev.stats.shareCount + 1 } }; save(n); return n; });
  }, []);

  return { profile, updateSettings, recordResult, recordShare };
}
