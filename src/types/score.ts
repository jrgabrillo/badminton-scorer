export type TeamId = 'red' | 'blue';

export type FlipDirection = 'up' | 'down';

export interface FlipTransition {
  id: number;
  from: number;
  to: number;
  direction: FlipDirection;
}

export interface DeltaBadge {
  id: number;
  delta: 1 | -1;
}
