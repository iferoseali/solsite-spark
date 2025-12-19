import { ProjectData, PersonalityStyles, RoadmapPhase } from "../../types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface RoadmapProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

const defaultPhases: RoadmapPhase[] = [
  { phase: 'Phase 1', title: 'Genesis', items: ['Token deployment', 'Fair launch', 'Community formation'], completed: true },
  { phase: 'Phase 2', title: 'Momentum', items: ['Marketing blitz', 'Influencer deals', 'DEX expansion'], completed: false },
  { phase: 'Phase 3', title: 'Evolution', items: ['Utility launch', 'Staking platform', 'NFT collection'], completed: false },
  { phase: 'Phase 4', title: 'Ascension', items: ['Tier 1 CEX', 'Global brand', 'Moon mission 🚀'], completed: false },
];

export const RoadmapZigzag = ({ project, styles }: RoadmapProps) => {
  if (!project.showRoadmap) return null;
  const phases = project.roadmapPhases?.length ? project.roadmapPhases : defaultPhases;

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          The Journey
        </motion.h2>

        <div className="space-y-0">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Content */}
              <div className="flex-1">
                <div 
                  className="p-6 rounded-2xl"
                  style={{ 
                    background: `linear-gradient(${i % 2 === 0 ? '135deg' : '225deg'}, ${styles.primary}10, transparent)`,
                    borderLeft: i % 2 === 0 ? `3px solid ${styles.primary}` : 'none',
                    borderRight: i % 2 !== 0 ? `3px solid ${styles.primary}` : 'none',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span 
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: styles.primary }}
                    >
                      {phase.phase}
                    </span>
                    {phase.completed && (
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: styles.primary }}
                      >
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item, j) => (
                      <li key={j} className="text-white/60 text-sm">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Center node */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ 
                    background: phase.completed ? styles.primary : 'rgba(255,255,255,0.2)',
                    boxShadow: phase.completed ? `0 0 20px ${styles.primary}` : 'none'
                  }}
                />
                {i < phases.length - 1 && (
                  <div 
                    className="w-0.5 h-24"
                    style={{ background: `linear-gradient(180deg, ${styles.primary}50, rgba(255,255,255,0.1))` }}
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
