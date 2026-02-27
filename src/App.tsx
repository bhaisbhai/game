import React, { useState, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { Tutorial } from './components/Tutorial';
import { SettingsDrawer } from './components/SettingsDrawer';
import { usePlayerProfile } from './hooks/usePlayerProfile';
import { generateDailyPuzzle, generatePracticePuzzle, todayISO } from './engine/puzzle';
import { PuzzleDefinition, ScoreBreakdown } from './types';

type Screen = 'home' | 'game' | 'tutorial';

const TUTORIAL_KEY = 'mixtape_tutorial_v1';

function hasSeenTutorial(): boolean {
  return localStorage.getItem(TUTORIAL_KEY) === '1';
}
function markTutorialSeen() {
  localStorage.setItem(TUTORIAL_KEY, '1');
}

export function App() {
  const { profile, updateSettings, recordSolve, recordShare, recordGamePlayed } = usePlayerProfile();
  const [screen, setScreen] = useState<Screen>(hasSeenTutorial() ? 'home' : 'tutorial');
  const [puzzle, setPuzzle] = useState<PuzzleDefinition | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [prevScreen, setPrevScreen] = useState<Screen>('home');

  const alreadyPlayedToday = profile.stats.lastDailyPlayedDateISO === todayISO();

  const startDaily = useCallback(() => {
    setPuzzle(generateDailyPuzzle());
    setPrevScreen('home');
    setScreen('game');
  }, []);

  const startPractice = useCallback(() => {
    setPuzzle(generatePracticePuzzle());
    setPrevScreen('home');
    setScreen('game');
  }, []);

  const goHome = useCallback(() => {
    setPuzzle(null);
    setScreen('home');
  }, []);

  const openTutorial = useCallback(() => {
    setPrevScreen(screen);
    setScreen('tutorial');
  }, [screen]);

  const finishTutorial = useCallback(() => {
    markTutorialSeen();
    setScreen(prevScreen);
  }, [prevScreen]);

  const handleShare = useCallback(async (text: string) => {
    recordShare();
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mixtape Masala', text, url: 'https://fantastic-creponne-bc083b.netlify.app' });
        setShareToast('Shared! 📼');
      } else {
        await navigator.clipboard.writeText(text);
        setShareToast('Copied to clipboard! 📋');
      }
    } catch {
      // Fallback: copy text
      try {
        const ta = document.getElementById('share-text-area') as HTMLTextAreaElement | null;
        if (ta) {
          ta.select();
          document.execCommand('copy');
          setShareToast('Copied! 📋');
        }
      } catch {
        setShareToast('Share manually 👆');
      }
    }
    setTimeout(() => setShareToast(null), 3000);
  }, [recordShare]);

  const handleRecordSolve = useCallback((score: ScoreBreakdown, dateISO?: string) => {
    recordSolve(score, dateISO);
  }, [recordSolve]);

  return (
    <div className={`app ${profile.settings.highContrast ? 'high-contrast' : ''}`}>
      {screen === 'tutorial' && <Tutorial onDone={finishTutorial} />}

      {screen === 'home' && (
        <HomeScreen
          stats={profile.stats}
          alreadyPlayedToday={alreadyPlayedToday}
          onPlayDaily={startDaily}
          onPlayPractice={startPractice}
          onTutorial={openTutorial}
        />
      )}

      {screen === 'game' && puzzle && (
        <GameScreen
          puzzle={puzzle}
          profile={profile}
          onHome={goHome}
          onSettings={() => setShowSettings(true)}
          onShare={handleShare}
          onPlayAgain={startPractice}
          onRecordSolve={handleRecordSolve}
          onRecordGamePlayed={recordGamePlayed}
        />
      )}

      {showSettings && (
        <SettingsDrawer
          profile={profile}
          onUpdateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {shareToast && (
        <div className="toast" role="status" aria-live="polite">{shareToast}</div>
      )}
    </div>
  );
}
