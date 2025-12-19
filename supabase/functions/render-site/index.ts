import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Project {
  id: string;
  coin_name: string;
  ticker: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  twitter_url: string | null;
  discord_url: string | null;
  telegram_url: string | null;
  dex_link: string | null;
  show_roadmap: boolean;
  show_faq: boolean;
  config: Record<string, any>;
  template_id: string | null;
}

interface Template {
  layout_id: string;
  personality_id: string;
  config: Record<string, any>;
}

interface TemplateConfig {
  fonts: { heading: string; body: string; mono?: string };
  colors: { bg: string; primary: string; accent: string; text: string; muted: string };
  heroLayout: 'centered' | 'split' | 'fullscreen' | 'left-aligned' | 'minimal' | 'grid-hero' | 'scroll' | 'media-left' | 'glow' | 'dashboard' | 'raw' | 'terminal' | 'avatar' | '3d';
  cardStyle: 'glass' | 'neon' | 'gold' | 'brutalist' | 'soft' | 'terminal' | 'bento' | 'float';
  animations: string[];
  backgroundEffect: string;
  buttonStyle: string;
}

// Template configurations for each personality
function getTemplateConfig(templateId: string): TemplateConfig {
  switch (templateId) {
    case 'cult_minimal':
      return {
        fonts: { heading: 'JetBrains Mono', body: 'JetBrains Mono', mono: 'JetBrains Mono' },
        colors: { bg: '#0b0b0b', primary: '#a6ff00', accent: '#00ff88', text: '#ffffff', muted: 'rgba(166,255,0,0.6)' },
        heroLayout: 'centered',
        cardStyle: 'brutalist',
        animations: ['glitch', 'flicker'],
        backgroundEffect: 'matrix',
        buttonStyle: 'brutalist'
      };
    case 'vc_pro':
      return {
        fonts: { heading: 'Inter', body: 'Inter' },
        colors: { bg: '#0e1117', primary: '#5da9ff', accent: '#a855f7', text: '#e6e6e6', muted: 'rgba(93,169,255,0.6)' },
        heroLayout: 'split',
        cardStyle: 'glass',
        animations: ['fade-up', 'scale-in'],
        backgroundEffect: 'gradient-orbs',
        buttonStyle: 'gradient'
      };
    case 'degen_meme':
      return {
        fonts: { heading: 'Bangers', body: 'Fredoka' },
        colors: { bg: '#120018', primary: '#ff4fd8', accent: '#ffeb3b', text: '#ffffff', muted: 'rgba(255,79,216,0.7)' },
        heroLayout: 'fullscreen',
        cardStyle: 'neon',
        animations: ['shake', 'bounce', 'zoom-in'],
        backgroundEffect: 'floating-emojis',
        buttonStyle: 'neon'
      };
    case 'dark_cult':
      return {
        fonts: { heading: 'Crimson Text', body: 'Crimson Text' },
        colors: { bg: '#050505', primary: '#ff0000', accent: '#8b0000', text: '#f5f5f5', muted: 'rgba(255,0,0,0.5)' },
        heroLayout: 'left-aligned',
        cardStyle: 'brutalist',
        animations: ['fade-in', 'reveal'],
        backgroundEffect: 'fog',
        buttonStyle: 'cult'
      };
    case 'luxury_token':
      return {
        fonts: { heading: 'Playfair Display', body: 'Cormorant Garamond' },
        colors: { bg: '#0a0a0a', primary: '#d4af37', accent: '#c0a030', text: '#ffffff', muted: 'rgba(212,175,55,0.6)' },
        heroLayout: 'minimal',
        cardStyle: 'gold',
        animations: ['shimmer', 'elegant-fade'],
        backgroundEffect: 'gold-dust',
        buttonStyle: 'luxury'
      };
    case 'builder_utility':
      return {
        fonts: { heading: 'Space Grotesk', body: 'Fira Code', mono: 'Fira Code' },
        colors: { bg: '#0d1117', primary: '#00ffa3', accent: '#00d4ff', text: '#c9d1d9', muted: 'rgba(0,255,163,0.6)' },
        heroLayout: 'split',
        cardStyle: 'terminal',
        animations: ['type-in', 'slide-up'],
        backgroundEffect: 'grid-lines',
        buttonStyle: 'terminal'
      };
    case 'neo_grid':
      return {
        fonts: { heading: 'Orbitron', body: 'Rajdhani' },
        colors: { bg: '#0b0f1a', primary: '#7c8cff', accent: '#a855f7', text: '#eaeaff', muted: 'rgba(124,140,255,0.6)' },
        heroLayout: 'grid-hero',
        cardStyle: 'bento',
        animations: ['fade-in-stagger', 'scale'],
        backgroundEffect: 'cyber-grid',
        buttonStyle: 'cyber'
      };
    case 'scroll_story':
      return {
        fonts: { heading: 'Libre Baskerville', body: 'Lora' },
        colors: { bg: '#000000', primary: '#ffffff', accent: '#888888', text: '#cccccc', muted: 'rgba(255,255,255,0.5)' },
        heroLayout: 'scroll',
        cardStyle: 'soft',
        animations: ['scroll-reveal', 'fade-in'],
        backgroundEffect: 'none',
        buttonStyle: 'minimal'
      };
    case 'web3_gaming':
      return {
        fonts: { heading: 'Audiowide', body: 'Exo 2' },
        colors: { bg: '#0c1022', primary: '#00f0ff', accent: '#ff00ff', text: '#ffffff', muted: 'rgba(0,240,255,0.6)' },
        heroLayout: 'media-left',
        cardStyle: 'neon',
        animations: ['slide-in', 'pulse'],
        backgroundEffect: 'scanlines',
        buttonStyle: 'gaming'
      };
    case 'ai_crypto':
      return {
        fonts: { heading: 'Sora', body: 'Space Grotesk' },
        colors: { bg: '#05070a', primary: '#00ffcc', accent: '#00ff88', text: '#e0fdf8', muted: 'rgba(0,255,204,0.6)' },
        heroLayout: 'glow',
        cardStyle: 'glass',
        animations: ['fade-up-stagger', 'glow'],
        backgroundEffect: 'neural',
        buttonStyle: 'glow'
      };
    case 'dao_portal':
      return {
        fonts: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans' },
        colors: { bg: '#101014', primary: '#b08cff', accent: '#7c5cff', text: '#ffffff', muted: 'rgba(176,140,255,0.6)' },
        heroLayout: 'dashboard',
        cardStyle: 'glass',
        animations: ['fade-in', 'slide-up'],
        backgroundEffect: 'gradient-orbs',
        buttonStyle: 'gradient'
      };
    case 'ultra_brutalist':
      return {
        fonts: { heading: 'Archivo Black', body: 'IBM Plex Mono' },
        colors: { bg: '#ffffff', primary: '#000000', accent: '#ff0000', text: '#000000', muted: 'rgba(0,0,0,0.6)' },
        heroLayout: 'raw',
        cardStyle: 'brutalist',
        animations: ['none'],
        backgroundEffect: 'none',
        buttonStyle: 'raw'
      };
    case 'infra_terminal':
      return {
        fonts: { heading: 'JetBrains Mono', body: 'JetBrains Mono', mono: 'JetBrains Mono' },
        colors: { bg: '#020409', primary: '#00ff88', accent: '#00d4ff', text: '#9effc3', muted: 'rgba(0,255,136,0.5)' },
        heroLayout: 'terminal',
        cardStyle: 'terminal',
        animations: ['typing', 'blink'],
        backgroundEffect: 'matrix',
        buttonStyle: 'terminal'
      };
    case 'social_first':
      return {
        fonts: { heading: 'DM Sans', body: 'DM Sans' },
        colors: { bg: '#0f0f12', primary: '#ffcc00', accent: '#ff6b00', text: '#ffffff', muted: 'rgba(255,204,0,0.6)' },
        heroLayout: 'avatar',
        cardStyle: 'soft',
        animations: ['fade-in', 'slide-up'],
        backgroundEffect: 'warm-gradient',
        buttonStyle: 'warm'
      };
    case 'futuristic_3d':
      return {
        fonts: { heading: 'Orbitron', body: 'Exo 2' },
        colors: { bg: '#030014', primary: '#7b5cff', accent: '#00f0ff', text: '#ffffff', muted: 'rgba(123,92,255,0.6)' },
        heroLayout: '3d',
        cardStyle: 'float',
        animations: ['parallax', 'float', 'glow-pulse'],
        backgroundEffect: '3d-space',
        buttonStyle: 'hologram'
      };
    default:
      return {
        fonts: { heading: 'Inter', body: 'Inter' },
        colors: { bg: '#0a0f1a', primary: '#00d4ff', accent: '#22c55e', text: '#ffffff', muted: 'rgba(255,255,255,0.6)' },
        heroLayout: 'centered',
        cardStyle: 'glass',
        animations: ['fade-in'],
        backgroundEffect: 'none',
        buttonStyle: 'gradient'
      };
  }
}

