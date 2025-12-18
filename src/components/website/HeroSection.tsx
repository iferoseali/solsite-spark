import { ProjectData, PersonalityStyles } from "./types";

interface HeroSectionProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

export const HeroSection = ({ project, styles }: HeroSectionProps) => {
  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 relative"
    >
      {/* Glow effect */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none animate-pulse"
        style={{ 
          background: `radial-gradient(circle, ${styles.primary}40 0%, transparent 70%)`,
          opacity: 0.3
        }}
      />

      {/* Logo */}
      <div className="relative z-10 mb-8 animate-[float_6s_ease-in-out_infinite]">
        {project.logoUrl ? (
          <img 
            src={project.logoUrl} 
            alt={project.coinName}
            className="w-32 h-32 rounded-3xl object-cover shadow-2xl"
          />
        ) : (
          <div 
            className="w-32 h-32 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})` }}
          >
            {project.ticker?.[1] || '?'}
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 animate-fade-in">
        {project.coinName || 'Your Coin Name'}
      </h1>

      {/* Ticker */}
      <p 
        className="relative z-10 text-2xl md:text-4xl font-mono mb-6 animate-fade-in"
        style={{ color: styles.primary, animationDelay: '0.1s' }}
      >
        {project.ticker || '$TICKER'}
      </p>

      {/* Tagline */}
      <p className="relative z-10 text-lg md:text-2xl text-white/60 max-w-2xl mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {project.tagline || 'Your awesome tagline goes here'}
      </p>

      {/* CTA Buttons */}
      <div className="relative z-10 flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {project.dexLink ? (
          <a 
            href={project.dexLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl"
            style={{ 
              background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})`,
              color: '#000'
            }}
          >
            Buy Now
          </a>
        ) : (
          <button 
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl"
            style={{ 
              background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})`,
              color: '#000'
            }}
          >
            Buy Now
          </button>
        )}
        <a 
          href="#about"
          className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:scale-105"
          style={{ 
            border: '2px solid rgba(255,255,255,0.2)',
            background: 'transparent'
          }}
        >
          Learn More
        </a>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
};
