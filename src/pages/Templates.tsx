import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Check, Eye, Sparkles, X, Columns, 
  Search, Heart, Grid3X3, List, SlidersHorizontal,
  ArrowUpDown, ChevronDown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTemplateFavorites } from "@/hooks/useTemplateFavorites";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TemplateBlueprint {
  id: string;
  name: string;
  personality: string;
  layout_category: string;
  styles: {
    background?: string;
    primary?: string;
    text?: string;
  };
  sections: unknown[];
  animations: Record<string, string>;
  is_active: boolean;
}

// Map blueprint names to render-site templateId
const templateIdMap: Record<string, string> = {
  "Cult Minimal": "cult_minimal",
  "VC Grade Pro": "vc_pro",
  "Degenerate Meme": "degen_meme",
  "Dark Cult Narrative": "dark_cult",
  "Luxury Token": "luxury_token",
  "Builder Utility": "builder_utility",
  "Neo Grid": "neo_grid",
  "Scroll Story": "scroll_story",
  "Web3 Gaming": "web3_gaming",
  "AI Crypto": "ai_crypto",
  "DAO Portal": "dao_portal",
  "Ultra Brutalist": "ultra_brutalist",
  "Infra Terminal": "infra_terminal",
  "Social First": "social_first",
  "Futuristic 3D": "futuristic_3d",
};

// Template categories for filtering
type Category = "all" | "meme" | "professional" | "gaming" | "tech" | "minimal" | "community";

const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "meme", label: "Meme", emoji: "🚀" },
  { id: "professional", label: "Pro", emoji: "💼" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "tech", label: "Tech", emoji: "🤖" },
  { id: "minimal", label: "Minimal", emoji: "⚡" },
  { id: "community", label: "Community", emoji: "💬" },
];

type SortOption = "name" | "newest" | "popular";

const sortOptions: { id: SortOption; label: string }[] = [
  { id: "name", label: "Name A-Z" },
  { id: "newest", label: "Newest First" },
  { id: "popular", label: "Most Popular" },
];

// Template metadata with category
const templateMeta: Record<string, { emoji: string; tagline: string; features: string[]; category: Category; popularity: number }> = {
  "cult_minimal": { emoji: "⚡", tagline: "Stark, glitchy, monospace aesthetic for cult followings", features: ["Matrix rain effect", "Glitch text animation", "Neon green accents"], category: "minimal", popularity: 85 },
  "vc_pro": { emoji: "💼", tagline: "Clean, professional design that screams legitimacy", features: ["Gradient orb backgrounds", "Glass morphism cards", "Split hero layout"], category: "professional", popularity: 92 },
  "degen_meme": { emoji: "🚀", tagline: "Wild, chaotic energy for maximum degen appeal", features: ["Floating emoji particles", "Shake animations", "Giant ticker display"], category: "meme", popularity: 98 },
  "dark_cult": { emoji: "🌙", tagline: "Mysterious, moody atmosphere for lore-heavy projects", features: ["Fog particle effects", "Serif typography", "Blood red accents"], category: "minimal", popularity: 78 },
  "luxury_token": { emoji: "👑", tagline: "Elegant, refined design for premium positioning", features: ["Gold dust particles", "Shimmer text effects", "Minimal layout"], category: "professional", popularity: 88 },
  "builder_utility": { emoji: "⚙️", tagline: "Terminal-inspired design for utility-focused tokens", features: ["Grid line background", "Monospace fonts", "Dev-focused aesthetic"], category: "tech", popularity: 72 },
  "neo_grid": { emoji: "⬡", tagline: "Modern bento grid layout inspired by zkSync & Starknet", features: ["Cyber grid background", "Bento card layout", "Stagger animations"], category: "tech", popularity: 90 },
  "scroll_story": { emoji: "📜", tagline: "Minimal narrative scroll for story-driven launches", features: ["Full-screen text", "Scroll reveal effects", "Serif typography"], category: "minimal", popularity: 65 },
  "web3_gaming": { emoji: "🎮", tagline: "Neon arcade aesthetic for gaming tokens", features: ["Scanline overlay", "Neon glow effects", "Media-left hero"], category: "gaming", popularity: 82 },
  "ai_crypto": { emoji: "🤖", tagline: "Futuristic glow design for AI & tech projects", features: ["Neural network bg", "Glowing rings", "Tech-forward look"], category: "tech", popularity: 95 },
  "dao_portal": { emoji: "⬢", tagline: "Dashboard-style layout for governance tokens", features: ["Stats display", "Purple accents", "Clean governance UI"], category: "community", popularity: 70 },
  "ultra_brutalist": { emoji: "◼", tagline: "Raw anti-design for maximum contrast", features: ["Black & white only", "No animations", "Bold typography"], category: "minimal", popularity: 60 },
  "infra_terminal": { emoji: "💻", tagline: "CLI-inspired design for infrastructure projects", features: ["Terminal window", "Typing animation", "Matrix effect"], category: "tech", popularity: 75 },
  "social_first": { emoji: "💬", tagline: "Community-focused design with warm tones", features: ["Avatar focus", "Social proof", "Yellow accents"], category: "community", popularity: 68 },
  "futuristic_3d": { emoji: "🌌", tagline: "Immersive holographic design for premium launches", features: ["3D space bg", "Floating shapes", "Hologram buttons"], category: "professional", popularity: 87 },
};

