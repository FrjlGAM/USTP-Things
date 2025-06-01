import { useState, useEffect } from 'react';

/**
 * A custom hook that tracks if a media query matches
 * @param query - The media query string (e.g., '(min-width: 768px)')
 * @returns boolean - Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize state with the current match
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Update the state when the media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Initial check
    setMatches(mediaQuery.matches);
    
    // Add event listener for future changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
