import React, { useState } from 'react';

interface TutorialProps {
  onDone: () => void;
}

const STEPS = [
  {
    title: 'Crack the Watchlist',
    body: "Pick 5 titles to fill the reels. Try to guess today's secret 5-title sequence from 12 iconic 90s–00s films and shows.",
    visual: (
      <div className="tutorial-visual">
        <div className="t-slot">🕶️</div>
        <div className="t-slot">🌻</div>
        <div className="t-slot">☕</div>
        <div className="t-slot empty">·</div>
        <div className="t-slot empty">·</div>
      </div>
    ),
  },
  {
    title: 'Read the marks',
    body: '🟩 = right title, right slot  |  🟨 = right title, wrong slot  |  ⬛ = not in today\'s watchlist',
    visual: (
      <div className="tutorial-visual marks-demo">
        <div className="t-tile mark-exact" aria-label="exact">🚢</div>
        <div className="t-tile mark-present" aria-label="present">🏏</div>
        <div className="t-tile mark-absent" aria-label="absent">👑</div>
      </div>
    ),
  },
  {
    title: 'You get 8 tries',
    body: 'Deduce the 5-title sequence in up to 8 guesses. One free 🍿 Popcorn Hint per day reveals a slot.',
    visual: (
      <div className="tutorial-visual" style={{ flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.8rem' }}>8️⃣ attempts</span>
        <span style={{ fontSize: '1.4rem' }}>🍿 × 1 hint</span>
        <span style={{ fontSize: '0.75rem', color: '#b39dce' }}>12 titles · 5 in the secret</span>
      </div>
    ),
  },
  {
    title: 'Share without spoilers',
    body: 'After solving, share your spoiler-free result and challenge your mates to beat your time. 🎬',
    visual: (
      <div className="tutorial-visual share-demo">
        <div className="share-row-demo">🟨🟩⬛🟩🟨</div>
        <div className="share-row-demo">🟩🟩🟨⬛🟩</div>
        <div className="share-row-demo">🟩🟩🟩🟩🟩</div>
        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
          3/8 in 1:12 🎬📼 [A]
        </div>
      </div>
    ),
  },
];

export function Tutorial({ onDone }: TutorialProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-label="How to play">
      <div className="tutorial-modal">
        <div className="tutorial-progress">
          {STEPS.map((_, i) => (
            <span key={i} className={`progress-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} aria-hidden="true" />
          ))}
        </div>

        <h2 className="tutorial-title">🎬 {current.title}</h2>
        <div className="tutorial-visual-wrap">{current.visual}</div>
        <p className="tutorial-body">{current.body}</p>

        <div className="tutorial-actions">
          {step > 0 && (
            <button className="btn-tut-back" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          <button
            className="btn-tut-next"
            onClick={() => isLast ? onDone() : setStep(s => s + 1)}
            autoFocus
          >
            {isLast ? '▶ Play Now' : 'Next →'}
          </button>
        </div>

        <button className="btn-skip" onClick={onDone} aria-label="Skip tutorial">
          Skip
        </button>
      </div>
    </div>
  );
}
