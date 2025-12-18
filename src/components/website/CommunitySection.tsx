import { Twitter, MessageCircle, Send } from "lucide-react";
import { ProjectData, PersonalityStyles } from "./types";

interface CommunitySectionProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

export const CommunitySection = ({ project, styles }: CommunitySectionProps) => {
  const links = [
    { url: project.twitter, icon: Twitter, name: 'Twitter', action: 'Follow Us' },
    { url: project.discord, icon: MessageCircle, name: 'Discord', action: 'Join Server' },
    { url: project.telegram, icon: Send, name: 'Telegram', action: 'Join Group' },
  ].filter(link => link.url);

  if (links.length === 0) return null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Join the Community
        </h2>
        <p className="text-white/60 mb-12">
          Connect with fellow {project.coinName || 'token'} enthusiasts
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 rounded-2xl transition-all hover:scale-105 group"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <link.icon 
                className="w-10 h-10 mx-auto mb-4 transition-colors"
                style={{ color: styles.primary }}
              />
              <div className="font-semibold text-white mb-2">{link.name}</div>
              <div 
                className="text-sm"
                style={{ color: styles.primary }}
              >
                {link.action}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
