import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Rocket, Flame, Sparkles, Zap, Crown, Code, Skull, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SOLSITE_TEMPLATE_REGISTRY, TemplateDefinition } from "@/lib/templateRegistry";

// Map template IDs to visual metadata
const templateMeta: Record<string, {
  icon: typeof Rocket;
  gradient: string;
  personality: string;
  description: string;
}> = {
  cult_minimal: {
    icon: Sparkles,
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    personality: "Minimal & Clean",
    description: "Sleek, focused design inspired by early Solana cult sites"
  },
  vc_pro: {
    icon: Crown,
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    personality: "Professional & VC-Ready",
    description: "Enterprise-grade aesthetics for serious token projects"
  },
  degen_meme: {
    icon: Flame,
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
    personality: "Chaotic & Viral",
    description: "Maximum meme energy for degenerate launches"
  },
  dark_cult: {
    icon: Skull,
    gradient: "from-red-600 via-red-700 to-black",
    personality: "Dark & Mysterious",
    description: "Lore-heavy narrative style for cult-like communities"
  },
  luxury_token: {
    icon: Crown,
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    personality: "Premium & Exclusive",
    description: "Gold-standard design for luxury token brands"
  },
  builder_utility: {
    icon: Code,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    personality: "Dev & Utility",
    description: "Clean technical aesthetics for builder tokens"
  }
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
    personality: "Custom",
    description: template.inspiration
  };
  const Icon = meta.icon;
  
  const previewUrl = `https://bzbxdiaqpbroxhcibtpm.supabase.co/functions/v1/render-site?preview=true&templateId=${template.template_id}`;
  
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
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-10 transition-opacity duration-500 group-hover:opacity-20`} />
        
        {/* Live Preview iframe */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 origin-top-left scale-[0.24] w-[1600px] h-[2100px]">
            <iframe
              src={previewUrl}
              className="w-full h-full border-0 pointer-events-none"
              title={`${template.name} preview`}
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
        
        {/* Hover overlay for preview */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer z-10"
          onClick={() => onPreview(template)}
        >
          <div className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground font-medium">
            <Eye className="h-4 w-4" />
            Preview
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
        <div className="absolute right-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm z-20">
          #{index + 1} Popular
        </div>
      </div>
    </motion.div>
  );
};

// Preview Modal Component
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
        
        {/* iframe Preview */}
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          title={`${template.name} full preview`}
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
          <div className="relative">
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
              {/* Duplicate for seamless scroll feel */}
              {templates.map((template, index) => (
                <TemplateCard 
                  key={`dup-${template.template_id}`} 
                  template={template} 
                  index={index + templates.length}
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
