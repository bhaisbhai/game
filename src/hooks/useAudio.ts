import { useRef, useCallback } from 'react';
import { BeatId } from '../types';

// Each title gets a unique synthesized "cinema" tone — no audio files needed
type SoundType = BeatId | 'click' | 'submit' | 'win' | 'lose' | 'hint';

interface SynthParams {
  type: OscillatorType;
  freq: number;
  freq2?: number;
  gain: number;
  duration: number;
  attack: number;
  decay: number;
}

const SYNTH_MAP: Record<SoundType, SynthParams> = {
  // Titles — each a short distinctive cinematic tone
  Matrix:    { type: 'sawtooth', freq: 110,  freq2: 55,  gain: 0.5, duration: 0.22, attack: 0.01, decay: 0.18 }, // deep bass
  Titanic:   { type: 'sine',     freq: 523,  freq2: 659, gain: 0.4, duration: 0.35, attack: 0.02, decay: 0.3  }, // soaring melody
  Friends:   { type: 'square',   freq: 660,  gain: 0.35, duration: 0.18, attack: 0.01, decay: 0.15 },             // upbeat pluck
  Gladiator: { type: 'sawtooth', freq: 220,  freq2: 165, gain: 0.55, duration: 0.25, attack: 0.005, decay: 0.2 }, // heroic brass
  DDLJ:      { type: 'sine',     freq: 784,  freq2: 880, gain: 0.4, duration: 0.3, attack: 0.01, decay: 0.25 },  // flute-like
  KKCH:      { type: 'triangle', freq: 880,  gain: 0.4, duration: 0.28, attack: 0.02, decay: 0.24 },              // warm melody
  Lagaan:    { type: 'triangle', freq: 440,  freq2: 330, gain: 0.45, duration: 0.22, attack: 0.01, decay: 0.18 }, // folk
  DCH:       { type: 'square',   freq: 550,  freq2: 660, gain: 0.35, duration: 0.2, attack: 0.01, decay: 0.16 }, // jazzy
  // UK-popular TV shows
  SisterSister:  { type: 'triangle', freq: 740,  freq2: 880, gain: 0.38, duration: 0.22, attack: 0.01, decay: 0.18 },
  Neighbours:    { type: 'sine',     freq: 392,  freq2: 494, gain: 0.4,  duration: 0.28, attack: 0.015, decay: 0.24 },
  KenanKel:      { type: 'square',   freq: 587,  freq2: 440, gain: 0.35, duration: 0.18, attack: 0.01, decay: 0.14 },
  FreshPrince:   { type: 'sawtooth', freq: 349,  freq2: 523, gain: 0.42, duration: 0.25, attack: 0.01, decay: 0.2  },
  // UI sounds
  click:     { type: 'sine',     freq: 600,  gain: 0.15, duration: 0.06, attack: 0.001, decay: 0.05 },
  submit:    { type: 'square',   freq: 440,  freq2: 550, gain: 0.25, duration: 0.15, attack: 0.01, decay: 0.12 },
  win:       { type: 'sine',     freq: 523,  freq2: 659, gain: 0.5, duration: 0.6,  attack: 0.02, decay: 0.5  },
  lose:      { type: 'sawtooth', freq: 200,  gain: 0.35, duration: 0.5,  attack: 0.01, decay: 0.4  },
  hint:      { type: 'sine',     freq: 880,  gain: 0.3, duration: 0.2,  attack: 0.005, decay: 0.18 },
};

export function useAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, [enabled]);

  const play = useCallback((sound: SoundType) => {
    const ctx = getCtx();
    if (!ctx) return;
    const p = SYNTH_MAP[sound];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = p.type;
    osc.frequency.setValueAtTime(p.freq, now);
    if (p.freq2) osc.frequency.linearRampToValueAtTime(p.freq2, now + p.duration * 0.5);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(p.gain, now + p.attack);
    g.gain.exponentialRampToValueAtTime(0.001, now + p.duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + p.duration + 0.01);
  }, [getCtx]);

  const playWin = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    // Ascending fanfare — cinematic
    const notes = [523, 659, 784, 1046, 1318];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const t = ctx.currentTime + i * 0.11;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.35, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.46);
    });
  }, [getCtx]);

  return { play, playWin };
}
