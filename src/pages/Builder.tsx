import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Upload, 
  Twitter, 
  MessageCircle, 
  Globe,
  Rocket,
  Eye,
  Sparkles
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const Builder = () => {
  const [searchParams] = useSearchParams();
  const preselectedLayout = searchParams.get('layout') || 'minimal';
  const preselectedPersonality = searchParams.get('personality') || 'degen';

  const [formData, setFormData] = useState({
    coinName: "",
    ticker: "",
    tagline: "",
    description: "",
    twitter: "",
    discord: "",
    telegram: "",
    dexLink: "",
    showRoadmap: true,
    showFaq: true,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!formData.coinName || !formData.ticker) {
      toast.error("Please fill in at least the coin name and ticker");
      return;
    }
    toast.success("Website generated! (Demo mode - connect wallet to deploy)");
  };

  const subdomain = formData.coinName 
    ? `${formData.coinName.toLowerCase().replace(/\s+/g, '-')}.solsite.xyz`
    : 'yourcoin.solsite.xyz';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
          {/* Form Panel */}
          <div className="w-full lg:w-1/2 xl:w-2/5 p-6 lg:p-8 overflow-y-auto border-r border-border">
            <div className="max-w-xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
                  Build Your Site
                </h1>
                <p className="text-muted-foreground text-sm">
                  Template: <span className="text-primary capitalize">{preselectedLayout.replace('-', ' ')}</span> × <span className="text-primary capitalize">{preselectedPersonality.replace('-', ' ')}</span>
                </p>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Basic Info
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="coinName">Coin Name *</Label>
                      <Input
                        id="coinName"
                        name="coinName"
                        placeholder="Moon Doge"
                        value={formData.coinName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ticker">Ticker *</Label>
                      <Input
                        id="ticker"
                        name="ticker"
                        placeholder="$MDOGE"
                        value={formData.ticker}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      name="tagline"
                      placeholder="To the moon and beyond 🚀"
                      value={formData.tagline}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell the world about your coin..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border hover:border-primary/50 transition-colors bg-secondary/30">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {logoPreview ? 'Change logo' : 'Upload logo'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                      </label>
                      {logoPreview && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-border">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Social Links
                  </h2>

                  <div className="space-y-3">
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="twitter"
                        placeholder="twitter.com/yourcoin"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="discord"
                        placeholder="discord.gg/yourcoin"
                        value={formData.discord}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="telegram"
                        placeholder="t.me/yourcoin"
                        value={formData.telegram}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* DEX Link */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    DEX / Buy Link
                  </h2>
                  <Input
                    name="dexLink"
                    placeholder="raydium.io/swap?outputCurrency=..."
                    value={formData.dexLink}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Sections Toggle */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Optional Sections</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showRoadmap">Show Roadmap</Label>
                      <Switch
                        id="showRoadmap"
                        checked={formData.showRoadmap}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showRoadmap: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showFaq">Show FAQ</Label>
                      <Switch
                        id="showFaq"
                        checked={formData.showFaq}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showFaq: checked }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Domain Preview */}
                <div className="p-4 rounded-xl glass">
                  <p className="text-sm text-muted-foreground mb-1">Your site will be live at:</p>
                  <p className="text-primary font-mono text-sm">{subdomain}</p>
                </div>

                {/* Generate Button */}
                <Button variant="hero" size="xl" className="w-full" onClick={handleGenerate}>
                  <Rocket className="w-5 h-5 mr-2" />
                  Generate Website
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 bg-secondary/30 relative">
            <div className="sticky top-20 p-4 lg:p-6 h-[calc(100vh-5rem)]">
              <div className="h-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl">
                {/* Preview Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-accent/60" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 font-mono">{subdomain}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </div>
                
                {/* Preview Content */}
                <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
                  <LivePreview 
                    formData={formData} 
                    logoPreview={logoPreview}
                    layout={preselectedLayout}
                    personality={preselectedPersonality}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Live Preview Component
const LivePreview = ({ 
  formData, 
  logoPreview,
  layout,
  personality 
}: { 
  formData: any; 
  logoPreview: string | null;
  layout: string;
  personality: string;
}) => {
  const getPersonalityColors = () => {
    switch (personality) {
      case 'degen': return 'from-red-500/20 to-orange-500/20';
      case 'professional': return 'from-blue-500/20 to-cyan-500/20';
      case 'dark-cult': return 'from-purple-500/20 to-pink-500/20';
      case 'playful': return 'from-yellow-500/20 to-green-500/20';
      case 'premium': return 'from-gray-400/20 to-gray-600/20';
      default: return 'from-primary/20 to-accent/20';
    }
  };

  return (
    <div className={`min-h-full bg-gradient-to-br ${getPersonalityColors()} p-8`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {formData.ticker?.[1] || '?'}
              </span>
            </div>
          )}
          <span className="font-display font-bold text-lg">
            {formData.coinName || 'Your Coin'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {formData.twitter && <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />}
          {formData.discord && <MessageCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />}
          {formData.telegram && <MessageCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />}
        </div>
      </div>

      {/* Hero */}
      <div className="text-center mb-16">
        {logoPreview ? (
          <img src={logoPreview} alt="Logo" className="w-24 h-24 rounded-2xl mx-auto mb-6 object-cover shadow-xl" />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {formData.ticker?.[1] || '?'}
            </span>
          </div>
        )}
        <h1 className="text-3xl font-display font-bold mb-2">
          {formData.coinName || 'Your Coin Name'}
        </h1>
        <p className="text-xl text-primary font-mono mb-4">
          {formData.ticker || '$TICKER'}
        </p>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          {formData.tagline || 'Your awesome tagline goes here'}
        </p>
        <Button variant="hero" size="lg">
          Buy Now
        </Button>
      </div>

      {/* Description */}
      {formData.description && (
        <div className="max-w-lg mx-auto mb-12 text-center">
          <p className="text-muted-foreground">
            {formData.description}
          </p>
        </div>
      )}

      {/* Roadmap Section */}
      {formData.showRoadmap && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-center mb-6">Roadmap</h2>
          <div className="grid grid-cols-3 gap-4">
            {['Phase 1', 'Phase 2', 'Phase 3'].map((phase, i) => (
              <div key={i} className="p-4 rounded-xl bg-card/30 border border-border/50 text-center">
                <div className="text-sm font-medium text-primary mb-1">{phase}</div>
                <div className="text-xs text-muted-foreground">Coming soon...</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {formData.showFaq && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-center mb-6">FAQ</h2>
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-card/30 border border-border/50">
              <div className="font-medium text-sm mb-1">What is {formData.coinName || 'this coin'}?</div>
              <div className="text-xs text-muted-foreground">
                {formData.description || 'A revolutionary meme coin on Solana.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-8 border-t border-border/30">
        <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Built with Solsite
        </a>
        <p className="text-[10px] text-muted-foreground/50 mt-2">
          Solsite provides website infrastructure only.
        </p>
      </div>
    </div>
  );
};

export default Builder;
