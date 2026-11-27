import type { DeltaBadge } from '../types/score';

interface FloatingDeltaProps {
  badges: DeltaBadge[];
}

export function FloatingDelta({ badges }: FloatingDeltaProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
    >
      {badges.map((badge) => {
        const isPositive = badge.delta > 0;
        return (
          <div
            key={badge.id}
            data-testid="floating-delta"
            className={`absolute left-1/2 px-6 py-2 rounded-full text-3xl sm:text-5xl font-black tracking-tight backdrop-blur-md border border-white/30 shadow-2xl ${
              isPositive
                ? 'top-[22%] animate-float-up bg-white/25 text-white'
                : 'bottom-[22%] animate-float-down bg-black/45 text-white'
            }`}
          >
            {isPositive ? '+1' : '-1'}
          </div>
        );
      })}
    </div>
  );
}
