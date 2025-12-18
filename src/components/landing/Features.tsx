import { 
  Palette, 
  Smartphone, 
  Zap, 
  Globe, 
  Lock,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "30+ Stunning Templates",
    description: "From degen chaos to professional clean. 6 layouts × 5 personalities = infinite possibilities."
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Every template looks fire on mobile. Your community will flex on the go."
  },
  {
    icon: Zap,
    title: "Dynamic Animations",
    description: "Hover effects, fade-ins, smooth transitions. Your site won't be a boring static page."
  },
  {
    icon: Globe,
    title: "Instant Deployment",
    description: "Free subdomain included. Custom domains for the serious degens (0.25-0.5 SOL)."
  },
  {
    icon: Lock,
    title: "Wallet Connected",
    description: "Solana wallet auth. No passwords, no emails. Just connect and create."
  },
  {
    icon: Sparkles,
    title: "Live Preview",
    description: "See your changes instantly. No guessing, no refreshing. Pure WYSIWYG energy."
  }
];

export const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient-primary">Moon</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built by degens, for degens. No fluff, just features that matter.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl glass hover-lift hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
