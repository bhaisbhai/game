import { useRef, useCallback } from 'react';
import { BeatId } from '../types';

// Synthesize beat stabs using Web Audio API — no audio files needed
type SoundType = BeatId | 'click' | 'submit' | 'win' | 'lose' | 'hint';

interface BeatSynthParams {
  type: OscillatorType;
  freq: number;
  freq2?: number;
  gain: number;
  duration: number;
  attack: number;
  decay: number;
}

const BEAT_SYNTH: Record<SoundType, BeatSynthParams> = {
  Dhol:   { type: 'sawtooth', freq: 80,   gain: 0.6, duration: 0.18, attack: 0.005, decay: 0.15 },
  Synth:  { type: 'square',   freq: 440,  freq2: 880, gain: 0.4, duration: 0.2, attack: 0.01, decay: 0.15 },
  Clap:   { type: 'square',   freq: 1200, gain: 0.5, duration: 0.12, attack: 0.001, decay: 0.1 },
  Bass:   { type: 'sawtooth', freq: 55,   gain: 0.7, duration: 0.25, attack: 0.005, decay: 0.2 },
  Chime:  { type: 'sine',     freq: 1760, gain: 0.4, duration: 0.35, attack: 0.005, decay: 0.3 },
  Tabla:  { type: 'triangle', freq: 120,  gain: 0.6, duration: 0.15, attack: 0.003, decay: 0.12 },
  Disco:  { type: 'square',   freq: 660,  freq2: 880, gain: 0.4, duration: 0.2, attack: 0.01, decay: 0.15 },
  Snap:   { type: 'triangle', freq: 900,  gain: 0.5, duration: 0.08, attack: 0.001, decay: 0.07 },
  click:  { type: 'sine',     freq: 600,  gain: 0.2, duration: 0.06, attack: 0.001, decay: 0.05 },
  submit: { type: 'square',   freq: 440,  freq2: 550, gain: 0.3, duration: 0.15, attack: 0.01, decay: 0.12 },
  win:    { type: 'sine',     freq: 523,  freq2: 659, gain: 0.5, duration: 0.6, attack: 0.02, decay: 0.5 },
  lose:   { type: 'sawtooth', freq: 200,  gain: 0.4, duration: 0.5, attack: 0.01, decay: 0.4 },
  hint:   { type: 'sine',     freq: 880,  gain: 0.3, duration: 0.2, attack: 0.005, decay: 0.18 },
};

export function useAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, [enabled]);

  const play = useCallback((sound: SoundType) => {
    const ctx = getCtx();
    if (!ctx) return;

    const params = BEAT_SYNTH[sound];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = params.type;
    osc.frequency.setValueAtTime(params.freq, now);
    if (params.freq2) {
      osc.frequency.linearRampToValueAtTime(params.freq2, now + params.duration * 0.5);
    }

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(params.gain, now + params.attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + params.duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + params.duration + 0.01);

    // For bass-y sounds add a second lower osc for body
    if (sound === 'Dhol' || sound === 'Bass' || sound === 'Tabla') {
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(params.freq * 0.5, now);
      osc2.frequency.exponentialRampToValueAtTime(params.freq * 0.2, now + params.duration);
      g2.gain.setValueAtTime(0, now);
      g2.gain.linearRampToValueAtTime(params.gain * 0.8, now + params.attack);
      g2.gain.exponentialRampToValueAtTime(0.001, now + params.duration * 0.8);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + params.duration * 0.8 + 0.01);
    }
  }, [getCtx]);

  const playWin = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const notes = [523, 659, 784, 1046];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const t = ctx.currentTime + i * 0.12;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.41);
    });
  }, [getCtx]);

  return { play, playWin };
}
