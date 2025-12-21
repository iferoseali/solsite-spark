// Template styles configuration
import type { TemplateStyles } from './types';

const templateStyles: Record<string, TemplateStyles> = {
  cult_minimal: { 
    primary: '#a6ff00', accent: '#00ff88', 
    bgGradient: 'linear-gradient(135deg, #0b0b0b 0%, #0b0b0b 100%)', 
    bgColor: '#0b0b0b', text: '#ffffff', muted: 'rgba(166,255,0,0.6)',
    fontHeading: 'JetBrains Mono', fontBody: 'JetBrains Mono'
  },
  vc_pro: { 
    primary: '#5da9ff', accent: '#a855f7', 
    bgGradient: 'linear-gradient(135deg, #0e1117 0%, #0e1117 100%)', 
    bgColor: '#0e1117', text: '#e6e6e6', muted: 'rgba(93,169,255,0.6)',
    fontHeading: 'Inter', fontBody: 'Inter'
  },
  degen_meme: { 
    primary: '#ff4fd8', accent: '#ffeb3b', 
    bgGradient: 'linear-gradient(135deg, #120018 0%, #120018 100%)', 
    bgColor: '#120018', text: '#ffffff', muted: 'rgba(255,79,216,0.7)',
    fontHeading: 'Bangers', fontBody: 'Fredoka'
  },
  dark_cult: { 
    primary: '#ff0000', accent: '#8b0000', 
    bgGradient: 'linear-gradient(135deg, #050505 0%, #050505 100%)', 
    bgColor: '#050505', text: '#f5f5f5', muted: 'rgba(255,0,0,0.5)',
    fontHeading: 'Crimson Text', fontBody: 'Crimson Text'
  },
  luxury_token: { 
    primary: '#d4af37', accent: '#c0a030', 
    bgGradient: 'linear-gradient(135deg, #0a0a0a 0%, #0a0a0a 100%)', 
    bgColor: '#0a0a0a', text: '#ffffff', muted: 'rgba(212,175,55,0.6)',
    fontHeading: 'Playfair Display', fontBody: 'Cormorant Garamond'
  },
  builder_utility: { 
    primary: '#00ffa3', accent: '#00d4ff', 
    bgGradient: 'linear-gradient(135deg, #0d1117 0%, #0d1117 100%)', 
    bgColor: '#0d1117', text: '#c9d1d9', muted: 'rgba(0,255,163,0.6)',
    fontHeading: 'Space Grotesk', fontBody: 'Fira Code'
  },
  neo_grid: { 
    primary: '#7c8cff', accent: '#a855f7', 
    bgGradient: 'linear-gradient(135deg, #0b0f1a 0%, #0b0f1a 100%)', 
    bgColor: '#0b0f1a', text: '#eaeaff', muted: 'rgba(124,140,255,0.6)',
    fontHeading: 'Orbitron', fontBody: 'Rajdhani'
  },
  scroll_story: { 
    primary: '#ffffff', accent: '#888888', 
    bgGradient: 'linear-gradient(135deg, #000000 0%, #000000 100%)', 
    bgColor: '#000000', text: '#cccccc', muted: 'rgba(255,255,255,0.5)',
    fontHeading: 'Libre Baskerville', fontBody: 'Lora'
  },
  web3_gaming: { 
    primary: '#00f0ff', accent: '#ff00ff', 
    bgGradient: 'linear-gradient(135deg, #0c1022 0%, #0c1022 100%)', 
    bgColor: '#0c1022', text: '#ffffff', muted: 'rgba(0,240,255,0.6)',
    fontHeading: 'Audiowide', fontBody: 'Exo 2'
  },
  ai_crypto: { 
    primary: '#00ffcc', accent: '#00ff88', 
    bgGradient: 'linear-gradient(135deg, #05070a 0%, #05070a 100%)', 
    bgColor: '#05070a', text: '#e0fdf8', muted: 'rgba(0,255,204,0.6)',
    fontHeading: 'Sora', fontBody: 'Space Grotesk'
  },
  dao_portal: { 
    primary: '#b08cff', accent: '#7c5cff', 
    bgGradient: 'linear-gradient(135deg, #101014 0%, #101014 100%)', 
    bgColor: '#101014', text: '#ffffff', muted: 'rgba(176,140,255,0.6)',
    fontHeading: 'Plus Jakarta Sans', fontBody: 'Plus Jakarta Sans'
  },
  ultra_brutalist: { 
    primary: '#000000', accent: '#ff0000', 
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #ffffff 100%)', 
    bgColor: '#ffffff', text: '#000000', muted: 'rgba(0,0,0,0.6)',
    fontHeading: 'Archivo Black', fontBody: 'IBM Plex Mono'
  },
  infra_terminal: { 
    primary: '#00ff88', accent: '#00d4ff', 
    bgGradient: 'linear-gradient(135deg, #020409 0%, #020409 100%)', 
    bgColor: '#020409', text: '#9effc3', muted: 'rgba(0,255,136,0.5)',
    fontHeading: 'JetBrains Mono', fontBody: 'JetBrains Mono'
  },
  social_first: { 
    primary: '#ffcc00', accent: '#ff6b00', 
    bgGradient: 'linear-gradient(135deg, #0f0f12 0%, #0f0f12 100%)', 
    bgColor: '#0f0f12', text: '#ffffff', muted: 'rgba(255,204,0,0.6)',
    fontHeading: 'DM Sans', fontBody: 'DM Sans'
  },
  futuristic_3d: { 
    primary: '#7b5cff', accent: '#00f0ff', 
    bgGradient: 'linear-gradient(135deg, #030014 0%, #030014 100%)', 
    bgColor: '#030014', text: '#ffffff', muted: 'rgba(123,92,255,0.6)',
    fontHeading: 'Orbitron', fontBody: 'Exo 2'
  },
  // Premium Templates
  pump_blast_hero: { 
    primary: '#14F195', accent: '#00ff88', 
    bgGradient: 'linear-gradient(135deg, #000000 0%, #001a0d 100%)', 
    bgColor: '#000000', text: '#14F195', muted: 'rgba(20,241,149,0.6)',
    fontHeading: 'JetBrains Mono', fontBody: 'JetBrains Mono'
  },
  chaos_carousel: { 
    primary: '#FF00FF', accent: '#00ffff', 
    bgGradient: 'linear-gradient(135deg, #0a0014 0%, #140028 100%)', 
    bgColor: '#0a0014', text: '#ffffff', muted: 'rgba(255,0,255,0.6)',
    fontHeading: 'Inter', fontBody: 'Inter'
  },
  only_up_maxi_chart: { 
    primary: '#00FF00', accent: '#33ff33', 
    bgGradient: 'linear-gradient(135deg, #001100 0%, #002200 100%)', 
    bgColor: '#001100', text: '#00ff00', muted: 'rgba(0,255,0,0.5)',
    fontHeading: 'JetBrains Mono', fontBody: 'JetBrains Mono'
  },
  stealth_drop_reveal: { 
    primary: '#ffffff', accent: '#ff3366', 
    bgGradient: 'linear-gradient(135deg, #050505 0%, #0a0a0a 100%)', 
    bgColor: '#050505', text: '#888888', muted: 'rgba(255,255,255,0.4)',
    fontHeading: 'DM Sans', fontBody: 'DM Sans'
  },
  brutalist_pump_fun: { 
    primary: '#ffffff', accent: '#ff0000', 
    bgGradient: 'linear-gradient(135deg, #000000 0%, #000000 100%)', 
    bgColor: '#000000', text: '#ffffff', muted: 'rgba(255,255,255,0.6)',
    fontHeading: 'Arial', fontBody: 'Arial'
  },
  meme_wall_madness: { 
    primary: '#ff00aa', accent: '#ffff00', 
    bgGradient: 'linear-gradient(135deg, #14001f 0%, #280038 100%)', 
    bgColor: '#14001f', text: '#ffffff', muted: 'rgba(255,0,170,0.6)',
    fontHeading: 'Inter', fontBody: 'Inter'
  },
  trend_hacker: { 
    primary: '#1DA1F2', accent: '#00d9ff', 
    bgGradient: 'linear-gradient(135deg, #0c1520 0%, #142030 100%)', 
    bgColor: '#0c1520', text: '#e7e9ea', muted: 'rgba(29,161,242,0.6)',
    fontHeading: 'Inter', fontBody: 'Inter'
  },
  social_rocket: { 
    primary: '#9945FF', accent: '#14F195', 
    bgGradient: 'linear-gradient(135deg, #0d0618 0%, #1a0c30 100%)', 
    bgColor: '#0d0618', text: '#ffffff', muted: 'rgba(153,69,255,0.6)',
    fontHeading: 'DM Sans', fontBody: 'DM Sans'
  },
};

