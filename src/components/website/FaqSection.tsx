import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProjectData, PersonalityStyles, FaqItem } from "./types";

interface FaqSectionProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

export const FaqSection = ({ project, styles }: FaqSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!project.showFaq) return null;

  const defaultFaqs: FaqItem[] = [
    {
      question: `What is ${project.coinName || 'this coin'}?`,
      answer: project.description || `${project.coinName || 'This'} is a community-driven meme coin on Solana with massive potential.`
    },
    {
      question: `How do I buy ${project.ticker || 'this token'}?`,
      answer: `You can buy ${project.ticker || 'this token'} on decentralized exchanges like Raydium or Jupiter. Connect your Solana wallet and swap SOL.`
    },
    {
      question: `Is ${project.coinName || 'this coin'} safe?`,
      answer: 'Always do your own research (DYOR). This is a meme coin and should be treated as a high-risk investment.'
    }
  ];

  const faqs = project.faqItems?.length ? project.faqItems : defaultFaqs;

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          FAQ
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="rounded-2xl overflow-hidden transition-all"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${openIndex === i ? styles.primary : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  style={{ color: styles.primary }}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 text-white/60 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
