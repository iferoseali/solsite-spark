import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
export const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-soft" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-soft" style={{
      animationDelay: '2s'
    }} />
      
      {/* Floating elements */}
      <div className="absolute top-20 right-20 w-20 h-20 border border-primary/30 rounded-full animate-float opacity-40" />
      <div className="absolute bottom-40 left-20 w-16 h-16 border border-accent/30 rounded-lg rotate-45 animate-float opacity-40" style={{
      animationDelay: '1s'
    }} />
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 fade-in-up fade-in-delay-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">The fastest way to launch your Website</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-tight mb-6 fade-in-up fade-in-delay-2">
            Build Your{" "}
            <span className="text-gradient-primary">Meme Coin</span>
            <br />
            Website in{" "}
            <span className="relative inline-block">
              <span className="text-primary">Seconds</span>
              <Zap className="absolute -top-2 -right-8 w-8 h-8 text-primary animate-pulse" />
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 fade-in-up fade-in-delay-3">
            Professional, animated, mobile-ready websites for Solana meme coins. 
            No code. No design skills. Just pure degen energy.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up fade-in-delay-4">
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
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto fade-in-up" style={{
          animationDelay: '0.5s'
        }}>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient-primary">30+</div>
              <div className="text-sm text-muted-foreground mt-1">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient-primary">Free</div>
              <div className="text-sm text-muted-foreground mt-1">Subdomain</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient-primary">&lt;60s</div>
              <div className="text-sm text-muted-foreground mt-1">To Deploy</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};