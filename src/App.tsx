import React, { useState, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { Tutorial } from './components/Tutorial';
import { StatsModal } from './components/StatsModal';
import { usePlayerProfile } from './hooks/usePlayerProfile';
import { getDailyQuote, getPracticeQuote, todayISO } from './engine/puzzle';
import { QuoteEntry } from './data/quotes';

type Screen = 'home' | 'game' | 'tutorial';

const TUTORIAL_KEY = 'reel_masala_tutorial_v2';
const hasSeen = () => localStorage.getItem(TUTORIAL_KEY) === '1';
const markSeen = () => localStorage.setItem(TUTORIAL_KEY, '1');

export function App() {
  const { profile, updateSettings, recordResult, recordShare } = usePlayerProfile();
  const [screen, setScreen] = useState<Screen>(hasSeen() ? 'home' : 'tutorial');
  const [quote, setQuote] = useState<QuoteEntry | null>(null);
  const [isDaily, setIsDaily] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [prevScreen, setPrevScreen] = useState<Screen>('home');

  const alreadyPlayedToday = profile.stats.lastDailyPlayedDateISO === todayISO();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const startDaily = useCallback(() => {
    setQuote(getDailyQuote());
    setIsDaily(true);
    setScreen('game');
  }, []);

  const startPractice = useCallback(() => {
    setQuote(getPracticeQuote());
    setIsDaily(false);
    setScreen('game');
  }, []);

  const goHome = useCallback(() => {
    setQuote(null);
    setScreen('home');
  }, []);

  const openTutorial = useCallback(() => {
    setPrevScreen(screen);
    setScreen('tutorial');
  }, [screen]);

  const finishTutorial = useCallback(() => {
    markSeen();
    setScreen(prevScreen);
  }, [prevScreen]);

  const handleShare = useCallback(async (text: string) => {
    recordShare();
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Reel Masala', text });
        showToast('Shared! 🎬');
      } else {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard! 📋');
      }
    } catch {
      showToast('Share manually 👆');
    }
  }, [recordShare]);

  const handleResult = useCallback((wrongCount: number, solved: boolean) => {
    recordResult(wrongCount, solved, isDaily ? todayISO() : undefined);
  }, [recordResult, isDaily]);

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
          onStats={() => setShowStats(true)}
        />
      )}

      {screen === 'game' && quote && (
        <GameScreen
          quote={quote}
          isDaily={isDaily}
          profile={profile}
          onHome={goHome}
          onShare={handleShare}
          onPlayAgain={startPractice}
          onResult={handleResult}
        />
      )}

      {showStats && (
        <StatsModal
          profile={profile}
          onUpdateSettings={updateSettings}
          onClose={() => setShowStats(false)}
        />
      )}

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
