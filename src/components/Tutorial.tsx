import React, { useState } from 'react';

interface TutorialProps { onDone: () => void; }

const STEPS = [
  {
    title: 'A film is hidden in emoji',
    body: 'Each day a 90s–00s film or show is encoded as 5 emoji clues. Start with just 1 — can you crack it early?',
    visual: (
      <div className="tut-clues">
        <div className="tut-tile revealed big">🌊<span className="clue-num">1</span></div>
        <div className="tut-tile hidden">?<span className="clue-num">2</span></div>
        <div className="tut-tile hidden">?<span className="clue-num">3</span></div>
        <div className="tut-tile hidden">?<span className="clue-num">4</span></div>
        <div className="tut-tile hidden">?<span className="clue-num">5</span></div>
      </div>
    ),
  },
  {
    title: 'Type to search & guess',
    body: 'Type any part of a film title — matching suggestions appear. Tap one to submit your guess.',
    visual: (
      <div className="tut-input-demo">
        <div className="tut-input-box">tit<span className="tut-cursor">|</span></div>
        <div className="tut-suggestion">Titanic</div>
        <div className="tut-suggestion muted">Training Day</div>
      </div>
    ),
  },
  {
    title: 'Wrong? Get feedback + next clue',
    body: 'Each wrong guess reveals the next emoji AND tells you if your guess matched the correct era, origin, or genre.',
    visual: (
      <div className="tut-feedback-demo">
        <div className="tut-wrong">❌ Poseidon Adventure</div>
        <div className="tut-tags">
          <span className="tag tag-yes">✓ Era</span>
          <span className="tag tag-yes">✓ Origin</span>
          <span className="tag tag-no">✗ Genre</span>
        </div>
        <div className="tut-new-clue">New clue: 🚢</div>
      </div>
    ),
  },
  {
    title: 'Score big with fewer clues',
    body: 'The earlier you crack it, the higher your score. Share your spoiler-free result and challenge friends!',
    visual: (
      <div className="tut-score-demo">
        <div className="tut-score-row"><span>1 clue</span><span>🔥 LEGENDARY</span></div>
        <div className="tut-score-row"><span>2 clues</span><span>⚡ BRILLIANT</span></div>
        <div className="tut-score-row"><span>3 clues</span><span>⭐ GREAT</span></div>
        <div className="tut-score-row muted"><span>5 clues</span><span>😅 SQUEAKY</span></div>
      </div>
    ),
  },
];

export function Tutorial({ onDone }: TutorialProps) {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true">
      <div className="tutorial-modal">
        <div className="tutorial-progress">
          {STEPS.map((_, i) => (
            <span key={i} className={`progress-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
        </div>
        <h2 className="tutorial-title">🎬 {s.title}</h2>
        <div className="tutorial-visual-wrap">{s.visual}</div>
        <p className="tutorial-body">{s.body}</p>
        <div className="tutorial-actions">
          {step > 0 && <button className="btn-tut-back" onClick={() => setStep(n => n - 1)}>← Back</button>}
          <button className="btn-tut-next" onClick={() => isLast ? onDone() : setStep(n => n + 1)} autoFocus>
            {isLast ? '▶ Play Now' : 'Next →'}
          </button>
        </div>
        <button className="btn-skip" onClick={onDone}>Skip</button>
      </div>
    </div>
  );
}
