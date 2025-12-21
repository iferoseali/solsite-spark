// Footer section generator
import { SITE_CONFIG } from "@/lib/config";

export function generateFooter(): string {
  return `
  <footer class="footer">
    <a href="${SITE_CONFIG.builtWithUrl}" target="_blank" rel="noopener" class="footer-link">Built with Solsite</a>
    <p class="footer-disclaimer">Solsite provides website infrastructure only. Always do your own research.</p>
  </footer>`;
}
