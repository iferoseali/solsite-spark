import { ProjectData, PersonalityStyles, RoadmapPhase } from "../../types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { getAnimationProfile, createMotionProps, createStaggerContainer, createStaggerChild } from "../../animations";

interface RoadmapProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

const defaultPhases: RoadmapPhase[] = [
  { phase: 'Phase 1', title: 'Launch', items: ['Token launch', 'Website live', 'Community building'], completed: true },
  { phase: 'Phase 2', title: 'Growth', items: ['CEX listings', 'Marketing', 'Partnerships'], completed: false },
  { phase: 'Phase 3', title: 'Moon', items: ['Major exchanges', 'Ecosystem expansion', 'To the moon 🚀'], completed: false },
];

export const RoadmapTimeline = ({ project, styles, personality = 'professional' }: RoadmapProps) => {
  if (!project.showRoadmap) return null;
  const phases = project.roadmapPhases?.length ? project.roadmapPhases : defaultPhases;
  const profile = getAnimationProfile(personality);

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
          {...createMotionProps(profile, 'fadeIn')}
        >
          Roadmap
        </motion.h2>

        <div className="relative">
          <motion.div 
            className="absolute left-8 top-0 bottom-0 w-0.5"
            style={{ background: `linear-gradient(180deg, ${styles.primary}, ${styles.accent})` }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          <motion.div className="space-y-12" {...createStaggerContainer(profile)}>
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                className="relative pl-20"
                {...createStaggerChild(profile, 'slideUp')}
              >
                <motion.div 
                  className="absolute left-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    background: phase.completed ? styles.primary : 'rgba(255,255,255,0.1)',
                    border: `2px solid ${phase.completed ? styles.primary : 'rgba(255,255,255,0.3)'}`,
                    boxShadow: phase.completed ? `0 0 20px ${styles.primary}50` : 'none'
                  }}
                  whileHover={{ scale: 1.2 }}
                  transition={profile.spring}
                >
                  {phase.completed && <Check className="w-4 h-4 text-black" />}
                </motion.div>

                <motion.div 
                  className="p-6 rounded-2xl"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${phase.completed ? `${styles.primary}30` : 'rgba(255,255,255,0.08)'}`
                  }}
                  whileHover={{ 
                    borderColor: `${styles.primary}50`,
                    x: 10
                  }}
                  transition={profile.spring}
                >
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: styles.primary }}>
                    {phase.phase}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-4">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item, j) => (
                      <li key={j} className="text-white/60 flex items-center gap-2">
                        <span style={{ color: styles.primary }}>→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
