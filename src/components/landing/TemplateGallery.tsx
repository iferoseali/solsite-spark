import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Rocket, Flame, Sparkles, Zap, Crown, Code, Skull, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SOLSITE_TEMPLATE_REGISTRY, type TemplateDefinition } from "@/lib/templates";
import { useIsMobile } from "@/hooks/use-mobile";

// Map template IDs to visual metadata with brand-matched colors
const templateMeta: Record<string, {
  icon: typeof Rocket;
  gradient: string;
  bgGradient: string;
  personality: string;
  description: string;
  accentColor: string;
  mockupStyle: {
    bg: string;
    primary: string;
    text: string;
  };
}> = {
  cult_minimal: {
    icon: Sparkles,
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    bgGradient: "from-[#0b0b0b] to-[#111]",
    personality: "Minimal & Clean",
    description: "Sleek, focused design inspired by early Solana cult sites",
    accentColor: "#a6ff00",
    mockupStyle: { bg: "#0b0b0b", primary: "#a6ff00", text: "#ffffff" }
  },
  vc_pro: {
    icon: Crown,
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    bgGradient: "from-[#0e1117] to-[#1a1f2e]",
    personality: "Professional & VC-Ready",
    description: "Enterprise-grade aesthetics for serious token projects",
    accentColor: "#5da9ff",
    mockupStyle: { bg: "#0e1117", primary: "#5da9ff", text: "#e6e6e6" }
  },
  degen_meme: {
    icon: Flame,
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
    bgGradient: "from-[#120018] to-[#1a0025]",
    personality: "Chaotic & Viral",
    description: "Maximum meme energy for degenerate launches",
    accentColor: "#ff4fd8",
    mockupStyle: { bg: "#120018", primary: "#ff4fd8", text: "#ffffff" }
  },
  dark_cult: {
    icon: Skull,
    gradient: "from-red-600 via-red-700 to-red-900",
    bgGradient: "from-[#050505] to-[#0a0808]",
    personality: "Dark & Mysterious",
    description: "Lore-heavy narrative style for cult-like communities",
    accentColor: "#ff0000",
    mockupStyle: { bg: "#050505", primary: "#ff0000", text: "#f5f5f5" }
  },
  luxury_token: {
    icon: Crown,
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    bgGradient: "from-[#0a0a0a] to-[#151510]",
    personality: "Premium & Exclusive",
    description: "Gold-standard design for luxury token brands",
    accentColor: "#d4af37",
    mockupStyle: { bg: "#0a0a0a", primary: "#d4af37", text: "#ffffff" }
  },
  builder_utility: {
    icon: Code,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    bgGradient: "from-[#0d1117] to-[#0d1a1a]",
    personality: "Dev & Utility",
    description: "Clean technical aesthetics for builder tokens",
    accentColor: "#00ffa3",
    mockupStyle: { bg: "#0d1117", primary: "#00ffa3", text: "#c9d1d9" }
  }
};

