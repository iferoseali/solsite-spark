import { useMemo } from "react";
import { SectionDefinition, StyleConfig, AnimationConfig } from "@/lib/templateTypes";

interface TemplatePreviewProps {
  sections: SectionDefinition[];
  styles: StyleConfig;
  animations: AnimationConfig;
}

// Sample data for preview
const SAMPLE_PROJECT = {
  coinName: 'MoonDoge',
  ticker: '$MDOGE',
  tagline: 'To the moon and beyond 🚀',
  description: 'The ultimate meme coin on Solana.',
  logoUrl: null,
};

export const TemplatePreview = ({ sections, styles, animations }: TemplatePreviewProps) => {
  const visibleSections = useMemo(() => 
    sections.filter(s => s.visible).sort((a, b) => a.order - b.order),
    [sections]
  );

  const renderSection = (section: SectionDefinition) => {
    const baseStyle = {
      transition: `all ${animations.transitionDuration}`,
    };

    switch (section.type) {
      case 'hero':
        return (
          <div 
            key={section.type}
            className="py-12 px-6 text-center"
            style={baseStyle}
          >
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
              style={{ background: styles.primaryColor, color: '#000' }}
            >
              {SAMPLE_PROJECT.ticker[1]}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{SAMPLE_PROJECT.coinName}</h1>
            <p className="text-lg text-white/60">{SAMPLE_PROJECT.tagline}</p>
            <div className="mt-6 flex justify-center gap-3">
              <button 
                className="px-6 py-2 rounded-lg font-medium"
                style={{ background: styles.primaryColor, color: '#000' }}
              >
                Buy Now
              </button>
              <button 
                className="px-6 py-2 rounded-lg font-medium border border-white/20 text-white"
              >
                Learn More
              </button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div key={section.type} className="py-10 px-6" style={baseStyle}>
            <h2 className="text-xl font-bold text-white mb-3 text-center">About</h2>
            <p className="text-white/60 text-center text-sm max-w-md mx-auto">
              {SAMPLE_PROJECT.description}
            </p>
          </div>
        );

      case 'tokenomics':
        return (
          <div key={section.type} className="py-10 px-6" style={baseStyle}>
            <h2 className="text-xl font-bold text-white mb-4 text-center">Tokenomics</h2>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              {['Supply', 'Holders', 'Market Cap', 'Tax'].map(stat => (
                <div 
                  key={stat}
                  className="p-3 rounded-lg text-center"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="text-xs text-white/40">{stat}</div>
                  <div className="font-bold" style={{ color: styles.primaryColor }}>---</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'roadmap':
        return (
          <div key={section.type} className="py-10 px-6" style={baseStyle}>
            <h2 className="text-xl font-bold text-white mb-4 text-center">Roadmap</h2>
            <div className="flex justify-center gap-2">
              {['Phase 1', 'Phase 2', 'Phase 3'].map((phase, i) => (
                <div 
                  key={phase}
                  className="p-3 rounded-lg text-center flex-1 max-w-[100px]"
                  style={{ 
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: i === 0 ? styles.primaryColor : 'transparent',
                    borderWidth: '1px'
                  }}
                >
                  <div className="text-xs" style={{ color: styles.primaryColor }}>{phase}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'community':
        return (
          <div key={section.type} className="py-10 px-6" style={baseStyle}>
            <h2 className="text-xl font-bold text-white mb-4 text-center">Community</h2>
            <div className="flex justify-center gap-4">
              {['Twitter', 'Discord', 'Telegram'].map(social => (
                <div 
                  key={social}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  {social[0]}
                </div>
              ))}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div key={section.type} className="py-10 px-6" style={baseStyle}>
            <h2 className="text-xl font-bold text-white mb-4 text-center">FAQ</h2>
            <div className="space-y-2 max-w-sm mx-auto">
              {['What is this?', 'How to buy?'].map(q => (
                <div 
                  key={q}
                  className="p-3 rounded-lg text-sm text-white/60"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        );

      case 'team':
        return (
          <div key={section.type} className="py-10 px-6" style={baseStyle}>
            <h2 className="text-xl font-bold text-white mb-4 text-center">Team</h2>
            <div className="flex justify-center gap-4">
              {['Dev', 'Marketing', 'Community'].map(role => (
                <div key={role} className="text-center">
                  <div 
                    className="w-10 h-10 rounded-full mx-auto mb-1"
                    style={{ background: `linear-gradient(135deg, ${styles.primaryColor}, ${styles.accentColor})` }}
                  />
                  <div className="text-xs text-white/60">{role}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'story':
        return (
          <div key={section.type} className="py-10 px-6" style={baseStyle}>
            <h2 className="text-xl font-bold text-white mb-3 text-center">The Story</h2>
            <p className="text-white/60 text-center text-sm">
              Once upon a time in the crypto universe...
            </p>
          </div>
        );

      case 'utility':
        return (
          <div key={section.type} className="py-10 px-6" style={baseStyle}>
            <h2 className="text-xl font-bold text-white mb-4 text-center">Utility</h2>
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
              {['Staking', 'NFTs', 'DAO', 'Rewards'].map(util => (
                <div 
                  key={util}
                  className="p-2 rounded-lg text-center text-xs text-white/60"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {util}
                </div>
              ))}
            </div>
          </div>
        );

      case 'footer':
        return (
          <div 
            key={section.type} 
            className="py-6 px-6 text-center border-t border-white/10"
            style={baseStyle}
          >
            <p className="text-xs text-white/40">Built with Solsite</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-[500px] overflow-auto"
      style={{ background: styles.bgGradient }}
    >
      {visibleSections.map(renderSection)}
    </div>
  );
};
