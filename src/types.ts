export type GameMode = 'daily' | 'challenge' | 'practice';
export type RunStatus = 'in_progress' | 'won' | 'lost' | 'abandoned';
export type SlotMark = 'exact' | 'present' | 'absent';

export type BeatId =
  | 'Dhol'
  | 'Synth'
  | 'Clap'
  | 'Bass'
  | 'Chime'
  | 'Tabla'
  | 'Disco'
  | 'Snap';

export interface BeatMeta {
  id: BeatId;
  label: string;
  colorToken: string;
  glyph: string;
  emoji: string;
}

export const BEATS: BeatMeta[] = [
  { id: 'Dhol',  label: 'Dhol',  colorToken: '#e85d04', glyph: '🥁', emoji: '🥁' },
  { id: 'Synth', label: 'Synth', colorToken: '#7209b7', glyph: '🎹', emoji: '🎹' },
  { id: 'Clap',  label: 'Clap',  colorToken: '#f72585', glyph: '👏', emoji: '👏' },
  { id: 'Bass',  label: 'Bass',  colorToken: '#4361ee', glyph: '🎸', emoji: '🎸' },
  { id: 'Chime', label: 'Chime', colorToken: '#4cc9f0', glyph: '🔔', emoji: '🔔' },
  { id: 'Tabla', label: 'Tabla', colorToken: '#80b918', glyph: '🪘', emoji: '🪘' },
  { id: 'Disco', label: 'Disco', colorToken: '#ff9e00', glyph: '🪩', emoji: '🪩' },
  { id: 'Snap',  label: 'Snap',  colorToken: '#ef476f', glyph: '🫰', emoji: '🫰' },
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
  secret: BeatId[]; // client-only MVP
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
