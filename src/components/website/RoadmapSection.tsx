import { ProjectData, PersonalityStyles, RoadmapPhase } from "./types";

interface RoadmapSectionProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

const defaultPhases: RoadmapPhase[] = [
  {
    phase: 'Phase 1',
    title: 'Launch',
    items: ['Token launch on Solana', 'Website & socials live', 'Community building'],
    completed: true
  },
  {
    phase: 'Phase 2',
    title: 'Growth',
    items: ['CEX listings', 'Marketing campaigns', 'Partnerships'],
    completed: false
  },
  {
    phase: 'Phase 3',
    title: 'Moon',
    items: ['Major exchange listings', 'Ecosystem expansion', 'To the moon 🚀'],
    completed: false
  }
];

export const RoadmapSection = ({ project, styles }: RoadmapSectionProps) => {
  if (!project.showRoadmap) return null;

  const phases = project.roadmapPhases?.length ? project.roadmapPhases : defaultPhases;

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Roadmap
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {phases.map((phase, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl transition-all hover:scale-105"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${phase.completed ? styles.primary : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <div 
                className="text-xs uppercase tracking-widest mb-2"
                style={{ color: styles.primary }}
              >
                {phase.phase}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {phase.title}
              </h3>
              <ul className="space-y-2">
                {phase.items.map((item, j) => (
                  <li key={j} className="text-white/60 flex items-start gap-2">
                    <span style={{ color: styles.primary }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
