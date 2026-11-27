import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function swipe(element: HTMLElement, from: { x: number; y: number }, to: { x: number; y: number }) {
  fireEvent.pointerDown(element, { pointerId: 1, clientX: from.x, clientY: from.y });
  fireEvent.pointerUp(element, { pointerId: 1, clientX: to.x, clientY: to.y });
}

describe('Badminton Scorer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Red and Blue divisions starting at 0 in landscape mode', () => {
    mockMatchMedia(false);
    render(<App />);

    expect(screen.getByTestId('scoreboard-root')).toHaveAttribute('data-rotated', 'false');
    expect(screen.getByTestId('score-value-red')).toHaveTextContent('0');
    expect(screen.getByTestId('score-value-blue')).toHaveTextContent('0');
  });

  it('increments score and shows +1 on swipe up, decrements and shows -1 on swipe down', () => {
    mockMatchMedia(false);
    render(<App />);

    const redPanel = screen.getByTestId('score-panel-red');

    // Swipe up (+1)
    swipe(redPanel, { x: 100, y: 200 }, { x: 100, y: 120 });
    expect(screen.getByTestId('score-value-red')).toHaveTextContent('1');
    expect(screen.getByText('+1')).toBeInTheDocument();

    // Swipe up again (+1)
    swipe(redPanel, { x: 100, y: 200 }, { x: 100, y: 120 });
    expect(screen.getByTestId('score-value-red')).toHaveTextContent('2');

    // Swipe down (-1)
    swipe(redPanel, { x: 100, y: 120 }, { x: 100, y: 200 });
    expect(screen.getByTestId('score-value-red')).toHaveTextContent('1');
    expect(screen.getByText('-1')).toBeInTheDocument();
  });

  it('does not go below 0 when swiping down at 0', () => {
    mockMatchMedia(false);
    render(<App />);

    const bluePanel = screen.getByTestId('score-panel-blue');
    swipe(bluePanel, { x: 300, y: 120 }, { x: 300, y: 220 });

    expect(screen.getByTestId('score-value-blue')).toHaveTextContent('0');
    expect(screen.queryByText('-1')).not.toBeInTheDocument();
  });

  it('rotates 90deg on portrait smartphone and maps visual swipe up (+X) to +1', () => {
    mockMatchMedia(true);
    render(<App />);

    const root = screen.getByTestId('scoreboard-root');
    expect(root).toHaveAttribute('data-rotated', 'true');
    expect(root.className).toContain('scoreboard-rotated-portrait');

    const bluePanel = screen.getByTestId('score-panel-blue');
    // When rotated 90deg clockwise, visual UP is rightward (+X)
    swipe(bluePanel, { x: 100, y: 200 }, { x: 180, y: 200 });
    expect(screen.getByTestId('score-value-blue')).toHaveTextContent('1');
    expect(screen.getByText('+1')).toBeInTheDocument();

    // Visual DOWN is leftward (-X)
    swipe(bluePanel, { x: 180, y: 200 }, { x: 100, y: 200 });
    expect(screen.getByTestId('score-value-blue')).toHaveTextContent('0');
    expect(screen.getByText('-1')).toBeInTheDocument();
  });

  it('swaps sides and resets scores after confirmation', () => {
    mockMatchMedia(false);
    render(<App />);

    const redPanel = screen.getByTestId('score-panel-red');
    swipe(redPanel, { x: 100, y: 200 }, { x: 100, y: 120 });
    expect(screen.getByTestId('score-value-red')).toHaveTextContent('1');

    // Swap sides
    fireEvent.click(screen.getByRole('button', { name: /swap sides/i }));
    const sections = screen.getByTestId('scoreboard-root').querySelectorAll('section');
    expect(sections[0]).toHaveAttribute('data-testid', 'score-panel-blue');
    expect(sections[1]).toHaveAttribute('data-testid', 'score-panel-red');

    // Reset requires confirmation
    fireEvent.click(screen.getByRole('button', { name: /reset scores/i }));
    expect(screen.getByText(/reset scores\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^yes$/i }));

    expect(screen.getByTestId('score-value-red')).toHaveTextContent('0');
    expect(screen.getByTestId('score-value-blue')).toHaveTextContent('0');
  });
});
