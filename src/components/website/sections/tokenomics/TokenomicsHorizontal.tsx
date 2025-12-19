import { ProjectData, PersonalityStyles, TokenomicsData } from "../../types";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { getAnimationProfile } from "../../animations";

interface TokenomicsProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

const defaultTokenomics: TokenomicsData = {
  totalSupply: '1B',
  holders: '5K+',
  marketCap: '$100K',
  tax: '0%'
};

export const TokenomicsHorizontal = ({ project, styles, personality = 'degen' }: TokenomicsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tokenomics = project.tokenomics || defaultTokenomics;
  const profile = getAnimationProfile(personality);
  const isDegen = personality === 'degen' || personality === 'degen_meme';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  const stats = [
    { label: 'Total Supply', value: tokenomics.totalSupply, emoji: '💎' },
    { label: 'Holders', value: tokenomics.holders, emoji: '🦍' },
    { label: 'Market Cap', value: tokenomics.marketCap, emoji: '📈' },
    { label: 'Tax', value: tokenomics.tax, emoji: '0️⃣' },
    ...(tokenomics.burned ? [{ label: 'Burned', value: tokenomics.burned, emoji: '🔥' }] : []),
    ...(tokenomics.liquidity ? [{ label: 'Liquidity', value: tokenomics.liquidity, emoji: '💧' }] : []),
  ];

  return (
    <section ref={containerRef} className="py-24 overflow-hidden">
      <div className="text-center mb-12 px-6">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={profile.smooth}
        >
          {isDegen ? '💰 TOKENOMICS 💰' : 'Tokenomics'}
        </motion.h2>
      </div>

      <motion.div className="flex gap-8 px-6" style={{ x }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex-shrink-0 w-72 p-8 rounded-2xl relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${styles.primary}15, ${styles.accent}08)`,
              border: `2px solid ${styles.primary}40`
            }}
            initial={{ opacity: 0, scale: 0.8, rotate: isDegen ? -5 : 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ ...profile.spring, delay: i * 0.1 }}
            whileHover={{ scale: 1.05, rotate: isDegen ? 3 : 0 }}
          >
            {isDegen && (
              <motion.div 
                className="absolute top-2 right-2 text-2xl"
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                {stat.emoji}
              </motion.div>
            )}
            <motion.div 
              className="text-5xl font-black mb-4"
              style={{ color: styles.primary }}
              animate={isDegen ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            >
              {stat.value}
            </motion.div>
            <div className="text-white/60 uppercase tracking-wider text-sm">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
