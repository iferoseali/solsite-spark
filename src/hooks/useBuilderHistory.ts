import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import type { BuilderSnapshot } from "./useBuilderState";

const MAX_HISTORY = 50;

export interface UseBuilderHistoryProps {
  createSnapshot: () => BuilderSnapshot;
  applySnapshot: (snapshot: BuilderSnapshot) => void;
  isEditMode: boolean;
  dependencies: React.DependencyList;
}

export interface UseBuilderHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  initializeHistory: (snapshot: BuilderSnapshot) => void;
}

export function useBuilderHistory({
  createSnapshot,
  applySnapshot,
  isEditMode,
  dependencies,
}: UseBuilderHistoryProps): UseBuilderHistoryReturn {
  const [history, setHistory] = useState<BuilderSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyDebounce = useRef<NodeJS.Timeout | null>(null);
  const isRestoringHistory = useRef(false);
  const isInitialized = useRef(false);

  // Push to history with debounce (1000ms for performance)
  const pushToHistory = useCallback(() => {
    if (isRestoringHistory.current || !isInitialized.current) return;

    if (historyDebounce.current) {
      clearTimeout(historyDebounce.current);
    }

    historyDebounce.current = setTimeout(() => {
      const snapshot = createSnapshot();
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(snapshot);
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
          return newHistory;
        }
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
    }, 1000);
  }, [createSnapshot, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const snapshot = history[newIndex];
    if (!snapshot) return;

    isRestoringHistory.current = true;
    applySnapshot(snapshot);
    setHistoryIndex(newIndex);

    setTimeout(() => {
      isRestoringHistory.current = false;
    }, 100);

    toast.success("Undone");
  }, [history, historyIndex, applySnapshot]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const snapshot = history[newIndex];
    if (!snapshot) return;

    isRestoringHistory.current = true;
    applySnapshot(snapshot);
    setHistoryIndex(newIndex);

    setTimeout(() => {
      isRestoringHistory.current = false;
    }, 100);

    toast.success("Redone");
  }, [history, historyIndex, applySnapshot]);

  const initializeHistory = useCallback((snapshot: BuilderSnapshot) => {
    if (!isInitialized.current && !isEditMode) {
      setHistory([snapshot]);
      setHistoryIndex(0);
      isInitialized.current = true;
    }
  }, [isEditMode]);

  // Track changes for history
  useEffect(() => {
    if (isInitialized.current) {
      pushToHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    initializeHistory,
  };
}
