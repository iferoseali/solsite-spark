import { ProjectData, PersonalityStyles, RoadmapPhase } from "../../types";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Check, Circle } from "lucide-react";
import { getAnimationProfile } from "../../animations";

interface RoadmapProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

const defaultPhases: RoadmapPhase[] = [
  { phase: 'Q1', title: 'Foundation', items: ['Token launch on Solana', 'Website & branding', 'Initial community'], completed: true },
  { phase: 'Q2', title: 'Expansion', items: ['DEX listings', 'Marketing push', 'Strategic partnerships'], completed: true },
  { phase: 'Q3', title: 'Scale', items: ['CEX listings', 'NFT integration', 'Cross-chain bridge'], completed: false },
  { phase: 'Q4', title: 'Domination', items: ['Major exchange listing', 'DApp ecosystem', 'Global adoption'], completed: false },
];

export const RoadmapHorizontal = ({ project, styles, personality = 'degen' }: RoadmapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  if (!project.showRoadmap) return null;
  const phases = project.roadmapPhases?.length ? project.roadmapPhases : defaultPhases;
  const profile = getAnimationProfile(personality);
  const isDegen = personality === 'degen' || personality === 'degen_meme';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);

  return (
    <section ref={containerRef} className="py-24 overflow-hidden">
      <div className="px-6 mb-12">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={profile.smooth}
        >
          {isDegen ? '🗺️ ROADMAP 🗺️' : 'Roadmap'}
        </motion.h2>
      </div>

      <motion.div className="flex gap-6 px-6" style={{ x }}>
        {phases.map((phase, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 w-80 relative"
            initial={{ opacity: 0, y: 30, rotate: isDegen ? (i % 2 === 0 ? -3 : 3) : 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ ...profile.spring, delay: i * 0.1 }}
          >
            {/* Connecting line */}
            {i < phases.length - 1 && (
              <motion.div 
                className="absolute top-10 left-full w-6 h-0.5"
                style={{ background: phase.completed ? styles.primary : 'rgba(255,255,255,0.2)' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
              />
            )}

            {/* Phase indicator */}
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  background: phase.completed ? styles.primary : 'transparent',
                  border: phase.completed ? `2px solid ${styles.primary}` : '2px solid rgba(255,255,255,0.3)'
                }}
                whileHover={{ scale: 1.2 }}
                transition={profile.spring}
              >
                {phase.completed ? (
                  <motion.div
                    animate={isDegen ? { rotate: [0, 360] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Check className="w-4 h-4 text-black" />
                  </motion.div>
                ) : (
                  <Circle className="w-3 h-3 text-white/30" />
                )}
              </motion.div>
              <motion.span 
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: phase.completed ? styles.primary : 'rgba(255,255,255,0.5)' }}
                animate={isDegen && phase.completed ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {phase.phase}
              </motion.span>
            </div>

            {/* Card */}
            <motion.div 
              className="p-6 rounded-2xl h-64"
              style={{ 
                background: phase.completed 
                  ? `linear-gradient(135deg, ${styles.primary}20, transparent)` 
                  : 'rgba(255,255,255,0.03)',
                border: phase.completed ? `1px solid ${styles.primary}` : '1px solid rgba(255,255,255,0.08)'
              }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={profile.spring}
            >
              <h3 className="text-2xl font-bold text-white mb-4">{phase.title}</h3>
              <ul className="space-y-3">
                {phase.items.map((item, j) => (
                  <motion.li 
                    key={j} 
                    className="text-sm flex items-start gap-2"
                    style={{ color: phase.completed ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)' }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + j * 0.1 }}
                  >
                    <motion.span 
                      style={{ color: styles.primary }}
                      animate={isDegen && phase.completed ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity, delay: j * 0.1 }}
                    >
                      •
                    </motion.span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
