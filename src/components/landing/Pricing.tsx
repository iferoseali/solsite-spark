import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Free subdomain (coin.solsite.fun)",
  "All 30+ templates included",
  "Mobile responsive design",
  "Dynamic animations",
  "Social links integration",
  "DEX links & trading buttons",
  "Tokenomics & roadmap sections",
  "Instant deployment",
];

export const Pricing = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Simple{" "}
            <span className="text-gradient-primary">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to launch. One simple fee.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Main pricing card */}
          <div className="relative p-8 md:p-10 rounded-3xl glass-strong border-primary/30 glow-primary">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold rounded-full flex items-center gap-2 shadow-lg">
              <Sparkles className="w-4 h-4" />
              All-Inclusive
            </div>

            <div className="text-center mb-8 pt-4">
              <h3 className="text-2xl font-bold mb-4">Launch Your Site</h3>
              
              {/* Price display */}
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="text-5xl md:text-6xl font-display font-bold text-gradient-primary">
                  0.05
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">SOL</div>
                  <div className="text-sm text-muted-foreground">one-time</div>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mt-4">
                Generation fee to create & publish your website
              </p>
            </div>

            {/* Features list */}
            <ul className="space-y-3 mb-8">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link to="/builder">
              <Button variant="hero" className="w-full" size="lg">
                <Zap className="w-5 h-5 mr-2" />
                Start Building Now
              </Button>
            </Link>

            {/* Additional info */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  No hidden fees
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  No subscriptions
                </div>
              </div>
            </div>
          </div>

          {/* Free preview note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">Free to design & preview</span> — Only pay when you're ready to publish
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
