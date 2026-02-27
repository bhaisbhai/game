import React from 'react';
import { BeatId, BEATS } from '../types';

interface BeatPaletteProps {
  activeSlot: number;
  currentSlots: (BeatId | null)[];
  onSelect: (beat: BeatId) => void;
  onClear: () => void;
  onSubmit: () => void;
  onHint: () => void;
  hintsUsed: number;
  disabled: boolean;
}

export function BeatPalette({
  activeSlot,
  currentSlots,
  onSelect,
  onClear,
  onSubmit,
  onHint,
  hintsUsed,
  disabled,
}: BeatPaletteProps) {
  const canSubmit = currentSlots.every(Boolean) && !disabled;
  const canHint = hintsUsed < 1 && !disabled;

  return (
    <div className="beat-palette">
      <div className="palette-grid">
        {BEATS.map(beat => (
          <button
            key={beat.id}
            className="beat-btn"
            style={{ '--beat-color': beat.colorToken } as React.CSSProperties}
            onClick={() => { if (!disabled) onSelect(beat.id); }}
            disabled={disabled}
            aria-label={`Select ${beat.label}`}
            title={beat.label}
          >
            <span className="beat-emoji" role="img" aria-hidden="true">{beat.emoji}</span>
            <span className="beat-label">{beat.label}</span>
          </button>
        ))}
      </div>

      <div className="palette-actions">
        <button
          className="action-btn hint-btn"
          onClick={onHint}
          disabled={!canHint}
          aria-label={hintsUsed >= 1 ? 'Hint used' : 'Use spice hint (reveals one slot)'}
          title="Spice hint — reveals one slot"
        >
          {hintsUsed >= 1 ? '🌶️ Used' : '🌶️ Hint'}
        </button>

        <button
          className="action-btn clear-btn"
          onClick={onClear}
          disabled={disabled || currentSlots.every(s => s === null)}
          aria-label={`Clear slot ${activeSlot + 1}`}
        >
          ⌫ Clear
        </button>

        <button
          className="action-btn submit-btn"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Submit guess"
        >
          Submit ▶
        </button>
      </div>
    </div>
  );
}
