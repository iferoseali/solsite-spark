// Roadmap section generator
import type { SanitizedData, RoadmapPhaseData } from '../types';
import { escapeHtml } from '@/lib/htmlSanitize';

const DEFAULT_ROADMAP_PHASES: RoadmapPhaseData[] = [
  { phase: 'Phase 1', title: 'Launch', items: ['Token launch on Solana', 'Website & socials live', 'Community building'], completed: false },
  { phase: 'Phase 2', title: 'Growth', items: ['CEX listings', 'Marketing campaigns', 'Partnerships'], completed: false },
  { phase: 'Phase 3', title: 'Moon', items: ['Major exchange listings', 'Ecosystem expansion', 'To the moon 🚀'], completed: false },
];

export function generateRoadmap(data: SanitizedData, showRoadmap: boolean): string {
  if (!showRoadmap) {
    return '';
  }

  // Use custom roadmap phases if provided, otherwise use defaults
  const phases = data.roadmapPhases && data.roadmapPhases.length > 0
    ? data.roadmapPhases
    : DEFAULT_ROADMAP_PHASES;

  const phaseCardsHtml = phases.map(phase => `
      <div class="roadmap-card${phase.completed ? ' completed' : ''}">
        <div class="roadmap-phase">${escapeHtml(phase.phase)}</div>
        <div class="roadmap-title">${escapeHtml(phase.title)}</div>
        <ul class="roadmap-list">
          ${phase.items.filter(item => item.trim()).map(item => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
        ${phase.completed ? '<div class="roadmap-completed">✓ Completed</div>' : ''}
      </div>`).join('');
  
  return `
  <section class="roadmap-section fade-in-section">
    <h2 class="section-title">Roadmap</h2>
    <div class="roadmap-grid">
      ${phaseCardsHtml}
    </div>
  </section>`;
}
