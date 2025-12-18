import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const personalities = [{
  name: "Degenerate",
  color: "from-red-500 to-orange-500",
  emoji: "🔥"
}, {
  name: "Professional",
  color: "from-blue-500 to-cyan-500",
  emoji: "💼"
}, {
  name: "Dark Cult",
  color: "from-purple-500 to-pink-500",
  emoji: "🌙"
}, {
  name: "Playful Meme",
  color: "from-yellow-500 to-green-500",
  emoji: "😂"
}, {
  name: "Premium",
  color: "from-gray-400 to-gray-600",
  emoji: "👑"
}];
const layouts = ["Minimal", "Hero+Roadmap", "Story/Lore", "Stats Heavy", "Community", "Utility"];
export const TemplateShowcase = () => {
  return <section className="py-24 relative">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-gradient-primary">30 Templates</span> to Choose From
          </h2>
          
        </div>

        {/* Personality Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {personalities.map((p, i) => <div key={i} className={`px-4 py-2 rounded-full bg-gradient-to-r ${p.color} text-primary-foreground font-medium text-sm flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer`}>
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </div>)}
        </div>

        {/* Template Grid Preview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {layouts.map((layout, i) => <div key={i} className="aspect-[3/4] rounded-xl glass overflow-hidden group cursor-pointer hover:border-primary/50 transition-all duration-300">
              <div className="w-full h-full bg-gradient-to-br from-secondary to-muted p-3 flex flex-col">
                <div className="w-full h-3 rounded bg-primary/20 mb-2" />
                <div className="w-2/3 h-2 rounded bg-muted-foreground/20 mb-4" />
                <div className="flex-1 rounded-lg bg-card/50 mb-2" />
                <div className="w-full h-6 rounded bg-primary/30" />
              </div>
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-sm font-medium text-foreground">{layout}</span>
              </div>
            </div>)}
        </div>

        <div className="text-center">
          <Link to="/templates">
            <Button variant="glow" size="lg" className="group">
              Explore All Templates
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};