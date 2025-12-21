import { useMemo, useRef, useState, useEffect, useTransition } from "react";

/**
 * A hook that provides throttled updates for expensive computations like HTML preview generation.
 * Uses useTransition to keep the UI responsive during updates.
 */
export function useThrottledPreview<T>(
  computeValue: () => T,
  dependencies: React.DependencyList,
  throttleMs: number = 800
): { value: T; isPending: boolean } {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState<T>(() => computeValue());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastComputeRef = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastCompute = now - lastComputeRef.current;

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If enough time has passed, compute immediately in a transition
    if (timeSinceLastCompute >= throttleMs) {
      lastComputeRef.current = now;
      startTransition(() => {
        setValue(computeValue());
      });
    } else {
      // Otherwise, schedule for later
      const delay = throttleMs - timeSinceLastCompute;
      timeoutRef.current = setTimeout(() => {
        lastComputeRef.current = Date.now();
        startTransition(() => {
          setValue(computeValue());
        });
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { value, isPending };
}
