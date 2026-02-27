import React, { useEffect, useCallback } from 'react';
import { TopBar } from './TopBar';
import { GuessGrid } from './GuessGrid';
import { CassetteSlots } from './CassetteSlots';
import { BeatPalette } from './BeatPalette';
import { ResultsModal } from './ResultsModal';
import { useGameRun } from '../hooks/useGameRun';
import { useAudio } from '../hooks/useAudio';
import { PuzzleDefinition, BeatId, PlayerProfile } from '../types';
import { getDailyNumber } from '../engine/puzzle';

interface GameScreenProps {
  puzzle: PuzzleDefinition;
  profile: PlayerProfile;
  onHome: () => void;
  onSettings: () => void;
  onShare: (text: string) => void;
  onPlayAgain: () => void;
  onRecordSolve: (score: import('../types').ScoreBreakdown, dateISO?: string) => void;
  onRecordGamePlayed: () => void;
}

export function GameScreen({
  puzzle,
  profile,
  onHome,
  onSettings,
  onShare,
  onPlayAgain,
  onRecordSolve,
  onRecordGamePlayed,
}: GameScreenProps) {
  const { state, startGame, selectBeat, clearSlot, submitGuess, useHint } = useGameRun();
  const { play, playWin } = useAudio(profile.settings.soundEnabled);

  const reduceMotion =
    profile.settings.reduceMotion === 'on' ||
    (profile.settings.reduceMotion === 'system' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Start game on mount
  useEffect(() => {
    startGame(puzzle);
  }, [puzzle, startGame]);

  // Track game end
  useEffect(() => {
    if (!state.run) return;
    if (state.run.status === 'won') {
      if (!reduceMotion) playWin();
      if (state.run.score) onRecordSolve(state.run.score, puzzle.dateISO);
    } else if (state.run.status === 'lost') {
      play('lose');
      onRecordGamePlayed();
    }
  }, [state.run?.status]); // eslint-disable-line

  const handleSelectBeat = useCallback((beat: BeatId) => {
    if (!state.run || state.run.status !== 'in_progress') return;
    play(beat);
    if (profile.settings.hapticsEnabled && navigator.vibrate) navigator.vibrate(15);
    selectBeat(state.activeSlot, beat);
  }, [state.run, state.activeSlot, play, selectBeat, profile.settings.hapticsEnabled]);

  const handleSlotClick = useCallback((index: number) => {
    // Clicking a slot focuses it; if filled, clear it
    if (state.currentSlots[index]) {
      clearSlot(index);
    }
  }, [state.currentSlots, clearSlot]);

  const handleSubmit = useCallback(() => {
    play('submit');
    submitGuess();
  }, [play, submitGuess]);

  const handleHint = useCallback(() => {
    play('hint');
    useHint();
  }, [play, useHint]);

  const handleClear = useCallback(() => {
    clearSlot(state.activeSlot);
  }, [clearSlot, state.activeSlot]);

  const handleShare = useCallback(() => {
    if (!state.run || !state.puzzle) return;
    const { run, puzzle: p } = state;
    const num = p.mode === 'daily' ? `#${getDailyNumber()}` : 'Practice';
    const attempts = run.status === 'won' ? `${run.guesses.length}/${p.maxAttempts}` : 'X/8';
    const ms = run.elapsedMs;
    const secs = Math.floor(ms / 1000);
    const time = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    const hint = run.hintsUsed > 0 ? ' 🌶️' : '';
    const grade = run.score?.grade ? ` [${run.score.grade}]` : '';
    const rows = run.guesses.map(g => g.marks.map(m => ({ exact: '🟩', present: '🟨', absent: '⬛' }[m])).join('')).join('\n');
    const text = `Mixtape Masala — Daily Mix ${num}: ${attempts} in ${time}${hint}${grade} ⏪📼\n\n${rows}\n\nhttps://fantastic-creponne-bc083b.netlify.app`;
    onShare(text);
  }, [state, onShare]);

  if (!state.run || !state.puzzle) return null;

  const done = state.run.status !== 'in_progress';

  return (
    <div className="game-screen">
      <TopBar
        elapsedMs={state.run.elapsedMs}
        attemptsUsed={state.run.guesses.length}
        maxAttempts={state.puzzle.maxAttempts}
        mode={state.puzzle.mode}
        onSettings={onSettings}
        onHome={onHome}
      />

      <div className="game-body">
        <CassetteSlots
          slots={state.currentSlots}
          activeSlot={state.activeSlot}
          revealedSlots={state.run.revealedSlots}
          onSlotClick={handleSlotClick}
          disabled={done}
        />

        <GuessGrid
          guesses={state.run.guesses}
          maxAttempts={state.puzzle.maxAttempts}
          currentSlots={state.currentSlots}
          colourBlind={profile.settings.colourBlindMode}
        />

        <BeatPalette
          activeSlot={state.activeSlot}
          currentSlots={state.currentSlots}
          onSelect={handleSelectBeat}
          onClear={handleClear}
          onSubmit={handleSubmit}
          onHint={handleHint}
          hintsUsed={state.run.hintsUsed}
          disabled={done}
        />
      </div>

      {done && (
        <ResultsModal
          run={state.run}
          puzzle={state.puzzle}
          onShare={handleShare}
          onPlayAgain={onPlayAgain}
          reduceMotion={reduceMotion}
        />
      )}
    </div>
  );
}
