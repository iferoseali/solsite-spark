import { PersonalityStyles } from "./types";

interface WebsiteFooterProps {
  styles: PersonalityStyles;
}

export const WebsiteFooter = ({ styles }: WebsiteFooterProps) => {
  return (
    <footer 
      className="py-10 px-6 text-center mt-12"
      style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
    >
      <a 
        href="https://solsite.fun" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-white/60 hover:text-white transition-colors"
      >
        Built with Solsite
      </a>
      <p className="text-white/30 text-xs mt-3">
        Solsite provides website infrastructure only. Always do your own research.
      </p>
    </footer>
  );
};
