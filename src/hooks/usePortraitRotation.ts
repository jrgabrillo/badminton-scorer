import { useEffect, useState } from 'react';

const PORTRAIT_PHONE_QUERY = '(max-width: 767px) and (orientation: portrait)';

function getMatches(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(PORTRAIT_PHONE_QUERY).matches;
}

/**
 * Detects when the app is viewed on a smartphone in portrait orientation
 * so the scoreboard can automatically rotate 90deg clockwise into landscape.
 */
export function usePortraitRotation(): boolean {
  const [isPortraitPhone, setIsPortraitPhone] = useState<boolean>(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia(PORTRAIT_PHONE_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsPortraitPhone(event.matches);
    };

    setIsPortraitPhone(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isPortraitPhone;
}
