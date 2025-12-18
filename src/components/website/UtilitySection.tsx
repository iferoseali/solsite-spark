import { ProjectData, PersonalityStyles } from "./types";

interface UtilitySectionProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

export const UtilitySection = ({ project, styles }: UtilitySectionProps) => {
  const utilities = [
    {
      icon: '🔒',
      title: 'Staking Rewards',
      description: `Stake your ${project.ticker || '$TOKEN'} to earn passive rewards and participate in governance decisions.`
    },
    {
      icon: '🎮',
      title: 'Exclusive Access',
      description: 'Holders get early access to new features, NFT drops, and community events.'
    },
    {
      icon: '💎',
      title: 'Holder Benefits',
      description: 'Diamond hand rewards, airdrops, and special perks for long-term believers.'
    },
    {
      icon: '🌐',
      title: 'Ecosystem Integration',
      description: `Use ${project.ticker || '$TOKEN'} across partner platforms and upcoming DeFi integrations.`
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Token Utility
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {utilities.map((utility, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl text-center transition-all hover:scale-105"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="text-5xl mb-4">{utility.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">
                {utility.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {utility.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
