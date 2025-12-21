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
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <Link to="/builder">
          <Button variant="hero" size="xl" className="group">
            Start Building
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link to="/templates">
          <Button variant="glass" size="xl">
            View Templates
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
      >
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-gradient-primary">
            30+
          </div>
          <div className="text-sm text-muted-foreground mt-1">Templates</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-gradient-primary">
            Free
          </div>
          <div className="text-sm text-muted-foreground mt-1">Subdomain</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-gradient-primary">
            &lt;60s
          </div>
          <div className="text-sm text-muted-foreground mt-1">To Deploy</div>
        </div>
      </motion.div>
    </HeroGeometric>
  );
};
