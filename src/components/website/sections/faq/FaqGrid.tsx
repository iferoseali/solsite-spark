import { ProjectData, PersonalityStyles, FaqItem } from "../../types";
import { motion } from "framer-motion";
import { getAnimationProfile, createMotionProps, createStaggerContainer, createStaggerChild } from "../../animations";

interface FaqProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

const defaultFaqs: FaqItem[] = [
  { question: 'What is the vision?', answer: 'To build the most community-focused token on Solana.' },
  { question: 'How to buy?', answer: 'Swap SOL on Raydium or Jupiter.' },
  { question: 'Contract renounced?', answer: 'Yes, fully renounced.' },
  { question: 'Tax?', answer: '0% buy and sell tax.' },
];

export const FaqGrid = ({ project, styles, personality = 'professional' }: FaqProps) => {
  const profile = getAnimationProfile(personality);
  
  if (!project.showFaq) return null;
  const faqs = project.faqItems?.length ? project.faqItems : defaultFaqs;

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
          {...createMotionProps(profile, 'fadeIn')}
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          {...createStaggerContainer(profile)}
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${styles.primary}08, transparent)`,
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              {...createStaggerChild(profile, 'slideUp')}
              whileHover={{ 
                borderColor: `${styles.primary}40`,
                scale: 1.02
              }}
              transition={profile.spring}
            >
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span style={{ color: styles.primary }}>Q:</span>
                {faq.question}
              </h3>
              <p className="text-white/70 pl-6">{faq.answer}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
