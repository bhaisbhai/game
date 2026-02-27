import { BeatId, Guess, SlotMark } from '../types';

export function evaluateGuess(guess: BeatId[], secret: BeatId[]): Omit<Guess, 'guessId' | 'submittedAtMs'> {
  const marks: SlotMark[] = guess.map((beat, i) => {
    if (beat === secret[i]) return 'exact';
    if (secret.includes(beat)) return 'present';
    return 'absent';
  });

  const exactCount = marks.filter(m => m === 'exact').length;
  const presentCount = marks.filter(m => m === 'present').length;

  return { beats: guess, marks, exactCount, presentCount };
}
