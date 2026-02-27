import React, { useEffect, useRef } from 'react';
import { GameRun } from '../types';
import { computeScore, getDailyNumber, buildShareText } from '../engine/puzzle';
import { MAX_WRONG } from '../hooks/useGameRun';

interface ResultsModalProps {
  run: GameRun;
  isDaily: boolean;
  onShare: (text: string) => void;
  onPlayAgain: () => void;
  reduceMotion: boolean;
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function ResultsModal({ run, isDaily, onShare, onPlayAgain, reduceMotion }: ResultsModalProps) {
  const wrongCount = run.wrongLetters.length;
  const score = computeScore(wrongCount, run.solved);
  const dailyNum = isDaily ? getDailyNumber() : undefined;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => { dialogRef.current?.focus(); }, []);

  const handleShare = () => onShare(buildShareText(run, dailyNum));

  return (
    <div className="results-overlay" role="dialog" aria-modal="true">
      <div className={`results-modal ${!reduceMotion ? 'animate-in' : ''}`} ref={dialogRef} tabIndex={-1}>

        {/* Score header */}
        <div className="result-score-block">
          <span className="result-emoji" role="img">{score.emoji}</span>
          <div className="result-text">
            <p className="result-label">{score.label}</p>
            <p className="result-points">
              {run.solved
                ? `${wrongCount} wrong letter${wrongCount !== 1 ? 's' : ''} · ${score.points} pts`
                : 'No points — better luck next time!'}
            </p>
          </div>
        </div>

        {/* Full quote revealed */}
        <div className="quote-reveal">
          <p className="quote-reveal-label">{run.solved ? 'You got it!' : 'The quote was:'}</p>
          <blockquote className="quote-reveal-text">
            &ldquo;{run.quote.quote}&rdquo;
          </blockquote>
        </div>

        {/* Film reveal */}
        <div className="film-reveal">
          <p className="film-reveal-label">From</p>
          <p className="film-title-big">{run.quote.film}</p>
          <p className="film-meta">
            {run.quote.year}
            {run.quote.character ? ` · Said by ${run.quote.character}` : ''}
          </p>
        </div>

        {/* All emoji hints */}
        <div className="results-emojis">
          <p className="all-clues-label">Film hints:</p>
          <div className="results-emoji-row">
            {run.quote.emojis.map((e, i) => (
              <span key={i} className="results-hint-emoji" role="img">{e}</span>
            ))}
          </div>
        </div>

        {/* Fun fact */}
        {run.quote.funFact && (
          <div className="fun-fact">
            <span className="fun-fact-icon">🍿</span>
            <p className="fun-fact-text">{run.quote.funFact}</p>
          </div>
        )}

        {/* Stats */}
        <div className="result-stats">
          <div className="stat-box">
            <span className="stat-val">{run.solved ? `${wrongCount}` : '✗'}</span>
            <span className="stat-lbl">Wrong letters</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">{run.guessedLetters.length}</span>
            <span className="stat-lbl">Letters tried</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">{fmt(run.elapsedMs)}</span>
            <span className="stat-lbl">Time</span>
          </div>
        </div>

        {/* Share grid — 6 squares: 🟥 wrong, 🟩 survived, ⬛ unused */}
        <div className="share-preview-grid" aria-hidden="true">
          {Array(MAX_WRONG).fill(null).map((_, i) => {
            const wrong = i < wrongCount;
            const survived = run.solved;
            return (
              <span
                key={i}
                className={`share-sq ${wrong ? 'sq-wrong' : survived ? 'sq-correct' : 'sq-unused'}`}
              />
            );
          })}
        </div>

        {/* Actions */}
        <div className="results-actions">
          <button className="btn-share" onClick={handleShare}>⏪ Share result</button>
          {!isDaily && (
            <button className="btn-again" onClick={onPlayAgain}>🎬 New quote</button>
          )}
        </div>
      </div>
    </div>
  );
}