const personalityStyles: Record<string, TemplateStyles> = {
  degen: { 
    primary: '#ff4444', accent: '#ff8800', 
    bgGradient: 'linear-gradient(135deg, #1a0505 0%, #2d1810 100%)', 
    bgColor: '#1a0505', text: '#ffffff', muted: 'rgba(255,68,68,0.6)',
    fontHeading: 'Outfit', fontBody: 'Space Grotesk'
  },
  professional: { 
    primary: '#00d4ff', accent: '#0088ff', 
    bgGradient: 'linear-gradient(135deg, #0a1628 0%, #0d2137 100%)', 
    bgColor: '#0a1628', text: '#ffffff', muted: 'rgba(0,212,255,0.6)',
    fontHeading: 'Inter', fontBody: 'Inter'
  },
  'dark-cult': { 
    primary: '#a855f7', accent: '#ec4899', 
    bgGradient: 'linear-gradient(135deg, #150520 0%, #1f0a30 100%)', 
    bgColor: '#150520', text: '#ffffff', muted: 'rgba(168,85,247,0.6)',
    fontHeading: 'Crimson Text', fontBody: 'Crimson Text'
  },
  playful: { 
    primary: '#fbbf24', accent: '#22c55e', 
    bgGradient: 'linear-gradient(135deg, #1a1a0a 0%, #0a1a10 100%)', 
    bgColor: '#1a1a0a', text: '#ffffff', muted: 'rgba(251,191,36,0.6)',
    fontHeading: 'Outfit', fontBody: 'Space Grotesk'
  },
  premium: { 
    primary: '#d4af37', accent: '#c0c0c0', 
    bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', 
    bgColor: '#1a1a1a', text: '#ffffff', muted: 'rgba(212,175,55,0.6)',
    fontHeading: 'Playfair Display', fontBody: 'Cormorant Garamond'
  },
};

const defaultStyles: TemplateStyles = { 
  primary: '#00d4ff', accent: '#22c55e', 
  bgGradient: 'linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%)', 
  bgColor: '#0a0f1a', text: '#ffffff', muted: 'rgba(255,255,255,0.6)',
  fontHeading: 'Outfit', fontBody: 'Space Grotesk'
};

export function getTemplateStyles(templateId?: string, personality?: string): TemplateStyles {
  if (templateId && templateStyles[templateId]) {
    return templateStyles[templateId];
  }
  if (personality && personalityStyles[personality]) {
    return personalityStyles[personality];
  }
  return defaultStyles;
}

export function generateFontUrl(styles: TemplateStyles): string {
  const fontFamilies = new Set([styles.fontHeading, styles.fontBody]);
  const fontParams = Array.from(fontFamilies).map(font => {
    const formatted = font.replace(/ /g, '+');
    return `family=${formatted}:wght@400;500;600;700;800`;
  }).join('&');
  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
}
