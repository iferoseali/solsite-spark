import { ProjectData, PersonalityStyles, TokenomicsData } from "../../types";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface TokenomicsProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

const defaultTokenomics: TokenomicsData = {
  totalSupply: '1B',
  holders: '5K+',
  marketCap: '$100K',
  tax: '0%'
};

export const TokenomicsHorizontal = ({ project, styles }: TokenomicsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tokenomics = project.tokenomics || defaultTokenomics;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  const stats = [
    { label: 'Total Supply', value: tokenomics.totalSupply },
    { label: 'Holders', value: tokenomics.holders },
    { label: 'Market Cap', value: tokenomics.marketCap },
    { label: 'Tax', value: tokenomics.tax },
    ...(tokenomics.burned ? [{ label: 'Burned', value: tokenomics.burned }] : []),
    ...(tokenomics.liquidity ? [{ label: 'Liquidity', value: tokenomics.liquidity }] : []),
  ];

  return (
    <section ref={containerRef} className="py-24 overflow-hidden">
      <div className="text-center mb-12 px-6">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Tokenomics
        </motion.h2>
      </div>

      <motion.div 
        className="flex gap-8 px-6"
        style={{ x }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex-shrink-0 w-72 p-8 rounded-2xl"
            style={{ 
              background: `linear-gradient(135deg, ${styles.primary}10, ${styles.accent}05)`,
              border: `1px solid ${styles.primary}30`
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div 
              className="text-5xl font-black mb-4"
              style={{ color: styles.primary }}
            >
              {stat.value}
            </div>
            <div className="text-white/60 uppercase tracking-wider text-sm">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
