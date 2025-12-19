import React, { useCallback, useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { WalletVerification } from "@/components/wallet/WalletVerification";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Globe, 
  Calendar, 
  ExternalLink,
  Wallet,
  Sparkles,
  Eye,
  Check,
  ArrowRight
} from "lucide-react";
import { useUserProjects } from "@/hooks/queries/useProjects";
import { useTemplateBlueprints } from "@/hooks/queries/useTemplates";

interface Project {
  id: string;
  coin_name: string;
  ticker: string;
  subdomain: string | null;
  status: string;
  created_at: string;
}

interface TemplateBlueprint {
  id: string;
  name: string;
  personality: string;
  layout_category: string;
  styles: {
    background?: string;
    primary?: string;
  };
  is_active: boolean;
}

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

const templateMeta: Record<string, { emoji: string; tagline: string }> = {
  "cult_minimal": { emoji: "⚡", tagline: "Stark, glitchy aesthetic" },
  "vc_pro": { emoji: "💼", tagline: "Clean, professional design" },
  "degen_meme": { emoji: "🚀", tagline: "Wild, chaotic energy" },
  "dark_cult": { emoji: "🌙", tagline: "Mysterious, moody atmosphere" },
  "luxury_token": { emoji: "👑", tagline: "Elegant, refined design" },
  "builder_utility": { emoji: "⚙️", tagline: "Terminal-inspired design" },
  "neo_grid": { emoji: "⬡", tagline: "Modern bento grid layout" },
  "scroll_story": { emoji: "📜", tagline: "Minimal narrative scroll" },
  "web3_gaming": { emoji: "🎮", tagline: "Neon arcade aesthetic" },
  "ai_crypto": { emoji: "🤖", tagline: "Futuristic glow design" },
  "dao_portal": { emoji: "⬢", tagline: "Dashboard-style layout" },
  "ultra_brutalist": { emoji: "◼", tagline: "Raw anti-design" },
  "infra_terminal": { emoji: "💻", tagline: "CLI-inspired design" },
  "social_first": { emoji: "💬", tagline: "Community-focused design" },
  "futuristic_3d": { emoji: "🌌", tagline: "Immersive holographic design" },
};

const Dashboard = () => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { isVerified, user, isVerifying } = useWalletAuth();
  
  // Use React Query for data fetching with caching
  const { data: projects = [], isLoading: projectsLoading } = useUserProjects(user?.id);
  const { data: blueprints = [], isLoading: templatesLoading } = useTemplateBlueprints();
  
  // Map blueprints to templates with proper typing
  const templates = useMemo(() => 
    blueprints as unknown as TemplateBlueprint[], 
    [blueprints]
  );
  
  const isLoading = projectsLoading || templatesLoading;
  
  // Local state for template selection
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Memoized handler
  const handleSelectTemplate = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
  }, []);

  if (!connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">
                Connect Your Wallet
              </h1>
              <p className="text-muted-foreground mb-8">
                Connect your Solana wallet to access your dashboard and create meme coin websites.
              </p>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setVisible(true)}
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-display font-bold mb-6 text-center">
                {isVerifying ? "Verifying..." : "Verify Your Wallet"}
              </h1>
              <WalletVerification />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);
  const selectedTemplateId = selectedTemplateData ? templateIdMap[selectedTemplateData.name] || "cult_minimal" : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold mb-4">
              Choose Your Template
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select from {templates.length} stunning templates to create your meme coin website in seconds.
            </p>
          </div>

          {/* Existing Projects Banner */}
          {projects.length > 0 && (
            <div className="mb-8 p-4 rounded-xl glass border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-sm">
                    You have <strong>{projects.length}</strong> existing project{projects.length > 1 ? 's' : ''}
                  </span>
                </div>
                <Link to="/my-projects">
                  <Button variant="outline" size="sm" className="gap-2">
                    View Projects
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Templates Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-[4/5] rounded-2xl glass animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => {
                const templateId = templateIdMap[template.name] || "cult_minimal";
                const meta = templateMeta[templateId] || { emoji: "🎨", tagline: "Custom template" };
                const isSelected = selectedTemplate === template.id;
                const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&templateId=${templateId}`;

                return (
                  <div
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "ring-2 ring-primary shadow-2xl shadow-primary/30 scale-[1.02]"
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

                    {/* Preview thumbnail */}
                    <div className="relative aspect-[4/5] p-4">
                      <div className="w-full h-full rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden flex flex-col">
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-black/30 border-b border-white/5">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 relative overflow-hidden">
                          <div className="absolute inset-0 origin-top-left" style={{ transform: "scale(0.22)", width: "455%", height: "455%" }}>
                            <iframe 
                              src={previewUrl} 
                              className="w-full h-full border-0 pointer-events-none" 
                              title={`Thumbnail: ${template.name}`} 
                              sandbox="allow-scripts"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}

                    {/* Label section */}
                    <div className="relative p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent -mt-8 pt-12">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{meta.emoji}</span>
                        <h3 className="font-bold text-lg text-white">{template.name}</h3>
                      </div>
                      <p className="text-sm text-white/60">{meta.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sticky CTA */}
          {selectedTemplate && selectedTemplateId && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border z-40">
              <div className="container flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{templateMeta[selectedTemplateId]?.emoji}</span>
                  <div>
                    <p className="font-semibold">{selectedTemplateData?.name}</p>
                    <p className="text-sm text-muted-foreground">{templateMeta[selectedTemplateId]?.tagline}</p>
                  </div>
                </div>
                <Link to={`/builder?templateId=${selectedTemplateId}&blueprintId=${selectedTemplate}`}>
                  <Button variant="glow" size="lg" className="gap-2">
                    <Sparkles className="w-5 h-5" />
                    Use This Template
                    <ArrowRight className="w-5 h-5" />
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

export default Dashboard;
