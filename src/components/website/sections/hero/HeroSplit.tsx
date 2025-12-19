import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { getAnimationProfile, createMotionProps, createHoverEffect } from "../../animations";

interface HeroProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

export const HeroSplit = ({ project, styles, personality = 'professional' }: HeroProps) => {
  const profile = getAnimationProfile(personality);

  return (
    <section className="min-h-screen flex items-center px-6 pt-24 pb-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left - Content */}
        <div className="order-2 md:order-1">
          <motion.div {...createMotionProps(profile, 'fadeIn')}>
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ background: `${styles.primary}20`, color: styles.primary }}
            >
              {project.ticker || '$TICKER'}
            </span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            {...createMotionProps(profile, 'slideUp')}
          >
            {project.coinName || 'Your Coin Name'}
          </motion.h1>

          <motion.p 
            className="text-xl text-white/60 mb-8 max-w-lg"
            {...createMotionProps(profile, 'fadeIn')}
          >
            {project.tagline || 'Your awesome tagline goes here'}
          </motion.p>

          <motion.div 
            className="flex flex-wrap gap-4"
            {...createMotionProps(profile, 'slideUp')}
          >
            <motion.a 
              href={project.dexLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl font-semibold text-lg"
              style={{ background: styles.primary, color: '#000' }}
              {...createHoverEffect(profile)}
            >
              Get Started
            </motion.a>
            <motion.a 
              href="#about"
              className="px-8 py-4 rounded-2xl font-semibold text-lg text-white border border-white/20"
              {...createHoverEffect(profile)}
            >
              Documentation
            </motion.a>
          </motion.div>
        </div>

        {/* Right - Visual */}
        <motion.div 
          className="order-1 md:order-2 flex justify-center"
          {...createMotionProps(profile, 'scaleIn')}
        >
          <div className="relative">
            <div className="absolute inset-0 blur-3xl opacity-40" style={{ background: styles.primary }} />
            
            {project.logoUrl ? (
              <motion.img 
                src={project.logoUrl} 
                alt={project.coinName}
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl object-cover shadow-2xl"
                animate={{ y: [0, -20, 0], rotateZ: [0, 2, 0, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : (
              <motion.div 
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl flex items-center justify-center text-8xl font-bold shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})` }}
                animate={{ y: [0, -20, 0], rotateZ: [0, 2, 0, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {project.ticker?.[1] || '?'}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
