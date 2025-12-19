import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "solsite:recently-viewed";
const MAX_ITEMS = 5;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch {
      // Ignore storage errors
    }
  }, [recentlyViewed]);

  const addRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => {
      // Remove if exists, then add to front
      const filtered = prev.filter((x) => x !== id);
      return [id, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  return { recentlyViewed, addRecentlyViewed, clearRecentlyViewed };
};
