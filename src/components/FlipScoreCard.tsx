import { useEffect, useState } from 'react';
import type { FlipTransition, TeamId } from '../types/score';

interface FlipScoreCardProps {
  team: TeamId;
  score: number;
  transition: FlipTransition | null;
  isShaking: boolean;
}

const FLIP_DURATION_MS = 390;

const TEAM_COLORS: Record<TeamId, { topBg: string; bottomBg: string }> = {
  red: { topBg: '#b91c1c', bottomBg: '#991b1b' },
  blue: { topBg: '#1d4ed8', bottomBg: '#1e40af' },
};

export function FlipScoreCard({
  team,
  score,
  transition,
  isShaking,
}: FlipScoreCardProps) {
  const [activeTransition, setActiveTransition] = useState<FlipTransition | null>(null);

  useEffect(() => {
    if (!transition) {
      setActiveTransition(null);
      return;
    }

    setActiveTransition(transition);
    const timer = window.setTimeout(() => {
      setActiveTransition(null);
    }, FLIP_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [transition]);

  const { topBg, bottomBg } = TEAM_COLORS[team];

  const staticTopValue = activeTransition
    ? activeTransition.direction === 'up'
      ? activeTransition.from
      : activeTransition.to
    : score;

  const staticBottomValue = activeTransition
    ? activeTransition.direction === 'up'
      ? activeTransition.to
      : activeTransition.from
    : score;

  return (
    <div
      className={`flip-scene flip-card-dimensions relative pointer-events-none ${
        isShaking ? 'animate-shake' : ''
      }`}
    >
      {/* Screen-reader and test-friendly single numeric score readout */}
      <span
        className="sr-only"
        aria-live="polite"
        data-testid={`score-value-${team}`}
      >
        {score}
      </span>

      <div
        aria-hidden="true"
        className="flip-card w-full h-full rounded-[16px] shadow-[0_18px_40px_rgba(0,0,0,0.38)] border border-white/15"
      >
        {/* Static Top Half */}
        <div
          className="flap flap-top"
          style={{
            backgroundColor: topBg,
            borderBottom: '1px solid rgba(0, 0, 0, 0.35)',
          }}
        >
          <div className="flap-digit font-black text-white">{staticTopValue}</div>
        </div>

        {/* Static Bottom Half */}
        <div
          className="flap flap-bottom"
          style={{
            backgroundColor: bottomBg,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <div className="flap-digit font-black text-white">{staticBottomValue}</div>
        </div>

        {/* Animated Page-Flip Leaves */}
        {activeTransition && activeTransition.direction === 'up' && (
          <div key={activeTransition.id} className="absolute inset-0 pointer-events-none">
            <div
              className="flap flap-bottom flip-leaf-up-front"
              style={{
                backgroundColor: bottomBg,
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div className="flap-digit font-black text-white">
                {activeTransition.from}
              </div>
            </div>
            <div
              className="flap flap-top flip-leaf-up-back"
              style={{
                backgroundColor: topBg,
                borderBottom: '1px solid rgba(0, 0, 0, 0.35)',
              }}
            >
              <div className="flap-digit font-black text-white">
                {activeTransition.to}
              </div>
            </div>
          </div>
        )}

        {activeTransition && activeTransition.direction === 'down' && (
          <div key={activeTransition.id} className="absolute inset-0 pointer-events-none">
            <div
              className="flap flap-top flip-leaf-down-front"
              style={{
                backgroundColor: topBg,
                borderBottom: '1px solid rgba(0, 0, 0, 0.35)',
              }}
            >
              <div className="flap-digit font-black text-white">
                {activeTransition.from}
              </div>
            </div>
            <div
              className="flap flap-bottom flip-leaf-down-back"
              style={{
                backgroundColor: bottomBg,
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div className="flap-digit font-black text-white">
                {activeTransition.to}
              </div>
            </div>
          </div>
        )}

        {/* Center Hinge Line & Side Notches */}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-3.5 rounded-r bg-black/40 z-30" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-3.5 rounded-l bg-black/40 z-30" />
        <div className="absolute top-1/2 inset-x-0 h-[2px] -translate-y-1/2 bg-black/30 z-30" />
      </div>
    </div>
  );
}
