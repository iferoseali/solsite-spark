import { ProjectData, PersonalityStyles, TeamMember } from "../../types";
import { motion } from "framer-motion";
import { Twitter } from "lucide-react";
import { getAnimationProfile, createMotionProps, createStaggerContainer, createStaggerChild, createHoverEffect } from "../../animations";

interface TeamProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

const defaultTeam: TeamMember[] = [
  { name: 'Founder', role: 'Lead Developer', twitter: '#' },
  { name: 'Co-Founder', role: 'Marketing', twitter: '#' },
  { name: 'Dev', role: 'Smart Contracts', twitter: '#' },
];

export const TeamGrid = ({ project, styles, personality = 'professional' }: TeamProps) => {
  const profile = getAnimationProfile(personality);
  const team = project.team?.length ? project.team : defaultTeam;

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
          {...createMotionProps(profile, 'fadeIn')}
        >
          Meet The Team
        </motion.h2>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          {...createStaggerContainer(profile)}
        >
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="text-center"
              {...createStaggerChild(profile, 'slideUp')}
            >
              <motion.div 
                className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold"
                style={{ 
                  background: `linear-gradient(135deg, ${styles.primary}, ${styles.accent})`,
                }}
                {...createHoverEffect(profile)}
              >
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  member.name[0]
                )}
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-white/60 mb-3">{member.role}</p>
              
              {member.twitter && (
                <motion.a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm"
                  style={{ color: styles.primary }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </motion.a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
