import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { getAnimationProfile, createMotionProps, createHoverEffect } from "../../animations";

interface HeroProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

export const HeroAsymmetric = ({ project, styles, personality = 'playful' }: HeroProps) => {
  const profile = getAnimationProfile(personality);

  return (
    <section className="min-h-screen relative overflow-hidden pt-20">
      {/* Diagonal background split */}
      <motion.div 
        className="absolute inset-0 origin-top-left -skew-y-6"
        style={{ background: `linear-gradient(135deg, ${styles.primary}15 0%, transparent 50%)` }}
        initial={{ opacity: 0, skewY: -12 }}
        animate={{ opacity: 1, skewY: -6 }}
        transition={profile.smooth}
      />

      <div className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
          {/* Left content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div {...createMotionProps(profile, 'slideUp')}>
              <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: styles.primary }}>
                Introducing
              </span>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none">
                {project.coinName?.split(' ').map((word, i) => (
                  <motion.span 
                    key={i} 
                    className="block"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...profile.spring, delay: i * 0.1 }}
                  >
                    {word}
                  </motion.span>
                )) || 'Your Coin'}
              </h1>
            </motion.div>

            <motion.p 
              className="text-xl text-white/60 max-w-md"
              {...createMotionProps(profile, 'fadeIn')}
            >
              {project.tagline || 'Your awesome tagline goes here'}
            </motion.p>

            <motion.div
              className="flex items-center gap-6"
              {...createMotionProps(profile, 'slideUp')}
            >
              <motion.a 
                href={project.dexLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-none font-bold text-lg"
                style={{ background: styles.primary, color: '#000' }}
                {...createHoverEffect(profile)}
              >
                BUY NOW →
              </motion.a>
              <motion.span 
                className="text-4xl font-mono font-bold"
                style={{ color: styles.primary }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {project.ticker || '$TICKER'}
              </motion.span>
            </motion.div>
          </div>

          {/* Right visual */}
          <motion.div 
            className="lg:col-span-5 lg:translate-y-20"
            {...createMotionProps(profile, 'scaleIn')}
          >
            <div className="relative">
              <motion.div 
                className="absolute -top-10 -left-10 w-32 h-32 border-2 opacity-30"
                style={{ borderColor: styles.primary }}
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute -bottom-10 -right-10 w-20 h-20"
                style={{ background: styles.primary }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {project.logoUrl ? (
                <motion.img 
                  src={project.logoUrl} 
                  alt={project.coinName}
                  className="relative w-full max-w-md aspect-square object-cover"
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={profile.spring}
                />
              ) : (
                <motion.div 
                  className="relative w-full max-w-md aspect-square flex items-center justify-center text-9xl font-black"
                  style={{ background: `linear-gradient(135deg, ${styles.primary}40, ${styles.accent}40)`, color: styles.primary }}
                  whileHover={{ scale: 1.05 }}
                  transition={profile.spring}
                >
                  {project.ticker?.[1] || '?'}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
