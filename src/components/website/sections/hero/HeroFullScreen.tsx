import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

export const HeroFullScreen = ({ project, styles }: HeroProps) => {
  return (
    <section className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${styles.primary}40 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Multiple glow effects */}
      <motion.div 
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${styles.primary}30 0%, transparent 70%)`,
        }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Logo with intense animation */}
      <motion.div 
        className="relative z-10 mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      >
        {project.logoUrl ? (
          <motion.img 
            src={project.logoUrl} 
            alt={project.coinName}
            className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover"
            style={{ 
              boxShadow: `0 0 60px ${styles.primary}60, 0 0 120px ${styles.primary}30`
            }}
            animate={{ 
              boxShadow: [
                `0 0 60px ${styles.primary}60, 0 0 120px ${styles.primary}30`,
                `0 0 100px ${styles.primary}80, 0 0 200px ${styles.primary}50`,
                `0 0 60px ${styles.primary}60, 0 0 120px ${styles.primary}30`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ) : (
          <motion.div 
            className="w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center text-7xl font-bold"
            style={{ 
              background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})`,
              boxShadow: `0 0 60px ${styles.primary}60`
            }}
            animate={{ 
              boxShadow: [
                `0 0 60px ${styles.primary}60`,
                `0 0 100px ${styles.primary}80`,
                `0 0 60px ${styles.primary}60`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {project.ticker?.[1] || '?'}
          </motion.div>
        )}
      </motion.div>

      {/* Large title */}
      <motion.h1 
        className="relative z-10 text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 tracking-tighter"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {project.coinName || 'Your Coin'}
      </motion.h1>

      {/* Ticker badge */}
      <motion.div
        className="relative z-10 mb-8"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <span 
          className="px-6 py-3 rounded-full text-2xl font-mono font-bold"
          style={{ 
            background: `${styles.primary}20`,
            color: styles.primary,
            border: `2px solid ${styles.primary}`
          }}
        >
          {project.ticker || '$TICKER'}
        </span>
      </motion.div>

      {/* Single CTA */}
      <motion.a 
        href={project.dexLink || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 px-12 py-5 rounded-full font-bold text-xl transition-all hover:scale-110"
        style={{ 
          background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})`,
          color: '#000'
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ boxShadow: `0 0 40px ${styles.primary}60` }}
      >
        Enter the Portal
      </motion.a>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-white/40" />
      </motion.div>
    </section>
  );
};
