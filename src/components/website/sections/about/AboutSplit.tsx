import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { getAnimationProfile, createMotionProps } from "../../animations";

interface AboutProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

export const AboutSplit = ({ project, styles, personality = 'professional' }: AboutProps) => {
  const profile = getAnimationProfile(personality);

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div {...createMotionProps(profile, 'slideUp')}>
          <span 
            className="text-sm font-bold uppercase tracking-wider mb-4 block"
            style={{ color: styles.primary }}
          >
            Our Mission
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About {project.coinName || 'The Project'}
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            {project.description || 'Building the future of decentralized finance with innovation and community at our core.'}
          </p>
        </motion.div>

        <motion.div 
          className="relative"
          {...createMotionProps(profile, 'scaleIn')}
        >
          <div 
            className="absolute inset-0 rounded-3xl opacity-20 blur-2xl"
            style={{ background: styles.primary }}
          />
          <div 
            className="relative p-8 rounded-3xl"
            style={{ 
              background: `linear-gradient(135deg, ${styles.primary}15, ${styles.accent}10)`,
              border: `1px solid ${styles.primary}30`
            }}
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Community First', icon: '🤝' },
                { label: 'Transparent', icon: '🔍' },
                { label: 'Innovative', icon: '💡' },
                { label: 'Secure', icon: '🔒' },
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  className="text-center p-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-white/80 text-sm">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
