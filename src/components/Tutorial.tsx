import React, { useState } from 'react';

interface TutorialProps { onDone: () => void; }

const STEPS = [
  {
    title: 'Guess the famous quote',
    body: "A classic line from a 90s–00s film or show is hidden. Letters are blanked out — you reveal them one at a time by picking letters. Can you crack it before running out of guesses?",
    visual: (
      <div className="tut-quote-demo">
        <div className="tut-quote-words">
          <div className="tut-letter revealed">T</div>
          <div className="tut-letter revealed">O</div>
          <span className="tut-space" />
          <div className="tut-letter hidden" />
          <div className="tut-letter hidden" />
          <div className="tut-letter hidden" />
          <div className="tut-letter hidden" />
          <div className="tut-letter hidden" />
          <div className="tut-letter hidden" />
          <div className="tut-letter hidden" />
          <span className="tut-space" />
          <div className="tut-letter hidden" />
          <div className="tut-letter hidden" />
          <div className="tut-letter hidden" />
        </div>
      </div>
    ),
  },
  {
    title: 'Pick letters — all matches reveal',
    body: "Tap a letter or press a key. If it appears in the quote, every matching letter lights up at once. If it's not there, you lose one of your 6 lives.",
    visual: (
      <div className="tut-kb-demo">
        <div className="tut-kb-row">
          {['T', 'O', 'I', 'N', 'F'].map(l => (
            <div key={l} className={`tut-key ${l === 'T' || l === 'O' ? 'correct' : l === 'F' ? 'wrong' : ''}`}>{l}</div>
          ))}
        </div>
        <div className="tut-lives-demo">
          <div className="tut-frame used" />
          <div className="tut-frame" />
          <div className="tut-frame" />
          <div className="tut-frame" />
          <div className="tut-frame" />
          <div className="tut-frame" />
          <span className="tut-lives-label">1 of 6 wrong</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Need a hint? Reveal the emojis',
    body: "Stuck on which film it's from? Hit 'Show film hints' to reveal 5 emoji clues about the source film. It's noted in your result but won't stop you winning!",
    visual: (
      <div className="tut-hint-demo">
        <div className="tut-emoji-row">
          <span className="tut-hint-emoji">💊</span>
          <span className="tut-hint-emoji">🕶️</span>
          <span className="tut-hint-emoji">🟢</span>
          <span className="tut-hint-emoji">📱</span>
          <span className="tut-hint-emoji">🤖</span>
        </div>
        <p className="tut-hint-caption">From a 1999 film…</p>
      </div>
    ),
  },
  {
    title: 'Score big — fewer wrong = better',
    body: "Solve the quote without mistakes for a perfect score. Share your spoiler-free result and challenge your friends!",
    visual: (
      <div className="tut-score-demo">
        <div className="tut-score-row"><span>0 wrong</span><span>🔥 FLAWLESS</span></div>
        <div className="tut-score-row"><span>1 wrong</span><span>⚡ BRILLIANT</span></div>
        <div className="tut-score-row"><span>2 wrong</span><span>⭐ GREAT</span></div>
        <div className="tut-score-row muted"><span>6 wrong</span><span>💀 Stumped</span></div>
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
