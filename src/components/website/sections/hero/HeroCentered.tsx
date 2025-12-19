import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";

interface HeroProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

export const HeroCentered = ({ project, styles }: HeroProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 relative overflow-hidden">
      {/* Glow effect */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${styles.primary}40 0%, transparent 70%)`,
          opacity: 0.3
        }}
      />

      {/* Logo */}
      <motion.div 
        className="relative z-10 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {project.logoUrl ? (
          <motion.img 
            src={project.logoUrl} 
            alt={project.coinName}
            className="w-32 h-32 rounded-3xl object-cover shadow-2xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <motion.div 
            className="w-32 h-32 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})` }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {project.ticker?.[1] || '?'}
          </motion.div>
        )}
      </motion.div>

      {/* Title */}
      <motion.h1 
        className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {project.coinName || 'Your Coin Name'}
      </motion.h1>

      {/* Ticker */}
      <motion.p 
        className="relative z-10 text-2xl md:text-4xl font-mono mb-6"
        style={{ color: styles.primary }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {project.ticker || '$TICKER'}
      </motion.p>

      {/* Tagline */}
      <motion.p 
        className="relative z-10 text-lg md:text-2xl text-white/60 max-w-2xl mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {project.tagline || 'Your awesome tagline goes here'}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div 
        className="relative z-10 flex flex-wrap gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {project.dexLink ? (
          <a 
            href={project.dexLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl"
            style={{ 
              background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})`,
              color: '#000'
            }}
          >
            Buy Now
          </a>
        ) : (
          <button 
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl"
            style={{ 
              background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})`,
              color: '#000'
            }}
          >
            Buy Now
          </button>
        )}
        <a 
          href="#about"
          className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:scale-105"
          style={{ border: '2px solid rgba(255,255,255,0.2)' }}
        >
          Learn More
        </a>
      </motion.div>
    </section>
  );
};
