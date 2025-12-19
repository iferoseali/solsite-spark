import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";

interface HeroProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

export const HeroAsymmetric = ({ project, styles }: HeroProps) => {
  return (
    <section className="min-h-screen relative overflow-hidden pt-20">
      {/* Diagonal background split */}
      <div 
        className="absolute inset-0 origin-top-left -skew-y-6"
        style={{ 
          background: `linear-gradient(135deg, ${styles.primary}15 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
          {/* Left content - spans 7 columns */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <span 
                className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4"
                style={{ color: styles.primary }}
              >
                Introducing
              </span>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none">
                {project.coinName?.split(' ').map((word, i) => (
                  <span key={i} className="block">
                    {word}
                  </span>
                )) || 'Your Coin'}
              </h1>
            </motion.div>

            <motion.p 
              className="text-xl text-white/60 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {project.tagline || 'Your awesome tagline goes here with more detail about the project'}
            </motion.p>

            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <a 
                href={project.dexLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-none font-bold text-lg transition-all hover:translate-x-2"
                style={{ 
                  background: styles.primary,
                  color: '#000'
                }}
              >
                BUY NOW →
              </a>
              <span 
                className="text-4xl font-mono font-bold"
                style={{ color: styles.primary }}
              >
                {project.ticker || '$TICKER'}
              </span>
            </motion.div>
          </div>

          {/* Right visual - spans 5 columns, offset */}
          <motion.div 
            className="lg:col-span-5 lg:translate-y-20"
            initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div 
                className="absolute -top-10 -left-10 w-32 h-32 border-2 opacity-30"
                style={{ borderColor: styles.primary }}
              />
              <div 
                className="absolute -bottom-10 -right-10 w-20 h-20"
                style={{ background: styles.primary }}
              />
              
              {project.logoUrl ? (
                <img 
                  src={project.logoUrl} 
                  alt={project.coinName}
                  className="relative w-full max-w-md aspect-square object-cover"
                />
              ) : (
                <div 
                  className="relative w-full max-w-md aspect-square flex items-center justify-center text-9xl font-black"
                  style={{ 
                    background: `linear-gradient(135deg, ${styles.primary}40, ${styles.accent}40)`,
                    color: styles.primary
                  }}
                >
                  {project.ticker?.[1] || '?'}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
