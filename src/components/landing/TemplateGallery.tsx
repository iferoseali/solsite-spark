import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Rocket, Flame, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const templates = [
  {
    id: 1,
    name: "Cosmic Degen",
    personality: "Chaotic & Bold",
    gradient: "from-purple-600 via-pink-500 to-orange-400",
    image: "https://images.unsplash.com/photo-1634017839464-5c339bbe3c08?q=80&w=800",
    icon: Rocket,
    description: "Maximum chaos energy for the boldest meme coins",
  },
  {
    id: 2,
    name: "Cyber Punk",
    personality: "Edgy & Futuristic",
    gradient: "from-cyan-500 via-blue-600 to-purple-700",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800",
    icon: Zap,
    description: "Neon-soaked aesthetics for tech-forward tokens",
  },
  {
    id: 3,
    name: "Meme Lord",
    personality: "Playful & Viral",
    gradient: "from-green-400 via-yellow-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
    icon: Flame,
    description: "Perfectly crafted for maximum meme potential",
  },
  {
    id: 4,
    name: "Diamond Hands",
    personality: "Premium & Confident",
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800",
    icon: Sparkles,
    description: "Elegant design for serious moon missions",
  },
];

const TemplateCard = ({ template, index }: { template: typeof templates[0]; index: number }) => {
  const Icon = template.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative"
    >
      <div className="relative h-[500px] w-[380px] overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-20 transition-opacity duration-500 group-hover:opacity-40`} />
        
        {/* Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={template.image}
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className={`mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${template.gradient} px-4 py-1.5`}>
            <Icon className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">{template.personality}</span>
          </div>
          
          <h3 className="mb-2 text-2xl font-bold text-foreground">{template.name}</h3>
          <p className="mb-4 text-sm text-muted-foreground">{template.description}</p>
          
          <Button 
            variant="outline" 
            className="w-full border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            Use Template
          </Button>
        </div>
        
        {/* Floating badge */}
        <div className="absolute right-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          #{index + 1} Popular
        </div>
      </div>
    </motion.div>
  );
};

export const TemplateGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
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
            Four stunning templates designed to make your meme coin stand out. Each one crafted for maximum impact.
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
              <TemplateCard key={template.id} template={template} index={index} />
            ))}
            {/* Duplicate for seamless scroll feel */}
            {templates.map((template, index) => (
              <TemplateCard key={`dup-${template.id}`} template={template} index={index} />
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
          <Button size="lg" variant="glow" className="text-lg">
            Explore All Templates
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
