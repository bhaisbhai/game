import { useRef, useCallback } from 'react';

type Sound = 'select' | 'wrong' | 'win' | 'lose' | 'reveal' | 'tick';

export function useAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const ctx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, [enabled]);

  const play = useCallback((sound: Sound) => {
    const c = ctx();
    if (!c) return;
    const t = c.currentTime;

    const osc = c.createOscillator();
    const g = c.createGain();
    osc.connect(g); g.connect(c.destination);

    switch (sound) {
      case 'select':
        osc.type = 'sine'; osc.frequency.setValueAtTime(660, t);
        g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t); osc.stop(t + 0.09); break;

      case 'wrong':
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, t);
        osc.frequency.linearRampToValueAtTime(150, t + 0.15);
        g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t); osc.stop(t + 0.21); break;

      case 'reveal': {
        // Upward chime — new clue!
        const freqs = [523, 659, 784];
        freqs.forEach((f, i) => {
          const o2 = c.createOscillator(); const g2 = c.createGain();
          o2.connect(g2); g2.connect(c.destination);
          const st = t + i * 0.07;
          o2.type = 'sine'; o2.frequency.setValueAtTime(f, st);
          g2.gain.setValueAtTime(0, st); g2.gain.linearRampToValueAtTime(0.2, st + 0.02);
          g2.gain.exponentialRampToValueAtTime(0.001, st + 0.25);
          o2.start(st); o2.stop(st + 0.26);
        });
        break;
      }

      case 'win': {
        // Ascending fanfare
        [523, 659, 784, 1046, 1318].forEach((f, i) => {
          const o2 = c.createOscillator(); const g2 = c.createGain();
          o2.connect(g2); g2.connect(c.destination);
          const st = t + i * 0.1;
          o2.type = 'sine'; o2.frequency.setValueAtTime(f, st);
          g2.gain.setValueAtTime(0, st); g2.gain.linearRampToValueAtTime(0.35, st + 0.02);
          g2.gain.exponentialRampToValueAtTime(0.001, st + 0.5);
          o2.start(st); o2.stop(st + 0.51);
        });
        break;
      }

      case 'lose':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t); osc.frequency.linearRampToValueAtTime(100, t + 0.6);
        g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.start(t); osc.stop(t + 0.61); break;

      case 'tick':
        osc.type = 'sine'; osc.frequency.setValueAtTime(880, t);
        g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.start(t); osc.stop(t + 0.05); break;
    }
  }, [ctx]);

  return { play };
}
