import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { getAnimationProfile, createMotionProps, createHoverEffect } from "../../animations";

interface HeroProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

export const HeroCentered = ({ project, styles, personality = 'professional' }: HeroProps) => {
  const profile = getAnimationProfile(personality);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 relative overflow-hidden">
      {/* Glow effect */}
      <motion.div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${styles.primary}40 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo */}
      <motion.div 
        className="relative z-10 mb-8"
        {...createMotionProps(profile, 'scaleIn')}
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
        {...createMotionProps(profile, 'slideUp')}
      >
        {project.coinName || 'Your Coin Name'}
      </motion.h1>

      {/* Ticker */}
      <motion.p 
        className="relative z-10 text-2xl md:text-4xl font-mono mb-6"
        style={{ color: styles.primary }}
        {...createMotionProps(profile, 'fadeIn')}
      >
        {project.ticker || '$TICKER'}
      </motion.p>

      {/* Tagline */}
      <motion.p 
        className="relative z-10 text-lg md:text-2xl text-white/60 max-w-2xl mb-10"
        {...createMotionProps(profile, 'fadeIn')}
      >
        {project.tagline || 'Your awesome tagline goes here'}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div 
        className="relative z-10 flex flex-wrap gap-4 justify-center"
        {...createMotionProps(profile, 'slideUp')}
      >
        <motion.a 
          href={project.dexLink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          style={{ background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})`, color: '#000' }}
          {...createHoverEffect(profile)}
        >
          Buy Now
        </motion.a>
        <motion.a 
          href="#about"
          className="px-8 py-4 rounded-xl font-semibold text-lg text-white border-2 border-white/20"
          {...createHoverEffect(profile)}
        >
          Learn More
        </motion.a>
      </motion.div>
    </section>
  );
};
