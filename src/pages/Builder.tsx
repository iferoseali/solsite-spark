import { useState, useEffect, useMemo } from "react";
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
  Sparkles,
  ExternalLink,
  Loader2,
  Wallet,
  Check,
  RefreshCw,
  Save,
  LayoutGrid
} from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { generatePreviewHtml } from "@/lib/generatePreviewHtml";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { usePayment } from "@/hooks/usePayment";
import { SectionManager, DEFAULT_SECTIONS, type SectionConfig } from "@/components/builder/SectionManager";

// Template ID map for render-site edge function
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

const Builder = () => {
  const [searchParams] = useSearchParams();
  const editProjectId = searchParams.get('edit');
  const urlTemplateId = searchParams.get('templateId'); // e.g., "infra_terminal"
  const urlBlueprintId = searchParams.get('blueprintId'); // UUID of template_blueprint
  const preselectedLayout = searchParams.get('layout') || 'minimal';
  const preselectedPersonality = searchParams.get('personality') || 'degen';

  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { user, isVerified } = useWalletAuth();

  const [templateId, setTemplateId] = useState<string | null>(null);
  const [blueprintId, setBlueprintId] = useState<string | null>(urlBlueprintId);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(urlTemplateId);
  const [blueprintName, setBlueprintName] = useState<string>("");
  const [currentLayout, setCurrentLayout] = useState(preselectedLayout);
  const [currentPersonality, setCurrentPersonality] = useState(preselectedPersonality);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(!!editProjectId);
  const [generatedProject, setGeneratedProject] = useState<{
    id: string;
    subdomain: string;
  } | null>(null);

  const [previewKey, setPreviewKey] = useState(0);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isRefreshingPreview, setIsRefreshingPreview] = useState(false);
  const [templatePreviewHtml, setTemplatePreviewHtml] = useState<string | null>(null);
  const [isLoadingTemplatePreview, setIsLoadingTemplatePreview] = useState(false);

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
    // Tokenomics
    totalSupply: "",
    circulatingSupply: "",
    contractAddress: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  // Section customization state
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);
  
  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const { checkExistingPayment } = usePayment();

  // Load existing project for editing
  useEffect(() => {
    const loadProject = async () => {
      if (!editProjectId) return;
      
      setIsLoadingProject(true);
      try {
        const { data: project, error } = await supabase
          .from('projects')
          .select(`
            *,
            templates (
              layout_id,
              personality_id
            )
          `)
          .eq('id', editProjectId)
          .single();

        if (error) throw error;

        if (project) {
          // Parse config for tokenomics and sections
          const config = project.config as { 
            tokenomics?: { totalSupply?: string; circulatingSupply?: string; contractAddress?: string };
            sections?: SectionConfig[];
          } | null;
          
          // Set form data from project
          setFormData({
            coinName: project.coin_name || "",
            ticker: project.ticker || "",
            tagline: project.tagline || "",
            description: project.description || "",
            twitter: project.twitter_url || "",
            discord: project.discord_url || "",
            telegram: project.telegram_url || "",
            dexLink: project.dex_link || "",
            showRoadmap: project.show_roadmap ?? true,
            showFaq: project.show_faq ?? true,
            // Tokenomics from config
            totalSupply: config?.tokenomics?.totalSupply || "",
            circulatingSupply: config?.tokenomics?.circulatingSupply || "",
            contractAddress: config?.tokenomics?.contractAddress || "",
          });

          // Load sections from config
          if (config?.sections && Array.isArray(config.sections)) {
            setSections(config.sections);
          }

          // Set logo preview
          if (project.logo_url) {
            setLogoPreview(project.logo_url);
          }

          // Set template info
          const template = project.templates as { layout_id: string; personality_id: string } | null;
          if (template) {
            setCurrentLayout(template.layout_id);
            setCurrentPersonality(template.personality_id);
          }

          // Set as existing project
          setGeneratedProject({
            id: project.id,
            subdomain: project.subdomain || ''
          });

          setTemplateId(project.template_id || null);
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error('Failed to load project');
      } finally {
        setIsLoadingProject(false);
      }
    };

    loadProject();
  }, [editProjectId]);

  // Derive showRoadmap and showFaq from sections
  const showRoadmap = sections.some(s => s.type === 'roadmap' && s.visible);
  const showFaq = sections.some(s => s.type === 'faq' && s.visible);

  // Generate real-time preview HTML
  const livePreviewHtml = useMemo(() => {
    return generatePreviewHtml(
      {
        coinName: formData.coinName,
        ticker: formData.ticker,
        tagline: formData.tagline,
        description: formData.description,
        logoUrl: logoPreview,
        twitter: formData.twitter,
        discord: formData.discord,
        telegram: formData.telegram,
        dexLink: formData.dexLink,
        showRoadmap,
        showFaq,
        tokenomics: {
          totalSupply: formData.totalSupply,
          circulatingSupply: formData.circulatingSupply,
          contractAddress: formData.contractAddress,
        },
        sections,
      },
      { 
        layout: currentLayout, 
        personality: currentPersonality,
        templateId: selectedTemplateId || undefined
      }
    );
  }, [formData, logoPreview, currentLayout, currentPersonality, selectedTemplateId, showRoadmap, showFaq, sections]);

  // Load template blueprint preview when blueprintId is provided
  useEffect(() => {
    const loadTemplatePreview = async () => {
      if (!urlTemplateId) return;
      
      setIsLoadingTemplatePreview(true);
      try {
        // Fetch the preview HTML from render-site edge function
        const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&templateId=${urlTemplateId}`;
        const response = await fetch(previewUrl);
        const html = await response.text();
        setTemplatePreviewHtml(html);
        setSelectedTemplateId(urlTemplateId);

        // Also fetch blueprint name
        if (urlBlueprintId) {
          const { data: blueprint } = await supabase
            .from('template_blueprints')
            .select('name, personality, layout_category')
            .eq('id', urlBlueprintId)
            .single();
          
          if (blueprint) {
            setBlueprintName(blueprint.name);
            if (blueprint.personality) setCurrentPersonality(blueprint.personality);
            if (blueprint.layout_category) setCurrentLayout(blueprint.layout_category);
          }
        }
      } catch (error) {
        console.error('Error loading template preview:', error);
      } finally {
        setIsLoadingTemplatePreview(false);
      }
    };

    loadTemplatePreview();
  }, [urlTemplateId, urlBlueprintId]);

  // Fetch template ID on mount (only for new projects without blueprintId)
  useEffect(() => {
    if (editProjectId || urlBlueprintId) return; // Skip for edit mode or when blueprintId is provided
    
    const fetchTemplate = async () => {
      const { data } = await supabase
        .from('templates')
        .select('id')
        .eq('layout_id', preselectedLayout)
        .eq('personality_id', preselectedPersonality)
        .maybeSingle();
      
      if (data) {
        setTemplateId(data.id);
      }
    };
    fetchTemplate();
  }, [preselectedLayout, preselectedPersonality, editProjectId, urlBlueprintId]);

  // Refresh preview (fetch HTML and update srcDoc)
  const refreshPreview = async () => {
    if (!generatedProject) return;
    setIsRefreshingPreview(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?subdomain=${generatedProject.subdomain}&t=${Date.now()}`
      );
      const html = await response.text();
      setPreviewHtml(html);
      setPreviewKey((k) => k + 1);
      toast.success('Preview refreshed');
    } catch (error) {
      console.error('Error refreshing preview:', error);
      toast.error('Failed to refresh preview');
    } finally {
      setIsRefreshingPreview(false);
    }
  };

  // Save changes and refresh preview
  const saveChanges = async () => {
    if (!generatedProject || !user) return;
    
    setIsSaving(true);
    try {
      // Upload new logo if changed
      let logoUrl = undefined;
      if (logoFile) {
        logoUrl = await uploadLogo(generatedProject.id);
      }

      // Update project data
      const updateData: Record<string, unknown> = {
        coin_name: formData.coinName,
        ticker: formData.ticker,
        tagline: formData.tagline || null,
        description: formData.description || null,
        twitter_url: formData.twitter || null,
        discord_url: formData.discord || null,
        telegram_url: formData.telegram || null,
        dex_link: formData.dexLink || null,
        show_roadmap: showRoadmap,
        show_faq: showFaq,
        config: {
          tokenomics: {
            totalSupply: formData.totalSupply || null,
            circulatingSupply: formData.circulatingSupply || null,
            contractAddress: formData.contractAddress || null,
          },
          sections: sections.map(s => ({
            id: s.id,
            type: s.type,
            variant: s.variant,
            visible: s.visible,
            order: s.order,
          })),
          templateId: selectedTemplateId || null,
          blueprintId: blueprintId || null,
        },
      };

      if (logoUrl) {
        updateData.logo_url = logoUrl;
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', generatedProject.id);

      if (error) {
        console.error('Error saving changes:', error);
        toast.error('Failed to save changes');
        return;
      }

      toast.success('Changes saved!');
      refreshPreview();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store file for later upload
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (projectId: string): Promise<string | null> => {
    if (!logoFile) return null;
    
    setIsUploadingLogo(true);
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${projectId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-logos')
        .upload(fileName, logoFile, { upsert: true });
      
      if (uploadError) {
        console.error('Logo upload error:', uploadError);
        return null;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('project-logos')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Logo upload failed:', error);
      return null;
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const generateSubdomain = (coinName: string): string => {
    return coinName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 30);
  };

  const handleGenerate = async () => {
    if (!formData.coinName || !formData.ticker) {
      toast.error("Please fill in at least the coin name and ticker");
      return;
    }

    if (!connected) {
      toast.error("Please connect your wallet first");
      setVisible(true);
      return;
    }

    if (!isVerified || !user) {
      toast.error("Please verify your wallet on the dashboard first");
      return;
    }

    // Check if user has already paid for website generation
    const alreadyPaid = await checkExistingPayment(user.id, 'website');
    
    if (!alreadyPaid && !hasPaid) {
      // Show payment modal
      setShowPaymentModal(true);
      return;
    }

    // Proceed with generation
    await createProject();
  };

  const createProject = async () => {
    if (!user) return;
    
    setIsGenerating(true);

    try {
      const subdomain = generateSubdomain(formData.coinName);
      
      // Check if subdomain is taken
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('subdomain', subdomain)
        .maybeSingle();

      let finalSubdomain = subdomain;
      if (existingProject) {
        // Add random suffix if taken
        finalSubdomain = `${subdomain}-${Math.random().toString(36).substring(2, 6)}`;
      }

      // Create project with blueprint/template config and sections
      const projectConfig = {
        tokenomics: {
          totalSupply: formData.totalSupply || null,
          circulatingSupply: formData.circulatingSupply || null,
          contractAddress: formData.contractAddress || null,
        },
        sections: sections.map(s => ({
          id: s.id,
          type: s.type,
          variant: s.variant,
          visible: s.visible,
          order: s.order,
        })),
        templateId: selectedTemplateId || null,
        blueprintId: blueprintId || null,
      } as Json;

      // Create project first (without logo)
      const { data: project, error } = await supabase
        .from('projects')
        .insert([{
          user_id: user.id,
          template_id: templateId,
          coin_name: formData.coinName,
          ticker: formData.ticker,
          tagline: formData.tagline || null,
          description: formData.description || null,
          logo_url: null,
          twitter_url: formData.twitter || null,
          discord_url: formData.discord || null,
          telegram_url: formData.telegram || null,
          dex_link: formData.dexLink || null,
          show_roadmap: showRoadmap,
          show_faq: showFaq,
          subdomain: finalSubdomain,
          status: 'published',
          generated_url: `https://${finalSubdomain}.solsite.xyz`,
          config: projectConfig
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        toast.error('Failed to create website');
        return;
      }

      // Upload logo if provided
      if (logoFile) {
        const logoUrl = await uploadLogo(project.id);
        if (logoUrl) {
          await supabase
            .from('projects')
            .update({ logo_url: logoUrl })
            .eq('id', project.id);
        }
      }

      // Create domain record
      await supabase
        .from('domains')
        .insert({
          project_id: project.id,
          subdomain: finalSubdomain,
          status: 'active'
        });

      setGeneratedProject({
        id: project.id,
        subdomain: finalSubdomain
      });

      toast.success('Website generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate website');
    } finally {
      setIsGenerating(false);
    }
  };

  const subdomain = formData.coinName 
    ? generateSubdomain(formData.coinName)
    : 'yourcoin';

  const previewUrl = generatedProject 
    ? `/site/${generatedProject.subdomain}`
    : null;

  useEffect(() => {
    if (generatedProject) refreshPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedProject?.subdomain]);

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
                  {editProjectId ? 'Edit Your Site' : 'Build Your Site'}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Template: <span className="text-primary">{blueprintName || `${currentLayout.replace('-', ' ')} × ${currentPersonality.replace('-', ' ')}`}</span>
                </p>
              </div>

              {/* Wallet Status */}
              {!connected && (
                <div className="mb-6 p-4 rounded-xl glass border border-primary/30">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Connect wallet to deploy</p>
                      <p className="text-xs text-muted-foreground">Required to save your website</p>
                    </div>
                    <Button variant="glow" size="sm" onClick={() => setVisible(true)}>
                      Connect
                    </Button>
                  </div>
                </div>
              )}

              {connected && !isVerified && (
                <div className="mb-6 p-4 rounded-xl glass border border-yellow-500/30">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Verify your wallet</p>
                      <p className="text-xs text-muted-foreground">Go to dashboard to sign & verify</p>
                    </div>
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm">
                        Verify
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {connected && isVerified && (
                <div className="mb-6 p-4 rounded-xl glass border border-accent/30">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-accent">Wallet verified</p>
                      <p className="text-xs text-muted-foreground">Ready to deploy your website</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Success */}
              {generatedProject && (
                <div className="mb-6 p-6 rounded-xl bg-accent/10 border border-accent/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-accent">Website Live!</p>
                      <p className="text-sm text-muted-foreground">{generatedProject.subdomain}.solsite.xyz</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={previewUrl!} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="accent" className="w-full gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View Live Site
                      </Button>
                    </a>
                    <Link to="/dashboard">
                      <Button variant="outline">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

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

                {/* Tokenomics */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Tokenomics
                  </h2>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="totalSupply">Total Supply</Label>
                      <Input
                        id="totalSupply"
                        name="totalSupply"
                        placeholder="1,000,000,000"
                        value={formData.totalSupply}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="circulatingSupply">Circulating Supply</Label>
                      <Input
                        id="circulatingSupply"
                        name="circulatingSupply"
                        placeholder="850,000,000"
                        value={formData.circulatingSupply}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractAddress">Contract Address (CA)</Label>
                      <Input
                        id="contractAddress"
                        name="contractAddress"
                        placeholder="0x..."
                        value={formData.contractAddress}
                        onChange={handleInputChange}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Customization */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-primary" />
                    Customize Sections
                  </h2>
                  <p className="text-xs text-muted-foreground -mt-2">
                    Drag to reorder, click eye to hide, expand for layout variants
                  </p>
                  <div className="p-4 rounded-xl glass border border-border">
                    <SectionManager 
                      sections={sections} 
                      onChange={setSections} 
                    />
                  </div>
                </div>

                {/* Domain Preview */}
                <div className="p-4 rounded-xl glass">
                  <p className="text-sm text-muted-foreground mb-1">
                    {generatedProject ? 'Your site is live at:' : 'Your site will be live at:'}
                  </p>
                  <p className="text-primary font-mono text-sm">
                    {generatedProject?.subdomain || subdomain}.solsite.xyz
                  </p>
                </div>

                {/* Generate / Save Button */}
                {!generatedProject && (
                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="w-full" 
                    onClick={handleGenerate}
                    disabled={isGenerating || !formData.coinName || !formData.ticker}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Generate Website
                      </>
                    )}
                  </Button>
                )}

                {generatedProject && (
                  <div className="space-y-3">
                    <Button 
                      variant="hero" 
                      size="xl" 
                      className="w-full" 
                      onClick={saveChanges}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    {!editProjectId && (
                      <Button 
                        variant="outline" 
                        size="xl" 
                        className="w-full" 
                        onClick={() => {
                          setGeneratedProject(null);
                          setFormData({
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
                            totalSupply: "",
                            circulatingSupply: "",
                            contractAddress: "",
                          });
                          setLogoPreview(null);
                          setLogoFile(null);
                          setSections(DEFAULT_SECTIONS);
                        }}
                      >
                        Create Another Site
                      </Button>
                    )}
                  </div>
                )}
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
                    <span className="text-xs text-muted-foreground ml-2 font-mono">{subdomain}.solsite.xyz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {generatedProject && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1"
                          onClick={saveChanges}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1"
                          onClick={refreshPreview}
                          disabled={isRefreshingPreview}
                        >
                          <RefreshCw className={`w-4 h-4 ${isRefreshingPreview ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                        <a href={previewUrl!} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ExternalLink className="w-4 h-4" />
                            Open
                          </Button>
                        </a>
                      </>
                    )}
                    {!generatedProject && (
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="h-[calc(100%-3.5rem)] overflow-hidden">
                  {generatedProject ? (
                    isRefreshingPreview && !previewHtml ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : previewHtml ? (
                      <iframe
                        key={previewKey}
                        srcDoc={previewHtml}
                        className="w-full h-full border-0"
                        title="Site Preview"
                        sandbox="allow-scripts"
                      />
                    ) : null
                  ) : isLoadingTemplatePreview ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : templatePreviewHtml && !formData.coinName ? (
                    // Show template preview when no user input yet
                    <iframe
                      srcDoc={templatePreviewHtml}
                      className="w-full h-full border-0"
                      title="Template Preview"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    // Show live preview with user's data
                    <iframe
                      key={`preview-${logoPreview}`}
                      srcDoc={livePreviewHtml}
                      className="w-full h-full border-0"
                      title="Live Preview"
                      sandbox="allow-scripts"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {user && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setHasPaid(true);
            setShowPaymentModal(false);
            createProject();
          }}
          paymentType="website"
          userId={user.id}
          walletAddress={user.wallet_address}
        />
      )}
    </div>
  );
};

export default Builder;