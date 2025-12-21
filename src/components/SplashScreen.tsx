import { useState, useEffect, useCallback } from "react";
import logo from "@/assets/logo.png";

interface SplashScreenProps {
  onComplete: () => void;
  /** Minimum display time in ms. Defaults to 800ms for a snappy feel */
  minDisplayTime?: number;
}

export const SplashScreen = ({ onComplete, minDisplayTime = 800 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Mark as ready once minimum time has passed
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  // Start fade out when ready
  useEffect(() => {
    if (!isReady) return;

    setIsFading(true);
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 400); // Faster fade out

    return () => clearTimeout(hideTimer);
  }, [isReady, onComplete]);

  // Allow click to skip
  const handleSkip = useCallback(() => {
    if (!isFading) {
      setIsReady(true);
    }
  }, [isFading]);

  if (!isVisible) return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-400 cursor-pointer ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background glow effects - simplified */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
      
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo with scale animation */}
        <div className="animate-scale-in">
          <img 
            src={logo} 
            alt="Solsite" 
            className="h-20 md:h-28 w-auto drop-shadow-2xl"
          />
        </div>
        
        {/* Simple loading indicator */}
        <div className="w-32 h-0.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"
            style={{ width: isReady ? '100%' : '60%', transition: 'width 0.3s ease-out' }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground">Click to continue</p>
      </div>
    </div>
  );
};
