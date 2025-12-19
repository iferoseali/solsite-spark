import { ProjectData, PersonalityStyles, TokenomicsData } from "../../types";
import { motion } from "framer-motion";
import { getAnimationProfile, createMotionProps } from "../../animations";

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

export const TokenomicsCircular = ({ project, styles, personality = 'dark-cult' }: TokenomicsProps) => {
  const tokenomics = project.tokenomics || defaultTokenomics;
  const profile = getAnimationProfile(personality);

  const distribution = [
    { label: 'Liquidity Pool', percentage: 40, color: styles.primary },
    { label: 'Community', percentage: 30, color: styles.accent },
    { label: 'Team', percentage: 15, color: `${styles.primary}99` },
    { label: 'Marketing', percentage: 15, color: `${styles.accent}99` },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
          {...createMotionProps(profile, 'fadeIn')}
        >
          Token Distribution
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Circular visualization */}
          <motion.div 
            className="relative mx-auto"
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...profile.smooth, duration: 1.2 }}
          >
            <svg viewBox="0 0 200 200" className="w-64 h-64 md:w-80 md:h-80">
              {distribution.map((item, i) => {
                const startAngle = distribution.slice(0, i).reduce((acc, d) => acc + d.percentage, 0) * 3.6;
                const endAngle = startAngle + item.percentage * 3.6;
                const largeArc = item.percentage > 50 ? 1 : 0;
                
                const startX = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                const startY = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                const endX = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                const endY = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);

                return (
                  <motion.path
                    key={item.label}
                    d={`M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArc} 1 ${endX} ${endY} Z`}
                    fill={item.color}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...profile.spring, delay: 0.3 + i * 0.2 }}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  />
                );
              })}
              <circle cx="100" cy="100" r="50" fill="rgba(0,0,0,0.9)" />
              <text x="100" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {tokenomics.totalSupply}
              </text>
              <text x="100" y="112" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">
                Total Supply
              </text>
            </svg>
          </motion.div>

          {/* Legend & stats */}
          <div className="space-y-6">
            {distribution.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...profile.smooth, delay: i * 0.1 }}
              >
                <motion.div 
                  className="w-4 h-4 rounded-full"
                  style={{ background: item.color }}
                  whileHover={{ scale: 1.3 }}
                  transition={profile.spring}
                />
                <span className="text-white flex-1">{item.label}</span>
                <span className="text-xl font-bold" style={{ color: item.color }}>
                  {item.percentage}%
                </span>
              </motion.div>
            ))}

            <motion.div 
              className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div>
                <p className="text-white/50 text-sm">Holders</p>
                <p className="text-xl font-bold" style={{ color: styles.primary }}>{tokenomics.holders}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm">Tax</p>
                <p className="text-xl font-bold" style={{ color: styles.accent }}>{tokenomics.tax}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
