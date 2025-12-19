import { ProjectData, PersonalityStyles, RoadmapPhase } from "../../types";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { getAnimationProfile, createMotionProps, createHoverEffect } from "../../animations";

interface RoadmapProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

const defaultPhases: RoadmapPhase[] = [
  { phase: 'Phase 1', title: 'Launch', items: ['Token launch', 'Website live', 'Community building'], completed: true },
  { phase: 'Phase 2', title: 'Growth', items: ['CEX listings', 'Marketing', 'Partnerships'], completed: false },
  { phase: 'Phase 3', title: 'Moon', items: ['Major exchanges', 'Ecosystem', 'Domination'], completed: false },
];

export const RoadmapCards = ({ project, styles, personality = 'professional' }: RoadmapProps) => {
  if (!project.showRoadmap) return null;
  const phases = project.roadmapPhases?.length ? project.roadmapPhases : defaultPhases;
  const profile = getAnimationProfile(personality);
  const isDegen = personality === 'degen' || personality === 'degen_meme';

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
          {...createMotionProps(profile, 'fadeIn')}
        >
          {isDegen ? '🗺️ Roadmap 🗺️' : 'Roadmap'}
        </motion.h2>
        <motion.p
          className="text-white/50 text-center mb-16 max-w-xl mx-auto"
          {...createMotionProps(profile, 'fadeIn')}
        >
          {isDegen ? 'Wen moon? Check below 👇' : 'Our journey to revolutionize the space'}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, y: 40, rotate: isDegen ? (i % 2 === 0 ? -3 : 3) : 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: profile.scrollOffset }}
              transition={{ ...profile.spring, delay: i * 0.15 }}
            >
              <motion.div 
                className="p-8 rounded-3xl h-full"
                style={{ 
                  background: phase.completed 
                    ? `linear-gradient(135deg, ${styles.primary}20, ${styles.accent}10)` 
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${phase.completed ? `${styles.primary}50` : 'rgba(255,255,255,0.08)'}`
                }}
                {...createHoverEffect(profile)}
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.span 
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: styles.primary }}
                    animate={isDegen && phase.completed ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {phase.phase}
                  </motion.span>
                  {phase.completed ? (
                    <motion.div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: `${styles.primary}20` }}
                      animate={isDegen ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Check className="w-4 h-4" style={{ color: styles.primary }} />
                    </motion.div>
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5">
                      <Clock className="w-4 h-4 text-white/30" />
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-6">{phase.title}</h3>

                <ul className="space-y-3">
                  {phase.items.map((item, j) => (
                    <motion.li 
                      key={j} 
                      className="flex items-center gap-3 text-white/70"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + j * 0.1 }}
                    >
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: phase.completed ? styles.primary : 'rgba(255,255,255,0.3)' }}
                        animate={isDegen && phase.completed ? { scale: [1, 1.5, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }}
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                style={{ background: `${styles.primary}20` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
