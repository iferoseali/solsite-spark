import { ProjectData, PersonalityStyles, TeamMember } from "../../types";
import { motion } from "framer-motion";
import { Twitter } from "lucide-react";
import { getAnimationProfile, createMotionProps, createHoverEffect } from "../../animations";

interface TeamProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

const defaultTeam: TeamMember[] = [
  { name: 'Founder', role: 'Vision & Strategy', twitter: '#' },
  { name: 'CTO', role: 'Technical Lead', twitter: '#' },
  { name: 'CMO', role: 'Growth & Marketing', twitter: '#' },
  { name: 'Community Lead', role: 'Community Management', twitter: '#' },
];

export const TeamCards = ({ project, styles, personality = 'professional' }: TeamProps) => {
  const profile = getAnimationProfile(personality);
  const team = project.team?.length ? project.team : defaultTeam;

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" {...createMotionProps(profile, 'fadeIn')}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Team</h2>
          <p className="text-white/60">The people behind the vision</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="p-6 rounded-2xl text-center group"
              style={{ 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...profile.smooth, delay: i * 0.1 }}
              {...createHoverEffect(profile)}
              whileHover={{ 
                borderColor: `${styles.primary}40`,
                background: `${styles.primary}08`
              }}
            >
              <motion.div 
                className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${styles.primary}40, ${styles.accent}40)` }}
                whileHover={{ rotate: 5 }}
              >
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span style={{ color: styles.primary }}>{member.name[0]}</span>
                )}
              </motion.div>

              <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
              <p className="text-white/50 text-sm mb-3">{member.role}</p>
              
              {member.twitter && (
                <motion.a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ background: `${styles.primary}20` }}
                  whileHover={{ scale: 1.2, background: styles.primary }}
                >
                  <Twitter className="w-4 h-4" style={{ color: styles.primary }} />
                </motion.a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