const TemplateCard = ({
  template,
  templateId,
  isSelected,
  onSelect,
  isComparing,
  onToggleCompare,
  compareCount,
  isFavorite,
  onToggleFavorite,
  viewMode,
  index,
}: {
  template: TemplateBlueprint;
  templateId: string;
  isSelected: boolean;
  onSelect: () => void;
  isComparing: boolean;
  onToggleCompare: () => void;
  compareCount: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  viewMode: "grid" | "list";
  index: number;
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [thumbnailHtml, setThumbnailHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&templateId=${templateId}`;
  const meta = templateMeta[templateId] || { emoji: "🎨", tagline: "Custom template", features: [], category: "all" as Category, popularity: 50 };

  useEffect(() => {
    const key = `tplthumb:v4:${templateId}`;
    const fromCache = (() => {
      try { return localStorage.getItem(key); } catch { return null; }
    })();

    if (fromCache) {
      setThumbnailHtml(fromCache);
      setThumbnailLoaded(true);
      return;
    }

    const loadThumbnail = async () => {
      try {
        const response = await fetch(previewUrl);
        const html = await response.text();
        setThumbnailHtml(html);
        setThumbnailLoaded(true);
        try { localStorage.setItem(key, html); } catch { /* ignore */ }
      } catch (error) {
        console.error("Error loading thumbnail:", error);
      }
    };
    loadThumbnail();
  }, [previewUrl, templateId]);

  const loadPreview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(previewUrl);
      const html = await response.text();
      setPreviewHtml(html);
    } catch (error) {
      console.error("Error loading preview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        onClick={onSelect}
        className={`group relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 bg-card border ${
          isSelected
            ? "border-primary shadow-lg shadow-primary/20"
            : isComparing
            ? "border-accent shadow-md shadow-accent/10"
            : "border-border hover:border-primary/50 hover:shadow-md"
        }`}
      >
        {/* Thumbnail */}
        <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/50">
          {thumbnailLoaded && thumbnailHtml ? (
            <div className="w-full h-full relative overflow-hidden">
              <div className="absolute inset-0 origin-top-left" style={{ transform: "scale(0.15)", width: "667%", height: "667%" }}>
                <iframe srcDoc={thumbnailHtml} className="w-full h-full border-0 pointer-events-none" title={`Thumbnail: ${template.name}`} sandbox="allow-scripts" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full" style={{ background: `linear-gradient(135deg, ${template.styles?.primary || "#00d4ff"}, ${template.styles?.background || "#0a0a0a"})` }} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{meta.emoji}</span>
            <h3 className="font-semibold text-foreground truncate">{template.name}</h3>
            {isFavorite && <Heart className="w-4 h-4 fill-red-500 text-red-500" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{meta.tagline}</p>
          <div className="flex flex-wrap gap-1">
            {meta.features.slice(0, 3).map((feature, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{feature}</span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${isComparing ? "text-accent" : "text-muted-foreground"}`}
            onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
            disabled={compareCount >= 3 && !isComparing}
          >
            <Columns className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={(e) => { e.stopPropagation(); setShowPreview(true); loadPreview(); }}
          >
            <Eye className="w-3 h-3" />
            Preview
          </Button>
          <Link to={`/builder?templateId=${templateId}&blueprintId=${template.id}`} onClick={(e) => e.stopPropagation()}>
            <Button variant="glow" size="sm" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Use
            </Button>
          </Link>
        </div>

        {/* Preview modal (same as grid) */}
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { e.stopPropagation(); setShowPreview(false); }}>
            <div className="relative w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden bg-background border border-border shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Link to={`/builder?templateId=${templateId}&blueprintId=${template.id}`}>
                  <Button variant="glow" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Use This Template
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>Close</Button>
              </div>
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : previewHtml ? (
                <iframe srcDoc={previewHtml} className="w-full h-full border-0" title={`Preview: ${template.name}`} sandbox="allow-scripts" />
              ) : null}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
        isSelected
          ? "ring-2 ring-primary shadow-2xl shadow-primary/30 scale-[1.02]"
          : isComparing
          ? "ring-2 ring-accent shadow-xl shadow-accent/20"
          : "hover:ring-1 hover:ring-primary/50 hover:shadow-xl"
      }`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(135deg, ${template.styles?.background || "#0a0a0a"} 0%, ${template.styles?.primary || "#00d4ff"}20 100%)`,
        }}
      />

      {/* Top actions */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
          className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
            isComparing
              ? "bg-accent border-accent text-accent-foreground"
              : "bg-black/40 border-white/30 text-white/60 hover:border-white/60"
          } ${compareCount >= 3 && !isComparing ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={compareCount >= 3 && !isComparing}
        >
          {isComparing ? <Check className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
        </button>
        
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="w-8 h-8 rounded-lg bg-black/40 border-2 border-white/30 flex items-center justify-center transition-all hover:border-white/60"
        >
          <Heart className={`w-4 h-4 transition-all ${isFavorite ? "fill-red-500 text-red-500" : "text-white/60"}`} />
        </button>
      </div>

      {/* Preview thumbnail */}
      <div className="relative aspect-[4/5] p-4">
        <div className="w-full h-full rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-black/30 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <div className="flex-1 mx-3 h-4 rounded bg-white/5 flex items-center px-2">
              <span className="text-[8px] text-white/40 truncate">solsite.xyz/preview</span>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
            {thumbnailLoaded && thumbnailHtml ? (
              <div className="absolute inset-0 origin-top-left" style={{ transform: "scale(0.22)", width: "455%", height: "455%" }}>
                <iframe srcDoc={thumbnailHtml} className="w-full h-full border-0 pointer-events-none" title={`Thumbnail: ${template.name}`} sandbox="allow-scripts" />
              </div>
            ) : (
              <div className="flex-1 p-3 flex flex-col gap-2 animate-pulse h-full items-center justify-center">
                <div className="w-16 h-16 rounded-full" style={{ background: `linear-gradient(135deg, ${template.styles?.primary || "#00d4ff"}, ${template.styles?.background || "#0a0a0a"})` }} />
                <div className="w-24 h-3 rounded bg-white/20" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-14 right-5 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <Check className="w-5 h-5 text-primary-foreground" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            setShowPreview(true);
            loadPreview();
          }}
        >
          <Eye className="w-4 h-4" />
          Full Preview
        </Button>
      </div>

      {/* Label section */}
      <div className="relative p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent -mt-8 pt-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{meta.emoji}</span>
          <h3 className="font-bold text-lg text-white">{template.name}</h3>
        </div>
        <p className="text-sm text-white/60 mb-3 line-clamp-2">{meta.tagline}</p>
        <div className="flex flex-wrap gap-1.5">
          {meta.features.slice(0, 2).map((feature, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">{feature}</span>
          ))}
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { e.stopPropagation(); setShowPreview(false); }}>
          <div className="relative w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden bg-background border border-border shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Link to={`/builder?templateId=${templateId}&blueprintId=${template.id}`}>
                <Button variant="glow" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Use This Template
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>Close</Button>
            </div>
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : previewHtml ? (
              <iframe srcDoc={previewHtml} className="w-full h-full border-0" title={`Preview: ${template.name}`} sandbox="allow-scripts" />
            ) : null}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Comparison View Component
