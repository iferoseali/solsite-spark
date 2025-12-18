import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const layouts = [
  { id: "minimal", name: "Minimal", description: "Clean and simple" },
  { id: "hero-roadmap", name: "Hero + Roadmap", description: "Full featured" },
  { id: "story-lore", name: "Story/Lore", description: "Narrative driven" },
  { id: "stats-heavy", name: "Stats Heavy", description: "Data focused" },
  { id: "community", name: "Community", description: "Social first" },
  { id: "utility", name: "Utility/Serious", description: "Professional" },
];

const personalities = [
  { id: "degen", name: "Degenerate", emoji: "🔥", color: "from-red-500 to-orange-500" },
  { id: "professional", name: "Professional", emoji: "💼", color: "from-blue-500 to-cyan-500" },
  { id: "dark-cult", name: "Dark Cult", emoji: "🌙", color: "from-purple-500 to-pink-500" },
  { id: "playful", name: "Playful Meme", emoji: "😂", color: "from-yellow-500 to-green-500" },
  { id: "premium", name: "Premium", emoji: "👑", color: "from-gray-400 to-gray-600" },
];

const Templates = () => {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
              Choose Your{" "}
              <span className="text-gradient-primary">Template</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              6 layouts × 5 personalities = 30 unique combinations. Find your coin's perfect match.
            </p>
          </div>

          {/* Personality Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-center">Select Personality</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {personalities.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersonality(p.id === selectedPersonality ? null : p.id)}
                  className={`px-5 py-2.5 rounded-full bg-gradient-to-r ${p.color} font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
                    selectedPersonality === p.id 
                      ? 'scale-110 shadow-lg ring-2 ring-foreground/20' 
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <span>{p.emoji}</span>
                  <span className="text-primary-foreground">{p.name}</span>
                  {selectedPersonality === p.id && (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Grid */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-center">Select Layout</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {layouts.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id === selectedLayout ? null : layout.id)}
                  className={`group relative aspect-[4/5] rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedLayout === layout.id
                      ? 'ring-2 ring-primary scale-[1.02] shadow-xl shadow-primary/20'
                      : 'glass hover:border-primary/30'
                  }`}
                >
                  {/* Template Preview Mock */}
                  <div className="absolute inset-0 p-4 bg-gradient-to-br from-secondary to-muted">
                    <div className="w-full h-full flex flex-col gap-2">
                      {/* Header mock */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/30" />
                        <div className="flex gap-2">
                          <div className="w-12 h-3 rounded bg-muted-foreground/20" />
                          <div className="w-12 h-3 rounded bg-muted-foreground/20" />
                        </div>
                      </div>
                      
                      {/* Content area varies by layout */}
                      <div className="flex-1 rounded-xl bg-card/30 p-3">
                        {layout.id === 'minimal' && (
                          <div className="h-full flex flex-col items-center justify-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-primary/20" />
                            <div className="w-24 h-4 rounded bg-foreground/10" />
                            <div className="w-32 h-3 rounded bg-muted-foreground/20" />
                          </div>
                        )}
                        {layout.id === 'hero-roadmap' && (
                          <div className="h-full flex flex-col gap-2">
                            <div className="flex-1 rounded bg-primary/10" />
                            <div className="h-1/3 flex gap-2">
                              {[1,2,3].map(i => (
                                <div key={i} className="flex-1 rounded bg-accent/10" />
                              ))}
                            </div>
                          </div>
                        )}
                        {layout.id === 'story-lore' && (
                          <div className="h-full flex flex-col gap-2">
                            <div className="w-2/3 h-4 rounded bg-foreground/10" />
                            <div className="flex-1 space-y-1">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="w-full h-2 rounded bg-muted-foreground/10" />
                              ))}
                            </div>
                          </div>
                        )}
                        {layout.id === 'stats-heavy' && (
                          <div className="h-full grid grid-cols-2 gap-2">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="rounded bg-primary/10 flex items-center justify-center">
                                <div className="w-8 h-4 rounded bg-foreground/10" />
                              </div>
                            ))}
                          </div>
                        )}
                        {layout.id === 'community' && (
                          <div className="h-full flex flex-col gap-2">
                            <div className="flex gap-2">
                              {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-accent/20" />
                              ))}
                            </div>
                            <div className="flex-1 rounded bg-secondary/50" />
                          </div>
                        )}
                        {layout.id === 'utility' && (
                          <div className="h-full flex flex-col gap-2">
                            <div className="h-1/2 rounded bg-muted/50" />
                            <div className="flex gap-2 flex-1">
                              <div className="flex-1 rounded bg-primary/10" />
                              <div className="flex-1 rounded bg-accent/10" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Footer mock */}
                      <div className="h-8 rounded-lg bg-primary/20" />
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {selectedLayout === layout.id && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}

                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                    <h3 className="font-semibold text-foreground">{layout.name}</h3>
                    <p className="text-xs text-muted-foreground">{layout.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              to={`/builder${selectedLayout && selectedPersonality ? `?layout=${selectedLayout}&personality=${selectedPersonality}` : ''}`}
            >
              <Button 
                variant="hero" 
                size="xl" 
                className="group"
                disabled={!selectedLayout || !selectedPersonality}
              >
                {selectedLayout && selectedPersonality 
                  ? 'Use This Template' 
                  : 'Select Layout & Personality'
                }
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            {selectedLayout && selectedPersonality && (
              <p className="mt-4 text-sm text-muted-foreground">
                Selected: {layouts.find(l => l.id === selectedLayout)?.name} × {personalities.find(p => p.id === selectedPersonality)?.name}
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
