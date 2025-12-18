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

function generateWebsiteHTML(project: Project, template: Template | null): string {
  const personality = template?.personality_id || 'professional';
  const layout = template?.layout_id || 'minimal';
  const styles = getPersonalityStyles(personality);
  
  const logoHtml = project.logo_url 
    ? `<img src="${project.logo_url}" alt="${project.coin_name}" class="logo-image" />`
    : `<div class="logo-placeholder">${project.ticker?.[1] || '?'}</div>`;

  const socialLinks = `
    ${project.twitter_url ? `<a href="${project.twitter_url}" target="_blank" rel="noopener" class="social-link" aria-label="Twitter">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
    </a>` : ''}
    ${project.discord_url ? `<a href="${project.discord_url}" target="_blank" rel="noopener" class="social-link" aria-label="Discord">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.5c3.5-1 5.5-1 9 0"/><path d="M7 16.5c3.5 1 6.5 1 10 0"/><path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5"/><path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.476-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5"/></svg>
    </a>` : ''}
    ${project.telegram_url ? `<a href="${project.telegram_url}" target="_blank" rel="noopener" class="social-link" aria-label="Telegram">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
    </a>` : ''}
  `;

  const roadmapSection = project.show_roadmap ? `
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

  const faqSection = project.show_faq ? `
    <section class="faq-section fade-in-section">
      <h2 class="section-title">FAQ</h2>
      <div class="faq-grid">
        <div class="faq-card">
          <div class="faq-question">What is ${project.coin_name}?</div>
          <div class="faq-answer">${project.description || `${project.coin_name} is a community-driven meme coin on Solana with massive potential.`}</div>
        </div>
        <div class="faq-card">
          <div class="faq-question">How do I buy ${project.ticker}?</div>
          <div class="faq-answer">You can buy ${project.ticker} on decentralized exchanges like Raydium or Jupiter. Connect your Solana wallet and swap SOL for ${project.ticker}.</div>
        </div>
        <div class="faq-card">
          <div class="faq-question">Is ${project.coin_name} safe?</div>
          <div class="faq-answer">Always do your own research (DYOR). ${project.coin_name} is a meme coin and should be treated as a high-risk investment.</div>
        </div>
      </div>
    </section>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.coin_name} (${project.ticker}) - Official Website</title>
  <meta name="description" content="${project.tagline || project.description || `${project.coin_name} - The next big meme coin on Solana`}">
  <meta property="og:title" content="${project.coin_name} (${project.ticker})">
  <meta property="og:description" content="${project.tagline || project.description || `${project.coin_name} - The next big meme coin on Solana`}">
  <meta property="og:type" content="website">
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

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Space Grotesk', sans-serif;
      background: var(--bg-gradient);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Header */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 16px 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--card-border);
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

    .logo-image {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      object-fit: cover;
    }

    .logo-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 20px;
    }

    .social-links {
      display: flex;
      gap: 12px;
    }

    .social-link {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: var(--primary);
      border-color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .social-link svg {
      width: 20px;
      height: 20px;
    }

    /* Hero */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 120px 20px 80px;
      position: relative;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
      opacity: 0.15;
      pointer-events: none;
      animation: pulse 4s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.15; transform: translateX(-50%) scale(1); }
      50% { opacity: 0.25; transform: translateX(-50%) scale(1.1); }
    }

    .hero-logo {
      width: 120px;
      height: 120px;
      border-radius: 24px;
      margin-bottom: 32px;
      animation: float 6s ease-in-out infinite;
      position: relative;
      z-index: 1;
    }

    .hero-logo img {
      width: 100%;
      height: 100%;
      border-radius: 24px;
      object-fit: cover;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }

    .hero-logo .logo-placeholder {
      width: 100%;
      height: 100%;
      border-radius: 24px;
      font-size: 48px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .hero-title {
      font-size: clamp(48px, 10vw, 80px);
      margin-bottom: 16px;
      position: relative;
      z-index: 1;
    }

    .hero-ticker {
      font-size: clamp(24px, 5vw, 36px);
      color: var(--primary);
      font-family: 'Space Grotesk', monospace;
      margin-bottom: 24px;
      position: relative;
      z-index: 1;
    }

    .hero-tagline {
      font-size: clamp(18px, 3vw, 24px);
      color: var(--text-muted);
      max-width: 600px;
      margin-bottom: 40px;
      position: relative;
      z-index: 1;
    }

    .cta-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    .btn {
      padding: 16px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: #000;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    .btn-primary:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }

    .btn-secondary {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text);
    }

    .btn-secondary:hover {
      background: rgba(255,255,255,0.1);
      border-color: var(--primary);
    }

    /* Description */
    .description-section {
      padding: 80px 0;
      text-align: center;
    }

    .description-text {
      font-size: 20px;
      color: var(--text-muted);
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.8;
    }

    /* Sections */
    .section-title {
      font-size: clamp(32px, 5vw, 48px);
      text-align: center;
      margin-bottom: 48px;
    }

    /* Roadmap */
    .roadmap-section {
      padding: 80px 0;
    }

    .roadmap-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .roadmap-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 32px;
      transition: all 0.3s ease;
    }

    .roadmap-card:hover {
      transform: translateY(-8px);
      border-color: var(--primary);
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .roadmap-phase {
      color: var(--primary);
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .roadmap-title {
      font-size: 24px;
      margin-bottom: 16px;
    }

    .roadmap-list {
      list-style: none;
      color: var(--text-muted);
    }

    .roadmap-list li {
      padding: 8px 0;
      padding-left: 20px;
      position: relative;
    }

    .roadmap-list li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--primary);
    }

    /* FAQ */
    .faq-section {
      padding: 80px 0;
    }

    .faq-grid {
      display: grid;
      gap: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s ease;
    }

    .faq-card:hover {
      border-color: var(--primary);
    }

    .faq-question {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 12px;
    }

    .faq-answer {
      color: var(--text-muted);
      line-height: 1.6;
    }

    /* Footer */
    .footer {
      padding: 40px 0;
      text-align: center;
      border-top: 1px solid var(--card-border);
    }

    .footer-built {
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 12px;
    }

    .footer-built a {
      color: var(--primary);
      text-decoration: none;
    }

    .footer-built a:hover {
      text-decoration: underline;
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

      .hero {
        padding-top: 160px;
      }

      .cta-buttons {
        flex-direction: column;
        width: 100%;
        padding: 0 20px;
      }

      .btn {
        width: 100%;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container header-content">
      <div class="logo-container">
        ${logoHtml}
        <span class="logo-text">${project.coin_name}</span>
      </div>
      <div class="social-links">
        ${socialLinks}
      </div>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="hero-logo">
        ${logoHtml}
      </div>
      <h1 class="hero-title">${project.coin_name}</h1>
      <div class="hero-ticker">${project.ticker}</div>
      <p class="hero-tagline">${project.tagline || `The next big thing on Solana`}</p>
      <div class="cta-buttons">
        ${project.dex_link ? `<a href="${project.dex_link}" target="_blank" rel="noopener" class="btn btn-primary">Buy Now</a>` : ''}
        ${project.twitter_url ? `<a href="${project.twitter_url}" target="_blank" rel="noopener" class="btn btn-secondary">Join Community</a>` : ''}
      </div>
    </section>

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
      <p class="footer-disclaimer">Solsite provides website infrastructure only. We do not endorse any token or project. Always DYOR.</p>
    </div>
  </footer>

  <script>
    // Fade in sections on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
      observer.observe(section);
    });
  </script>
