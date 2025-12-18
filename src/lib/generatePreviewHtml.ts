// Client-side HTML generator that matches the edge function output

interface ProjectData {
  coinName: string;
  ticker: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  twitter: string;
  discord: string;
  telegram: string;
  dexLink: string;
  showRoadmap: boolean;
  showFaq: boolean;
}

interface TemplateConfig {
  layout: string;
  personality: string;
}

function getPersonalityStyles(personality: string): { primary: string; accent: string; bgGradient: string } {
  switch (personality) {
    case 'degen':
      return { primary: '#ff4444', accent: '#ff8800', bgGradient: 'linear-gradient(135deg, #1a0505 0%, #2d1810 100%)' };
    case 'professional':
      return { primary: '#00d4ff', accent: '#0088ff', bgGradient: 'linear-gradient(135deg, #0a1628 0%, #0d2137 100%)' };
    case 'dark-cult':
      return { primary: '#a855f7', accent: '#ec4899', bgGradient: 'linear-gradient(135deg, #150520 0%, #1f0a30 100%)' };
    case 'playful':
      return { primary: '#fbbf24', accent: '#22c55e', bgGradient: 'linear-gradient(135deg, #1a1a0a 0%, #0a1a10 100%)' };
    case 'premium':
      return { primary: '#d4af37', accent: '#c0c0c0', bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' };
    default:
      return { primary: '#00d4ff', accent: '#22c55e', bgGradient: 'linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%)' };
  }
}

export function generatePreviewHtml(project: ProjectData, config: TemplateConfig): string {
  const { layout, personality } = config;
  const styles = getPersonalityStyles(personality);
  
  const logoHtml = project.logoUrl 
    ? `<img src="${project.logoUrl}" alt="${project.coinName}" class="logo-image" />`
    : `<div class="logo-placeholder">${project.ticker?.[1] || '?'}</div>`;

  const socialLinks = `
    ${project.twitter ? `<a href="${project.twitter}" target="_blank" rel="noopener" class="social-link" aria-label="Twitter">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
    </a>` : ''}
    ${project.discord ? `<a href="${project.discord}" target="_blank" rel="noopener" class="social-link" aria-label="Discord">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.5c3.5-1 5.5-1 9 0"/><path d="M7 16.5c3.5 1 6.5 1 10 0"/><path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5"/><path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.476-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5"/></svg>
    </a>` : ''}
    ${project.telegram ? `<a href="${project.telegram}" target="_blank" rel="noopener" class="social-link" aria-label="Telegram">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
    </a>` : ''}
  `;

  // Layout-specific sections
  const statsSection = (layout === 'stats-heavy' || layout === 'hero-roadmap') ? `
    <section class="stats-section fade-in-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">1M+</div>
            <div class="stat-label">Total Supply</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">5,000+</div>
            <div class="stat-label">Holders</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">$100K+</div>
            <div class="stat-label">Market Cap</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">0%</div>
            <div class="stat-label">Buy/Sell Tax</div>
          </div>
        </div>
      </div>
    </section>
  ` : '';

  const communitySection = (layout === 'community' || layout === 'hero-roadmap') ? `
    <section class="community-section fade-in-section">
      <div class="container">
        <h2 class="section-title">Join the Community</h2>
        <p class="community-subtitle">Connect with fellow ${project.coinName || 'token'} enthusiasts</p>
        <div class="community-grid">
          ${project.twitter ? `
          <a href="${project.twitter}" target="_blank" rel="noopener" class="community-card twitter">
            <div class="community-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </div>
            <div class="community-name">Twitter</div>
            <div class="community-action">Follow Us</div>
          </a>
          ` : ''}
          ${project.discord ? `
          <a href="${project.discord}" target="_blank" rel="noopener" class="community-card discord">
            <div class="community-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.5c3.5-1 5.5-1 9 0"/><path d="M7 16.5c3.5 1 6.5 1 10 0"/></svg>
            </div>
            <div class="community-name">Discord</div>
            <div class="community-action">Join Server</div>
          </a>
          ` : ''}
          ${project.telegram ? `
          <a href="${project.telegram}" target="_blank" rel="noopener" class="community-card telegram">
            <div class="community-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
            <div class="community-name">Telegram</div>
            <div class="community-action">Join Group</div>
          </a>
          ` : ''}
        </div>
      </div>
    </section>
  ` : '';

  const storySection = (layout === 'story-lore') ? `
    <section class="story-section fade-in-section">
      <div class="container">
        <h2 class="section-title">The Legend of ${project.coinName || 'Your Coin'}</h2>
        <div class="story-content">
          <div class="story-chapter">
            <div class="chapter-number">Chapter I</div>
            <h3 class="chapter-title">The Beginning</h3>
            <p class="chapter-text">${project.description || `In the vast digital cosmos of Solana, a new force emerged. ${project.coinName || 'This coin'} was born from the collective dreams of degens and visionaries alike.`}</p>
          </div>
          <div class="story-chapter">
            <div class="chapter-number">Chapter II</div>
            <h3 class="chapter-title">The Journey</h3>
            <p class="chapter-text">As word spread across the blockchain, believers gathered. Each holder became part of something greater—a movement that transcended mere transactions.</p>
          </div>
          <div class="story-chapter">
            <div class="chapter-number">Chapter III</div>
            <h3 class="chapter-title">The Future</h3>
            <p class="chapter-text">The path ahead glows with promise. With diamond hands and unwavering conviction, the community marches toward the moon.</p>
          </div>
        </div>
      </div>
    </section>
  ` : '';

  const utilitySection = (layout === 'utility') ? `
    <section class="utility-section fade-in-section">
      <div class="container">
        <h2 class="section-title">Token Utility</h2>
        <div class="utility-grid">
          <div class="utility-card">
            <div class="utility-icon">🔒</div>
            <h3 class="utility-title">Staking Rewards</h3>
            <p class="utility-desc">Stake your ${project.ticker || '$TOKEN'} to earn passive rewards and participate in governance decisions.</p>
          </div>
          <div class="utility-card">
            <div class="utility-icon">🎮</div>
            <h3 class="utility-title">Exclusive Access</h3>
            <p class="utility-desc">Holders get early access to new features, NFT drops, and community events.</p>
          </div>
          <div class="utility-card">
            <div class="utility-icon">💎</div>
            <h3 class="utility-title">Holder Benefits</h3>
            <p class="utility-desc">Diamond hand rewards, airdrops, and special perks for long-term believers.</p>
          </div>
          <div class="utility-card">
            <div class="utility-icon">🌐</div>
            <h3 class="utility-title">Ecosystem Integration</h3>
            <p class="utility-desc">Use ${project.ticker || '$TOKEN'} across partner platforms and upcoming DeFi integrations.</p>
          </div>
        </div>
      </div>
    </section>
  ` : '';

  const roadmapSection = project.showRoadmap ? `
    <section class="roadmap-section fade-in-section">
      <h2 class="section-title">Roadmap</h2>
      <div class="roadmap-grid">
        <div class="roadmap-card">
          <div class="roadmap-phase">Phase 1</div>
          <div class="roadmap-title">Launch</div>
          <ul class="roadmap-list">
            <li>Token launch on Solana</li>
            <li>Website & socials live</li>
            <li>Community building</li>
          </ul>
        </div>
        <div class="roadmap-card">
          <div class="roadmap-phase">Phase 2</div>
          <div class="roadmap-title">Growth</div>
          <ul class="roadmap-list">
            <li>CEX listings</li>
            <li>Marketing campaigns</li>
            <li>Partnerships</li>
          </ul>
        </div>
        <div class="roadmap-card">
          <div class="roadmap-phase">Phase 3</div>
          <div class="roadmap-title">Moon</div>
          <ul class="roadmap-list">
            <li>Major exchange listings</li>
            <li>Ecosystem expansion</li>
            <li>To the moon 🚀</li>
          </ul>
        </div>
      </div>
    </section>
  ` : '';

  const faqSection = project.showFaq ? `
    <section class="faq-section fade-in-section">
      <h2 class="section-title">FAQ</h2>
      <div class="faq-grid">
        <div class="faq-card">
          <div class="faq-question">What is ${project.coinName || 'this coin'}?</div>
          <div class="faq-answer">${project.description || `${project.coinName || 'This'} is a community-driven meme coin on Solana with massive potential.`}</div>
        </div>
        <div class="faq-card">
          <div class="faq-question">How do I buy ${project.ticker || 'this token'}?</div>
          <div class="faq-answer">You can buy on decentralized exchanges like Raydium or Jupiter. Connect your Solana wallet and swap SOL.</div>
        </div>
        <div class="faq-card">
          <div class="faq-question">Is ${project.coinName || 'this coin'} safe?</div>
          <div class="faq-answer">Always do your own research (DYOR). This is a meme coin and should be treated as a high-risk investment.</div>
        </div>
      </div>
    </section>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.coinName || 'Your Coin'} (${project.ticker || '$TICKER'}) - Official Website</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${styles.primary};
      --accent: ${styles.accent};
      --bg-gradient: ${styles.bgGradient};
      --text: #ffffff;
      --text-muted: rgba(255,255,255,0.6);
      --card-bg: rgba(255,255,255,0.05);
      --card-border: rgba(255,255,255,0.1);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Space Grotesk', sans-serif;
      background: var(--bg-gradient);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }

    h1, h2, h3, h4, h5, h6 { font-family: 'Outfit', sans-serif; font-weight: 700; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

    /* Header */
    .header {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 16px 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--card-border);
    }

    .header-content { display: flex; justify-content: space-between; align-items: center; }
    .logo-container { display: flex; align-items: center; gap: 12px; }
    .logo-image { width: 40px; height: 40px; border-radius: 12px; object-fit: cover; }
    .logo-placeholder {
      width: 40px; height: 40px; border-radius: 12px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 18px;
    }
    .logo-text { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 20px; }
    .social-links { display: flex; gap: 12px; }
    .social-link {
      width: 40px; height: 40px; border-radius: 12px;
      background: var(--card-bg); border: 1px solid var(--card-border);
      display: flex; align-items: center; justify-content: center;
      color: var(--text); text-decoration: none; transition: all 0.3s ease;
    }
    .social-link:hover {
      background: var(--primary); border-color: var(--primary);
      transform: translateY(-2px);
    }
    .social-link svg { width: 20px; height: 20px; }

    /* Hero */
    .hero {
      min-height: 100vh;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; padding: 120px 20px 80px; position: relative;
    }
    .hero::before {
      content: '';
      position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
      width: 600px; height: 600px;
      background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
      opacity: 0.15; pointer-events: none;
      animation: pulse 4s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.15; transform: translateX(-50%) scale(1); }
      50% { opacity: 0.25; transform: translateX(-50%) scale(1.1); }
    }
    .hero-logo {
      width: 120px; height: 120px; border-radius: 24px;
      margin-bottom: 32px; animation: float 6s ease-in-out infinite;
      position: relative; z-index: 1;
    }
    .hero-logo img {
      width: 100%; height: 100%; border-radius: 24px; object-fit: cover;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    .hero-logo .logo-placeholder {
      width: 100%; height: 100%; border-radius: 24px; font-size: 48px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    .hero-title { font-size: clamp(48px, 10vw, 80px); margin-bottom: 16px; position: relative; z-index: 1; }
    .hero-ticker { font-size: clamp(24px, 5vw, 36px); color: var(--primary); font-family: 'Space Grotesk', monospace; margin-bottom: 24px; position: relative; z-index: 1; }
    .hero-tagline { font-size: clamp(18px, 3vw, 24px); color: var(--text-muted); max-width: 600px; margin-bottom: 40px; position: relative; z-index: 1; }

    /* CTA Buttons */
    .cta-buttons { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }
    .cta-btn {
      padding: 16px 32px; border-radius: 12px; font-weight: 600;
      font-size: 16px; text-decoration: none; transition: all 0.3s ease;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .cta-btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: #000; border: none;
    }
    .cta-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .cta-btn-secondary {
      background: transparent; color: var(--text);
      border: 2px solid var(--card-border);
    }
    .cta-btn-secondary:hover { border-color: var(--primary); color: var(--primary); }

    /* About */
    .about-section {
      padding: 80px 0;
      text-align: center;
    }
    .about-text {
      font-size: 18px;
      color: var(--text-muted);
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.8;
    }

    /* Stats */
    .stats-section { padding: 60px 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
    .stat-card {
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 20px; padding: 32px; text-align: center;
      transition: all 0.3s ease;
    }
    .stat-card:hover { transform: translateY(-5px); border-color: var(--primary); }
    .stat-value { font-size: 36px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
    .stat-label { font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

    /* Community */
    .community-section { padding: 80px 0; text-align: center; }
    .community-subtitle { color: var(--text-muted); margin-bottom: 40px; }
    .community-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; max-width: 800px; margin: 0 auto; }
    .community-card {
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 20px; padding: 32px; text-align: center;
      text-decoration: none; color: var(--text); transition: all 0.3s ease;
    }
    .community-card:hover { transform: translateY(-5px); border-color: var(--primary); }
    .community-icon { margin-bottom: 16px; }
    .community-icon svg { color: var(--primary); }
    .community-name { font-weight: 600; margin-bottom: 8px; }
    .community-action { color: var(--primary); font-size: 14px; }

    /* Story */
    .story-section { padding: 80px 0; }
    .story-content { max-width: 800px; margin: 0 auto; }
    .story-chapter { margin-bottom: 48px; padding: 32px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; }
    .chapter-number { color: var(--primary); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
    .chapter-title { font-size: 24px; margin-bottom: 16px; }
    .chapter-text { color: var(--text-muted); line-height: 1.8; }

    /* Utility */
    .utility-section { padding: 80px 0; text-align: center; }
    .utility-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-top: 40px; }
    .utility-card {
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 20px; padding: 32px; text-align: center;
      transition: all 0.3s ease;
    }
    .utility-card:hover { transform: translateY(-5px); border-color: var(--primary); }
    .utility-icon { font-size: 48px; margin-bottom: 16px; }
    .utility-title { font-size: 20px; margin-bottom: 12px; }
    .utility-desc { color: var(--text-muted); font-size: 14px; line-height: 1.6; }

    /* Roadmap */
    .roadmap-section { padding: 80px 20px; text-align: center; }
    .roadmap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1000px; margin: 40px auto 0; }
    .roadmap-card {
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 20px; padding: 32px; text-align: left;
      transition: all 0.3s ease;
    }
    .roadmap-card:hover { transform: translateY(-5px); border-color: var(--primary); }
    .roadmap-phase { color: var(--primary); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
    .roadmap-title { font-size: 24px; margin-bottom: 16px; }
    .roadmap-list { list-style: none; }
    .roadmap-list li { color: var(--text-muted); padding: 8px 0; padding-left: 20px; position: relative; }
    .roadmap-list li::before { content: '→'; position: absolute; left: 0; color: var(--primary); }

    /* FAQ */
    .faq-section { padding: 80px 20px; text-align: center; }
    .faq-grid { max-width: 800px; margin: 40px auto 0; }
    .faq-card {
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 16px; padding: 24px; margin-bottom: 16px; text-align: left;
      transition: all 0.3s ease;
    }
    .faq-card:hover { border-color: var(--primary); }
    .faq-question { font-weight: 600; margin-bottom: 12px; }
    .faq-answer { color: var(--text-muted); line-height: 1.6; }

    /* Section Title */
    .section-title { font-size: clamp(32px, 5vw, 48px); margin-bottom: 24px; text-align: center; }

    /* Footer */
    .footer { padding: 40px 20px; text-align: center; border-top: 1px solid var(--card-border); margin-top: 60px; }
    .footer-link { color: var(--text-muted); text-decoration: none; transition: color 0.3s ease; }
    .footer-link:hover { color: var(--primary); }
    .footer-disclaimer { color: var(--text-muted); opacity: 0.5; font-size: 12px; margin-top: 12px; }

    /* Fade in animations */
    .fade-in-section { opacity: 0; transform: translateY(30px); animation: fadeInUp 0.8s ease forwards; }
    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in-section:nth-child(2) { animation-delay: 0.2s; }
    .fade-in-section:nth-child(3) { animation-delay: 0.4s; }
    .fade-in-section:nth-child(4) { animation-delay: 0.6s; }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo-container">
          ${logoHtml}
          <span class="logo-text">${project.coinName || 'Your Coin'}</span>
        </div>
        <div class="social-links">
          ${socialLinks}
        </div>
      </div>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-logo">
      ${logoHtml}
    </div>
    <h1 class="hero-title">${project.coinName || 'Your Coin Name'}</h1>
    <div class="hero-ticker">${project.ticker || '$TICKER'}</div>
    <p class="hero-tagline">${project.tagline || 'Your awesome tagline goes here'}</p>
    <div class="cta-buttons">
      <a href="${project.dexLink || '#'}" target="_blank" rel="noopener" class="cta-btn cta-btn-primary">
        Buy Now
      </a>
      <a href="#about" class="cta-btn cta-btn-secondary">Learn More</a>
    </div>
  </section>

  <!-- About -->
  ${project.description ? `
  <section class="about-section fade-in-section" id="about">
    <div class="container">
      <h2 class="section-title">About ${project.coinName || 'Us'}</h2>
      <p class="about-text">${project.description}</p>
    </div>
  </section>
  ` : ''}

  ${statsSection}
  ${communitySection}
  ${storySection}
  ${utilitySection}
  ${roadmapSection}
  ${faqSection}

  <!-- Footer -->
  <footer class="footer">
    <a href="https://solsite.xyz" target="_blank" rel="noopener" class="footer-link">Built with Solsite</a>
    <p class="footer-disclaimer">Solsite provides website infrastructure only. Always do your own research.</p>
  </footer>
</body>
</html>`;
}
