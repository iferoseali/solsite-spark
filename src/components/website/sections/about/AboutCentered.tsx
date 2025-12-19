import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { getAnimationProfile, createMotionProps } from "../../animations";

interface AboutProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

export const AboutCentered = ({ project, styles, personality = 'professional' }: AboutProps) => {
  const profile = getAnimationProfile(personality);

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-8"
          {...createMotionProps(profile, 'fadeIn')}
        >
          About {project.coinName || 'Us'}
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-white/70 leading-relaxed"
          {...createMotionProps(profile, 'slideUp')}
        >
          {project.description || 'A revolutionary project building the future of decentralized finance on Solana.'}
        </motion.p>
      </div>
    </section>
  );
};