</body>
</html>`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const subdomain = url.searchParams.get('subdomain');
    const projectId = url.searchParams.get('projectId');

    if (!subdomain && !projectId) {
      return new Response(
        JSON.stringify({ error: 'Missing subdomain or projectId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Rendering site for: subdomain=${subdomain}, projectId=${projectId}`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch project data
    let query = supabase.from('projects').select('*');
    
    if (projectId) {
      query = query.eq('id', projectId);
    } else if (subdomain) {
      query = query.eq('subdomain', subdomain);
    }

    const { data: project, error: projectError } = await query.maybeSingle();

    if (projectError) {
      console.error('Error fetching project:', projectError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch project' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!project) {
      console.log('Project not found');
      return new Response(
        generateNotFoundHTML(),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
      );
    }

    // Fetch template if exists
    let template: Template | null = null;
    if (project.template_id) {
      const { data: templateData } = await supabase
        .from('templates')
        .select('*')
        .eq('id', project.template_id)
        .maybeSingle();
      
      template = templateData;
    }

    console.log(`Generating HTML for ${project.coin_name}`);
    const html = generateWebsiteHTML(project, template);

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5 minute cache
      },
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
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
    }
    .container { max-width: 500px; }
    h1 { font-size: 120px; color: #00d4ff; margin-bottom: 20px; }
    h2 { font-size: 32px; margin-bottom: 16px; }
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
    a:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <h2>Site Not Found</h2>
    <p>This meme coin website doesn't exist yet. Maybe it's time to create one?</p>
    <a href="https://solsite.xyz">Create Your Site</a>
  </div>
</body>
</html>`;
}