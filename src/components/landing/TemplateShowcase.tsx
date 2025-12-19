import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const personalities = [
  { name: "Degenerate", color: "from-red-500 to-orange-500", emoji: "🔥" },
  { name: "Professional", color: "from-blue-500 to-cyan-500", emoji: "💼" },
  { name: "Dark Cult", color: "from-purple-500 to-pink-500", emoji: "🌙" },
  { name: "Playful Meme", color: "from-yellow-500 to-green-500", emoji: "😂" },
  { name: "Premium", color: "from-gray-400 to-gray-600", emoji: "👑" },
  { name: "Minimalist", color: "from-slate-400 to-slate-600", emoji: "✨" },
  { name: "Brutalist", color: "from-zinc-500 to-zinc-700", emoji: "🏗️" },
  { name: "Gaming", color: "from-violet-500 to-indigo-500", emoji: "🎮" },
];

const templates = [
  { name: "Cult Minimal", personality: "Dark Cult", gradient: "from-purple-900 to-black" },
  { name: "VC Grade Pro", personality: "Professional", gradient: "from-blue-900 to-slate-900" },
  { name: "Degen Meme", personality: "Degenerate", gradient: "from-red-900 to-orange-900" },
  { name: "Luxury Token", personality: "Premium", gradient: "from-amber-900 to-stone-900" },
  { name: "Neo Grid", personality: "Minimalist", gradient: "from-slate-800 to-gray-900" },
  { name: "Web3 Gaming", personality: "Gaming", gradient: "from-violet-900 to-indigo-900" },
  { name: "Ultra Brutalist", personality: "Brutalist", gradient: "from-zinc-800 to-black" },
  { name: "Social First", personality: "Playful Meme", gradient: "from-green-900 to-teal-900" },
];

export const TemplateShowcase = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-gradient-primary">30+ Templates</span> to Choose From
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pick your style and customize everything
          </p>
        </div>

        {/* Marquee Personality Pills */}
        <div className="relative mb-12 overflow-hidden">
          <div className="flex animate-marquee">
            {[...personalities, ...personalities].map((p, i) => (
              <div
                key={i}
                className={`flex-shrink-0 mx-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${p.color} text-primary-foreground font-medium text-sm flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg`}
              >
                <span className="text-lg">{p.emoji}</span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Scrolling Templates */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center transition-all duration-300 ${
              canScrollLeft ? 'opacity-100 hover:bg-primary/20' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center transition-all duration-300 ${
              canScrollRight ? 'opacity-100 hover:bg-primary/20' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none" />

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-container pb-4 px-4"
          >
            {templates.map((template, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-72 aspect-[3/4] rounded-2xl overflow-hidden group/card cursor-pointer hover:scale-[1.02] transition-all duration-300"
              >
                <div className={`w-full h-full bg-gradient-to-br ${template.gradient} p-4 flex flex-col relative`}>
                  {/* Mock browser header */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <div className="flex-1 h-5 rounded bg-white/10 ml-2" />
                  </div>

                  {/* Mock content */}
                  <div className="flex-1 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-white/10 mb-3" />
                    <div className="w-3/4 h-4 rounded bg-white/20 mb-2" />
                    <div className="w-1/2 h-3 rounded bg-white/10 mb-4" />
                    <div className="flex-1 rounded-lg bg-white/5 mb-3" />
                    <div className="w-full h-10 rounded-lg bg-white/20" />
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-background/90 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6">
                    <span className="text-lg font-bold text-foreground mb-1">{template.name}</span>
                    <span className="text-sm text-muted-foreground mb-4">{template.personality}</span>
                    <Link to="/templates">
                      <Button variant="outline" size="sm">
                        View Template
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/templates">
            <Button variant="glow" size="lg" className="group">
              Explore All Templates
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
