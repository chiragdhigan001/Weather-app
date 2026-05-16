import { useState, useCallback } from "react";

const STORAGE_KEY = "weather_recent";
const MAX = 5;

export function useRecentSearches() {
  const [searches, setSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });

  const addSearch = useCallback((city) => {
    if (!city) return;
    setSearches(prev => {
      const next = [city, ...prev.filter(s => s.toLowerCase() !== city.toLowerCase())].slice(0, MAX);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { searches, addSearch };
}
