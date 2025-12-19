import { Link } from "react-router-dom";
import { Plus, Sparkles, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Decorative icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Rocket className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Text content */}
      <h2 className="text-2xl font-display font-bold mb-3 text-center">
        No Projects Yet
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Create your first meme coin website in minutes. Choose from stunning templates and customize everything to match your vision.
      </p>

      {/* CTA Button */}
      <Link to="/builder">
        <Button variant="glow" size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Create Your First Project
        </Button>
      </Link>

      {/* Features list */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
        {[
          { icon: "⚡", title: "Lightning Fast", desc: "Build in minutes" },
          { icon: "🎨", title: "Fully Customizable", desc: "Make it yours" },
          { icon: "🚀", title: "Instant Deploy", desc: "Go live instantly" },
        ].map((feature) => (
          <div 
            key={feature.title}
            className="text-center p-4 rounded-xl bg-card/50 border border-border"
          >
            <span className="text-2xl mb-2 block">{feature.icon}</span>
            <h3 className="font-semibold text-sm">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