// Mock website preview component (static visual representation)
const MockPreview = ({ meta }: { meta: typeof templateMeta[string] }) => {
  const { mockupStyle, accentColor } = meta;
  
  return (
    <div 
      className="w-full h-full flex flex-col"
      style={{ background: mockupStyle.bg }}
    >
      {/* Mock navbar */}
      <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b" style={{ borderColor: `${accentColor}20` }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full" style={{ background: accentColor }} />
          <div className="w-12 md:w-16 h-2 rounded" style={{ background: `${mockupStyle.text}30` }} />
        </div>
        <div className="hidden md:flex gap-2">
          <div className="w-12 h-2 rounded" style={{ background: `${mockupStyle.text}20` }} />
          <div className="w-12 h-2 rounded" style={{ background: `${mockupStyle.text}20` }} />
          <div className="w-16 h-5 rounded-full" style={{ background: accentColor }} />
        </div>
      </div>
      
      {/* Mock hero section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
        {/* Background glow */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 md:w-48 h-32 md:h-48 rounded-full blur-3xl opacity-30"
          style={{ background: accentColor }}
        />
        
        {/* Mock logo */}
        <div 
          className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl mb-3 md:mb-4 relative z-10"
          style={{ background: `${accentColor}30`, border: `2px solid ${accentColor}` }}
        />
        
        {/* Mock title */}
        <div className="w-24 md:w-32 h-3 md:h-4 rounded mb-2 relative z-10" style={{ background: mockupStyle.text }} />
        <div className="w-20 md:w-24 h-2 md:h-3 rounded mb-3 md:mb-4 relative z-10" style={{ background: accentColor }} />
        
        {/* Mock description */}
        <div className="w-32 md:w-40 h-2 rounded mb-1 relative z-10" style={{ background: `${mockupStyle.text}40` }} />
        <div className="w-24 md:w-32 h-2 rounded mb-3 md:mb-4 relative z-10" style={{ background: `${mockupStyle.text}30` }} />
        
        {/* Mock button */}
        <div 
          className="w-20 md:w-24 h-5 md:h-6 rounded-full relative z-10"
          style={{ background: accentColor }}
        />
      </div>
      
      {/* Mock stats section */}
      <div className="flex justify-center gap-3 md:gap-4 py-3 md:py-4 border-t" style={{ borderColor: `${accentColor}20` }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-6 md:w-8 h-2 rounded mb-1" style={{ background: accentColor }} />
            <div className="w-10 md:w-12 h-1.5 rounded" style={{ background: `${mockupStyle.text}30` }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const TemplateCard = ({ 
  template, 
  index,
  onPreview,
  isMobile
}: { 
  template: TemplateDefinition; 
  index: number;
  onPreview: (template: TemplateDefinition) => void;
  isMobile: boolean;
}) => {
  const meta = templateMeta[template.template_id] || {
    icon: Sparkles,
    gradient: "from-primary to-accent",
    bgGradient: "from-background to-card",
    personality: "Custom",
    description: template.inspiration,
    accentColor: "#00d4ff",
    mockupStyle: { bg: "#0a0f1a", primary: "#00d4ff", text: "#ffffff" }
  };
  const Icon = meta.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: isMobile ? 0 : index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex-shrink-0 snap-center"
    >
      <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 ${
        isMobile ? 'h-[400px] w-[280px]' : 'h-[520px] w-[380px]'
      }`}>
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-5 transition-opacity duration-500 group-hover:opacity-15`} />
        
        {/* Static Preview Mockup */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${meta.bgGradient}`}>
            <MockPreview meta={meta} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        {/* Hover overlay for preview - only on desktop */}
        {!isMobile && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer z-10"
            onClick={() => onPreview(template)}
          >
            <div className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground font-medium">
              <Eye className="h-4 w-4" />
              Live Preview
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 z-20">
          <div className={`mb-3 md:mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${meta.gradient} px-3 md:px-4 py-1 md:py-1.5`}>
            <Icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
            <span className="text-xs md:text-sm font-medium text-white">{meta.personality}</span>
          </div>
          
          <h3 className="mb-2 text-xl md:text-2xl font-bold text-foreground">{template.name}</h3>
          <p className="mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground line-clamp-2">{meta.description}</p>
          
          <div className="flex gap-2">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onPreview(template)}
                className="border border-border/50"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Link to={`/builder?templateId=${template.template_id}`} className="flex-1">
              <Button 
                variant="outline" 
                className={`w-full border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary ${
                  isMobile ? 'text-sm py-2' : ''
                }`}
              >
                Use Template
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Floating badge */}
        <div className="absolute right-3 md:right-4 top-3 md:top-4 rounded-full bg-background/80 px-2 md:px-3 py-1 text-xs font-semibold backdrop-blur-sm z-20">
          #{index + 1} Popular
        </div>
      </div>
    </motion.div>
  );
};

// Preview Modal Component with live iframe
const PreviewModal = ({ 
  template, 
  onClose 
}: { 
  template: TemplateDefinition | null; 
  onClose: () => void;
}) => {
  if (!template) return null;
  
  const meta = templateMeta[template.template_id];
  const previewUrl = `https://bzbxdiaqpbroxhcibtpm.supabase.co/functions/v1/render-site?preview=true&templateId=${template.template_id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-lg p-2 md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-6xl h-[90vh] md:h-[85vh] rounded-xl md:rounded-2xl overflow-hidden border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-background via-background/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${meta?.gradient || 'from-primary to-accent'} px-3 md:px-4 py-1 md:py-1.5`}>
              <span className="text-xs md:text-sm font-medium text-white truncate max-w-[120px] md:max-w-none">{template.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link to={`/builder?templateId=${template.template_id}`}>
              <Button variant="glow" size="sm" className="text-xs md:text-sm">
                Use Template
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 md:h-10 md:w-10">
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
        
        {/* iframe Preview */}
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          title={`${template.name} full preview`}
          sandbox="allow-scripts allow-same-origin"
        />
      </motion.div>
    </motion.div>
  );
};

export const TemplateGallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isMobile = useIsMobile();
  
  const templates = SOLSITE_TEMPLATE_REGISTRY.templates;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = isMobile ? 300 : 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <section className="relative overflow-hidden py-16 md:py-24" id="templates">
        {/* Background effects - hidden on mobile for performance */}
        {!isMobile && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10 md:mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Template Gallery
            </span>
            <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground">
              Choose Your <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Vibe</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
              {templates.length} stunning templates designed to make your meme coin stand out.
            </p>
          </motion.div>

          {/* Horizontal scroll gallery with CSS-based scrolling */}
          <div className="relative">
            {/* Navigation arrows - hidden on mobile, users swipe instead */}
            {!isMobile && (
              <>
                <button
                  onClick={() => scroll('left')}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center transition-all duration-300 ${
                    canScrollLeft ? 'opacity-100 hover:bg-primary/20' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <ChevronLeft className="w-6 h-6 text-foreground" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center transition-all duration-300 ${
                    canScrollRight ? 'opacity-100 hover:bg-primary/20' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <ChevronRight className="w-6 h-6 text-foreground" />
                </button>
              </>
            )}
            
            {/* Gradient fades - smaller on mobile */}
            <div className={`pointer-events-none absolute left-0 top-0 z-10 h-full bg-gradient-to-r from-background to-transparent ${isMobile ? 'w-8' : 'w-24'}`} />
            <div className={`pointer-events-none absolute right-0 top-0 z-10 h-full bg-gradient-to-l from-background to-transparent ${isMobile ? 'w-8' : 'w-24'}`} />
            
            {/* Scrollable container with CSS snap */}
            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-4 md:gap-8 pb-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide touch-pan-x"
              style={{ 
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {/* Spacer for centered first item */}
              <div className={`flex-shrink-0 ${isMobile ? 'w-4' : 'w-12'}`} />
              
              {templates.map((template, index) => (
                <TemplateCard 
                  key={template.template_id} 
                  template={template} 
                  index={index}
                  onPreview={setSelectedTemplate}
                  isMobile={isMobile}
                />
              ))}
              
              {/* Spacer for centered last item */}
              <div className={`flex-shrink-0 ${isMobile ? 'w-4' : 'w-12'}`} />
            </div>
            
            {/* Scroll indicator for mobile */}
            {isMobile && (
              <div className="flex justify-center gap-1 mt-4">
                <span className="text-xs text-muted-foreground">← Swipe to explore →</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 md:mt-12 text-center"
          >
            <Link to="/templates">
              <Button size="lg" variant="glow" className="text-base md:text-lg">
                Explore All Templates
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Preview Modal */}
      {selectedTemplate && (
        <PreviewModal 
          template={selectedTemplate} 
          onClose={() => setSelectedTemplate(null)} 
        />
      )}
    </>
  );
};