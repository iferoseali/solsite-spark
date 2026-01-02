import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplatePreview {
  id: string;
  name: string;
  theme: {
    background: string;
    primary: string;
    accent: string;
  };
  tagline: string;
}

const FEATURED_TEMPLATES: TemplatePreview[] = [
  { id: "degen_meme", name: "Degenerate Meme", theme: { background: "#120018", primary: "#ff4fd8", accent: "#ff8800" }, tagline: "Wild chaotic energy" },
  { id: "vc_pro", name: "VC Grade Pro", theme: { background: "#0e1117", primary: "#5da9ff", accent: "#0088ff" }, tagline: "Clean & professional" },
  { id: "ai_crypto", name: "AI Crypto", theme: { background: "#0a1520", primary: "#00d4ff", accent: "#22c55e" }, tagline: "Futuristic tech vibes" },
  { id: "cult_minimal", name: "Cult Minimal", theme: { background: "#0b0b0b", primary: "#a6ff00", accent: "#7acc00" }, tagline: "Stark cult aesthetic" },
  { id: "neo_grid", name: "Neo Grid", theme: { background: "#0f0f0f", primary: "#8b5cf6", accent: "#ec4899" }, tagline: "Modern bento layout" },
  { id: "luxury_token", name: "Luxury Token", theme: { background: "#0a0a0a", primary: "#d4af37", accent: "#c0c0c0" }, tagline: "Premium elegance" },
];

export const PhoneMockupCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_TEMPLATES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const prev = () => goTo((activeIndex - 1 + FEATURED_TEMPLATES.length) % FEATURED_TEMPLATES.length);
  const next = () => goTo((activeIndex + 1) % FEATURED_TEMPLATES.length);

  const currentTemplate = FEATURED_TEMPLATES[activeIndex];

  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-primary">Beautiful</span> on every device
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your site looks stunning on mobile, tablet, and desktop. Preview our templates in action.
          </p>
        </motion.div>

        {/* Carousel */}
        <div 
          className="relative flex items-center justify-center gap-4 sm:gap-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Nav buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="hidden sm:flex shrink-0 h-12 w-12 rounded-full bg-card/50 hover:bg-card border border-border/50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Phone mockups */}
          <div className="relative h-[500px] sm:h-[600px] w-full max-w-4xl flex items-center justify-center">
            {FEATURED_TEMPLATES.map((template, index) => {
              const offset = index - activeIndex;
              const isActive = index === activeIndex;
              const isPrev = offset === -1 || (activeIndex === 0 && index === FEATURED_TEMPLATES.length - 1);
              const isNext = offset === 1 || (activeIndex === FEATURED_TEMPLATES.length - 1 && index === 0);
              const isVisible = isActive || isPrev || isNext;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={template.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? "-60%" : "60%",
                    scale: isActive ? 1 : 0.75,
                    opacity: isActive ? 1 : 0.5,
                    zIndex: isActive ? 20 : 10,
                    rotateY: isActive ? 0 : isPrev ? 15 : -15,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute cursor-pointer"
                  onClick={() => !isActive && goTo(index)}
                  style={{ perspective: 1000 }}
                >
                  {/* Phone frame */}
                  <div className={cn(
                    "relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px] rounded-[3rem] p-3",
                    "bg-gradient-to-b from-zinc-700 to-zinc-900",
                    "shadow-2xl shadow-black/50",
                    isActive && "ring-2 ring-primary/50"
                  )}>
                    {/* Notch */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />
                    
                    {/* Screen */}
                    <div 
                      className="w-full h-full rounded-[2.5rem] overflow-hidden"
                      style={{ backgroundColor: template.theme.background }}
                    >
                      {/* Fake website content */}
                      <div className="h-full flex flex-col p-6 pt-10">
                        {/* Logo placeholder */}
                        <div 
                          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                          style={{ 
                            backgroundColor: `${template.theme.primary}20`,
                            color: template.theme.primary 
                          }}
                        >
                          $M
                        </div>
                        
                        {/* Title */}
                        <h3 
                          className="text-xl font-bold text-center mb-2"
                          style={{ color: template.theme.primary }}
                        >
                          MEMECOIN
                        </h3>
                        
                        {/* Tagline */}
                        <p className="text-center text-white/60 text-sm mb-6">
                          The next 100x gem on Solana
                        </p>
                        
                        {/* CTA button */}
                        <div 
                          className="mx-auto px-6 py-2 rounded-full text-sm font-semibold"
                          style={{ 
                            backgroundColor: template.theme.primary,
                            color: template.theme.background
                          }}
                        >
                          Buy Now
                        </div>
                        
                        {/* Stats row */}
                        <div className="mt-auto grid grid-cols-3 gap-2">
                          {["Supply", "Tax", "LP"].map((label) => (
                            <div 
                              key={label}
                              className="rounded-xl p-3 text-center"
                              style={{ backgroundColor: `${template.theme.primary}10` }}
                            >
                              <div 
                                className="text-lg font-bold"
                                style={{ color: template.theme.primary }}
                              >
                                {label === "Supply" ? "1B" : label === "Tax" ? "0%" : "🔒"}
                              </div>
                              <div className="text-[10px] text-white/40">{label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="hidden sm:flex shrink-0 h-12 w-12 rounded-full bg-card/50 hover:bg-card border border-border/50"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Template info + dots */}
        <div className="mt-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTemplate.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <h3 className="text-xl font-semibold">{currentTemplate.name}</h3>
              <p className="text-muted-foreground text-sm">{currentTemplate.tagline}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {FEATURED_TEMPLATES.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
