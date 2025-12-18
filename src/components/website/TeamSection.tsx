import { Twitter } from "lucide-react";
import { ProjectData, PersonalityStyles, TeamMember } from "./types";

interface TeamSectionProps {
  project: ProjectData;
  styles: PersonalityStyles;
}

const defaultTeam: TeamMember[] = [
  { name: 'Founder', role: 'Visionary', avatar: undefined },
  { name: 'Dev', role: 'Builder', avatar: undefined },
  { name: 'Community', role: 'Manager', avatar: undefined },
];

export const TeamSection = ({ project, styles }: TeamSectionProps) => {
  const team = project.team?.length ? project.team : defaultTeam;

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Team
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl text-center transition-all hover:scale-105"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {member.avatar ? (
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                  style={{ background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})` }}
                >
                  {member.name[0]}
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-1">
                {member.name}
              </h3>
              <p className="text-white/60 text-sm mb-3">
                {member.role}
              </p>
              {member.twitter && (
                <a 
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm"
                  style={{ color: styles.primary }}
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
