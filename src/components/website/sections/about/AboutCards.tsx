import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { getAnimationProfile, createMotionProps, createStaggerContainer, createStaggerChild } from "../../animations";

interface AboutProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

export const AboutCards = ({ project, styles, personality = 'professional' }: AboutProps) => {
  const profile = getAnimationProfile(personality);

  const features = [
    { title: 'Community Driven', description: 'Built by the community, for the community', icon: '🌐' },
    { title: 'Fully Transparent', description: 'Open-source and audited smart contracts', icon: '🔍' },
    { title: 'Fair Launch', description: 'No presale, no team tokens, 100% fair', icon: '⚖️' },
    { title: 'Deflationary', description: 'Built-in burn mechanism reduces supply', icon: '🔥' },
  ];

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" {...createMotionProps(profile, 'fadeIn')}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why {project.coinName || 'Choose Us'}?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            {project.description?.slice(0, 120) || 'Join the revolution in decentralized finance.'}
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          {...createStaggerContainer(profile)}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-2xl text-center group cursor-pointer"
              style={{ 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              {...createStaggerChild(profile, 'slideUp')}
              whileHover={{ 
                scale: profile.hoverScale,
                borderColor: `${styles.primary}50`,
                background: `${styles.primary}08`
              }}
            >
              <motion.div 
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={profile.spring}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
