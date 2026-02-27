import React from 'react';
import { BeatId, BEAT_MAP } from '../types';

interface CassetteSlotsProps {
  slots: (BeatId | null)[];
  activeSlot: number;
  revealedSlots: Array<{ slotIndex: number; beat: BeatId }>;
  onSlotClick: (index: number) => void;
  disabled: boolean;
}

export function CassetteSlots({ slots, activeSlot, revealedSlots, onSlotClick, disabled }: CassetteSlotsProps) {
  const revealedIndices = new Set(revealedSlots.map(r => r.slotIndex));

  return (
    <div className="cassette-slots" role="group" aria-label="Watchlist sequence — 5 slots to fill">
      {slots.map((beat, i) => {
        const isActive = i === activeSlot && !disabled;
        const isRevealed = revealedIndices.has(i);
        const meta = beat ? BEAT_MAP[beat] : null;

        return (
          <button
            key={i}
            className={`cassette-slot ${isActive ? 'active' : ''} ${beat ? 'filled' : 'empty'} ${isRevealed ? 'revealed' : ''}`}
            onClick={() => !disabled && onSlotClick(i)}
            disabled={disabled}
            aria-label={
              beat
                ? `Slot ${i + 1}: ${meta!.label}${isRevealed ? ' (hint revealed)' : ''}`
                : `Slot ${i + 1}: empty${isActive ? ' (active)' : ''}`
            }
            style={meta ? { '--slot-color': meta.colorToken } as React.CSSProperties : undefined}
          >
            <span className="slot-number">{i + 1}</span>
            {beat && meta ? (
              <span className="slot-emoji" role="img" aria-hidden="true">{meta.emoji}</span>
            ) : (
              <span className="slot-dot" aria-hidden="true">●</span>
            )}
            {isRevealed && <span className="hint-badge" aria-hidden="true">💡</span>}
          </button>
        );
      })}
    </div>
  );
}
