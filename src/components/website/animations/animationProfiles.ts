import { Variants, Transition } from "framer-motion";

export type AnimationPersonality = 'degen' | 'professional' | 'dark-cult' | 'premium' | 'playful' | 'builder';

interface AnimationProfile {
  // Entrance animations
  fadeIn: Variants;
  slideUp: Variants;
  scaleIn: Variants;
  stagger: { staggerChildren: number; delayChildren: number };
  
  // Transitions
  spring: Transition;
  smooth: Transition;
  
  // Hover effects
  hoverScale: number;
  hoverRotate?: number;
  
  // Scroll-triggered
  scrollOffset: string;
}

const degenProfile: AnimationProfile = {
  fadeIn: {
    hidden: { opacity: 0, y: 50, rotate: -5 },
    visible: { opacity: 1, y: 0, rotate: 0 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 100, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0 }
  },
  stagger: { staggerChildren: 0.08, delayChildren: 0.1 },
  spring: { type: "spring", stiffness: 400, damping: 15, bounce: 0.6 },
  smooth: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] },
  hoverScale: 1.15,
  hoverRotate: 3,
  scrollOffset: "-100px"
};

const professionalProfile: AnimationProfile = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: { staggerChildren: 0.12, delayChildren: 0.2 },
  spring: { type: "spring", stiffness: 100, damping: 20 },
  smooth: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  hoverScale: 1.03,
  scrollOffset: "-50px"
};

const darkCultProfile: AnimationProfile = {
  fadeIn: {
    hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" }
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 1.1, filter: "blur(20px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" }
  },
  stagger: { staggerChildren: 0.2, delayChildren: 0.3 },
  spring: { type: "spring", stiffness: 50, damping: 30 },
  smooth: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  hoverScale: 1.02,
  scrollOffset: "-150px"
};

const premiumProfile: AnimationProfile = {
  fadeIn: {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: { staggerChildren: 0.15, delayChildren: 0.25 },
  spring: { type: "spring", stiffness: 80, damping: 25 },
  smooth: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
  hoverScale: 1.04,
  scrollOffset: "-80px"
};

const playfulProfile: AnimationProfile = {
  fadeIn: {
    hidden: { opacity: 0, y: 30, rotate: 3 },
    visible: { opacity: 1, y: 0, rotate: 0 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: { staggerChildren: 0.1, delayChildren: 0.15 },
  spring: { type: "spring", stiffness: 300, damping: 12, bounce: 0.5 },
  smooth: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  hoverScale: 1.1,
  hoverRotate: 2,
  scrollOffset: "-100px"
};

const builderProfile: AnimationProfile = {
  fadeIn: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: { staggerChildren: 0.1, delayChildren: 0.1 },
  spring: { type: "spring", stiffness: 150, damping: 18 },
  smooth: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  hoverScale: 1.05,
  scrollOffset: "-60px"
};

const profiles: Record<AnimationPersonality, AnimationProfile> = {
  degen: degenProfile,
  professional: professionalProfile,
  'dark-cult': darkCultProfile,
  premium: premiumProfile,
  playful: playfulProfile,
  builder: builderProfile
};

export function getAnimationProfile(personality: string): AnimationProfile {
  // Map template personalities to animation profiles
  const mapping: Record<string, AnimationPersonality> = {
    'degen': 'degen',
    'degen_meme': 'degen',
    'professional': 'professional',
    'vc_pro': 'professional',
    'dark-cult': 'dark-cult',
    'dark_cult': 'dark-cult',
    'premium': 'premium',
    'luxury_token': 'premium',
    'playful': 'playful',
    'neo_grid': 'playful',
    'scroll_story': 'playful',
    'builder': 'builder',
    'builder_utility': 'builder',
    'cult_minimal': 'dark-cult',
  };

  const profileKey = mapping[personality] || 'professional';
  return profiles[profileKey];
}

// Utility for creating motion props
export function createMotionProps(profile: AnimationProfile, type: 'fadeIn' | 'slideUp' | 'scaleIn' = 'fadeIn') {
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: profile.scrollOffset },
    variants: profile[type],
    transition: profile.smooth
  };
}

// Container with stagger
export function createStaggerContainer(profile: AnimationProfile) {
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: profile.scrollOffset },
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: profile.stagger
      }
    }
  };
}

// Child item for stagger containers
export function createStaggerChild(profile: AnimationProfile, type: 'fadeIn' | 'slideUp' | 'scaleIn' = 'slideUp') {
  return {
    variants: profile[type],
    transition: profile.spring
  };
}

// Hover effect
export function createHoverEffect(profile: AnimationProfile) {
  return {
    whileHover: { 
      scale: profile.hoverScale,
      rotate: profile.hoverRotate || 0,
      transition: profile.spring
    },
    whileTap: { scale: profile.hoverScale * 0.95 }
  };
}
