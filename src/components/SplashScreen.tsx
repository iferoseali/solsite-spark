import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1800);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "0.5s" }} />
      
      <div className="relative flex flex-col items-center gap-8">
        {/* Logo with scale animation */}
        <div className="animate-scale-in">
          <img 
            src={logo} 
            alt="Solsite" 
            className="h-24 md:h-32 w-auto drop-shadow-2xl"
          />
        </div>
        
        {/* Loading bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            style={{
              animation: "loading 1.8s ease-in-out forwards"
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
