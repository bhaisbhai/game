import { QuoteEntry } from './data/quotes';

export type RunStatus = 'playing' | 'won' | 'lost';

export interface GameRun {
  runId: string;
  quote: QuoteEntry;
  status: RunStatus;
  guessedLetters: string[];  // uppercase A-Z letters tried
  wrongLetters: string[];    // subset of guessedLetters not in quote
  hintsUsed: boolean;        // whether emoji hints were revealed
  startedAtMs: number;
  endedAtMs?: number;
  elapsedMs: number;
  solved: boolean;
}

export interface ScoreResult {
  label: string;
  emoji: string;
  points: number;
}

export interface PlayerSettings {
  soundEnabled: boolean;
  reduceMotion: 'system' | 'on' | 'off';
  highContrast: boolean;
}

export interface PlayerStats {
  dailyStreakCurrent: number;
  dailyStreakBest: number;
  lastDailyPlayedDateISO?: string;
  solvedTotal: number;
  gamesPlayed: number;
  shareCount: number;
  // [0wrong, 1wrong, 2wrong, 3wrong, 4-5wrong, failed]
  clueDistribution: [number, number, number, number, number, number];
}

export interface PlayerProfile {
  playerId: string;
  createdAtMs: number;
  settings: PlayerSettings;
  stats: PlayerStats;
}
