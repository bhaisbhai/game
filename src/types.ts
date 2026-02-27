export type GameMode = 'daily' | 'challenge' | 'practice';
export type RunStatus = 'in_progress' | 'won' | 'lost' | 'abandoned';
export type SlotMark = 'exact' | 'present' | 'absent';

// 12 iconic 90s–00s titles: Western films, Bollywood, & UK-popular shows
export type BeatId =
  | 'Matrix'
  | 'Titanic'
  | 'Friends'
  | 'Gladiator'
  | 'DDLJ'
  | 'KKCH'
  | 'Lagaan'
  | 'DCH'
  | 'SisterSister'
  | 'Neighbours'
  | 'KenanKel'
  | 'FreshPrince';

export interface BeatMeta {
  id: BeatId;
  label: string;
  sublabel: string;
  colorToken: string;
  emoji: string;
  glyph: string;
}

export const BEATS: BeatMeta[] = [
  // Western films
  { id: 'Matrix',      label: 'The Matrix',     sublabel: '1999 · Sci-fi',     colorToken: '#39ff14', emoji: '🕶️', glyph: '🕶️' },
  { id: 'Titanic',     label: 'Titanic',         sublabel: '1997 · Drama',      colorToken: '#4cc9f0', emoji: '🚢', glyph: '🚢' },
  { id: 'Gladiator',   label: 'Gladiator',       sublabel: '2000 · Action',     colorToken: '#e85d04', emoji: '⚔️', glyph: '⚔️' },
  // Bollywood
  { id: 'DDLJ',        label: 'DDLJ',            sublabel: '1995 · Bollywood',  colorToken: '#ffd60a', emoji: '🌻', glyph: '🌻' },
  { id: 'KKCH',        label: 'Kuch Kuch',       sublabel: '1998 · Bollywood',  colorToken: '#f72585', emoji: '❤️', glyph: '❤️' },
  { id: 'Lagaan',      label: 'Lagaan',          sublabel: '2001 · Bollywood',  colorToken: '#80b918', emoji: '🏏', glyph: '🏏' },
  { id: 'DCH',         label: 'Dil Chahta Hai',  sublabel: '2001 · Bollywood',  colorToken: '#7209b7', emoji: '🎭', glyph: '🎭' },
  // TV — UK-popular shows
  { id: 'Friends',     label: 'Friends',         sublabel: '1994 · TV',         colorToken: '#ff9e00', emoji: '☕', glyph: '☕' },
  { id: 'SisterSister',label: 'Sister Sister',   sublabel: '1994 · TV',         colorToken: '#ff6b9d', emoji: '👯', glyph: '👯' },
  { id: 'Neighbours',  label: 'Neighbours',      sublabel: '90s · UK/Aus TV',   colorToken: '#06d6a0', emoji: '🏡', glyph: '🏡' },
  { id: 'KenanKel',    label: 'Kenan & Kel',     sublabel: '1996 · TV',         colorToken: '#ff6600', emoji: '🧴', glyph: '🧴' },
  { id: 'FreshPrince', label: 'Fresh Prince',    sublabel: '1990 · TV',         colorToken: '#9b5de5', emoji: '👑', glyph: '👑' },
];

export const BEAT_MAP: Record<BeatId, BeatMeta> = Object.fromEntries(
  BEATS.map(b => [b.id, b])
) as Record<BeatId, BeatMeta>;

export interface PuzzleDefinition {
  puzzleId: string;
  mode: GameMode;
  dateISO?: string;
  seed: string;
  allowedBeats: BeatId[];
  secretLength: 5;
  maxAttempts: 8;
  secret: BeatId[];
}

export interface Guess {
  guessId: string;
  beats: BeatId[];
  submittedAtMs: number;
  marks: SlotMark[];
  presentCount: number;
  exactCount: number;
}

export interface GameRun {
  runId: string;
  puzzleId: string;
  mode: GameMode;
  status: RunStatus;
  startedAtMs: number;
  endedAtMs?: number;
  elapsedMs: number;
  guesses: Guess[];
  hintsUsed: number;
  revealedSlots: Array<{ slotIndex: number; beat: BeatId }>;
  score?: ScoreBreakdown;
}

export interface ScoreBreakdown {
  attemptsUsed: number;
  maxAttempts: number;
  timeMs: number;
  hintPenalty: number;
  raw: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface PlayerSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reduceMotion: 'system' | 'on' | 'off';
  colourBlindMode: boolean;
  highContrast: boolean;
}

export interface PlayerStats {
  dailyStreakCurrent: number;
  dailyStreakBest: number;
  lastDailyPlayedDateISO?: string;
  solvesTotal: number;
  totalTimeMs: number;
  shareCount: number;
  gamesPlayed: number;
}

export interface PlayerProfile {
  playerId: string;
  createdAtMs: number;
  settings: PlayerSettings;
  stats: PlayerStats;
}

export type AppScreen = 'home' | 'game' | 'tutorial';

export type GameAction =
  | { type: 'START_GAME'; puzzle: PuzzleDefinition }
  | { type: 'SELECT_BEAT'; slotIndex: number; beat: BeatId }
  | { type: 'CLEAR_SLOT'; slotIndex: number }
  | { type: 'SUBMIT_GUESS' }
  | { type: 'USE_HINT' }
  | { type: 'TICK'; nowMs: number }
  | { type: 'RESET' };

export interface GameState {
  run: GameRun | null;
  puzzle: PuzzleDefinition | null;
  currentSlots: (BeatId | null)[];
  activeSlot: number;
}
