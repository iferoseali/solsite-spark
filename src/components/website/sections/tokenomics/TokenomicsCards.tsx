import { ProjectData, PersonalityStyles, TokenomicsData } from "../../types";
import { motion } from "framer-motion";

interface TokenomicsProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

const defaultTokenomics: TokenomicsData = {
  totalSupply: '1,000,000,000',
  holders: '5,000+',
  marketCap: '$100K+',
  tax: '0%'
};

export const TokenomicsCards = ({ project, styles }: TokenomicsProps) => {
  const tokenomics = project.tokenomics || defaultTokenomics;

  const cards = [
    {
      title: 'Supply',
      value: tokenomics.totalSupply,
      description: 'Total tokens in circulation',
      gradient: `linear-gradient(135deg, ${styles.primary}20, ${styles.accent}20)`
    },
    {
      title: 'Community',
      value: tokenomics.holders,
      description: 'Diamond hand holders',
      gradient: `linear-gradient(135deg, ${styles.accent}20, ${styles.primary}20)`
    },
    {
      title: 'Market Cap',
      value: tokenomics.marketCap,
      description: 'Current valuation',
      gradient: `linear-gradient(135deg, ${styles.primary}30, transparent)`
    },
    {
      title: 'Tax',
      value: tokenomics.tax,
      description: 'Buy & sell fee',
      gradient: `linear-gradient(135deg, transparent, ${styles.accent}30)`
    },
  ];

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-6xl font-bold text-white mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Tokenomics
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className="relative p-8 rounded-3xl overflow-hidden group"
              style={{ background: card.gradient }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              {/* Hover glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ 
                  background: `radial-gradient(circle at center, ${styles.primary}20 0%, transparent 70%)`
                }}
              />

              <div className="relative z-10">
                <p className="text-white/50 text-sm uppercase tracking-wider mb-2">
                  {card.title}
                </p>
                <p 
                  className="text-5xl md:text-6xl font-black mb-4"
                  style={{ color: styles.primary }}
                >
                  {card.value}
                </p>
                <p className="text-white/60">{card.description}</p>
              </div>

              {/* Corner accent */}
              <div 
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20"
                style={{ background: styles.primary }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
