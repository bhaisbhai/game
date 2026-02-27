import React, { useEffect, useRef } from 'react';
import { GameRun } from '../types';
import { computeScore, getDailyNumber, buildShareText } from '../engine/puzzle';

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
  const score = computeScore(run.cluesRevealed, run.solved);
  const dailyNum = isDaily ? getDailyNumber() : undefined;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => { dialogRef.current?.focus(); }, []);

  const handleShare = () => {
    onShare(buildShareText(run, dailyNum));
  };

  return (
    <div className="results-overlay" role="dialog" aria-modal="true">
      <div className={`results-modal ${!reduceMotion ? 'animate-in' : ''}`} ref={dialogRef} tabIndex={-1}>

        {/* Score header */}
        <div className="result-score-block">
          <span className="result-emoji" role="img">{score.emoji}</span>
          <div className="result-text">
            <p className="result-label">{score.label}</p>
            <p className="result-points">{score.points > 0 ? `${score.points} pts` : 'No points'}</p>
          </div>
        </div>

        {/* Film reveal */}
        <div className="film-reveal">
          <p className="film-reveal-label">{run.solved ? "You got it!" : "Today's answer was:"}</p>
          <p className="film-title-big">{run.film.title}</p>
          <p className="film-meta">
            {run.film.year} · {run.film.origin} · {run.film.genre}
          </p>
        </div>

        {/* All 5 emoji clues revealed */}
        <div className="all-clues-reveal">
          <p className="all-clues-label">All 5 clues:</p>
          <div className="all-clues-row">
            {run.film.clues.map((clue, i) => (
              <div key={i} className={`all-clue-tile ${i < run.cluesRevealed ? 'seen' : 'unseen'}`}>
                <span className="clue-emoji" role="img">{clue}</span>
                <span className="clue-num">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fun fact */}
        <div className="fun-fact">
          <span className="fun-fact-icon">🍿</span>
          <p className="fun-fact-text">{run.film.funFact}</p>
        </div>

        {/* Stats row */}
        <div className="result-stats">
          <div className="stat-box">
            <span className="stat-val">{run.solved ? `${run.cluesRevealed}/5` : '✗'}</span>
            <span className="stat-lbl">Clues used</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">{run.wrongGuesses.length}</span>
            <span className="stat-lbl">Wrong guesses</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">{fmt(run.elapsedMs)}</span>
            <span className="stat-lbl">Time</span>
          </div>
        </div>

        {/* Share grid preview */}
        <div className="share-preview-grid" aria-hidden="true">
          {Array(5).fill(null).map((_, i) => {
            const wrong = i < run.wrongGuesses.length;
            const correct = i === run.wrongGuesses.length && run.solved;
            return (
              <span key={i} className={`share-sq ${wrong ? 'sq-wrong' : correct ? 'sq-correct' : 'sq-unused'}`} />
            );
          })}
        </div>

        {/* Actions */}
        <div className="results-actions">
          <button className="btn-share" onClick={handleShare}>⏪ Share result</button>
          {!isDaily && (
            <button className="btn-again" onClick={onPlayAgain}>🎬 New film</button>
          )}
        </div>
      </div>
    </div>
  );
}
