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

export const TokenomicsGrid = ({ project, styles }: TokenomicsProps) => {
  const tokenomics = project.tokenomics || defaultTokenomics;
  
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
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Tokenomics</h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Built for sustainability and community growth
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              className="p-6 rounded-2xl text-center transition-all hover:scale-105"
              style={{ 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                borderColor: `${styles.primary}50`,
                background: `${styles.primary}08`
              }}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div 
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: styles.primary }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
