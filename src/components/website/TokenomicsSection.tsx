import { ProjectData, PersonalityStyles, TokenomicsData } from "./types";

interface TokenomicsSectionProps {
  project: ProjectData;
  styles: PersonalityStyles;
  tokenomics?: TokenomicsData;
}

const defaultTokenomics: TokenomicsData = {
  totalSupply: '1,000,000,000',
  holders: '5,000+',
  marketCap: '$100K+',
  tax: '0%'
};

export const TokenomicsSection = ({ project, styles, tokenomics = defaultTokenomics }: TokenomicsSectionProps) => {
  const stats = [
    { label: 'Total Supply', value: tokenomics.totalSupply },
    { label: 'Holders', value: tokenomics.holders },
    { label: 'Market Cap', value: tokenomics.marketCap },
    { label: 'Buy/Sell Tax', value: tokenomics.tax },
  ];

  if (tokenomics.burned) {
    stats.push({ label: 'Burned', value: tokenomics.burned });
  }
  if (tokenomics.liquidity) {
    stats.push({ label: 'Liquidity', value: tokenomics.liquidity });
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Tokenomics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl text-center transition-all hover:scale-105 hover:border-opacity-100"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid rgba(255,255,255,0.1)`,
              }}
            >
              <div 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: styles.primary }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
