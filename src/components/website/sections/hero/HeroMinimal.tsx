import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

export const HeroMinimal = ({ project, styles }: HeroProps) => {
  return (
    <section className="min-h-[80vh] flex items-center px-6 pt-32 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Simple ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <span 
            className="text-sm font-mono tracking-widest"
            style={{ color: styles.primary }}
          >
            {project.ticker || '$TICKER'}
          </span>
        </motion.div>

        {/* Clean headline */}
        <motion.h1 
          className="text-5xl md:text-7xl font-light text-white mb-8 leading-[1.1]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {project.coinName || 'Your Coin Name'}
          <br />
          <span className="text-white/40">{project.tagline || 'for the future'}</span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="text-lg text-white/50 max-w-xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {project.description?.slice(0, 150) || 'A brief description of your project and its mission.'}
        </motion.p>

        {/* Minimal CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a 
            href={project.dexLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-lg font-medium transition-all group"
            style={{ color: styles.primary }}
          >
            Get Started
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
