import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { Twitter, MessageCircle, Globe } from "lucide-react";
import { getAnimationProfile, createMotionProps, createHoverEffect } from "../../animations";

interface CommunityProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

export const CommunitySocials = ({ project, styles, personality = 'professional' }: CommunityProps) => {
  const profile = getAnimationProfile(personality);

  const socials = [
    { name: 'Twitter', url: project.twitter, icon: Twitter, color: '#1DA1F2' },
    { name: 'Discord', url: project.discord, icon: MessageCircle, color: '#5865F2' },
    { name: 'Telegram', url: project.telegram, icon: MessageCircle, color: '#0088cc' },
  ].filter(s => s.url);

  if (socials.length === 0) return null;

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          {...createMotionProps(profile, 'fadeIn')}
        >
          Join Our Community
        </motion.h2>
        <motion.p 
          className="text-white/60 mb-12 max-w-xl mx-auto"
          {...createMotionProps(profile, 'fadeIn')}
        >
          Connect with fellow holders and stay updated on the latest news
        </motion.p>

        <motion.div 
          className="flex flex-wrap justify-center gap-6"
          {...createMotionProps(profile, 'slideUp')}
        >
          {socials.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold"
              style={{ 
                background: `linear-gradient(135deg, ${styles.primary}20, ${styles.accent}10)`,
                border: `1px solid ${styles.primary}30`
              }}
              {...createHoverEffect(profile)}
              whileHover={{ 
                borderColor: styles.primary,
                boxShadow: `0 0 30px ${styles.primary}30`
              }}
            >
              <social.icon className="w-5 h-5" />
              {social.name}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