const ComparisonView = ({
  templates,
  compareIds,
  onRemove,
  onClose,
}: {
  templates: TemplateBlueprint[];
  compareIds: string[];
  onRemove: (id: string) => void;
  onClose: () => void;
}) => {
  const compareTemplates = templates.filter((t) => compareIds.includes(t.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Columns className="w-5 h-5 text-primary" />
          Compare Templates ({compareTemplates.length})
        </h2>
        <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
          <X className="w-4 h-4" />
          Close
        </Button>
      </div>

      {/* Comparison Grid */}
      <div className="flex-1 overflow-hidden p-4">
        <div className={`grid h-full gap-4 ${compareTemplates.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {compareTemplates.map((template) => {
            const templateId = templateIdMap[template.name] || "cult_minimal";
            const meta = templateMeta[templateId] || { emoji: "🎨", tagline: "", features: [], category: "all" as Category, popularity: 50 };
            const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&templateId=${templateId}`;

            return (
              <motion.div 
                key={template.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col rounded-xl overflow-hidden border border-border bg-card"
              >
                {/* Template header */}
                <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="font-semibold">{template.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/builder?templateId=${templateId}&blueprintId=${template.id}`}>
                      <Button variant="glow" size="sm" className="gap-1">
                        <Sparkles className="w-3 h-3" />
                        Use
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => onRemove(template.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Live preview iframe */}
                <div className="flex-1 relative">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title={`Compare: ${template.name}`}
                    sandbox="allow-scripts"
                  />
                </div>

                {/* Features footer */}
                <div className="p-3 border-t border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">{meta.tagline}</p>
                  <div className="flex flex-wrap gap-1">
                    {meta.features.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{f}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const Templates = () => {
  const [templates, setTemplates] = useState<TemplateBlueprint[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategories, setActiveCategories] = useState<Category[]>(["all"]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useTemplateFavorites();

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("template_blueprints")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (data && !error) {
        setTemplates(data as TemplateBlueprint[]);
      }
      setIsLoading(false);
    };
    fetchTemplates();
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("template-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleCategory = (cat: Category) => {
    if (cat === "all") {
      setActiveCategories(["all"]);
    } else {
      setActiveCategories((prev) => {
        const withoutAll = prev.filter((c) => c !== "all");
        if (withoutAll.includes(cat)) {
          const newCats = withoutAll.filter((c) => c !== cat);
          return newCats.length === 0 ? ["all"] : newCats;
        }
        return [...withoutAll, cat];
      });
    }
  };

  const filteredAndSortedTemplates = useMemo(() => {
    let result = templates;

    // Filter by favorites
    if (showFavoritesOnly) {
      result = result.filter((t) => isFavorite(t.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((t) => {
        const templateId = templateIdMap[t.name] || "cult_minimal";
        const meta = templateMeta[templateId];
        return (
          t.name.toLowerCase().includes(query) ||
          meta?.tagline.toLowerCase().includes(query) ||
          meta?.features.some((f) => f.toLowerCase().includes(query))
        );
      });
    }

    // Filter by categories
    if (!activeCategories.includes("all")) {
      result = result.filter((t) => {
        const templateId = templateIdMap[t.name] || "cult_minimal";
        const meta = templateMeta[templateId];
        return meta && activeCategories.includes(meta.category);
      });
    }

    // Sort
    result = [...result].sort((a, b) => {
      const aId = templateIdMap[a.name] || "cult_minimal";
      const bId = templateIdMap[b.name] || "cult_minimal";
      const aMeta = templateMeta[aId];
      const bMeta = templateMeta[bId];

      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return b.name.localeCompare(a.name); // Simplified, ideally use created_at
        case "popular":
          return (bMeta?.popularity || 0) - (aMeta?.popularity || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [templates, searchQuery, activeCategories, sortBy, showFavoritesOnly, isFavorite]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);
  const selectedTemplateId = selectedTemplateData ? templateIdMap[selectedTemplateData.name] || "cult_minimal" : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
              Choose Your <span className="text-gradient-primary">Template</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {templates.length} unique designs with distinct personalities, animations, and visual effects.
            </p>
          </motion.div>

          {/* Search & Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="template-search"
                placeholder="Search templates... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Favorites toggle */}
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="gap-1.5"
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
                <span className="hidden sm:inline">Favorites</span>
                {favorites.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">{favorites.length}</span>
                )}
              </Button>

              {/* Sort dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden sm:inline">Sort</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map((opt) => (
                    <DropdownMenuItem
                      key={opt.id}
                      onClick={() => setSortBy(opt.id)}
                      className={sortBy === opt.id ? "bg-accent" : ""}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View toggle */}
              <div className="flex items-center border border-border rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            {categories.map((cat) => {
              const isActive = cat.id === "all" ? activeCategories.includes("all") : activeCategories.includes(cat.id);
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(cat.id)}
                  className="gap-1.5"
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </Button>
              );
            })}
            {activeCategories.length > 1 || (activeCategories.length === 1 && !activeCategories.includes("all")) ? (
              <Button variant="ghost" size="sm" onClick={() => setActiveCategories(["all"])} className="text-muted-foreground">
                Clear filters
              </Button>
            ) : null}
          </motion.div>

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-4"
          >
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedTemplates.length} of {templates.length} templates
              {showFavoritesOnly && " (favorites only)"}
            </p>
          </motion.div>

          {/* Compare Bar */}
          <AnimatePresence>
            {compareIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="sticky top-20 z-30 mb-6"
              >
                <div className="glass rounded-xl p-3 flex items-center justify-between gap-4 border border-accent/30">
                  <div className="flex items-center gap-3">
                    <Columns className="w-5 h-5 text-accent" />
                    <span className="font-medium">{compareIds.length} template{compareIds.length > 1 ? "s" : ""} selected</span>
                    <span className="text-sm text-muted-foreground">(max 3)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setCompareIds([])}>
                      Clear
                    </Button>
                    <Button
                      variant="glow"
                      size="sm"
                      className="gap-2"
                      onClick={() => setShowComparison(true)}
                      disabled={compareIds.length < 2}
                    >
                      <Columns className="w-4 h-4" />
                      Compare Side by Side
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Template Grid/List */}
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                : "flex flex-col gap-3 mb-12"
              }>
                {filteredAndSortedTemplates.map((template, index) => {
                  const templateId = templateIdMap[template.name] || "cult_minimal";
                  return (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      templateId={templateId}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => setSelectedTemplate(template.id)}
                      isComparing={compareIds.includes(template.id)}
                      onToggleCompare={() => toggleCompare(template.id)}
                      compareCount={compareIds.length}
                      isFavorite={isFavorite(template.id)}
                      onToggleFavorite={() => toggleFavorite(template.id)}
                      viewMode={viewMode}
                      index={index}
                    />
                  );
                })}
              </div>

              {/* Empty state */}
              {filteredAndSortedTemplates.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-muted-foreground"
                >
                  {showFavoritesOnly ? (
                    <>
                      <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p className="mb-2">No favorite templates yet.</p>
                      <Button variant="link" onClick={() => setShowFavoritesOnly(false)}>View all templates</Button>
                    </>
                  ) : searchQuery ? (
                    <>
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p className="mb-2">No templates match "{searchQuery}"</p>
                      <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
                    </>
                  ) : (
                    <>
                      <p>No templates in this category yet.</p>
                      <Button variant="link" onClick={() => setActiveCategories(["all"])}>View all templates</Button>
                    </>
                  )}
                </motion.div>
              )}
            </>
          )}

          {/* Floating CTA */}
          <AnimatePresence>
            {selectedTemplate && selectedTemplateData && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
              >
                <div className="glass rounded-2xl p-4 shadow-2xl border border-primary/30 flex items-center gap-4">
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <span className="text-xl">{templateMeta[selectedTemplateId || ""]?.emoji || "🎨"}</span>
                      {selectedTemplateData.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Click to start building your site</p>
                  </div>
                  <Link to={`/builder?templateId=${selectedTemplateId}&blueprintId=${selectedTemplate}`}>
                    <Button variant="glow" className="gap-2">
                      Use Template
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && compareIds.length >= 2 && (
          <ComparisonView
            templates={templates}
            compareIds={compareIds}
            onRemove={(id) => {
              const newIds = compareIds.filter((x) => x !== id);
              setCompareIds(newIds);
              if (newIds.length < 2) setShowComparison(false);
            }}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Templates;
