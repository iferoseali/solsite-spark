import { ProjectData, PersonalityStyles } from "../../types";
import { motion } from "framer-motion";
import { Twitter, MessageCircle, Users, Zap } from "lucide-react";
import { getAnimationProfile, createMotionProps, createStaggerContainer, createStaggerChild, createHoverEffect } from "../../animations";

interface CommunityProps {
  project: ProjectData;
  styles: PersonalityStyles;
  personality?: string;
}

export const CommunityCards = ({ project, styles, personality = 'professional' }: CommunityProps) => {
  const profile = getAnimationProfile(personality);
  const isDegen = personality === 'degen' || personality === 'degen_meme';

  const cards = [
    { 
      title: 'Twitter', 
      description: isDegen ? 'Follow for alpha 🔥' : 'Latest updates & announcements',
      url: project.twitter, 
      icon: Twitter,
      stat: '10K+ Followers'
    },
    { 
      title: 'Discord', 
      description: isDegen ? 'Degen chat 24/7 💎' : 'Join the discussion',
      url: project.discord, 
      icon: MessageCircle,
      stat: '5K+ Members'
    },
    { 
      title: 'Telegram', 
      description: isDegen ? 'Ape together strong 🦍' : 'Real-time community chat',
      url: project.telegram, 
      icon: Users,
      stat: '8K+ Members'
    },
  ].filter(c => c.url);

  if (cards.length === 0) return null;

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" {...createMotionProps(profile, 'fadeIn')}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isDegen ? '🚀 Join the Movement 🚀' : 'Community'}
          </h2>
          <p className="text-white/60">
            {isDegen ? 'WAGMI fam. Get in before it\'s too late!' : 'Become part of our growing ecosystem'}
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          {...createStaggerContainer(profile)}
        >
          {cards.map((card, i) => (
            <motion.a
              key={card.title}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 rounded-3xl text-center group"
              style={{ 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              {...createStaggerChild(profile, 'slideUp')}
              {...createHoverEffect(profile)}
              whileHover={{ 
                borderColor: `${styles.primary}50`,
                background: `${styles.primary}08`
              }}
            >
              <motion.div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: `${styles.primary}20` }}
                whileHover={{ rotate: isDegen ? 360 : 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <card.icon className="w-8 h-8" style={{ color: styles.primary }} />
              </motion.div>
              
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-white/60 mb-4">{card.description}</p>
              <p className="text-sm font-semibold" style={{ color: styles.primary }}>
                {card.stat}
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
