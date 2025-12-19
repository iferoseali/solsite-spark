import { ProjectData, PersonalityStyles, RoadmapPhase } from "../../types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { getAnimationProfile } from "../../animations";

interface RoadmapProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

const defaultPhases: RoadmapPhase[] = [
  { phase: 'Phase 1', title: 'Genesis', items: ['Token deployment', 'Fair launch', 'Community formation'], completed: true },
  { phase: 'Phase 2', title: 'Momentum', items: ['Marketing blitz', 'Influencer deals', 'DEX expansion'], completed: false },
  { phase: 'Phase 3', title: 'Evolution', items: ['Utility launch', 'Staking platform', 'NFT collection'], completed: false },
  { phase: 'Phase 4', title: 'Ascension', items: ['Tier 1 CEX', 'Global brand', 'Moon mission 🚀'], completed: false },
];

export const RoadmapZigzag = ({ project, styles, personality = 'dark-cult' }: RoadmapProps) => {
  if (!project.showRoadmap) return null;
  const phases = project.roadmapPhases?.length ? project.roadmapPhases : defaultPhases;
  const profile = getAnimationProfile(personality);

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-20 text-center"
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={profile.smooth}
        >
          The Journey
        </motion.h2>

        <div className="space-y-0">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ ...profile.smooth, duration: 0.8 }}
            >
              {/* Content */}
              <div className="flex-1">
                <motion.div 
                  className="p-6 rounded-2xl"
                  style={{ 
                    background: `linear-gradient(${i % 2 === 0 ? '135deg' : '225deg'}, ${styles.primary}10, transparent)`,
                    borderLeft: i % 2 === 0 ? `3px solid ${styles.primary}` : 'none',
                    borderRight: i % 2 !== 0 ? `3px solid ${styles.primary}` : 'none',
                  }}
                  whileHover={{ 
                    background: `linear-gradient(${i % 2 === 0 ? '135deg' : '225deg'}, ${styles.primary}20, transparent)`,
                    scale: 1.02
                  }}
                  transition={profile.spring}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.span 
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: styles.primary }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      {phase.phase}
                    </motion.span>
                    {phase.completed && (
                      <motion.div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: styles.primary }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={profile.spring}
                      >
                        <Check className="w-3 h-3 text-black" />
                      </motion.div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item, j) => (
                      <motion.li 
                        key={j} 
                        className="text-white/60 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + j * 0.1 }}
                      >
                        • {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Center node */}
              <div className="flex flex-col items-center">
                <motion.div 
                  className="w-4 h-4 rounded-full"
                  style={{ 
                    background: phase.completed ? styles.primary : 'rgba(255,255,255,0.2)',
                    boxShadow: phase.completed ? `0 0 20px ${styles.primary}` : 'none'
                  }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={profile.spring}
                  whileHover={{ scale: 1.5 }}
                />
                {i < phases.length - 1 && (
                  <motion.div 
                    className="w-0.5 h-24"
                    style={{ background: `linear-gradient(180deg, ${styles.primary}50, rgba(255,255,255,0.1))` }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )}
              </div>

              {/* Spacer */}
              <div className="flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
