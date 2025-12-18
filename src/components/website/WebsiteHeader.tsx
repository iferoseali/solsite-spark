import { Twitter, MessageCircle, Send } from "lucide-react";
import { ProjectData, PersonalityStyles } from "./types";

interface WebsiteHeaderProps {
  project: ProjectData;
  styles: PersonalityStyles;
  onEdit?: () => void;
  isEditing?: boolean;
}

export const WebsiteHeader = ({ project, styles, onEdit, isEditing }: WebsiteHeaderProps) => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-xl border-b"
      style={{ 
        background: 'rgba(0,0,0,0.5)',
        borderColor: 'rgba(255,255,255,0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {project.logoUrl ? (
            <img 
              src={project.logoUrl} 
              alt={project.coinName} 
              className="w-10 h-10 rounded-xl object-cover"
            />
          ) : (
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{ background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})` }}
            >
              {project.ticker?.[1] || '?'}
            </div>
          )}
          <span className="font-bold text-lg text-white">
            {project.coinName || 'Your Coin'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {project.twitter && (
            <a 
              href={project.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Twitter className="w-5 h-5 text-white" />
            </a>
          )}
          {project.discord && (
            <a 
              href={project.discord} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </a>
          )}
          {project.telegram && (
            <a 
              href={project.telegram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Send className="w-5 h-5 text-white" />
            </a>
          )}
          {isEditing && onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
              style={{ 
                background: styles.primary,
                color: '#000'
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
