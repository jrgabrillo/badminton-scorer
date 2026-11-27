import { useSwipeScore } from '../hooks/useSwipeScore';
import type { DeltaBadge, FlipTransition, TeamId } from '../types/score';
import { FlipScoreCard } from './FlipScoreCard';
import { FloatingDelta } from './FloatingDelta';

interface ScorePanelProps {
  team: TeamId;
  score: number;
  isRotated90: boolean;
  transition: FlipTransition | null;
  badges: DeltaBadge[];
  isShaking: boolean;
  hasInteracted: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

const PANEL_STYLES: Record<TeamId, { label: string; gradient: string }> = {
  red: {
    label: 'RED',
    gradient: 'linear-gradient(155deg, #dc2626 0%, #991b1b 100%)',
  },
  blue: {
    label: 'BLUE',
    gradient: 'linear-gradient(155deg, #2563eb 0%, #1e3a8a 100%)',
  },
};

export function ScorePanel({
  team,
  score,
  isRotated90,
  transition,
  badges,
  isShaking,
  hasInteracted,
  onIncrement,
  onDecrement,
}: ScorePanelProps) {
  const swipeHandlers = useSwipeScore({
    isRotated90,
    onSwipeUp: onIncrement,
    onSwipeDown: onDecrement,
  });

  const { label, gradient } = PANEL_STYLES[team];
  const hintOpacity = hasInteracted ? 'opacity-30' : 'opacity-65';

  return (
    <section
      data-testid={`score-panel-${team}`}
      aria-label={`${label} team score panel. Swipe up to add 1, swipe down to subtract 1.`}
      className="score-panel-container relative flex-1 h-full flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden touch-none"
      style={{ background: gradient }}
      {...swipeHandlers}
    >
      {/* Top Team Label & Swipe Up Hint */}
      <div className="absolute top-1 sm:top-3 inset-x-0 flex items-center justify-center gap-2.5 pointer-events-none z-10">
        <span className="text-xs sm:text-base font-extrabold tracking-[0.24em] leading-none text-white/90">
          {label}
        </span>
        <span
          className={`text-xs leading-none font-medium text-white transition-opacity duration-500 ${hintOpacity}`}
        >
          ▲ +1
        </span>
      </div>

      {/* 3D Flip Score Card */}
      <FlipScoreCard
        team={team}
        score={score}
        transition={transition}
        isShaking={isShaking}
      />

      {/* Animated +1 / -1 Feedback */}
      <FloatingDelta badges={badges} />

      {/* Bottom Swipe Down Hint */}
      <div className="absolute bottom-1 sm:bottom-3 inset-x-0 flex justify-center pointer-events-none z-10">
        <span
          className={`text-xs leading-none font-medium text-white transition-opacity duration-500 ${hintOpacity}`}
        >
          ▼ -1
        </span>
      </div>
    </section>
  );
}
