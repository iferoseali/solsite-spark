import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalScrollSectionProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export const HorizontalScrollSection = ({ 
  children, 
  direction = 'left',
  speed = 0.5,
  className = ''
}: HorizontalScrollSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xRange = direction === 'left' ? ["5%", `-${speed * 50}%`] : [`-${speed * 50}%`, "5%"];
  const x = useTransform(scrollYProgress, [0, 1], xRange);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div 
        className="flex gap-6"
        style={{ x }}
      >
        {children}
      </motion.div>
    </div>
  );
};

interface ScrollCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollCard = ({ children, className = '', style }: ScrollCardProps) => {
  return (
    <motion.div
      className={`flex-shrink-0 ${className}`}
      style={style}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
};
