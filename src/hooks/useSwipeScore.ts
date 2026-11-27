import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

interface UseSwipeScoreOptions {
  /** True when the scoreboard container is CSS-rotated 90deg clockwise (portrait smartphone). */
  isRotated90: boolean;
  /** Minimum swipe travel distance in pixels along the local vertical axis. */
  threshold?: number;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}

interface SwipeStart {
  x: number;
  y: number;
  pointerId: number;
}

export function useSwipeScore({
  isRotated90,
  threshold = 36,
  onSwipeUp,
  onSwipeDown,
}: UseSwipeScoreOptions) {
  const startRef = useRef<SwipeStart | null>(null);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button')) return;

    startRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };

    if (typeof event.currentTarget.setPointerCapture === 'function') {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Ignore capture errors for synthetic pointer events in tests
      }
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = startRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    startRef.current = null;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    // Map physical screen delta into the scoreboard's visual vertical axis.
    // When rotated 90deg clockwise, visual UP corresponds to physical +X (rightward).
    const localUpDelta = isRotated90 ? dx : -dy;
    const localCrossDelta = isRotated90 ? Math.abs(dy) : Math.abs(dx);

    if (Math.abs(localUpDelta) < threshold || Math.abs(localUpDelta) <= localCrossDelta) {
      return;
    }

    if (localUpDelta > 0) {
      onSwipeUp();
    } else {
      onSwipeDown();
    }
  };

  const onPointerCancel = () => {
    startRef.current = null;
  };

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel,
  };
}
