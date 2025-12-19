import { ProjectData, PersonalityStyles, TokenomicsData } from "../../types";
import { motion } from "framer-motion";
import { getAnimationProfile, createMotionProps, createStaggerContainer, createStaggerChild, createHoverEffect } from "../../animations";

interface TokenomicsProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

const defaultTokenomics: TokenomicsData = {
  totalSupply: '1,000,000,000',
  holders: '5,000+',
  marketCap: '$100K+',
  tax: '0%'
};

export const TokenomicsGrid = ({ project, styles, personality = 'professional' }: TokenomicsProps) => {
  const tokenomics = project.tokenomics || defaultTokenomics;
  const profile = getAnimationProfile(personality);
  const isDegen = personality === 'degen' || personality === 'degen_meme';
  
  const stats = [
    { label: 'Total Supply', value: tokenomics.totalSupply, icon: '💎' },
    { label: 'Holders', value: tokenomics.holders, icon: '👥' },
    { label: 'Market Cap', value: tokenomics.marketCap, icon: '📈' },
    { label: 'Tax', value: tokenomics.tax, icon: '🏷️' },
  ];

  if (tokenomics.burned) stats.push({ label: 'Burned', value: tokenomics.burned, icon: '🔥' });
  if (tokenomics.liquidity) stats.push({ label: 'Liquidity', value: tokenomics.liquidity, icon: '💧' });

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" {...createMotionProps(profile, 'fadeIn')}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isDegen ? '💰 Tokenomics 💰' : 'Tokenomics'}
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            {isDegen ? 'Numbers go brrr 📊' : 'Built for sustainability and community growth'}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          {...createStaggerContainer(profile)}
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              className="p-6 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              {...createStaggerChild(profile, 'slideUp')}
              {...createHoverEffect(profile)}
              whileHover={{ 
                borderColor: `${styles.primary}50`,
                background: `${styles.primary}08`,
                scale: profile.hoverScale
              }}
            >
              <motion.div 
                className="text-3xl mb-3"
                animate={isDegen ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              >
                {stat.icon}
              </motion.div>
              <motion.div 
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: styles.primary }}
                animate={isDegen ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-white/50 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
