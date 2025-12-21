import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <HeroGeometric
      badge="The fastest way to launch your Website"
      title1="Build Your Website"
      title2="in 60 Seconds"
      description="Professional, animated, mobile-ready websites for Solana meme coins. No code. No design skills. Just pure degen energy."
    >
      {/* CTAs - improved mobile touch targets */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
        <Link to="/builder" className="w-full sm:w-auto">
          <Button variant="hero" size="xl" className="group w-full sm:w-auto min-h-[48px]">
            Start Building
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link to="/templates" className="w-full sm:w-auto">
          <Button variant="glass" size="xl" className="w-full sm:w-auto min-h-[48px]">
            View Templates
          </Button>
        </Link>
      </div>

      {/* Stats - responsive sizing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto px-4"
      >
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-primary">
            30+
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mt-1">Templates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-primary">
            Free
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mt-1">Subdomain</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-primary">
            &lt;60s
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mt-1">To Deploy</div>
        </div>
      </motion.div>
    </HeroGeometric>
  );
};