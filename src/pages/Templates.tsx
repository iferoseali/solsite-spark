import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Eye, Sparkles, Layout, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const layouts = [
  { id: "minimal", name: "Minimal", description: "Clean and simple single-page design", icon: "◻️" },
  { id: "hero-roadmap", name: "Hero + Roadmap", description: "Full featured with timeline", icon: "📊" },
  { id: "story-lore", name: "Story/Lore", description: "Narrative driven experience", icon: "📖" },
  { id: "stats-heavy", name: "Stats Heavy", description: "Data and metrics focused", icon: "📈" },
  { id: "community", name: "Community", description: "Social engagement first", icon: "👥" },
  { id: "utility", name: "Utility/Serious", description: "Professional and functional", icon: "⚙️" },
];

const personalities = [
  { id: "degen", name: "Degenerate", emoji: "🔥", color: "from-red-500 to-orange-500", bg: "bg-gradient-to-br from-red-950 to-orange-950" },
  { id: "professional", name: "Professional", emoji: "💼", color: "from-blue-500 to-cyan-500", bg: "bg-gradient-to-br from-blue-950 to-cyan-950" },
  { id: "dark-cult", name: "Dark Cult", emoji: "🌙", color: "from-purple-500 to-pink-500", bg: "bg-gradient-to-br from-purple-950 to-pink-950" },
  { id: "playful", name: "Playful Meme", emoji: "😂", color: "from-yellow-500 to-green-500", bg: "bg-gradient-to-br from-yellow-950 to-green-950" },
  { id: "premium", name: "Premium", emoji: "👑", color: "from-gray-400 to-gray-600", bg: "bg-gradient-to-br from-gray-900 to-slate-900" },
];

interface Template {
  id: string;
  layout_id: string;
  personality_id: string;
  name: string;
  config: {
    primary_color?: string;
    accent_color?: string;
  };
}

const TemplatePreviewCard = ({ 
  template, 
  layout, 
  personality, 
  isSelected, 
  onSelect 
}: { 
  template: Template;
  layout: typeof layouts[0];
  personality: typeof personalities[0];
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&layout=${layout.id}&personality=${personality.id}`;

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
        isSelected
          ? 'ring-2 ring-primary shadow-2xl shadow-primary/30 scale-[1.02]'
          : 'hover:ring-1 hover:ring-primary/50 hover:shadow-xl'
      }`}
    >
      {/* Background gradient based on personality */}
      <div className={`absolute inset-0 ${personality.bg} opacity-90`} />
      
      {/* Preview mockup */}
      <div className="relative aspect-[3/4] p-3">
        <div className="w-full h-full rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden flex flex-col">
          {/* Mini browser header */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-black/30 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <div className="flex-1 mx-3 h-4 rounded bg-white/5 flex items-center px-2">
              <span className="text-[8px] text-white/40 truncate">solsite.xyz/{template.name.toLowerCase().replace(/\s/g, '-')}</span>
            </div>
          </div>
          
          {/* Content preview - varies by layout */}
          <div className="flex-1 p-3 flex flex-col gap-2">
            {/* Hero section */}
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <div 
                className="w-12 h-12 rounded-full"
                style={{ background: `linear-gradient(135deg, ${template.config?.primary_color || '#ff4444'}, ${template.config?.accent_color || '#ff8800'})` }}
              />
              <div className="w-20 h-3 rounded bg-white/20" />
              <div className="w-28 h-2 rounded bg-white/10" />
              <div 
                className="w-16 h-5 rounded-md mt-1"
                style={{ backgroundColor: template.config?.primary_color || '#ff4444' }}
              />
            </div>

            {/* Layout-specific content */}
            {layout.id === 'hero-roadmap' && (
              <div className="flex gap-1.5 px-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 h-8 rounded bg-white/5 border border-white/10" />
                ))}
              </div>
            )}
            
            {layout.id === 'story-lore' && (
              <div className="space-y-1 px-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-1.5 rounded bg-white/10" style={{ width: `${90 - i * 15}%` }} />
                ))}
              </div>
            )}

            {layout.id === 'stats-heavy' && (
              <div className="grid grid-cols-2 gap-1.5 px-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                    <div className="w-8 h-2 rounded bg-white/20" />
                  </div>
                ))}
              </div>
            )}

            {layout.id === 'community' && (
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-white/10" />
                ))}
              </div>
            )}

            {layout.id === 'utility' && (
              <div className="space-y-1.5 px-1">
                <div className="h-6 rounded bg-white/5 border border-white/10" />
                <div className="grid grid-cols-2 gap-1">
                  <div className="h-5 rounded bg-white/5" />
                  <div className="h-5 rounded bg-white/5" />
                </div>
              </div>
            )}

            {/* Social links */}
            <div className="flex justify-center gap-2 mt-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
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
          }}
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </div>

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{personality.emoji}</span>
          <h3 className="font-semibold text-white">{layout.name}</h3>
        </div>
        <p className="text-xs text-white/60">{personality.name} personality</p>
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
            className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden bg-background border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Link to={`/builder?layout=${layout.id}&personality=${personality.id}`}>
                <Button variant="glow" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Use Template
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
            </div>
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title={`Preview: ${layout.name} × ${personality.name}`}
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'filter'>('grid');

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase
        .from('templates')
        .select('*');
      if (data) {
        setTemplates(data as Template[]);
      }
    };
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(t => {
    if (selectedLayout && t.layout_id !== selectedLayout) return false;
    if (selectedPersonality && t.personality_id !== selectedPersonality) return false;
    return true;
  });

  const selectedTemplate = selectedLayout && selectedPersonality
    ? templates.find(t => t.layout_id === selectedLayout && t.personality_id === selectedPersonality)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
              Template{" "}
              <span className="text-gradient-primary">Gallery</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              6 layouts × 5 personalities = 30 unique combinations. Preview them all and find your coin's perfect match.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-6">
            {/* Layout Filter */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layout className="w-4 h-4" />
                <span>Filter by Layout</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedLayout(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedLayout 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                  }`}
                >
                  All Layouts
                </button>
                {layouts.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLayout(l.id === selectedLayout ? null : l.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedLayout === l.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                    }`}
                  >
                    <span>{l.icon}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Personality Filter */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Palette className="w-4 h-4" />
                <span>Filter by Personality</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedPersonality(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedPersonality 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                  }`}
                >
                  All Styles
                </button>
                {personalities.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersonality(p.id === selectedPersonality ? null : p.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedPersonality === p.id 
                        ? `bg-gradient-to-r ${p.color} text-white` 
                        : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                    }`}
                  >
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredTemplates.map((template) => {
              const layout = layouts.find(l => l.id === template.layout_id);
              const personality = personalities.find(p => p.id === template.personality_id);
              
              if (!layout || !personality) return null;

              const isSelected = selectedTemplate?.id === template.id;

              return (
                <TemplatePreviewCard
                  key={template.id}
                  template={template}
                  layout={layout}
                  personality={personality}
                  isSelected={isSelected}
                  onSelect={() => {
                    setSelectedLayout(template.layout_id);
                    setSelectedPersonality(template.personality_id);
                  }}
                />
              );
            })}
          </div>

          {/* CTA */}
          {selectedTemplate && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
              <div className="glass rounded-2xl p-4 shadow-2xl border border-primary/30 flex items-center gap-4">
                <div>
                  <p className="font-semibold">
                    {layouts.find(l => l.id === selectedLayout)?.name} × {personalities.find(p => p.id === selectedPersonality)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Click to start building</p>
                </div>
                <Link to={`/builder?layout=${selectedLayout}&personality=${selectedPersonality}`}>
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