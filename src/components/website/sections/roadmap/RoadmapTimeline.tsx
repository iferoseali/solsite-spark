import { ProjectData, PersonalityStyles, RoadmapPhase } from "../../types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface RoadmapProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

const defaultPhases: RoadmapPhase[] = [
  { phase: 'Phase 1', title: 'Launch', items: ['Token launch', 'Website live', 'Community building'], completed: true },
  { phase: 'Phase 2', title: 'Growth', items: ['CEX listings', 'Marketing', 'Partnerships'], completed: false },
  { phase: 'Phase 3', title: 'Moon', items: ['Major exchanges', 'Ecosystem expansion', 'To the moon 🚀'], completed: false },
];

export const RoadmapTimeline = ({ project, styles }: RoadmapProps) => {
  if (!project.showRoadmap) return null;
  const phases = project.roadmapPhases?.length ? project.roadmapPhases : defaultPhases;

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Roadmap
        </motion.h2>

        <div className="relative">
          {/* Vertical line */}
          <div 
            className="absolute left-8 top-0 bottom-0 w-0.5"
            style={{ background: `linear-gradient(180deg, ${styles.primary}, ${styles.accent})` }}
          />

          <div className="space-y-12">
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                className="relative pl-20"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Node */}
                <div 
                  className="absolute left-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    background: phase.completed ? styles.primary : 'rgba(255,255,255,0.1)',
                    border: `2px solid ${phase.completed ? styles.primary : 'rgba(255,255,255,0.3)'}`,
                    boxShadow: phase.completed ? `0 0 20px ${styles.primary}50` : 'none'
                  }}
                >
                  {phase.completed && <Check className="w-4 h-4 text-black" />}
                </div>

                {/* Content */}
                <div 
                  className="p-6 rounded-2xl"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${phase.completed ? `${styles.primary}30` : 'rgba(255,255,255,0.08)'}`
                  }}
                >
                  <span 
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: styles.primary }}
                  >
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
