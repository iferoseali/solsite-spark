// Roadmap section generator

export function generateRoadmap(showRoadmap: boolean): string {
  if (!showRoadmap) {
    return '';
  }
  
  return `
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
  </section>`;
}