function generateFontsLink(config: TemplateConfig): string {
  const fontFamilies = new Set([config.fonts.heading, config.fonts.body]);
  if (config.fonts.mono) fontFamilies.add(config.fonts.mono);
  
  const fontParams = Array.from(fontFamilies).map(font => {
    const formatted = font.replace(/ /g, '+');
    return `family=${formatted}:wght@400;500;600;700;800`;
  }).join('&');
  
  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
}

function generateBackgroundEffect(templateId: string, config: TemplateConfig): string {
  switch (config.backgroundEffect) {
    case 'matrix':
      return `
        <div class="matrix-bg" id="matrix"></div>
        <style>
          .matrix-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.15;
          }
        </style>
        <script>
          (function() {
            const canvas = document.createElement('canvas');
            document.getElementById('matrix').appendChild(canvas);
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const chars = '01アイウエオカキクケコサシスセソタチツテト';
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops = Array(Math.floor(columns)).fill(1);
            function draw() {
              ctx.fillStyle = 'rgba(11, 11, 11, 0.05)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = '${config.colors.primary}';
              ctx.font = fontSize + 'px monospace';
              for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
              }
            }
            setInterval(draw, 50);
          })();
        </script>
      `;
    case 'gradient-orbs':
      return `
        <div class="orbs-container">
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <div class="orb orb-3"></div>
        </div>
        <style>
          .orbs-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
          }
          .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.4;
            animation: float-orb 20s infinite ease-in-out;
          }
          .orb-1 {
            width: 600px;
            height: 600px;
            background: ${config.colors.primary};
            top: -200px;
            right: -200px;
            animation-delay: 0s;
          }
          .orb-2 {
            width: 400px;
            height: 400px;
            background: ${config.colors.accent};
            bottom: -100px;
            left: -100px;
            animation-delay: -7s;
          }
          .orb-3 {
            width: 300px;
            height: 300px;
            background: linear-gradient(${config.colors.primary}, ${config.colors.accent});
            top: 50%;
            left: 50%;
            animation-delay: -14s;
          }
          @keyframes float-orb {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(50px, -50px) scale(1.1); }
            50% { transform: translate(-30px, 30px) scale(0.95); }
            75% { transform: translate(20px, 60px) scale(1.05); }
          }
        </style>
      `;
    case 'floating-emojis':
      return `
        <div class="emoji-container" id="emojis"></div>
        <style>
          .emoji-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
          }
          .floating-emoji {
            position: absolute;
            font-size: 30px;
            animation: float-up 10s linear infinite;
            opacity: 0.6;
          }
          @keyframes float-up {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
          }
        </style>
        <script>
          (function() {
            const emojis = ['🚀', '🌙', '💎', '🔥', '⚡', '🦍', '🐕', '💰', '🎉', '✨'];
            const container = document.getElementById('emojis');
            function createEmoji() {
              const emoji = document.createElement('div');
              emoji.className = 'floating-emoji';
              emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
              emoji.style.left = Math.random() * 100 + '%';
              emoji.style.animationDuration = (8 + Math.random() * 4) + 's';
              emoji.style.animationDelay = Math.random() * 2 + 's';
              container.appendChild(emoji);
              setTimeout(() => emoji.remove(), 12000);
            }
            setInterval(createEmoji, 800);
            for (let i = 0; i < 10; i++) setTimeout(createEmoji, i * 200);
          })();
        </script>
      `;
    case 'fog':
      return `
        <div class="fog-container">
          <div class="fog fog-1"></div>
          <div class="fog fog-2"></div>
        </div>
        <style>
          .fog-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
          }
          .fog {
            position: absolute;
            width: 200%;
            height: 100%;
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.4;
          }
          .fog-1 {
            animation: fog-move 60s linear infinite;
            background-blend-mode: overlay;
            background-color: ${config.colors.primary}20;
          }
          .fog-2 {
            animation: fog-move 45s linear infinite reverse;
            background-blend-mode: multiply;
            background-color: ${config.colors.accent}10;
            top: 50%;
          }
          @keyframes fog-move {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        </style>
      `;
    case 'gold-dust':
      return `
        <div class="dust-container" id="goldDust"></div>
        <style>
          .dust-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
          }
          .gold-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${config.colors.primary};
            border-radius: 50%;
            box-shadow: 0 0 10px ${config.colors.primary}, 0 0 20px ${config.colors.primary}40;
            animation: sparkle 4s ease-in-out infinite;
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
            50% { opacity: 1; transform: translateY(-20px) scale(1); }
          }
        </style>
        <script>
          (function() {
            const container = document.getElementById('goldDust');
            for (let i = 0; i < 50; i++) {
              const particle = document.createElement('div');
              particle.className = 'gold-particle';
              particle.style.left = Math.random() * 100 + '%';
              particle.style.top = Math.random() * 100 + '%';
              particle.style.animationDelay = Math.random() * 4 + 's';
              particle.style.animationDuration = (3 + Math.random() * 2) + 's';
              container.appendChild(particle);
            }
          })();
        </script>
      `;
    case 'grid-lines':
      return `
        <div class="grid-bg"></div>
        <style>
          .grid-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            background-image: 
              linear-gradient(${config.colors.primary}15 1px, transparent 1px),
              linear-gradient(90deg, ${config.colors.primary}15 1px, transparent 1px);
            background-size: 50px 50px;
            animation: grid-pulse 4s ease-in-out infinite;
          }
          @keyframes grid-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
        </style>
      `;
    case 'cyber-grid':
      return `
        <div class="cyber-grid-bg"></div>
        <style>
          .cyber-grid-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            background: 
              linear-gradient(90deg, ${config.colors.primary}08 1px, transparent 1px),
              linear-gradient(${config.colors.primary}08 1px, transparent 1px);
            background-size: 60px 60px;
            animation: cyber-shift 20s linear infinite;
          }
          .cyber-grid-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at 50% 0%, ${config.colors.primary}30, transparent 60%);
          }
          @keyframes cyber-shift {
            0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
            100% { transform: perspective(500px) rotateX(60deg) translateY(60px); }
          }
        </style>
      `;
    case 'scanlines':
      return `
        <div class="scanlines-bg"></div>
        <style>
          .scanlines-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.3) 2px,
              rgba(0,0,0,0.3) 4px
            );
            animation: scanline-flicker 0.1s infinite;
          }
          @keyframes scanline-flicker {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 0.9; }
          }
        </style>
      `;
    case 'neural':
      return `
        <div class="neural-bg" id="neural"></div>
        <style>
          .neural-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
          }
          .neural-node {
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${config.colors.primary};
            border-radius: 50%;
            box-shadow: 0 0 20px ${config.colors.primary};
            animation: pulse-node 3s ease-in-out infinite;
          }
          .neural-line {
            position: absolute;
            height: 1px;
            background: linear-gradient(90deg, ${config.colors.primary}40, transparent);
            transform-origin: left center;
          }
          @keyframes pulse-node {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
        </style>
        <script>
          (function() {
            const container = document.getElementById('neural');
            const nodes = [];
            for (let i = 0; i < 30; i++) {
              const node = document.createElement('div');
              node.className = 'neural-node';
              node.style.left = Math.random() * 100 + '%';
              node.style.top = Math.random() * 100 + '%';
              node.style.animationDelay = Math.random() * 3 + 's';
              container.appendChild(node);
              nodes.push(node);
            }
          })();
        </script>
      `;
    case 'warm-gradient':
      return `
        <div class="warm-gradient-bg"></div>
        <style>
          .warm-gradient-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            background: radial-gradient(ellipse at 0% 0%, ${config.colors.primary}20, transparent 50%),
                        radial-gradient(ellipse at 100% 100%, ${config.colors.accent}15, transparent 50%);
          }
        </style>
      `;
    case '3d-space':
      return `
        <div class="space-bg" id="space"></div>
        <style>
          .space-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            background: radial-gradient(ellipse at center, #0a0025 0%, #030014 100%);
          }
          .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: #fff;
            border-radius: 50%;
            animation: twinkle 3s ease-in-out infinite;
          }
          .nebula {
            position: absolute;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            filter: blur(100px);
            opacity: 0.3;
            animation: drift 30s ease-in-out infinite;
          }
          .nebula-1 { background: ${config.colors.primary}; top: -200px; right: -200px; }
          .nebula-2 { background: ${config.colors.accent}; bottom: -200px; left: -200px; animation-delay: -15s; }
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          @keyframes drift {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(50px, 30px); }
          }
        </style>
        <script>
          (function() {
            const container = document.getElementById('space');
            const nebula1 = document.createElement('div');
            nebula1.className = 'nebula nebula-1';
            container.appendChild(nebula1);
            const nebula2 = document.createElement('div');
            nebula2.className = 'nebula nebula-2';
            container.appendChild(nebula2);
            for (let i = 0; i < 100; i++) {
              const star = document.createElement('div');
              star.className = 'star';
              star.style.left = Math.random() * 100 + '%';
              star.style.top = Math.random() * 100 + '%';
              star.style.animationDelay = Math.random() * 3 + 's';
              star.style.animationDuration = (2 + Math.random() * 3) + 's';
              container.appendChild(star);
            }
          })();
        </script>
      `;
    default:
      return '';
  }
}

