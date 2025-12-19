// Team section generator
import type { SanitizedData, TeamMemberData } from '../types';
import { escapeHtml, sanitizeUrl } from '@/lib/htmlSanitize';

export function generateTeam(data: SanitizedData): string {
  if (!data.teamMembers || data.teamMembers.length === 0) {
    return '';
  }

  const teamCardsHtml = data.teamMembers.map(member => {
    const avatarHtml = member.avatar
      ? `<img src="${sanitizeUrl(member.avatar)}" alt="${escapeHtml(member.name)}" class="team-avatar" />`
      : `<div class="team-avatar-placeholder">${escapeHtml(member.name.charAt(0).toUpperCase())}</div>`;
    
    const twitterHtml = member.twitter
      ? `<a href="${sanitizeUrl(member.twitter)}" target="_blank" rel="noopener" class="team-twitter">𝕏</a>`
      : '';

    return `
      <div class="team-card">
        ${avatarHtml}
        <div class="team-info">
          <div class="team-name">${escapeHtml(member.name)}</div>
          <div class="team-role">${escapeHtml(member.role)}</div>
          ${twitterHtml}
        </div>
      </div>`;
  }).join('');
  
  return `
  <section class="team-section fade-in-section">
    <h2 class="section-title">Meet The Team</h2>
    <div class="team-grid">
      ${teamCardsHtml}
    </div>
  </section>`;
}
