import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Eye, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

// Template metadata for display
const templateMeta: Record<string, { emoji: string; tagline: string; features: string[] }> = {
  "cult_minimal": { emoji: "⚡", tagline: "Stark, glitchy, monospace aesthetic for cult followings", features: ["Matrix rain effect", "Glitch text animation", "Neon green accents"] },
  "vc_pro": { emoji: "💼", tagline: "Clean, professional design that screams legitimacy", features: ["Gradient orb backgrounds", "Glass morphism cards", "Split hero layout"] },
  "degen_meme": { emoji: "🚀", tagline: "Wild, chaotic energy for maximum degen appeal", features: ["Floating emoji particles", "Shake animations", "Giant ticker display"] },
  "dark_cult": { emoji: "🌙", tagline: "Mysterious, moody atmosphere for lore-heavy projects", features: ["Fog particle effects", "Serif typography", "Blood red accents"] },
  "luxury_token": { emoji: "👑", tagline: "Elegant, refined design for premium positioning", features: ["Gold dust particles", "Shimmer text effects", "Minimal layout"] },
  "builder_utility": { emoji: "⚙️", tagline: "Terminal-inspired design for utility-focused tokens", features: ["Grid line background", "Monospace fonts", "Dev-focused aesthetic"] },
  "neo_grid": { emoji: "⬡", tagline: "Modern bento grid layout inspired by zkSync & Starknet", features: ["Cyber grid background", "Bento card layout", "Stagger animations"] },
  "scroll_story": { emoji: "📜", tagline: "Minimal narrative scroll for story-driven launches", features: ["Full-screen text", "Scroll reveal effects", "Serif typography"] },
  "web3_gaming": { emoji: "🎮", tagline: "Neon arcade aesthetic for gaming tokens", features: ["Scanline overlay", "Neon glow effects", "Media-left hero"] },
  "ai_crypto": { emoji: "🤖", tagline: "Futuristic glow design for AI & tech projects", features: ["Neural network bg", "Glowing rings", "Tech-forward look"] },
  "dao_portal": { emoji: "⬢", tagline: "Dashboard-style layout for governance tokens", features: ["Stats display", "Purple accents", "Clean governance UI"] },
  "ultra_brutalist": { emoji: "◼", tagline: "Raw anti-design for maximum contrast", features: ["Black & white only", "No animations", "Bold typography"] },
  "infra_terminal": { emoji: "💻", tagline: "CLI-inspired design for infrastructure projects", features: ["Terminal window", "Typing animation", "Matrix effect"] },
  "social_first": { emoji: "💬", tagline: "Community-focused design with warm tones", features: ["Avatar focus", "Social proof", "Yellow accents"] },
  "futuristic_3d": { emoji: "🌌", tagline: "Immersive holographic design for premium launches", features: ["3D space bg", "Floating shapes", "Hologram buttons"] },
};

const TemplateCard = ({
  template,
  templateId,
  isSelected,
  onSelect,
}: {
  template: TemplateBlueprint;
  templateId: string;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [thumbnailHtml, setThumbnailHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&templateId=${templateId}`;
  const meta = templateMeta[templateId] || { emoji: "🎨", tagline: "Custom template", features: [] };

  // Load thumbnail on mount
  useEffect(() => {
    const key = `tplthumb:v3:${templateId}`;
    const fromCache = (() => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
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
        try {
          localStorage.setItem(key, html);
        } catch {
          // ignore quota / private mode
        }
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

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
        isSelected
          ? "ring-2 ring-primary shadow-2xl shadow-primary/30 scale-[1.02]"
          : "hover:ring-1 hover:ring-primary/50 hover:shadow-xl"
      }`}
    >
      {/* Background with template colors */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(135deg, ${template.styles?.background || "#0a0a0a"} 0%, ${template.styles?.primary || "#00d4ff"}20 100%)`,
        }}
      />

      {/* Live preview thumbnail */}
      <div className="relative aspect-[4/5] p-4">
        <div className="w-full h-full rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden flex flex-col">
          {/* Mini browser header */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-black/30 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <div className="flex-1 mx-3 h-4 rounded bg-white/5 flex items-center px-2">
              <span className="text-[8px] text-white/40 truncate">
                solsite.xyz/preview
              </span>
            </div>
          </div>

          {/* Actual website preview - scaled down */}
          <div className="flex-1 relative overflow-hidden">
            {thumbnailLoaded && thumbnailHtml ? (
              <div
                className="absolute inset-0 origin-top-left"
                style={{ transform: "scale(0.22)", width: "455%", height: "455%" }}
              >
                <iframe
                  srcDoc={thumbnailHtml}
                  className="w-full h-full border-0 pointer-events-none"
                  title={`Thumbnail: ${template.name}`}
                  sandbox="allow-scripts"
                />
              </div>
            ) : (
              <div className="flex-1 p-3 flex flex-col gap-2 animate-pulse h-full items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${template.styles?.primary || "#00d4ff"}, ${template.styles?.background || "#0a0a0a"})`,
                  }}
                />
                <div className="w-24 h-3 rounded bg-white/20" />
                <div className="w-32 h-2 rounded bg-white/10" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <Check className="w-5 h-5 text-primary-foreground" />
        </div>
      )}

      {/* Hover overlay with preview button */}
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
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setShowPreview(false);
          }}
        >
          <div
            className="relative w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden bg-background border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Link to={`/builder?templateId=${templateId}&blueprintId=${template.id}`}>
                <Button variant="glow" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Use This Template
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : previewHtml ? (
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                title={`Preview: ${template.name}`}
                sandbox="allow-scripts"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

const Templates = () => {
  const [templates, setTemplates] = useState<TemplateBlueprint[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);
  const selectedTemplateId = selectedTemplateData
    ? templateIdMap[selectedTemplateData.name] || "cult_minimal"
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
              Choose Your{" "}
              <span className="text-gradient-primary">Template</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              6 unique designs, each with distinct personality, animations, and visual effects.
              Pick the one that matches your coin's vibe.
            </p>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Template Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {templates.map((template) => {
                  const templateId = templateIdMap[template.name] || "cult_minimal";
                  return (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      templateId={templateId}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => setSelectedTemplate(template.id)}
                    />
                  );
                })}
              </div>

              {/* Empty state */}
              {templates.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <p>No templates available yet.</p>
                </div>
              )}
            </>
          )}

          {/* Floating CTA */}
          {selectedTemplate && selectedTemplateData && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
              <div className="glass rounded-2xl p-4 shadow-2xl border border-primary/30 flex items-center gap-4">
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <span className="text-xl">
                      {templateMeta[selectedTemplateId || ""]?.emoji || "🎨"}
                    </span>
                    {selectedTemplateData.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click to start building your site
                  </p>
                </div>
                <Link
                  to={`/builder?templateId=${selectedTemplateId}&blueprintId=${selectedTemplate}`}
                >
                  <Button variant="glow" className="gap-2">
                    Use Template
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
