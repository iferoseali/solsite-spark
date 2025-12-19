import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Full-page background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Animated gradient orbs spread across the page */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse-soft" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-accent/25 rounded-full blur-[140px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-primary/15 rounded-full blur-[160px] animate-pulse-soft" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: "3s" }} />

      {/* Floating elements spread across the entire viewport */}
      <div className="absolute top-32 right-20 w-24 h-24 border border-primary/30 rounded-full animate-float opacity-40" />
      <div className="absolute top-1/4 left-16 w-16 h-16 border border-accent/20 rounded-full animate-float opacity-30" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-1/2 right-1/4 w-12 h-12 border border-primary/25 rounded-lg rotate-45 animate-float opacity-35" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-40 left-20 w-20 h-20 border border-accent/30 rounded-lg rotate-45 animate-float opacity-40" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/3 right-16 w-14 h-14 border border-primary/20 rounded-full animate-float opacity-25" style={{ animationDelay: "2s" }} />
      <div className="absolute top-40 left-1/3 w-8 h-8 bg-primary/10 rounded-full animate-float opacity-50" style={{ animationDelay: "0.8s" }} />
      <div className="absolute bottom-20 right-1/3 w-10 h-10 bg-accent/10 rounded-full animate-float opacity-40" style={{ animationDelay: "1.2s" }} />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 fade-in-up fade-in-delay-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              The fastest way to launch your Website
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-tight mb-6 fade-in-up fade-in-delay-3">
            <span className="inline-block animate-slide-in-left">Build Your</span>{" "}
            <span className="inline-block animate-slide-in-right text-primary">
              Website
            </span>
            <br />
            <span
              className="inline-block animate-slide-in-left"
              style={{ animationDelay: "0.2s" }}
            >
              in less than
            </span>{" "}
            <span
              className="relative inline-block animate-slide-in-right"
              style={{ animationDelay: "0.3s" }}
            >
              <span
                className="text-primary typewriter"
                style={{ animationDelay: "0.8s" }}
              >
                60 Seconds
              </span>
              <Zap
                className="absolute -top-2 -right-8 w-8 h-8 text-primary zap-glow"
                style={{ animationDelay: "1.2s" }}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 fade-in-up fade-in-delay-4">
            Professional, animated, mobile-ready websites for Solana meme coins.
            No code. No design skills. Just pure degen energy.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
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
          <div
            className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto fade-in-up"
            style={{ animationDelay: "0.5s" }}
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
          </div>
        </div>
      </div>
    </section>
  );
};
