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
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 md:mb-4">
            <span className="text-gradient-primary">30+ Templates</span> to Choose From
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Pick your style and customize everything
          </p>
        </div>

        {/* Marquee Personality Pills - smaller on mobile */}
        <div className="relative mb-8 md:mb-12 overflow-hidden">
          <div className="flex animate-marquee">
            {[...personalities, ...personalities].map((p, i) => (
              <div
                key={i}
                className={`flex-shrink-0 mx-1.5 md:mx-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full bg-gradient-to-r ${p.color} text-primary-foreground font-medium text-xs md:text-sm flex items-center gap-1.5 md:gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg`}
              >
                <span className="text-sm md:text-lg">{p.emoji}</span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Scrolling Templates */}
        <div className="relative group">
          {/* Left Arrow - hidden on mobile */}
          <button
            onClick={() => scroll('left')}
            className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass items-center justify-center transition-all duration-300 ${
              canScrollLeft ? 'opacity-100 hover:bg-primary/20' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* Right Arrow - hidden on mobile */}
          <button
            onClick={() => scroll('right')}
            className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass items-center justify-center transition-all duration-300 ${
              canScrollRight ? 'opacity-100 hover:bg-primary/20' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Gradient Fades - smaller on mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none" />

          {/* Scrollable Container with touch support */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 md:px-4 touch-pan-x scrollbar-hide"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {templates.map((template, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-56 md:w-72 aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden group/card cursor-pointer hover:scale-[1.02] transition-all duration-300 snap-center"
              >
                <div className={`w-full h-full bg-gradient-to-br ${template.gradient} p-3 md:p-4 flex flex-col relative`}>
                  {/* Mock browser header */}
                  <div className="flex items-center gap-1 md:gap-1.5 mb-3 md:mb-4">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500/60" />
                    <div className="flex-1 h-4 md:h-5 rounded bg-white/10 ml-2" />
                  </div>

                  {/* Mock content */}
                  <div className="flex-1 flex flex-col">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 mb-2 md:mb-3" />
                    <div className="w-3/4 h-3 md:h-4 rounded bg-white/20 mb-1.5 md:mb-2" />
                    <div className="w-1/2 h-2 md:h-3 rounded bg-white/10 mb-3 md:mb-4" />
                    <div className="flex-1 rounded-lg bg-white/5 mb-2 md:mb-3" />
                    <div className="w-full h-8 md:h-10 rounded-lg bg-white/20" />
                  </div>

                  {/* Overlay on hover/tap */}
                  <div className="absolute inset-0 bg-background/90 opacity-0 group-hover/card:opacity-100 active:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 md:p-6">
                    <span className="text-base md:text-lg font-bold text-foreground mb-1">{template.name}</span>
                    <span className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{template.personality}</span>
                    <Link to="/templates">
                      <Button variant="outline" size="sm" className="text-xs md:text-sm">
                        View Template
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Swipe indicator for mobile */}
          <div className="flex md:hidden justify-center mt-3">
            <span className="text-xs text-muted-foreground">← Swipe to explore →</span>
          </div>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link to="/templates">
            <Button variant="glow" size="lg" className="group text-sm md:text-base min-h-[48px]">
              Explore All Templates
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
