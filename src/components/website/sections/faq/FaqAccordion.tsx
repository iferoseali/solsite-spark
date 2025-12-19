import { ProjectData, PersonalityStyles, FaqItem } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getAnimationProfile, createMotionProps } from "../../animations";

interface FaqProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

const defaultFaqs: FaqItem[] = [
  { question: 'What is this token?', answer: 'A community-driven token on Solana with a focus on transparency and growth.' },
  { question: 'How do I buy?', answer: 'Connect your Solana wallet to Raydium or Jupiter and swap SOL for the token.' },
  { question: 'Is the contract renounced?', answer: 'Yes, the contract is fully renounced and ownership has been transferred to a dead wallet.' },
  { question: 'What are the tokenomics?', answer: 'Fair launch with no presale. 0% buy/sell tax. Liquidity locked.' },
];

export const FaqAccordion = ({ project, styles, personality = 'professional' }: FaqProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const profile = getAnimationProfile(personality);
  
  if (!project.showFaq) return null;
  const faqs = project.faqItems?.length ? project.faqItems : defaultFaqs;

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
          {...createMotionProps(profile, 'fadeIn')}
        >
          FAQ
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ 
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${openIndex === i ? `${styles.primary}50` : 'rgba(255,255,255,0.08)'}`
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.button
                className="w-full p-6 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                whileHover={{ background: `${styles.primary}08` }}
              >
                <span className="text-white font-semibold pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={profile.spring}
                >
                  <ChevronDown className="w-5 h-5" style={{ color: styles.primary }} />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={profile.smooth}
                  >
                    <div className="px-6 pb-6 text-white/70">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
