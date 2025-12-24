import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { X, Bug } from 'lucide-react';

interface NavigationEvent {
  timestamp: string;
  path: string;
  type: string;
}

export const MobileDebugOverlay: FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState<NavigationEvent[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);

  // Only show on mobile in development or with debug query param
  const shouldShow = isMobile && (
    import.meta.env.DEV || 
    new URLSearchParams(window.location.search).has('debug')
  );

  useEffect(() => {
    if (!shouldShow) return;

    const newEvent: NavigationEvent = {
      timestamp: new Date().toLocaleTimeString(),
      path: location.pathname + location.search,
      type: navigationType,
    };

    setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10
  }, [location, navigationType, shouldShow]);

  // Log to console for additional debugging
  useEffect(() => {
    if (shouldShow) {
      console.log('[NAV DEBUG]', {
        path: location.pathname,
        search: location.search,
        hash: location.hash,
        type: navigationType,
        state: location.state,
      });
    }
  }, [location, navigationType, shouldShow]);

  if (!shouldShow) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-20 right-4 z-[9999] bg-destructive text-destructive-foreground p-3 rounded-full shadow-lg touch-manipulation"
        style={{ minWidth: '48px', minHeight: '48px' }}
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-background/95 backdrop-blur border-t border-border p-4 max-h-[40vh] overflow-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Bug className="w-4 h-4 text-destructive" />
          Navigation Debug
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 bg-muted rounded touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-3 p-2 bg-muted rounded">
        <p className="text-xs text-muted-foreground">Current Route:</p>
        <p className="text-sm font-mono text-foreground break-all">
          {location.pathname}{location.search}
        </p>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Navigation History:</p>
        <div className="space-y-1">
          {events.map((event, i) => (
            <div 
              key={i} 
              className="text-xs font-mono p-1.5 bg-muted/50 rounded flex justify-between"
            >
              <span className="text-foreground break-all">{event.path}</span>
              <span className="text-muted-foreground ml-2 shrink-0">
                {event.type} @ {event.timestamp}
              </span>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No navigation events yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