function generateHeroSection(project: Project, config: TemplateConfig, templateId: string): string {
  const logoHtml = project.logo_url 
    ? `<img src="${project.logo_url}" alt="${project.coin_name}" class="hero-logo-img" />`
    : `<div class="hero-logo-placeholder">${project.ticker?.[1] || '?'}</div>`;

  switch (config.heroLayout) {
    case 'fullscreen':
      // Degen Meme - Giant ticker, wild animations
      return `
        <section class="hero hero-fullscreen">
          <div class="hero-bg-overlay"></div>
          <div class="hero-content">
            <div class="hero-logo mega-bounce">${logoHtml}</div>
            <h1 class="hero-title giant-text shake-hover">${project.coin_name}</h1>
            <div class="hero-ticker mega-ticker pulse-glow">${project.ticker}</div>
            <p class="hero-tagline bounce-text">${project.tagline || 'TO THE MOON! 🚀🌕'}</p>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-mega shake-hover">🚀 APE IN NOW 🚀</a>` : ''}
              ${project.twitter_url ? `<a href="${project.twitter_url}" target="_blank" rel="noopener" class="btn btn-secondary btn-mega">JOIN THE CULT 🦍</a>` : ''}
            </div>
          </div>
        </section>
      `;
    case 'split':
      // VC Pro or Builder - Clean split layout
      return `
        <section class="hero hero-split">
          <div class="hero-content-left">
            <div class="hero-badge">Built on Solana</div>
            <h1 class="hero-title">${project.coin_name}</h1>
            <p class="hero-tagline">${project.tagline || 'The next generation of decentralized technology'}</p>
            <div class="hero-stats-mini">
              <div class="mini-stat"><span class="stat-num">1M+</span><span class="stat-label">Supply</span></div>
              <div class="mini-stat"><span class="stat-num">0%</span><span class="stat-label">Tax</span></div>
              <div class="mini-stat"><span class="stat-num">24/7</span><span class="stat-label">Support</span></div>
            </div>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary">Get Started</a>` : ''}
              ${project.twitter_url ? `<a href="${project.twitter_url}" target="_blank" rel="noopener" class="btn btn-secondary">Learn More</a>` : ''}
            </div>
          </div>
          <div class="hero-content-right">
            <div class="hero-visual">
              ${logoHtml}
              <div class="visual-glow"></div>
            </div>
          </div>
        </section>
      `;
    case 'left-aligned':
      // Dark Cult - Moody, mysterious
      return `
        <section class="hero hero-left">
          <div class="hero-content">
            <div class="cult-symbol">◈</div>
            <h1 class="hero-title reveal-text">${project.coin_name}</h1>
            <div class="hero-ticker blood-text">${project.ticker}</div>
            <p class="hero-tagline">${project.tagline || 'Join the inner circle. Embrace the darkness.'}</p>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-cult">Enter the Cult</a>` : ''}
            </div>
          </div>
          <div class="hero-side-art">
            <div class="dark-logo">${logoHtml}</div>
          </div>
        </section>
      `;
    case 'minimal':
      // Luxury - Ultra clean, elegant
      return `
        <section class="hero hero-minimal">
          <div class="hero-content">
            <div class="hero-logo luxury-logo">${logoHtml}</div>
            <h1 class="hero-title elegant-text">${project.coin_name}</h1>
            <div class="hero-ticker luxury-ticker">${project.ticker}</div>
            <div class="luxury-divider"><span class="diamond">◆</span></div>
            <p class="hero-tagline luxury-tagline">${project.tagline || 'Exclusive. Refined. Exceptional.'}</p>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-luxury">Acquire Now</a>` : ''}
            </div>
          </div>
        </section>
      `;
    case 'grid-hero':
      // Neo Grid - Bento style
      return `
        <section class="hero hero-grid">
          <div class="hero-content">
            <div class="grid-badge">⬡ NEXT GEN INFRASTRUCTURE</div>
            <h1 class="hero-title grid-title">${project.coin_name}</h1>
            <div class="hero-ticker grid-ticker">${project.ticker}</div>
            <p class="hero-tagline">${project.tagline || 'Scalable. Secure. Sovereign.'}</p>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-cyber">Explore Protocol</a>` : ''}
            </div>
          </div>
          <div class="hero-bento">
            <div class="bento-item bento-large">${logoHtml}</div>
            <div class="bento-item"><span class="bento-stat">100K</span><span class="bento-label">TPS</span></div>
            <div class="bento-item"><span class="bento-stat">0.001s</span><span class="bento-label">Finality</span></div>
          </div>
        </section>
      `;
    case 'scroll':
      // Scroll Story - Fullscreen text
      return `
        <section class="hero hero-scroll">
          <div class="hero-content">
            <h1 class="hero-title scroll-title">${project.coin_name}</h1>
            <div class="scroll-line"></div>
            <p class="hero-tagline scroll-tagline">${project.tagline || 'Every revolution begins with a story.'}</p>
          </div>
          <div class="scroll-indicator">
            <span>Scroll</span>
            <div class="scroll-arrow">↓</div>
          </div>
        </section>
      `;
    case 'media-left':
      // Web3 Gaming
      return `
        <section class="hero hero-media">
          <div class="hero-media-left">
            <div class="game-screen">${logoHtml}</div>
            <div class="game-glow"></div>
          </div>
          <div class="hero-media-right">
            <div class="game-badge">🎮 PLAY TO EARN</div>
            <h1 class="hero-title game-title">${project.coin_name}</h1>
            <div class="hero-ticker game-ticker">${project.ticker}</div>
            <p class="hero-tagline">${project.tagline || 'Level up your crypto game.'}</p>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-gaming">Start Playing</a>` : ''}
            </div>
          </div>
        </section>
      `;
    case 'glow':
      // AI Crypto
      return `
        <section class="hero hero-glow">
          <div class="ai-glow-ring"></div>
          <div class="hero-content">
            <div class="ai-icon">◉</div>
            <h1 class="hero-title glow-title">${project.coin_name}</h1>
            <div class="hero-ticker glow-ticker">${project.ticker}</div>
            <p class="hero-tagline">${project.tagline || 'Intelligence meets blockchain.'}</p>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-glow">Access Network</a>` : ''}
            </div>
          </div>
        </section>
      `;
    case 'dashboard':
      // DAO Portal
      return `
        <section class="hero hero-dashboard">
          <div class="hero-content">
            <div class="dao-badge">⬢ DECENTRALIZED GOVERNANCE</div>
            <h1 class="hero-title dao-title">${project.coin_name}</h1>
            <p class="hero-tagline">${project.tagline || 'Your vote. Your protocol. Your future.'}</p>
            <div class="dao-stats">
              <div class="dao-stat"><span class="stat-value">$2.5M</span><span class="stat-label">Treasury</span></div>
              <div class="dao-stat"><span class="stat-value">1,234</span><span class="stat-label">Members</span></div>
              <div class="dao-stat"><span class="stat-value">89</span><span class="stat-label">Proposals</span></div>
            </div>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary">Enter DAO</a>` : ''}
            </div>
          </div>
        </section>
      `;
    case 'raw':
      // Ultra Brutalist
      return `
        <section class="hero hero-raw">
          <div class="hero-content">
            <h1 class="hero-title raw-title">${project.coin_name}</h1>
            <div class="raw-divider">————————</div>
            <div class="hero-ticker raw-ticker">${project.ticker}</div>
            <p class="hero-tagline raw-tagline">${project.tagline || 'NO GIMMICKS. JUST CODE.'}</p>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-raw">[BUY]</a>` : ''}
            </div>
          </div>
        </section>
      `;
    case 'terminal':
      // Infra Terminal
      return `
        <section class="hero hero-terminal">
          <div class="terminal-window">
            <div class="terminal-header">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
              <span class="terminal-title">~ terminal</span>
            </div>
            <div class="terminal-body">
              <div class="terminal-line"><span class="prompt">$</span> <span class="typing-text">init ${project.coin_name.toLowerCase()}</span></div>
              <div class="terminal-line output">Starting ${project.ticker} protocol...</div>
              <div class="terminal-line output success">✓ Network online</div>
              <div class="terminal-line output">> ${project.tagline || 'Infrastructure for the decentralized future.'}</div>
              <div class="terminal-line"><span class="prompt">$</span> <span class="cursor">_</span></div>
            </div>
          </div>
          <div class="cta-buttons">
            ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-terminal">$ deploy --mainnet</a>` : ''}
          </div>
        </section>
      `;
    case 'avatar':
      // Social First
      return `
        <section class="hero hero-avatar">
          <div class="hero-content">
            <div class="avatar-stack">
              <div class="avatar-item">${logoHtml}</div>
              <div class="avatar-ring"></div>
            </div>
            <h1 class="hero-title social-title">${project.coin_name}</h1>
            <div class="hero-ticker social-ticker">${project.ticker}</div>
            <p class="hero-tagline">${project.tagline || 'Built by the community. For the community.'}</p>
            <div class="social-proof">
              <div class="proof-item">🐦 50K+ Followers</div>
              <div class="proof-item">💬 Active Community</div>
            </div>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-warm">Join Now</a>` : ''}
            </div>
          </div>
        </section>
      `;
    case '3d':
      // Futuristic 3D
      return `
        <section class="hero hero-3d">
          <div class="hero-3d-bg"></div>
          <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
          <div class="hero-content">
            <div class="hero-logo holo-logo">${logoHtml}</div>
            <h1 class="hero-title holo-title">${project.coin_name}</h1>
            <div class="hero-ticker holo-ticker">${project.ticker}</div>
            <p class="hero-tagline">${project.tagline || 'The future is now.'}</p>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-hologram">Enter Portal</a>` : ''}
            </div>
          </div>
        </section>
      `;
    default:
      // Cult Minimal - Stark, glitchy
      return `
        <section class="hero hero-centered">
          <div class="hero-content">
            <div class="hero-logo glitch-logo">${logoHtml}</div>
            <h1 class="hero-title glitch-text" data-text="${project.coin_name}">${project.coin_name}</h1>
            <div class="hero-ticker mono-ticker">${project.ticker}</div>
            <p class="hero-tagline">${project.tagline || 'The signal is clear.'}</p>
            <div class="cta-buttons">
              ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary btn-glitch">[ BUY NOW ]</a>` : ''}
              ${project.twitter_url ? `<a href="${project.twitter_url}" target="_blank" rel="noopener" class="btn btn-secondary">[ FOLLOW ]</a>` : ''}
            </div>
          </div>
        </section>
      `;
  }
}

function generateTemplateStyles(config: TemplateConfig, templateId: string): string {
  const baseStyles = `
    :root {
      --bg: ${config.colors.bg};
      --primary: ${config.colors.primary};
      --accent: ${config.colors.accent};
      --text: ${config.colors.text};
      --muted: ${config.colors.muted};
      --card-bg: rgba(255,255,255,0.03);
      --card-border: rgba(255,255,255,0.08);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: '${config.fonts.body}', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: '${config.fonts.heading}', sans-serif;
      font-weight: 700;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
  `;

  // Template-specific styles
  let specificStyles = '';
  
  switch (templateId) {
    case 'cult_minimal':
      specificStyles = `
        /* CULT MINIMAL - Stark, Glitchy, Monospace */
        body { background: #0b0b0b; }
        
        .header {
          border-bottom: 1px solid var(--primary);
          background: rgba(11,11,11,0.95);
        }

        .hero-centered {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 20px;
        }

        .hero-title {
          font-size: clamp(48px, 12vw, 100px);
          text-transform: uppercase;
          letter-spacing: -2px;
          margin-bottom: 16px;
        }

        .glitch-text {
          position: relative;
          animation: glitch 3s infinite;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-text::before {
          color: var(--primary);
          animation: glitch-1 0.3s infinite;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-2px, -2px);
          opacity: 0.8;
        }

        .glitch-text::after {
          color: var(--accent);
          animation: glitch-2 0.3s infinite;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          transform: translate(2px, 2px);
          opacity: 0.8;
        }

        @keyframes glitch {
          0%, 90%, 100% { transform: none; }
          92% { transform: skew(0.5deg); }
          94% { transform: skew(-0.5deg); }
        }

        @keyframes glitch-1 {
          0%, 100% { transform: translate(-2px, -2px); }
          50% { transform: translate(2px, 2px); }
        }

        @keyframes glitch-2 {
          0%, 100% { transform: translate(2px, 2px); }
          50% { transform: translate(-2px, -2px); }
        }

        .mono-ticker {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(24px, 5vw, 40px);
          color: var(--primary);
          margin-bottom: 24px;
          letter-spacing: 4px;
        }

        .btn-glitch {
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          border: 2px solid var(--primary);
          background: transparent;
          color: var(--primary);
          padding: 16px 40px;
          transition: all 0.2s;
        }

        .btn-glitch:hover {
          background: var(--primary);
          color: #000;
          box-shadow: 0 0 30px var(--primary);
        }

        .glitch-logo {
          width: 120px;
          height: 120px;
          margin-bottom: 32px;
          filter: drop-shadow(0 0 20px var(--primary));
        }

        .glitch-logo img, .glitch-logo .hero-logo-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          border: 2px solid var(--primary);
        }

        .section-card {
          background: transparent;
          border: 1px solid var(--primary);
          padding: 32px;
          margin-bottom: 16px;
        }

        .section-card:hover {
          background: var(--primary);
          color: #000;
        }
      `;
      break;

    case 'vc_pro':
      specificStyles = `
        /* VC PRO - Clean, Professional, Glass morphism */
        body { 
          background: linear-gradient(135deg, #0e1117 0%, #1a1f2e 50%, #0e1117 100%);
        }

        .header {
          background: rgba(14,17,23,0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(93,169,255,0.1);
        }

        .hero-split {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          padding: 120px 40px;
        }

        @media (max-width: 900px) {
          .hero-split {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-content-right { order: -1; }
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 16px;
          background: linear-gradient(135deg, var(--primary)20, var(--accent)20);
          border: 1px solid var(--primary)40;
          border-radius: 100px;
          font-size: 14px;
          color: var(--primary);
          margin-bottom: 24px;
        }

        .hero-title {
          font-size: clamp(40px, 6vw, 64px);
          line-height: 1.1;
          margin-bottom: 24px;
          background: linear-gradient(135deg, var(--text), var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-tagline {
          font-size: 20px;
          color: var(--muted);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .hero-stats-mini {
          display: flex;
          gap: 32px;
          margin-bottom: 40px;
        }

        .mini-stat {
          display: flex;
          flex-direction: column;
        }

        .stat-num {
          font-size: 24px;
          font-weight: 700;
          color: var(--primary);
        }

        .stat-label {
          font-size: 14px;
          color: var(--muted);
        }

        .hero-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-visual img, .hero-visual .hero-logo-placeholder {
          width: 300px;
          height: 300px;
          border-radius: 24px;
          box-shadow: 0 40px 100px rgba(93,169,255,0.3);
          animation: float 6s ease-in-out infinite;
        }

        .visual-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, var(--primary)30, transparent 70%);
          filter: blur(60px);
          z-index: -1;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: #000;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(93,169,255,0.4);
        }

        .section-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s;
        }

        .section-card:hover {
          border-color: var(--primary);
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        }
      `;
      break;

    case 'degen_meme':
      specificStyles = `
        /* DEGEN MEME - Wild, Colorful, Chaotic Fun */
        body {
          background: linear-gradient(180deg, #120018 0%, #1a0025 50%, #0d0015 100%);
        }

        .header {
          background: linear-gradient(90deg, #ff4fd880, #ffeb3b80);
          border-bottom: 3px solid var(--primary);
        }

        .hero-fullscreen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, var(--primary)20, transparent 50%);
          animation: pulse-bg 3s ease-in-out infinite;
        }

        @keyframes pulse-bg {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .hero-content { position: relative; z-index: 1; }

        .mega-bounce {
          animation: mega-bounce 1s ease infinite;
        }

        @keyframes mega-bounce {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }

        .giant-text {
          font-size: clamp(60px, 15vw, 140px);
          text-transform: uppercase;
          text-shadow: 
            4px 4px 0 var(--accent),
            8px 8px 0 var(--primary),
            12px 12px 20px rgba(0,0,0,0.5);
          letter-spacing: -4px;
          margin-bottom: 16px;
        }

        .shake-hover:hover {
          animation: shake 0.5s ease infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          25% { transform: translateX(-10px) rotate(-3deg); }
          75% { transform: translateX(10px) rotate(3deg); }
        }

        .mega-ticker {
          font-size: clamp(32px, 8vw, 72px);
          font-weight: 900;
          color: var(--accent);
          text-shadow: 0 0 40px var(--accent);
          margin-bottom: 24px;
        }

        .pulse-glow {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 20px var(--accent); }
          50% { text-shadow: 0 0 60px var(--accent), 0 0 100px var(--primary); }
        }

        .bounce-text {
          font-size: 24px;
          margin-bottom: 40px;
          animation: bounce-subtle 2s ease infinite;
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .btn-mega {
          font-size: 20px;
          padding: 20px 48px;
          border-radius: 100px;
          font-weight: 900;
          text-transform: uppercase;
          box-shadow: 0 0 40px var(--primary);
        }

        .btn-primary {
          background: linear-gradient(90deg, var(--primary), var(--accent), var(--primary));
          background-size: 200% 100%;
          animation: gradient-shift 2s linear infinite;
          color: #000;
          border: none;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .hero-logo {
          width: 150px;
          height: 150px;
          margin-bottom: 24px;
        }

        .hero-logo img, .hero-logo .hero-logo-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid var(--accent);
          box-shadow: 0 0 40px var(--primary);
        }

        .section-card {
          background: linear-gradient(135deg, var(--primary)20, var(--accent)10);
          border: 2px solid var(--primary);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 0 30px var(--primary)40;
          transition: all 0.3s;
        }

        .section-card:hover {
          transform: scale(1.05) rotate(1deg);
          box-shadow: 0 0 60px var(--primary);
        }
      `;
      break;

    case 'dark_cult':
      specificStyles = `
        /* DARK CULT - Mysterious, Moody, Ritualistic */
        body {
          background: #050505;
        }

        .header {
          background: transparent;
          border-bottom: 1px solid var(--primary)30;
        }

        .hero-left {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 120px 60px;
        }

        @media (max-width: 900px) {
          .hero-left { grid-template-columns: 1fr; padding: 120px 20px; }
          .hero-side-art { display: none; }
        }

        .cult-symbol {
          font-size: 64px;
          color: var(--primary);
          margin-bottom: 24px;
          animation: flicker 3s infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
          52% { opacity: 1; }
          54% { opacity: 0.6; }
          56% { opacity: 1; }
        }

        .reveal-text {
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 400;
          font-style: italic;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .blood-text {
          font-size: 28px;
          color: var(--primary);
          letter-spacing: 8px;
          margin-bottom: 24px;
          text-shadow: 0 0 30px var(--primary);
        }

        .hero-tagline {
          font-size: 18px;
          color: var(--muted);
          max-width: 400px;
          line-height: 1.8;
          margin-bottom: 40px;
          font-style: italic;
        }

        .btn-cult {
          background: transparent;
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 20px 48px;
          font-family: 'Crimson Text', serif;
          font-size: 18px;
          letter-spacing: 4px;
          text-transform: uppercase;
          transition: all 0.3s;
        }

        .btn-cult:hover {
          background: var(--primary);
          color: #050505;
          box-shadow: 0 0 60px var(--primary)80;
        }

        .hero-side-art {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dark-logo {
          width: 300px;
          height: 300px;
          position: relative;
        }

        .dark-logo::before {
          content: '';
          position: absolute;
          inset: -20px;
          border: 1px solid var(--primary)30;
          border-radius: 50%;
          animation: rotate-slow 20s linear infinite;
        }

        .dark-logo::after {
          content: '';
          position: absolute;
          inset: -40px;
          border: 1px solid var(--primary)15;
          border-radius: 50%;
          animation: rotate-slow 30s linear infinite reverse;
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .dark-logo img, .dark-logo .hero-logo-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          filter: grayscale(30%) contrast(1.2);
          box-shadow: 0 0 80px var(--primary)40;
        }

        .section-card {
          background: rgba(255,0,0,0.03);
          border: 1px solid var(--primary)20;
          padding: 40px;
          margin-bottom: 16px;
          transition: all 0.3s;
        }

        .section-card:hover {
          border-color: var(--primary);
          background: rgba(255,0,0,0.08);
        }

        .section-title {
          font-style: italic;
          font-weight: 400;
          letter-spacing: 2px;
        }
      `;
      break;

    case 'luxury_token':
      specificStyles = `
        /* LUXURY TOKEN - Elegant, Refined, Premium */
        body {
          background: linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%);
        }

        .header {
          background: transparent;
          border-bottom: 1px solid var(--primary)20;
        }

        .hero-minimal {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 20px;
        }

        .luxury-logo {
          width: 100px;
          height: 100px;
          margin-bottom: 48px;
        }

        .luxury-logo img, .luxury-logo .hero-logo-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid var(--primary);
          box-shadow: 0 0 60px var(--primary)30;
        }

        .elegant-text {
          font-size: clamp(40px, 8vw, 72px);
          font-weight: 400;
          letter-spacing: 16px;
          text-transform: uppercase;
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--primary), #fff, var(--primary));
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          to { background-position: 200% center; }
        }

        .luxury-ticker {
          font-size: 18px;
          color: var(--primary);
          letter-spacing: 8px;
          margin-bottom: 32px;
        }

        .luxury-divider {
          margin-bottom: 32px;
        }

        .diamond {
          color: var(--primary);
          font-size: 12px;
          animation: sparkle-diamond 2s ease infinite;
        }

        @keyframes sparkle-diamond {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .luxury-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-style: italic;
          color: var(--muted);
          max-width: 400px;
          margin: 0 auto 48px;
          line-height: 1.6;
        }

        .btn-luxury {
          background: transparent;
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 18px 56px;
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          letter-spacing: 4px;
          text-transform: uppercase;
          transition: all 0.4s;
        }

        .btn-luxury:hover {
          background: var(--primary);
          color: #0a0a0a;
          box-shadow: 0 0 40px var(--primary)60;
        }

        .section-card {
          background: transparent;
          border: 1px solid var(--primary)30;
          padding: 48px;
          text-align: center;
          transition: all 0.4s;
        }

        .section-card:hover {
          border-color: var(--primary);
          box-shadow: inset 0 0 30px var(--primary)10;
        }

        .section-title {
          font-weight: 400;
          letter-spacing: 8px;
          text-transform: uppercase;
          font-size: 14px;
          color: var(--primary);
          margin-bottom: 32px;
        }
      `;
      break;

    case 'builder_utility':
      specificStyles = `
        /* BUILDER UTILITY - Terminal, Dev-focused, Clean */
        body {
          background: #0d1117;
        }

        .header {
          background: rgba(13,17,23,0.95);
          border-bottom: 1px solid var(--primary)30;
        }

        .hero-split {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          padding: 120px 40px;
        }

        @media (max-width: 900px) {
          .hero-split {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-content-right { order: -1; }
        }

        .hero-badge {
          display: inline-block;
          padding: 6px 12px;
          background: var(--primary)20;
          border: 1px solid var(--primary)40;
          border-radius: 4px;
          font-family: 'Fira Code', monospace;
          font-size: 12px;
          color: var(--primary);
          margin-bottom: 24px;
        }

        .hero-badge::before {
          content: '> ';
          opacity: 0.5;
        }

        .hero-title {
          font-size: clamp(36px, 5vw, 56px);
          margin-bottom: 24px;
          color: var(--text);
        }

        .hero-tagline {
          font-family: 'Fira Code', monospace;
          font-size: 16px;
          color: var(--muted);
          margin-bottom: 32px;
          line-height: 1.8;
        }

        .hero-stats-mini {
          display: flex;
          gap: 24px;
          margin-bottom: 40px;
          font-family: 'Fira Code', monospace;
        }

        .mini-stat {
          padding: 12px 16px;
          background: var(--primary)10;
          border: 1px solid var(--primary)30;
          border-radius: 8px;
        }

        .stat-num {
          display: block;
          font-size: 20px;
          color: var(--primary);
        }

        .stat-label {
          font-size: 12px;
          color: var(--muted);
        }

        .hero-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-visual img, .hero-visual .hero-logo-placeholder {
          width: 250px;
          height: 250px;
          border-radius: 16px;
          border: 2px solid var(--primary)40;
          box-shadow: 0 0 60px var(--primary)30;
        }

        .visual-glow {
          position: absolute;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, var(--primary)20, transparent 70%);
          z-index: -1;
        }

        .btn-primary {
          font-family: 'Fira Code', monospace;
          background: var(--primary);
          color: #0d1117;
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          box-shadow: 0 0 30px var(--primary)60;
          transform: translateY(-2px);
        }

        .btn-secondary {
          font-family: 'Fira Code', monospace;
          background: transparent;
          color: var(--primary);
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 14px;
          border: 1px solid var(--primary)40;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: var(--primary)10;
          border-color: var(--primary);
        }

        .section-card {
          font-family: 'Fira Code', monospace;
          background: #161b22;
          border: 1px solid var(--primary)20;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.2s;
        }

        .section-card:hover {
          border-color: var(--primary);
          box-shadow: 0 0 20px var(--primary)20;
        }

        .section-card::before {
          content: '// ';
          color: var(--primary)60;
        }

        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 24px;
        }

        .section-title::before {
          content: '# ';
          opacity: 0.5;
        }
      `;
      break;

    case 'neo_grid':
      specificStyles = `
        /* NEO GRID - Cyber, Bento Layout */
        body { background: linear-gradient(180deg, #0b0f1a 0%, #0a0e18 100%); }
        .header { background: rgba(11,15,26,0.9); backdrop-filter: blur(10px); border-bottom: 1px solid var(--primary)20; }
        .hero-grid { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; padding: 120px 40px; }
        @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } .hero-bento { order: -1; } }
        .grid-badge { display: inline-block; padding: 8px 16px; background: var(--primary)15; border: 1px solid var(--primary)30; border-radius: 100px; font-size: 12px; color: var(--primary); letter-spacing: 2px; margin-bottom: 24px; }
        .grid-title { font-size: clamp(40px, 6vw, 64px); margin-bottom: 16px; background: linear-gradient(135deg, var(--text), var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .grid-ticker { font-size: 20px; color: var(--primary); letter-spacing: 4px; margin-bottom: 24px; }
        .hero-bento { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .bento-item { background: rgba(124,140,255,0.08); border: 1px solid var(--primary)20; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.3s; }
        .bento-item:hover { border-color: var(--primary); transform: translateY(-4px); }
        .bento-large { grid-column: span 2; padding: 40px; }
        .bento-large img, .bento-large .hero-logo-placeholder { width: 120px; height: 120px; border-radius: 24px; }
        .bento-stat { font-size: 32px; font-weight: 700; color: var(--primary); }
        .bento-label { font-size: 14px; color: var(--muted); margin-top: 8px; }
        .btn-cyber { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #000; padding: 16px 32px; border-radius: 12px; font-weight: 600; }
        .btn-cyber:hover { box-shadow: 0 0 40px var(--primary)60; transform: translateY(-4px); }
        .section-card { background: rgba(124,140,255,0.05); border: 1px solid var(--primary)15; border-radius: 16px; padding: 24px; }
      `;
      break;

    case 'scroll_story':
      specificStyles = `
        /* SCROLL STORY - Minimal, Narrative */
        body { background: #000; }
        .header { background: transparent; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .hero-scroll { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 20px; position: relative; }
        .scroll-title { font-size: clamp(48px, 12vw, 120px); font-weight: 400; font-style: italic; margin-bottom: 32px; line-height: 1; }
        .scroll-line { width: 1px; height: 80px; background: linear-gradient(180deg, var(--primary), transparent); margin-bottom: 32px; }
        .scroll-tagline { font-size: 20px; color: var(--muted); max-width: 500px; line-height: 1.8; font-style: italic; }
        .scroll-indicator { position: absolute; bottom: 40px; display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--muted); animation: bounce-scroll 2s infinite; }
        .scroll-arrow { font-size: 24px; }
        @keyframes bounce-scroll { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .btn-minimal { background: transparent; border: 1px solid var(--text); color: var(--text); padding: 16px 48px; font-size: 14px; letter-spacing: 4px; text-transform: uppercase; }
        .section-card { background: transparent; border-top: 1px solid rgba(255,255,255,0.1); padding: 40px 0; }
      `;
      break;

    case 'web3_gaming':
      specificStyles = `
        /* WEB3 GAMING - Neon, Arcade */
        body { background: linear-gradient(180deg, #0c1022 0%, #080c18 100%); }
        .header { background: rgba(12,16,34,0.9); backdrop-filter: blur(10px); border-bottom: 2px solid var(--primary)40; }
        .hero-media { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; padding: 120px 40px; }
        @media (max-width: 900px) { .hero-media { grid-template-columns: 1fr; } .hero-media-left { order: -1; } }
        .hero-media-left { position: relative; }
        .game-screen { width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, var(--primary)20, var(--accent)20); border: 2px solid var(--primary); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 60px var(--primary)40, inset 0 0 60px var(--primary)10; }
        .game-screen img, .game-screen .hero-logo-placeholder { width: 100px; height: 100px; border-radius: 16px; }
        .game-glow { position: absolute; inset: -20px; background: radial-gradient(ellipse, var(--primary)20, transparent 70%); z-index: -1; filter: blur(40px); }
        .game-badge { display: inline-block; padding: 8px 16px; background: var(--primary)20; border: 1px solid var(--primary); border-radius: 4px; font-size: 14px; color: var(--primary); margin-bottom: 24px; }
        .game-title { font-size: clamp(36px, 5vw, 56px); margin-bottom: 16px; text-shadow: 0 0 40px var(--primary)60; }
        .game-ticker { font-size: 24px; color: var(--accent); margin-bottom: 24px; text-shadow: 0 0 20px var(--accent); }
        .btn-gaming { background: linear-gradient(90deg, var(--primary), var(--accent)); color: #000; padding: 16px 40px; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 0 30px var(--primary)60; }
        .btn-gaming:hover { transform: scale(1.05); box-shadow: 0 0 50px var(--primary); }
        .section-card { background: rgba(0,240,255,0.05); border: 1px solid var(--primary)30; border-radius: 8px; padding: 24px; }
      `;
      break;

    case 'ai_crypto':
      specificStyles = `
        /* AI CRYPTO - Glowing, Futuristic */
        body { background: radial-gradient(ellipse at 50% 0%, #0a1515 0%, #05070a 100%); }
        .header { background: rgba(5,7,10,0.8); backdrop-filter: blur(20px); }
        .hero-glow { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 120px 20px; position: relative; }
        .ai-glow-ring { position: absolute; width: 400px; height: 400px; border: 1px solid var(--primary)30; border-radius: 50%; animation: pulse-ring 4s ease-in-out infinite; }
        .ai-glow-ring::before { content: ''; position: absolute; inset: 30px; border: 1px solid var(--primary)20; border-radius: 50%; animation: pulse-ring 4s ease-in-out infinite reverse; }
        @keyframes pulse-ring { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } }
        .ai-icon { font-size: 48px; color: var(--primary); margin-bottom: 32px; text-shadow: 0 0 40px var(--primary); animation: glow-pulse 2s infinite; }
        @keyframes glow-pulse { 0%, 100% { text-shadow: 0 0 20px var(--primary); } 50% { text-shadow: 0 0 60px var(--primary), 0 0 100px var(--accent); } }
        .glow-title { font-size: clamp(40px, 8vw, 72px); margin-bottom: 16px; color: var(--text); text-shadow: 0 0 40px var(--primary)40; }
        .glow-ticker { font-size: 24px; color: var(--primary); letter-spacing: 8px; margin-bottom: 24px; }
        .btn-glow { background: transparent; border: 1px solid var(--primary); color: var(--primary); padding: 16px 40px; border-radius: 100px; box-shadow: 0 0 20px var(--primary)40, inset 0 0 20px var(--primary)10; }
        .btn-glow:hover { background: var(--primary); color: #05070a; box-shadow: 0 0 60px var(--primary); }
        .section-card { background: rgba(0,255,204,0.03); border: 1px solid var(--primary)20; border-radius: 16px; padding: 32px; }
      `;
      break;

    case 'dao_portal':
      specificStyles = `
        /* DAO PORTAL - Dashboard, Governance */
        body { background: #101014; }
        .header { background: rgba(16,16,20,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--primary)20; }
        .hero-dashboard { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 120px 20px; }
        .dao-badge { display: inline-block; padding: 8px 20px; background: var(--primary)15; border: 1px solid var(--primary)30; border-radius: 100px; font-size: 12px; color: var(--primary); letter-spacing: 2px; margin-bottom: 24px; }
        .dao-title { font-size: clamp(40px, 6vw, 64px); margin-bottom: 24px; }
        .dao-stats { display: flex; gap: 32px; justify-content: center; margin: 40px 0; flex-wrap: wrap; }
        .dao-stat { background: rgba(176,140,255,0.08); border: 1px solid var(--primary)20; border-radius: 16px; padding: 24px 32px; }
        .dao-stat .stat-value { display: block; font-size: 32px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
        .dao-stat .stat-label { font-size: 14px; color: var(--muted); }
        .section-card { background: rgba(176,140,255,0.05); border: 1px solid var(--primary)15; border-radius: 16px; padding: 24px; }
      `;
      break;

    case 'ultra_brutalist':
      specificStyles = `
        /* ULTRA BRUTALIST - Raw, Anti-design */
        body { background: #fff; color: #000; }
        .header { background: #fff; border-bottom: 3px solid #000; }
        .header .logo-text { color: #000; }
        .header .social-link { background: transparent; border: 2px solid #000; color: #000; border-radius: 0; }
        .header .social-link:hover { background: #000; color: #fff; }
        .hero-raw { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 120px 20px; }
        .raw-title { font-size: clamp(48px, 15vw, 150px); font-weight: 900; text-transform: uppercase; letter-spacing: -4px; line-height: 0.9; margin-bottom: 24px; }
        .raw-divider { font-size: 24px; color: var(--accent); margin-bottom: 24px; }
        .raw-ticker { font-size: 24px; font-weight: 900; letter-spacing: 8px; margin-bottom: 24px; }
        .raw-tagline { font-size: 18px; text-transform: uppercase; letter-spacing: 4px; }
        .btn-raw { background: #000; color: #fff; padding: 20px 48px; border-radius: 0; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; border: 3px solid #000; }
        .btn-raw:hover { background: var(--accent); border-color: var(--accent); }
        .section-card { background: transparent; border: 3px solid #000; padding: 32px; }
        .section-title { color: #000; }
        .description-text { color: #000; }
        .footer { background: #000; color: #fff; border-top: none; }
        .footer a { color: var(--accent); }
        .footer-disclaimer { color: rgba(255,255,255,0.5); }
      `;
      break;

    case 'infra_terminal':
      specificStyles = `
        /* INFRA TERMINAL - CLI, Developer */
        body { background: #020409; }
        .header { background: rgba(2,4,9,0.95); border-bottom: 1px solid var(--primary)30; }
        .hero-terminal { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 20px; gap: 40px; }
        .terminal-window { width: 100%; max-width: 700px; background: #0a0f14; border: 1px solid var(--primary)40; border-radius: 12px; overflow: hidden; box-shadow: 0 0 60px var(--primary)20; }
        .terminal-header { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: rgba(0,255,136,0.05); border-bottom: 1px solid var(--primary)20; }
        .terminal-dot { width: 12px; height: 12px; border-radius: 50%; }
        .terminal-dot.red { background: #ff5f56; }
        .terminal-dot.yellow { background: #ffbd2e; }
        .terminal-dot.green { background: #27ca40; }
        .terminal-title { margin-left: auto; font-size: 12px; color: var(--muted); }
        .terminal-body { padding: 24px; font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 2; }
        .terminal-line { margin-bottom: 8px; }
        .prompt { color: var(--primary); }
        .typing-text { color: var(--text); }
        .output { color: var(--muted); padding-left: 16px; }
        .output.success { color: var(--primary); }
        .cursor { animation: blink 1s infinite; color: var(--primary); }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .btn-terminal { font-family: 'JetBrains Mono', monospace; background: var(--primary); color: #020409; padding: 16px 32px; border-radius: 4px; font-size: 14px; }
        .btn-terminal:hover { box-shadow: 0 0 40px var(--primary)60; }
        .section-card { font-family: 'JetBrains Mono', monospace; background: #0a0f14; border: 1px solid var(--primary)20; border-radius: 8px; padding: 24px; }
      `;
      break;

    case 'social_first':
      specificStyles = `
        /* SOCIAL FIRST - Community, Warm */
        body { background: #0f0f12; }
        .header { background: rgba(15,15,18,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--primary)20; }
        .hero-avatar { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 120px 20px; }
        .avatar-stack { position: relative; width: 150px; height: 150px; margin: 0 auto 32px; }
        .avatar-item img, .avatar-item .hero-logo-placeholder { width: 100%; height: 100%; border-radius: 50%; border: 4px solid var(--primary); }
        .avatar-ring { position: absolute; inset: -10px; border: 2px solid var(--primary)30; border-radius: 50%; animation: rotate-slow 10s linear infinite; }
        @keyframes rotate-slow { to { transform: rotate(360deg); } }
        .social-title { font-size: clamp(40px, 6vw, 64px); margin-bottom: 16px; }
        .social-ticker { font-size: 24px; color: var(--primary); margin-bottom: 24px; }
        .social-proof { display: flex; gap: 24px; justify-content: center; margin: 32px 0; flex-wrap: wrap; }
        .proof-item { background: var(--primary)15; border: 1px solid var(--primary)30; border-radius: 100px; padding: 12px 24px; font-size: 14px; }
        .btn-warm { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #000; padding: 16px 40px; border-radius: 100px; font-weight: 600; }
        .btn-warm:hover { transform: translateY(-4px); box-shadow: 0 20px 40px var(--primary)40; }
        .section-card { background: rgba(255,204,0,0.05); border: 1px solid var(--primary)20; border-radius: 20px; padding: 24px; }
      `;
      break;

    case 'futuristic_3d':
      specificStyles = `
        /* FUTURISTIC 3D - Holographic, Immersive */
        body { background: #030014; }
        .header { background: rgba(3,0,20,0.8); backdrop-filter: blur(20px); }
        .hero-3d { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 120px 20px; position: relative; overflow: hidden; }
        .floating-shapes { position: absolute; inset: 0; pointer-events: none; }
        .shape { position: absolute; border: 1px solid var(--primary)30; animation: float-shape 20s ease-in-out infinite; }
        .shape-1 { width: 300px; height: 300px; border-radius: 50%; top: 10%; left: 10%; animation-delay: 0s; }
        .shape-2 { width: 200px; height: 200px; top: 60%; right: 15%; animation-delay: -7s; }
        .shape-3 { width: 150px; height: 150px; border-radius: 50%; bottom: 20%; left: 20%; animation-delay: -14s; }
        @keyframes float-shape { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(30px, -30px) rotate(120deg); } 66% { transform: translate(-20px, 20px) rotate(240deg); } }
        .holo-logo { width: 120px; height: 120px; margin: 0 auto 32px; position: relative; }
        .holo-logo img, .holo-logo .hero-logo-placeholder { width: 100%; height: 100%; border-radius: 24px; box-shadow: 0 0 60px var(--primary)40; animation: holo-glow 3s ease-in-out infinite; }
        @keyframes holo-glow { 0%, 100% { box-shadow: 0 0 40px var(--primary)40; } 50% { box-shadow: 0 0 80px var(--primary)60, 0 0 120px var(--accent)30; } }
        .holo-title { font-size: clamp(40px, 8vw, 80px); margin-bottom: 16px; background: linear-gradient(135deg, var(--text), var(--primary), var(--accent), var(--text)); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradient-shift 5s ease infinite; }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .holo-ticker { font-size: 24px; color: var(--primary); letter-spacing: 8px; margin-bottom: 24px; text-shadow: 0 0 30px var(--primary); }
        .btn-hologram { background: linear-gradient(135deg, var(--primary)80, var(--accent)80); color: #fff; padding: 18px 48px; border-radius: 12px; font-weight: 600; border: 1px solid var(--primary)40; box-shadow: 0 0 30px var(--primary)40, inset 0 0 20px var(--primary)10; backdrop-filter: blur(10px); }
        .btn-hologram:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 0 60px var(--primary)60; }
        .section-card { background: rgba(123,92,255,0.05); border: 1px solid var(--primary)20; border-radius: 20px; padding: 32px; backdrop-filter: blur(10px); }
      `;
      break;

    default:
      specificStyles = `
        .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 120px 20px; }
        .hero-title { font-size: clamp(48px, 10vw, 80px); margin-bottom: 16px; }
        .hero-ticker { font-size: 24px; color: var(--primary); margin-bottom: 24px; }
        .hero-tagline { font-size: 18px; color: var(--muted); margin-bottom: 40px; }
      `;
  }

  // Common styles for all templates
  const commonStyles = `
    /* Header */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 16px 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-logo img, .header-logo .logo-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
    }

    .logo-placeholder {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .logo-text {
      font-weight: 700;
      font-size: 18px;
    }

    .social-links {
      display: flex;
      gap: 12px;
    }

    .social-link {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text);
      text-decoration: none;
      transition: all 0.3s;
    }

    .social-link:hover {
      background: var(--primary);
      border-color: var(--primary);
      color: #000;
    }

    .social-link svg { width: 18px; height: 18px; }

    /* Buttons */
    .cta-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      display: inline-block;
      padding: 16px 32px;
      border-radius: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
      cursor: pointer;
    }

    .btn-secondary {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--text);
    }

    /* Hero logo placeholder */
    .hero-logo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }

    .hero-logo-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      font-size: 48px;
      font-weight: 800;
      border-radius: inherit;
    }

    /* Sections */
    .section-title {
      font-size: clamp(28px, 4vw, 40px);
      text-align: center;
      margin-bottom: 48px;
    }

    /* Description */
    .description-section {
      padding: 80px 0;
      text-align: center;
    }

    .description-text {
      font-size: 18px;
      color: var(--muted);
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.8;
    }

    /* Stats */
    .stats-section { padding: 60px 0; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
    }

    /* Roadmap */
    .roadmap-section { padding: 80px 0; }
    .roadmap-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .roadmap-phase {
      color: var(--primary);
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .roadmap-title {
      font-size: 22px;
      margin-bottom: 16px;
    }

    .roadmap-list {
      list-style: none;
      color: var(--muted);
    }

    .roadmap-list li {
      padding: 8px 0;
      padding-left: 20px;
      position: relative;
    }

    .roadmap-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--primary);
    }

    /* FAQ */
    .faq-section { padding: 80px 0; }
    .faq-grid {
      display: grid;
      gap: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-question {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 12px;
    }

    .faq-answer {
      color: var(--muted);
      line-height: 1.6;
    }

    /* Footer */
    .footer {
      padding: 40px 0;
      text-align: center;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .footer-built {
      color: var(--muted);
      font-size: 14px;
      margin-bottom: 8px;
    }

    .footer-built a {
      color: var(--primary);
      text-decoration: none;
    }

    .footer-disclaimer {
      color: rgba(255,255,255,0.3);
      font-size: 12px;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Animations */
    .fade-in-section {
      opacity: 0;
      transform: translateY(40px);
      transition: all 0.8s ease;
    }

    .fade-in-section.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Mobile */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 16px;
      }
      .cta-buttons {
        flex-direction: column;
        width: 100%;
        padding: 0 20px;
      }
      .btn { width: 100%; text-align: center; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .hero-stats-mini { flex-wrap: wrap; justify-content: center; }
    }
  `;

  return `<style>${baseStyles}${specificStyles}${commonStyles}</style>`;
}

function generateWebsiteHTML(project: Project, template: Template | null, templateId: string = 'cult_minimal'): string {
  const config = getTemplateConfig(templateId);
  
  const logoHtml = project.logo_url 
    ? `<img src="${project.logo_url}" alt="${project.coin_name}" />`
    : `<div class="logo-placeholder">${project.ticker?.[1] || '?'}</div>`;

  const socialLinks = `
    ${project.twitter_url ? `<a href="${project.twitter_url}" target="_blank" rel="noopener" class="social-link" aria-label="Twitter">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
    </a>` : ''}
    ${project.discord_url ? `<a href="${project.discord_url}" target="_blank" rel="noopener" class="social-link" aria-label="Discord">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.5c3.5-1 5.5-1 9 0"/><path d="M7 16.5c3.5 1 6.5 1 10 0"/></svg>
    </a>` : ''}
    ${project.telegram_url ? `<a href="${project.telegram_url}" target="_blank" rel="noopener" class="social-link" aria-label="Telegram">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
    </a>` : ''}
  `;

  const roadmapSection = project.show_roadmap ? `
    <section class="roadmap-section fade-in-section">
      <div class="container">
        <h2 class="section-title">Roadmap</h2>
        <div class="roadmap-grid">
          <div class="section-card">
            <div class="roadmap-phase">Phase 1</div>
            <div class="roadmap-title">Launch</div>
            <ul class="roadmap-list">
              <li>Token launch on Solana</li>
              <li>Website & socials live</li>
              <li>Community building</li>
            </ul>
          </div>
          <div class="section-card">
            <div class="roadmap-phase">Phase 2</div>
            <div class="roadmap-title">Growth</div>
            <ul class="roadmap-list">
              <li>CEX listings</li>
              <li>Marketing campaigns</li>
              <li>Partnerships</li>
            </ul>
          </div>
          <div class="section-card">
            <div class="roadmap-phase">Phase 3</div>
            <div class="roadmap-title">Moon</div>
            <ul class="roadmap-list">
              <li>Major exchange listings</li>
              <li>Ecosystem expansion</li>
              <li>To the moon 🚀</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  ` : '';

  const faqSection = project.show_faq ? `
    <section class="faq-section fade-in-section">
      <div class="container">
        <h2 class="section-title">FAQ</h2>
        <div class="faq-grid">
          <div class="section-card">
            <div class="faq-question">What is ${project.coin_name}?</div>
            <div class="faq-answer">${project.description || `${project.coin_name} is a community-driven token on Solana.`}</div>
          </div>
          <div class="section-card">
            <div class="faq-question">How do I buy ${project.ticker}?</div>
            <div class="faq-answer">Connect your Solana wallet to a DEX like Raydium or Jupiter and swap SOL for ${project.ticker}.</div>
          </div>
          <div class="section-card">
            <div class="faq-question">Is ${project.coin_name} safe?</div>
            <div class="faq-answer">Always DYOR. ${project.coin_name} is a meme coin and should be treated as high-risk.</div>
          </div>
        </div>
      </div>
    </section>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.coin_name} ($${project.ticker}) - Official Website</title>
  <meta name="description" content="${project.tagline || project.description || `${project.coin_name} - The next big thing on Solana`}">
  <meta property="og:title" content="${project.coin_name} ($${project.ticker})">
  <meta property="og:description" content="${project.tagline || project.description || `${project.coin_name} - The next big thing on Solana`}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${generateFontsLink(config)}" rel="stylesheet">
  ${generateTemplateStyles(config, templateId)}
</head>
<body>
  ${generateBackgroundEffect(templateId, config)}
  
  <header class="header">
    <div class="container header-content">
      <div class="logo-container">
        <div class="header-logo">${logoHtml}</div>
        <span class="logo-text">${project.coin_name}</span>
      </div>
      <div class="social-links">${socialLinks}</div>
    </div>
  </header>

  <main>
    ${generateHeroSection(project, config, templateId)}

    ${project.description ? `
    <section class="description-section fade-in-section">
      <div class="container">
        <p class="description-text">${project.description}</p>
      </div>
    </section>
    ` : ''}

    <div class="container">
      ${roadmapSection}
      ${faqSection}
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p class="footer-built">Built with <a href="https://solsite.xyz" target="_blank">Solsite</a></p>
      <p class="footer-disclaimer">Solsite provides website infrastructure only. We do not endorse any token. DYOR.</p>
    </div>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-section').forEach(s => observer.observe(s));
  </script>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const subdomain = url.searchParams.get('subdomain');
    const projectId = url.searchParams.get('projectId');
    const isPreview = url.searchParams.get('preview') === 'true';
    const templateId = url.searchParams.get('templateId') || 'cult_minimal';

    // Handle preview mode with demo data
    if (isPreview) {
      console.log(`Generating preview for templateId=${templateId}`);
      
      const demoProject: Project = {
        id: 'preview',
        coin_name: 'MoonDoge',
        ticker: 'MDOGE',
        tagline: 'To the moon and beyond! 🚀',
        description: 'MoonDoge is the next generation meme coin on Solana. Join our community of degens and ride the wave to the moon.',
        logo_url: null,
        twitter_url: 'https://twitter.com',
        discord_url: 'https://discord.gg',
        telegram_url: 'https://t.me',
        dex_link: 'https://raydium.io',
        show_roadmap: true,
        show_faq: true,
        config: {},
        template_id: null,
      };

      const html = generateWebsiteHTML(demoProject, null, templateId);
      return new Response(html, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    }

    if (!subdomain && !projectId) {
      return new Response(
        JSON.stringify({ error: 'Missing subdomain or projectId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // For subdomain requests, try to serve from pre-rendered storage first (fastest path)
    if (subdomain) {
      try {
        const { data: cachedHtml } = await supabase
          .storage
          .from('pre-rendered-sites')
          .download(`${subdomain}.html`);
        
        if (cachedHtml) {
          console.log(`Serving pre-rendered site for ${subdomain}`);
          const html = await cachedHtml.text();
          return new Response(html, {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=3600, s-maxage=3600',
              'CDN-Cache-Control': 'max-age=3600',
              'X-Served-From': 'pre-rendered-cache',
            },
          });
        }
      } catch (cacheError) {
        // Cache miss - will generate dynamically
        console.log(`No pre-rendered cache for ${subdomain}, generating dynamically`);
      }
    }

    let query = supabase.from('projects').select('*');
    if (projectId) query = query.eq('id', projectId);
    else if (subdomain) query = query.eq('subdomain', subdomain);

    const { data: project, error: projectError } = await query.maybeSingle();

    if (projectError || !project) {
      return new Response(generateNotFoundHTML(), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Get template info to determine which template to use
    let selectedTemplateId = 'cult_minimal';
    
    // First check if templateId is stored in config (new method)
    if (project.config?.templateId) {
      selectedTemplateId = project.config.templateId;
    }
    // Fall back to template_id lookup (old method)
    else if (project.template_id) {
      const { data: templateData } = await supabase
        .from('template_blueprints')
        .select('name')
        .eq('id', project.template_id)
        .maybeSingle();
      
      if (templateData) {
        // Map template name to template ID
        const nameToId: Record<string, string> = {
          'Cult Minimal': 'cult_minimal',
          'VC Grade Pro': 'vc_pro',
          'Degenerate Meme': 'degen_meme',
          'Dark Cult Narrative': 'dark_cult',
          'Luxury Token': 'luxury_token',
          'Builder Utility': 'builder_utility',
          'Neo Grid': 'neo_grid',
          'Scroll Story': 'scroll_story',
          'Web3 Gaming': 'web3_gaming',
          'AI Crypto': 'ai_crypto',
          'DAO Portal': 'dao_portal',
          'Ultra Brutalist': 'ultra_brutalist',
          'Infra Terminal': 'infra_terminal',
          'Social First': 'social_first',
          'Futuristic 3D': 'futuristic_3d',
        };
        selectedTemplateId = nameToId[templateData.name] || 'cult_minimal';
      }
    }

    const html = generateWebsiteHTML(project, null, selectedTemplateId);
    
    // For published sites, enable CDN caching (1 hour)
    // For drafts or direct projectId requests, disable caching
    const isPublishedSite = project.status === 'published' && subdomain;
    
    const responseHeaders: Record<string, string> = {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8',
    };
    
    if (isPublishedSite) {
      responseHeaders['Cache-Control'] = 'public, max-age=3600, s-maxage=3600';
      responseHeaders['CDN-Cache-Control'] = 'max-age=3600';
      responseHeaders['Surrogate-Control'] = 'max-age=3600';
    } else {
      responseHeaders['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    }

    return new Response(html, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error rendering site:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateNotFoundHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Not Found - Solsite</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      background: linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    h1 { font-size: 100px; color: #00d4ff; margin-bottom: 16px; }
    h2 { font-size: 28px; margin-bottom: 12px; }
    p { color: rgba(255,255,255,0.6); margin-bottom: 32px; }
    a {
      display: inline-block;
      padding: 16px 32px;
      background: linear-gradient(135deg, #00d4ff, #22c55e);
      color: #000;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div>
    <h1>404</h1>
    <h2>Site Not Found</h2>
    <p>This meme coin website doesn't exist yet.</p>
    <a href="https://solsite.xyz">Create Your Site</a>
  </div>
</body>
</html>`;
}
