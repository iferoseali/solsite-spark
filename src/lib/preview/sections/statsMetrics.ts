// Stats/Metrics section HTML generator
import type { SanitizedData } from '../types';

export function generateStatsMetrics(data: SanitizedData): string {
  if (!data.stats || data.stats.length === 0) {
    return '';
  }

  const statsHtml = data.stats.map((stat, index) => `
    <div style="
      text-align: center;
      padding: 32px 24px;
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.1);
      transition: transform 0.3s ease, border-color 0.3s ease;
    " onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='var(--primary, #a855f7)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)'">
      ${stat.icon ? `<div style="font-size: 32px; margin-bottom: 12px;">${stat.icon}</div>` : ''}
      <div class="stat-value" style="
        font-size: 42px;
        font-weight: bold;
        background: linear-gradient(to right, var(--primary, #a855f7), var(--accent, #ec4899));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8px;
      " data-value="${stat.value}">${stat.value}</div>
      <div style="
        font-size: 14px;
        color: var(--muted, #888);
        text-transform: uppercase;
        letter-spacing: 1px;
      ">${stat.label}</div>
    </div>
  `).join('');

  return `
    <section id="stats" style="
      padding: 80px 20px;
      background: rgba(0,0,0,0.2);
    ">
      <div style="max-width: 1000px; margin: 0 auto;">
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        ">
          ${statsHtml}
        </div>
      </div>
    </section>
  `;
}
