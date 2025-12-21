'use client';
import { ReactLenis } from 'lenis/react';
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  // Disable Lenis smooth scroll on mobile to prevent 404 errors and scroll conflicts
  if (isMobile) {
    return <>{children}</>;
  }
  
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
};

export { SmoothScroll };
