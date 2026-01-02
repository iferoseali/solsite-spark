import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Users, Globe, TrendingUp, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ShowcaseProject {
  id: string;
  coin_name: string;
  ticker: string;
  tagline: string | null;
  logo_url: string | null;
  subdomain: string | null;
  category?: string;
}

const categories = [
  { id: "all", label: "All", icon: Globe },
  { id: "memecoin", label: "Memecoin", icon: Sparkles },
  { id: "defi", label: "DeFi", icon: TrendingUp },
  { id: "nft", label: "NFT", icon: Users },
];

const categoryColors: Record<string, string> = {
  memecoin: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  defi: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  nft: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

// Mock category assignment based on coin name patterns
const assignCategory = (coinName: string): string => {
  const name = coinName.toLowerCase();
  if (name.includes("swap") || name.includes("fi") || name.includes("yield")) return "defi";
  if (name.includes("nft") || name.includes("art") || name.includes("punk")) return "nft";
  return "memecoin";
};

const ShowcaseCard = ({ project }: { project: ShowcaseProject }) => {
  const category = project.category || assignCategory(project.coin_name);
  const siteUrl = project.subdomain 
    ? `https://${project.subdomain}.solsite.fun`
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Screenshot preview area */}
      <div className="aspect-[16/10] relative bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
        {/* Mock browser chrome */}
        <div className="absolute top-0 inset-x-0 h-8 bg-background/80 backdrop-blur-sm border-b border-border/50 flex items-center px-3 gap-1.5 z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <div className="flex-1 mx-3 h-4 rounded-md bg-muted/50 flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
              {project.subdomain}.solsite.fun
            </span>
          </div>
        </div>
        
        {/* Site preview content - mock for now */}
        <div className="absolute inset-0 pt-8 flex flex-col items-center justify-center p-6 text-center">
          {project.logo_url ? (
            <img 
              src={project.logo_url} 
              alt={project.coin_name}
              className="w-16 h-16 rounded-full object-cover mb-3 ring-2 ring-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3 ring-2 ring-border">
              <span className="text-2xl font-bold text-primary">
                {project.coin_name.charAt(0)}
              </span>
            </div>
          )}
          <h3 className="text-lg font-bold">{project.coin_name}</h3>
          <span className="text-sm text-muted-foreground">${project.ticker}</span>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {siteUrl && (
            <Button variant="glow" size="sm" asChild>
              <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Site
              </a>
            </Button>
          )}
        </div>
      </div>
      
      {/* Card footer */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{project.coin_name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {project.tagline || `The home of $${project.ticker}`}
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={cn("shrink-0 text-xs capitalize", categoryColors[category])}
          >
            {category}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

const ShowcaseCardSkeleton = () => (
  <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
    <Skeleton className="aspect-[16/10]" />
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

export default function Showcase() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["showcase-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, coin_name, ticker, tagline, logo_url, subdomain")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(24);

      if (error) throw error;
      return data as ShowcaseProject[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (selectedCategory === "all") return projects;
    return projects.filter(p => assignCategory(p.coin_name) === selectedCategory);
  }, [projects, selectedCategory]);

  const stats = useMemo(() => ({
    total: projects?.length || 0,
    published: projects?.length || 0,
  }), [projects]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero section */}
        <section className="container px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-4">
              <Globe className="w-3 h-3 mr-1" />
              Community Showcase
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Explore Live Sites
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover what the community is building with Solsite. Get inspired by real projects launched on our platform.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.total}+</div>
                <div className="text-sm text-muted-foreground">Sites Created</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.published}</div>
                <div className="text-sm text-muted-foreground">Live Now</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Category filters */}
        <section className="container px-4 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "gap-2 transition-all",
                    isActive && "shadow-lg shadow-primary/20"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </section>

        {/* Projects grid */}
        <section className="container px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ShowcaseCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No sites found</h3>
              <p className="text-muted-foreground mb-6">
                {selectedCategory === "all" 
                  ? "Be the first to publish your site!"
                  : "No sites in this category yet."}
              </p>
              <Button variant="glow" asChild>
                <a href="/builder">Create Your Site</a>
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <ShowcaseCard key={project.id} project={project} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}
