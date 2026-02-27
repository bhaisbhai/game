import React, { useEffect, useRef } from 'react';
import { GameRun, PuzzleDefinition, BEAT_MAP, Guess, SlotMark } from '../types';
import { formatElapsed } from '../engine/scoring';
import { getDailyNumber } from '../engine/puzzle';

interface ResultsModalProps {
  run: GameRun;
  puzzle: PuzzleDefinition;
  onShare: () => void;
  onPlayAgain: () => void;
  reduceMotion: boolean;
}

const GRID_MARKS: Record<SlotMark, string> = {
  exact: '🟩',
  present: '🟨',
  absent: '⬛',
};

function buildShareText(run: GameRun, puzzle: PuzzleDefinition): string {
  const num = puzzle.mode === 'daily' ? `#${getDailyNumber()}` : 'Practice';
  const attempts = run.status === 'won' ? `${run.guesses.length}/${puzzle.maxAttempts}` : 'X/8';
  const time = formatElapsed(run.elapsedMs);
  const hint = run.hintsUsed > 0 ? ' 🌶️' : '';
  const grade = run.score?.grade ?? '';

  const rows = run.guesses.map((g: Guess) => g.marks.map((m: SlotMark) => GRID_MARKS[m]).join('')).join('\n');

  return `Mixtape Masala — Daily Mix ${num}: ${attempts} in ${time}${hint} [${grade}]\n\n${rows}\n\nhttps://fantastic-creponne-bc083b.netlify.app`;
}

export function ResultsModal({ run, puzzle, onShare, onPlayAgain, reduceMotion }: ResultsModalProps) {
  const won = run.status === 'won';
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return (
    <div className={`results-overlay ${won ? 'won' : 'lost'}`} role="dialog" aria-modal="true" aria-label="Results">
      <div className={`results-modal ${!reduceMotion ? 'animate-in' : ''}`} ref={dialogRef} tabIndex={-1}>

        {/* Cassette header */}
        <div className={`cassette-header ${!reduceMotion ? 'spin' : ''}`}>
          <span className="cassette-icon" aria-hidden="true">📼</span>
          {won
            ? <span className="rewind-badge" aria-hidden="true">⏪ REWOUND</span>
            : <span className="rewind-badge lost" aria-hidden="true">📼 TAPE SNAP</span>
          }
        </div>

        {won ? (
          <h2 className="result-headline">🎉 You cracked it!</h2>
        ) : (
          <h2 className="result-headline">Better luck tomorrow</h2>
        )}

        {/* Score */}
        {run.score && (
          <div className="score-block">
            <span className={`grade grade-${run.score.grade}`}>{run.score.grade}</span>
            <span className="score-raw">{run.score.raw}</span>
          </div>
        )}

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-val">{won ? run.guesses.length : 'X'}/{puzzle.maxAttempts}</span>
            <span className="stat-lbl">Attempts</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">{formatElapsed(run.elapsedMs)}</span>
            <span className="stat-lbl">Time</span>
          </div>
          {run.hintsUsed > 0 && (
            <div className="stat-box">
              <span className="stat-val">🌶️ 1</span>
              <span className="stat-lbl">Hint used</span>
            </div>
          )}
        </div>

        {/* Secret reveal */}
        <div className="secret-reveal">
          <p className="secret-label">Today's mix was:</p>
          <div className="secret-row">
            {puzzle.secret.map((beat, i) => (
              <div key={i} className="secret-tile" style={{ '--beat-color': BEAT_MAP[beat].colorToken } as React.CSSProperties}>
                <span className="tile-emoji" role="img" aria-label={BEAT_MAP[beat].label}>{BEAT_MAP[beat].emoji}</span>
                <span className="tile-name">{BEAT_MAP[beat].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Share grid preview */}
        <div className="share-preview" aria-label="Share grid preview">
          {run.guesses.map((g, gi) => (
            <div key={gi} className="share-row">
              {g.marks.map((m, mi) => (
                <span key={mi} className={`share-block mark-${m}`} aria-hidden="true" />
              ))}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="results-actions">
          <button className="btn-share" onClick={onShare} aria-label="Share your result">
            ⏪ Share result
          </button>
          {puzzle.mode === 'practice' && (
            <button className="btn-again" onClick={onPlayAgain} aria-label="Play again">
              🔄 New mix
            </button>
          )}
        </div>

        {/* Share text copy area (hidden, for clipboard fallback) */}
        <textarea
          id="share-text-area"
          readOnly
          value={buildShareText(run, puzzle)}
          style={{ position: 'absolute', left: '-9999px', top: 0 }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
