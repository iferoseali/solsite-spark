// CSS styles generator for preview HTML
import type { TemplateStyles } from './types';

export function generateCss(styles: TemplateStyles): string {
  return `
    :root {
      --primary: ${styles.primary};
      --accent: ${styles.accent};
      --bg-gradient: ${styles.bgGradient};
      --bg-color: ${styles.bgColor};
      --text: ${styles.text};
      --text-muted: ${styles.muted};
      --card-bg: rgba(255,255,255,0.05);
      --card-border: rgba(255,255,255,0.1);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: '${styles.fontBody}', sans-serif;
      background: var(--bg-gradient);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    h1, h2, h3, h4, h5, h6 { font-family: '${styles.fontHeading}', sans-serif; font-weight: 700; }
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
    .about-section { padding: 80px 0; text-align: center; }
    .about-text { font-size: 18px; color: var(--text-muted); max-width: 800px; margin: 0 auto; line-height: 1.8; }

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
  `;
}
