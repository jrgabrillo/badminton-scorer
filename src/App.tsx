import { useCallback, useEffect, useRef, useState } from 'react';
import { ControlBar } from './components/ControlBar';
import { ScorePanel } from './components/ScorePanel';
import { usePortraitRotation } from './hooks/usePortraitRotation';
import type { DeltaBadge, FlipTransition, TeamId } from './types/score';

const MIN_SCORE = 0;
const MAX_SCORE = 999;
const DELTA_LIFETIME_MS = 680;
const SHAKE_DURATION_MS = 300;

interface AppProps {
  initialScores?: Record<TeamId, number>;
}

export function App({ initialScores = { red: 0, blue: 0 } }: AppProps) {
  const isPortraitPhone = usePortraitRotation();

  const [scores, setScores] = useState<Record<TeamId, number>>(initialScores);
  const [swapped, setSwapped] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [transitions, setTransitions] = useState<Record<TeamId, FlipTransition | null>>({
    red: null,
    blue: null,
  });
  const [badges, setBadges] = useState<Record<TeamId, DeltaBadge[]>>({
    red: [],
    blue: [],
  });
  const [shaking, setShaking] = useState<Record<TeamId, boolean>>({
    red: false,
    blue: false,
  });

  const nextIdRef = useRef(1);
  const scoresRef = useRef(scores);
  scoresRef.current = scores;

  const updateScore = useCallback((team: TeamId, delta: 1 | -1) => {
    setHasInteracted(true);
    const current = scoresRef.current[team];
    const next = current + delta;

    if (next < MIN_SCORE || next > MAX_SCORE) {
      setShaking((prev) => ({ ...prev, [team]: true }));
      window.setTimeout(() => {
        setShaking((prev) => ({ ...prev, [team]: false }));
      }, SHAKE_DURATION_MS);
      return;
    }

    const id = nextIdRef.current++;

    setScores((prev) => ({ ...prev, [team]: next }));
    setTransitions((prev) => ({
      ...prev,
      [team]: {
        id,
        from: current,
        to: next,
        direction: delta > 0 ? 'up' : 'down',
      },
    }));
    setBadges((prev) => ({
      ...prev,
      [team]: [...prev[team], { id, delta }],
    }));

    window.setTimeout(() => {
      setBadges((prev) => ({
        ...prev,
        [team]: prev[team].filter((item) => item.id !== id),
      }));
    }, DELTA_LIFETIME_MS);
  }, []);

  const handleReset = useCallback(() => {
    setScores({ red: 0, blue: 0 });
    setTransitions({ red: null, blue: null });
    setBadges({ red: [], blue: [] });
  }, []);

  const handleSwap = useCallback(() => {
    setSwapped((prev) => !prev);
  }, []);

  // Desktop keyboard shortcuts: W/S for Red, ArrowUp/ArrowDown for Blue
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key === 'w' || event.key === 'W') {
        updateScore('red', 1);
      } else if (event.key === 's' || event.key === 'S') {
        updateScore('red', -1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        updateScore('blue', 1);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        updateScore('blue', -1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [updateScore]);

  const leftTeam: TeamId = swapped ? 'blue' : 'red';
  const rightTeam: TeamId = swapped ? 'red' : 'blue';

  return (
    <main
      data-testid="scoreboard-root"
      data-rotated={isPortraitPhone ? 'true' : 'false'}
      className={
        isPortraitPhone
          ? 'scoreboard-rotated-portrait flex overflow-hidden'
          : 'fixed inset-0 w-dvw h-dvh flex overflow-hidden'
      }
    >
      <ScorePanel
        team={leftTeam}
        score={scores[leftTeam]}
        isRotated90={isPortraitPhone}
        transition={transitions[leftTeam]}
        badges={badges[leftTeam]}
        isShaking={shaking[leftTeam]}
        hasInteracted={hasInteracted}
        onIncrement={() => updateScore(leftTeam, 1)}
        onDecrement={() => updateScore(leftTeam, -1)}
      />

      <div className="w-[2px] h-full bg-white/20 shrink-0 z-10" aria-hidden="true" />

      <ScorePanel
        team={rightTeam}
        score={scores[rightTeam]}
        isRotated90={isPortraitPhone}
        transition={transitions[rightTeam]}
        badges={badges[rightTeam]}
        isShaking={shaking[rightTeam]}
        hasInteracted={hasInteracted}
        onIncrement={() => updateScore(rightTeam, 1)}
        onDecrement={() => updateScore(rightTeam, -1)}
      />

      <ControlBar onSwap={handleSwap} onReset={handleReset} />
    </main>
  );
}

export default App;
