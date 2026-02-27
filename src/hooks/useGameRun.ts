import { useReducer, useEffect, useRef, useCallback } from 'react';
import { GameState, GameAction, GameRun, PuzzleDefinition, BeatId } from '../types';
import { evaluateGuess } from '../engine/evaluate';
import { computeScore } from '../engine/scoring';

function initRun(puzzle: PuzzleDefinition): GameRun {
  return {
    runId: crypto.randomUUID(),
    puzzleId: puzzle.puzzleId,
    mode: puzzle.mode,
    status: 'in_progress',
    startedAtMs: Date.now(),
    elapsedMs: 0,
    guesses: [],
    hintsUsed: 0,
    revealedSlots: [],
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      return {
        run: initRun(action.puzzle),
        puzzle: action.puzzle,
        currentSlots: Array(5).fill(null),
        activeSlot: 0,
      };
    }

    case 'SELECT_BEAT': {
      if (!state.run || state.run.status !== 'in_progress') return state;
      const slots = [...state.currentSlots];
      slots[action.slotIndex] = action.beat;
      const nextEmpty = slots.findIndex((s, i) => i > action.slotIndex && s === null);
      const activeSlot = nextEmpty !== -1 ? nextEmpty : action.slotIndex;
      return { ...state, currentSlots: slots, activeSlot };
    }

    case 'CLEAR_SLOT': {
      if (!state.run || state.run.status !== 'in_progress') return state;
      const slots = [...state.currentSlots];
      slots[action.slotIndex] = null;
      return { ...state, currentSlots: slots, activeSlot: action.slotIndex };
    }

    case 'SUBMIT_GUESS': {
      if (!state.run || !state.puzzle || state.run.status !== 'in_progress') return state;
      const filled = state.currentSlots.filter(Boolean) as BeatId[];
      if (filled.length !== 5) return state;

      const result = evaluateGuess(filled, state.puzzle.secret);
      const guess = {
        guessId: crypto.randomUUID(),
        submittedAtMs: Date.now(),
        ...result,
      };

      const guesses = [...state.run.guesses, guess];
      const won = result.exactCount === 5;
      const lost = !won && guesses.length >= state.puzzle.maxAttempts;

      let run: GameRun = { ...state.run, guesses };
      if (won || lost) {
        const endedAtMs = Date.now();
        const elapsedMs = endedAtMs - run.startedAtMs;
        const score = won ? computeScore(guesses.length, elapsedMs, run.hintsUsed) : undefined;
        run = { ...run, status: won ? 'won' : 'lost', endedAtMs, elapsedMs, score };
      }

      return {
        ...state,
        run,
        currentSlots: Array(5).fill(null),
        activeSlot: 0,
      };
    }

    case 'USE_HINT': {
      if (!state.run || !state.puzzle || state.run.status !== 'in_progress') return state;
      if (state.run.hintsUsed >= 1) return state;

      // Find an unrevealed slot
      const guessed = new Set(state.run.revealedSlots.map(r => r.slotIndex));
      const candidateSlots = [0, 1, 2, 3, 4].filter(i => !guessed.has(i));
      if (candidateSlots.length === 0) return state;

      const slotIndex = candidateSlots[Math.floor(Math.random() * candidateSlots.length)];
      const beat = state.puzzle.secret[slotIndex];
      const revealed = [...state.run.revealedSlots, { slotIndex, beat }];
      const slots = [...state.currentSlots];
      slots[slotIndex] = beat;

      return {
        ...state,
        run: { ...state.run, hintsUsed: 1, revealedSlots: revealed },
        currentSlots: slots,
      };
    }

    case 'TICK': {
      if (!state.run || state.run.status !== 'in_progress') return state;
      return {
        ...state,
        run: { ...state.run, elapsedMs: action.nowMs - state.run.startedAtMs },
      };
    }

    case 'RESET':
      return { run: null, puzzle: null, currentSlots: Array(5).fill(null), activeSlot: 0 };

    default:
      return state;
  }
}

const initialState: GameState = {
  run: null,
  puzzle: null,
  currentSlots: Array(5).fill(null),
  activeSlot: 0,
};

export function useGameRun() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.run?.status === 'in_progress') {
      tickRef.current = window.setInterval(() => {
        dispatch({ type: 'TICK', nowMs: Date.now() });
      }, 1000);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [state.run?.status]);

  const startGame = useCallback((puzzle: PuzzleDefinition) => {
    dispatch({ type: 'START_GAME', puzzle });
  }, []);

  const selectBeat = useCallback((slotIndex: number, beat: BeatId) => {
    dispatch({ type: 'SELECT_BEAT', slotIndex, beat });
  }, []);

  const clearSlot = useCallback((slotIndex: number) => {
    dispatch({ type: 'CLEAR_SLOT', slotIndex });
  }, []);

  const submitGuess = useCallback(() => {
    dispatch({ type: 'SUBMIT_GUESS' });
  }, []);

  const useHint = useCallback(() => {
    dispatch({ type: 'USE_HINT' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return { state, startGame, selectBeat, clearSlot, submitGuess, useHint, reset };
}
