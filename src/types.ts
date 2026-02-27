import { FilmEntry, Origin, Genre } from './data/films';

export type { Origin, Genre };

export type RunStatus = 'playing' | 'won' | 'lost';

export interface WrongGuess {
  title: string;
  cluesSeenWhenGuessed: number;
  // metadata comparison feedback
  eraMatch: boolean;
  originMatch: boolean;
  genreMatch: boolean;
}

export interface GameRun {
  runId: string;
  film: FilmEntry;
  status: RunStatus;
  cluesRevealed: number;   // 1..5
  wrongGuesses: WrongGuess[];
  startedAtMs: number;
  endedAtMs?: number;
  elapsedMs: number;
  solved: boolean;
}

export interface ScoreResult {
  cluesUsed: number;
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
  clueDistribution: [number, number, number, number, number, number]; // [1clue, 2, 3, 4, 5, failed]
}

export interface PlayerProfile {
  playerId: string;
  createdAtMs: number;
  settings: PlayerSettings;
  stats: PlayerStats;
}
