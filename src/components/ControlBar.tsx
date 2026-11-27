import { useState } from 'react';

interface ControlBarProps {
  onSwap: () => void;
  onReset: () => void;
}

export function ControlBar({ onSwap, onReset }: ControlBarProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setConfirmingReset(false);
  };

  return (
    <div
      className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 shadow-xl"
      role="toolbar"
      aria-label="Scoreboard controls"
    >
      {confirmingReset ? (
        <>
          <span className="text-xs font-semibold text-white/90 pl-1 pr-1">
            Reset scores?
          </span>
          <button
            type="button"
            onClick={handleConfirmReset}
            className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-neutral-900 hover:bg-white/90 transition cursor-pointer"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setConfirmingReset(false)}
            className="px-2.5 py-1 rounded-full text-xs font-semibold text-white/85 hover:bg-white/15 transition cursor-pointer"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={onSwap}
            className="px-2.5 py-1 rounded-full text-xs font-semibold text-white/90 hover:bg-white/15 active:scale-95 transition cursor-pointer"
            aria-label="Swap sides"
          >
            ⇄ Swap
          </button>
          <div className="w-[1px] h-4 bg-white/20" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setConfirmingReset(true)}
            className="px-2.5 py-1 rounded-full text-xs font-semibold text-white/90 hover:bg-white/15 active:scale-95 transition cursor-pointer"
            aria-label="Reset scores"
          >
            ↺ Reset
          </button>
        </>
      )}
    </div>
  );
}
