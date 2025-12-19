import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getAnimationProfile, createMotionProps } from "../../animations";

interface HeroProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

export const HeroMinimal = ({ project, styles, personality = 'premium' }: HeroProps) => {
  const profile = getAnimationProfile(personality);

  return (
    <section className="min-h-[80vh] flex items-center px-6 pt-32 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Simple ticker */}
        <motion.div className="mb-8" {...createMotionProps(profile, 'fadeIn')}>
          <span className="text-sm font-mono tracking-widest" style={{ color: styles.primary }}>
            {project.ticker || '$TICKER'}
          </span>
        </motion.div>

        {/* Clean headline */}
        <motion.h1 
          className="text-5xl md:text-7xl font-light text-white mb-8 leading-[1.1]"
          {...createMotionProps(profile, 'slideUp')}
        >
          {project.coinName || 'Your Coin Name'}
          <br />
          <span className="text-white/40">{project.tagline || 'for the future'}</span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="text-lg text-white/50 max-w-xl mb-12"
          {...createMotionProps(profile, 'fadeIn')}
        >
          {project.description?.slice(0, 150) || 'A brief description of your project and its mission.'}
        </motion.p>

        {/* Minimal CTA */}
        <motion.div {...createMotionProps(profile, 'fadeIn')}>
          <motion.a 
            href={project.dexLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-lg font-medium group"
            style={{ color: styles.primary }}
            whileHover={{ x: 5 }}
            transition={profile.spring}
          >
            Get Started
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
