import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Rocket, Flame, Sparkles, Zap, Crown, Code, Skull, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SOLSITE_TEMPLATE_REGISTRY, type TemplateDefinition } from "@/lib/templates";

// Map template IDs to visual metadata with brand-matched colors
const templateMeta: Record<string, {
  icon: typeof Rocket;
  gradient: string;
  bgGradient: string;
  personality: string;
  description: string;
  accentColor: string;
  isPremium?: boolean;
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
  },
  // Premium Templates
  premium_genesis_pump: {
    icon: Rocket,
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    bgGradient: "from-[#0A0A0A] to-[#0a1a0a]",
    personality: "Premium • Genesis",
    description: "High-energy animated gradient for memecoin launches",
    accentColor: "#14F195",
    isPremium: true,
    mockupStyle: { bg: "#0A0A0A", primary: "#14F195", text: "#ffffff" }
  },
  premium_velocity_dark: {
    icon: Zap,
    gradient: "from-gray-100 via-gray-300 to-gray-500",
    bgGradient: "from-[#000000] to-[#111111]",
    personality: "Premium • Velocity",
    description: "Ultra-clean minimal dark design for serious projects",
    accentColor: "#FFFFFF",
    isPremium: true,
    mockupStyle: { bg: "#000000", primary: "#FFFFFF", text: "#ffffff" }
  },
  premium_meme_matrix: {
    icon: Sparkles,
    gradient: "from-cyan-400 via-teal-500 to-fuchsia-600",
    bgGradient: "from-[#0A0A0A] to-[#0a0a1a]",
    personality: "Premium • Matrix",
    description: "Neon cyberpunk aesthetic for viral meme tokens",
    accentColor: "#00FFCC",
    isPremium: true,
    mockupStyle: { bg: "#0A0A0A", primary: "#00FFCC", text: "#ffffff" }
  },
  premium_orbit_launchpad: {
    icon: Rocket,
    gradient: "from-emerald-400 via-cyan-500 to-blue-600",
    bgGradient: "from-[#0A0F1A] to-[#0a1a2a]",
    personality: "Premium • Orbit",
    description: "Glassmorphism design for startup launches",
    accentColor: "#14F195",
    isPremium: true,
    mockupStyle: { bg: "#0A0F1A", primary: "#14F195", text: "#ffffff" }
  },
  premium_stealth_drop: {
    icon: Eye,
    gradient: "from-gray-400 via-gray-600 to-emerald-600",
    bgGradient: "from-[#0A0A0A] to-[#111111]",
    personality: "Premium • Stealth",
    description: "Mysterious blackout design for stealth launches",
    accentColor: "#14F195",
    isPremium: true,
    mockupStyle: { bg: "#0A0A0A", primary: "#14F195", text: "#ffffff" }
  },
  premium_pump_fun_hero: {
    icon: Flame,
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    bgGradient: "from-[#0A0A0A] to-[#0a1a0a]",
    personality: "Premium • Pump.fun",
    description: "Terminal-style pump.fun inspired design",
    accentColor: "#14F195",
    isPremium: true,
    mockupStyle: { bg: "#0A0A0A", primary: "#14F195", text: "#ffffff" }
  },
  premium_chart_maxi: {
    icon: Zap,
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    bgGradient: "from-[#0A0A0A] to-[#0a1a0a]",
    personality: "Premium • Chart",
    description: "Chart-focused design for degenerate traders",
    accentColor: "#00FF00",
    isPremium: true,
    mockupStyle: { bg: "#0A0A0A", primary: "#00FF00", text: "#ffffff" }
  },
  premium_zero_info: {
    icon: Skull,
    gradient: "from-gray-100 via-gray-400 to-gray-600",
    bgGradient: "from-[#000000] to-[#0a0a0a]",
    personality: "Premium • Zero",
    description: "Ultra-minimal brutalist design with no distractions",
    accentColor: "#FFFFFF",
    isPremium: true,
    mockupStyle: { bg: "#000000", primary: "#FFFFFF", text: "#ffffff" }
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
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: `${accentColor}20` }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full" style={{ background: accentColor }} />
          <div className="w-16 h-2 rounded" style={{ background: `${mockupStyle.text}30` }} />
        </div>
        <div className="flex gap-2">
          <div className="w-12 h-2 rounded" style={{ background: `${mockupStyle.text}20` }} />
          <div className="w-12 h-2 rounded" style={{ background: `${mockupStyle.text}20` }} />
          <div className="w-16 h-5 rounded-full" style={{ background: accentColor }} />
        </div>
      </div>
      
      {/* Mock hero section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-30"
          style={{ background: accentColor }}
        />
        
        {/* Mock logo */}
        <div 
          className="w-16 h-16 rounded-2xl mb-4 relative z-10"
          style={{ background: `${accentColor}30`, border: `2px solid ${accentColor}` }}
        />
        
        {/* Mock title */}
        <div className="w-32 h-4 rounded mb-2 relative z-10" style={{ background: mockupStyle.text }} />
        <div className="w-24 h-3 rounded mb-4 relative z-10" style={{ background: accentColor }} />
        
        {/* Mock description */}
        <div className="w-40 h-2 rounded mb-1 relative z-10" style={{ background: `${mockupStyle.text}40` }} />
        <div className="w-32 h-2 rounded mb-4 relative z-10" style={{ background: `${mockupStyle.text}30` }} />
        
        {/* Mock button */}
        <div 
          className="w-24 h-6 rounded-full relative z-10"
          style={{ background: accentColor }}
        />
      </div>
      
      {/* Mock stats section */}
      <div className="flex justify-center gap-4 py-4 border-t" style={{ borderColor: `${accentColor}20` }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-8 h-2 rounded mb-1" style={{ background: accentColor }} />
            <div className="w-12 h-1.5 rounded" style={{ background: `${mockupStyle.text}30` }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const TemplateCard = ({ 
  template, 
  index,
  onPreview 
}: { 
  template: TemplateDefinition; 
  index: number;
  onPreview: (template: TemplateDefinition) => void;
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
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative flex-shrink-0"
    >
      <div className="relative h-[520px] w-[380px] overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-5 transition-opacity duration-500 group-hover:opacity-15`} />
        
        {/* Static Preview Mockup */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${meta.bgGradient}`}>
            <MockPreview meta={meta} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        {/* Hover overlay for preview */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer z-10"
          onClick={() => onPreview(template)}
        >
          <div className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground font-medium">
            <Eye className="h-4 w-4" />
            Live Preview
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 z-20">
          <div className={`mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${meta.gradient} px-4 py-1.5`}>
            <Icon className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">{meta.personality}</span>
          </div>
          
          <h3 className="mb-2 text-2xl font-bold text-foreground">{template.name}</h3>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{meta.description}</p>
          
          <Link to={`/builder?templateId=${template.template_id}`}>
            <Button 
              variant="outline" 
              className="w-full border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              Use Template
            </Button>
          </Link>
        </div>
        
        {/* Floating badge */}
        <div className="absolute right-4 top-4 flex items-center gap-2 z-20">
          {meta.isPremium && (
            <div className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1 text-xs font-semibold text-black">
              Premium
            </div>
          )}
          <div className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            #{index + 1}
          </div>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-lg p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-background via-background/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${meta?.gradient || 'from-primary to-accent'} px-4 py-1.5`}>
              <span className="text-sm font-medium text-white">{template.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/builder?templateId=${template.template_id}`}>
              <Button variant="glow" size="sm">
                Use This Template
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* iframe Preview - opens in new window on click */}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  
  const templates = SOLSITE_TEMPLATE_REGISTRY.templates;

  return (
    <>
      <section ref={containerRef} className="relative overflow-hidden py-24" id="templates">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Template Gallery
            </span>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Choose Your <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Vibe</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {templates.length} stunning templates designed to make your meme coin stand out. Each one crafted for maximum impact.
            </p>
          </motion.div>

          {/* Horizontal scroll gallery */}
          <div className="relative overflow-hidden">
            {/* Gradient fades */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
            
            <motion.div 
              style={{ x }}
              className="flex gap-8 pb-8"
            >
              {templates.map((template, index) => (
                <TemplateCard 
                  key={template.template_id} 
                  template={template} 
                  index={index}
                  onPreview={setSelectedTemplate}
                />
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link to="/templates">
              <Button size="lg" variant="glow" className="text-lg">
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
