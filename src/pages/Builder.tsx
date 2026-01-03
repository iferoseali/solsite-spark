import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Twitter, 
  MessageCircle, 
  Globe,
  Rocket,
  Sparkles,
  ExternalLink,
  Loader2,
  Wallet,
  Check,
  Save,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Map,
  Users,
  Zap,
  Image,
  Award,
  TrendingUp,
  RotateCcw,
  X,
  Undo2,
  Redo2
} from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { SectionManager } from "@/components/builder/SectionManager";
import { LogoCropper } from "@/components/builder/LogoCropper";
import { PreviewControls, type DeviceSize } from "@/components/builder/PreviewControls";
import { FaqEditor, RoadmapEditor, TeamEditor, FeaturesEditor, GalleryEditor, PartnersEditor, StatsEditor } from "@/components/builder/editors";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Custom hooks
import { useBuilderState } from "@/hooks/useBuilderState";
import { useBuilderHistory } from "@/hooks/useBuilderHistory";
import { useBuilderActions } from "@/hooks/useBuilderActions";
import { useBuilderTemplate } from "@/hooks/useBuilderTemplate";
import { useProjectLoader } from "@/hooks/useProjectLoader";
import { useSubdomainValidator } from "@/hooks/useSubdomainValidator";

const BUY_PRESETS = ['Buy Now', 'Buy $TICKER', 'Get Started', 'Trade Now'];
const LEARN_PRESETS = ['Learn More', 'Explore', 'Join Community', 'Read Docs'];

const Builder = () => {
  const [searchParams] = useSearchParams();
  const editProjectId = searchParams.get('edit');
  const urlTemplateId = searchParams.get('templateId');
  const urlBlueprintId = searchParams.get('blueprintId');
  const urlSubdomain = searchParams.get('subdomain');
  const preselectedLayout = searchParams.get('layout') || 'minimal';
  const preselectedPersonality = searchParams.get('personality') || 'degen';

  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { user, isVerified } = useWalletAuth();

  // Generated project state
  const [generatedProject, setGeneratedProject] = useState<{ id: string; subdomain: string } | null>(null);
  
  // Preview state
  const [previewKey, setPreviewKey] = useState(0);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isRefreshingPreview, setIsRefreshingPreview] = useState(false);
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');

  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    basic: true,
    socials: true,
    heroButtons: false,
    tokenomics: false,
    faq: false,
    roadmap: false,
    team: false,
    features: false,
    gallery: false,
    partners: false,
    stats: false,
    sections: false,
  });

  // State hook - initialize first, template hook will update sections
  const state = useBuilderState({
    editProjectId,
    generatedProject,
  });

  // Template hook - manages template/layout/personality and can update sections
  const template = useBuilderTemplate({
    urlTemplateId,
    urlBlueprintId,
    preselectedLayout,
    preselectedPersonality,
    editProjectId,
    setSections: state.setSections,
    setCurrentLayoutForPreview: state.setCurrentLayout,
    setCurrentPersonalityForPreview: state.setCurrentPersonality,
    setSelectedTemplateIdForPreview: state.setSelectedTemplateId,
  });

  // Project loader hook
  const { isLoadingProject } = useProjectLoader({
    editProjectId,
    setFormData: state.setFormData,
    setSections: state.setSections,
    setFaqItems: state.setFaqItems,
    setRoadmapPhases: state.setRoadmapPhases,
    setTeamMembers: state.setTeamMembers,
    setFeatures: state.setFeatures,
    setLogoPreview: state.setLogoPreview,
    setCurrentLayout: template.setCurrentLayout,
    setCurrentPersonality: template.setCurrentPersonality,
    setTemplateId: template.setTemplateId,
    setCurrentLayoutForPreview: state.setCurrentLayout,
    setCurrentPersonalityForPreview: state.setCurrentPersonality,
    onProjectLoaded: setGeneratedProject,
  });

  // Subdomain validator hook - pass URL subdomain as initial value
  const subdomain = useSubdomainValidator(editProjectId, state.formData.coinName, urlSubdomain || undefined);

  // History hook
  const history = useBuilderHistory({
    createSnapshot: state.createSnapshot,
    applySnapshot: state.applySnapshot,
    isEditMode: !!editProjectId,
    dependencies: [
      state.formData, 
      state.faqItems, 
      state.roadmapPhases, 
      state.teamMembers, 
      state.features, 
      state.sections, 
      state.logoPreview
    ],
  });

  // Initialize history
  useEffect(() => {
    if (!editProjectId && !isLoadingProject) {
      history.initializeHistory(state.createSnapshot());
    }
  }, [editProjectId, isLoadingProject]);

  // Preview refresh
  const refreshPreview = useCallback(async () => {
    setIsRefreshingPreview(true);
    setPreviewKey(k => k + 1);
    if (generatedProject) {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?subdomain=${generatedProject.subdomain}&t=${Date.now()}`);
        const html = await response.text();
        setPreviewHtml(html);
        toast.success('Preview refreshed');
      } catch (error) {
        console.error('Error refreshing preview:', error);
        toast.error('Failed to refresh preview');
      }
    } else {
      toast.success('Preview updated');
    }
    setIsRefreshingPreview(false);
  }, [generatedProject]);

  // Actions hook
  const actions = useBuilderActions({
    formData: state.formData,
    sections: state.sections,
    faqItems: state.faqItems,
    roadmapPhases: state.roadmapPhases,
    teamMembers: state.teamMembers,
    features: state.features,
    logoFile: state.logoFile,
    showRoadmap: state.showRoadmap,
    showFaq: state.showFaq,
    selectedTemplateId: template.selectedTemplateId,
    blueprintId: template.blueprintId,
    templateId: template.templateId,
    user,
    connected,
    isVerified,
    generatedProject,
    customSubdomain: subdomain.customSubdomain,
    subdomainAvailable: subdomain.subdomainAvailable,
    clearDraft: state.clearDraft,
    setVisible,
    onProjectCreated: setGeneratedProject,
    refreshPreview,
  });

  // Refresh preview when project is generated
  useEffect(() => { 
    if (generatedProject) refreshPreview(); 
  }, [generatedProject?.subdomain]);

  const toggleSection = (key: keyof typeof openSections) => 
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };
  const displaySubdomain = subdomain.customSubdomain || 
    (state.formData.coinName ? state.formData.coinName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 30) : 'yourcoin');
  const previewUrl = generatedProject ? `/site/${generatedProject.subdomain}` : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
          {/* Form Panel */}
          <div className="w-full lg:w-1/2 xl:w-2/5 p-6 lg:p-8 overflow-y-auto border-r border-border">
            <div className="max-w-xl mx-auto space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
                    {editProjectId ? 'Edit Your Site' : 'Build Your Site'}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Template: <span className="text-primary">
                      {template.blueprintName || `${template.currentLayout} × ${template.currentPersonality}`}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={history.undo} disabled={!history.canUndo} className="h-9 w-9">
                        <Undo2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={history.redo} disabled={!history.canRedo} className="h-9 w-9">
                        <Redo2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Restore Draft Banner */}
              {state.showDraftBanner && state.savedDraft && (
                <div className="p-4 rounded-xl glass border border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Unsaved draft found</p>
                      <p className="text-xs text-muted-foreground">
                        From {new Date(state.savedDraft.lastSaved).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={state.restoreDraft} className="gap-1">
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </Button>
                    <Button variant="ghost" size="icon" onClick={state.dismissDraft} className="h-8 w-8">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Wallet Status */}
              {!connected && (
                <div className="p-4 rounded-xl glass border border-primary/30">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-primary" />
                    <div className="flex-1"><p className="text-sm font-medium">Connect wallet to deploy</p></div>
                    <Button variant="glow" size="sm" onClick={() => setVisible(true)}>Connect</Button>
                  </div>
                </div>
              )}

              {connected && !isVerified && (
                <div className="p-4 rounded-xl glass border border-yellow-500/30">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-yellow-500" />
                    <div className="flex-1"><p className="text-sm font-medium">Verify your wallet</p></div>
                    <Link to="/dashboard"><Button variant="outline" size="sm">Verify</Button></Link>
                  </div>
                </div>
              )}

              {connected && isVerified && (
                <div className="p-4 rounded-xl glass border border-accent/30">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <div className="flex-1"><p className="text-sm font-medium text-accent">Wallet verified</p></div>
                  </div>
                </div>
              )}

              {generatedProject && (
                <div className="p-6 rounded-xl bg-accent/10 border border-accent/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-accent">Website Live!</p>
                      <p className="text-sm text-muted-foreground">{generatedProject.subdomain}.solsite.fun</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={previewUrl!} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="accent" className="w-full gap-2">
                        <ExternalLink className="w-4 h-4" />View Live
                      </Button>
                    </a>
                    <Link to="/dashboard"><Button variant="outline">Dashboard</Button></Link>
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <Collapsible open={openSections.basic} onOpenChange={() => toggleSection('basic')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /><span className="font-semibold">Basic Info</span></div>
                  {openSections.basic ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="coinName">Coin Name *</Label>
                      <Input id="coinName" name="coinName" placeholder="Moon Doge" value={state.formData.coinName} onChange={state.handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ticker">Ticker *</Label>
                      <Input id="ticker" name="ticker" placeholder="$MDOGE" value={state.formData.ticker} onChange={state.handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" name="tagline" placeholder="To the moon and beyond 🚀" value={state.formData.tagline} onChange={state.handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Tell the world about your coin..." value={state.formData.description} onChange={state.handleInputChange} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border hover:border-primary/50 transition-colors bg-secondary/30">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{state.logoPreview ? 'Change logo' : 'Upload logo'}</span>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={state.handleLogoUpload} />
                      </label>
                      {state.logoPreview && (
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-border">
                            <img src={state.logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => {
                            state.setTempLogoSrc(state.logoPreview);
                            state.setShowLogoCropper(true);
                          }}>
                            Crop
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Social Links */}
              <Collapsible open={openSections.socials} onOpenChange={() => toggleSection('socials')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /><span className="font-semibold">Social Links</span></div>
                  {openSections.socials ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-3">
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input name="twitter" placeholder="twitter.com/yourcoin" value={state.formData.twitter} onChange={state.handleInputChange} className="pl-10" />
                  </div>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input name="discord" placeholder="discord.gg/yourcoin" value={state.formData.discord} onChange={state.handleInputChange} className="pl-10" />
                  </div>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input name="telegram" placeholder="t.me/yourcoin" value={state.formData.telegram} onChange={state.handleInputChange} className="pl-10" />
                  </div>
                  <div className="relative">
                    <Rocket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input name="dexLink" placeholder="DEX / Buy Link" value={state.formData.dexLink} onChange={state.handleInputChange} className="pl-10" />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Hero Buttons */}
              <Collapsible open={openSections.heroButtons} onOpenChange={() => toggleSection('heroButtons')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><ExternalLink className="w-5 h-5 text-primary" /><span className="font-semibold">Hero Buttons</span></div>
                  {openSections.heroButtons ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  {/* Buy Now Button */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-medium">Buy Now Button</p>
                      <Switch checked={state.formData.showBuyNow} onCheckedChange={(checked) => state.setFormData(prev => ({ ...prev, showBuyNow: checked }))} />
                    </div>
                    {state.formData.showBuyNow && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {BUY_PRESETS.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => state.setFormData(prev => ({ ...prev, buyNowText: preset.replace('$TICKER', state.formData.ticker || '$TICKER') }))}
                              className={cn(
                                "text-xs px-2 py-1 rounded-md border transition-colors",
                                (state.formData.buyNowText || 'Buy Now') === preset.replace('$TICKER', state.formData.ticker || '$TICKER')
                                  ? "bg-primary/20 border-primary text-primary"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              {preset.replace('$TICKER', state.formData.ticker || '$TICKER')}
                            </button>
                          ))}
                        </div>
                        <Input name="buyNowText" placeholder='Button text (default: "Buy Now")' value={state.formData.buyNowText} onChange={state.handleInputChange} />
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input name="buyNowLink" placeholder="Link URL (defaults to DEX link)" value={state.formData.buyNowLink} onChange={state.handleInputChange} className="pl-10" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Learn More Button */}
                  <div className="space-y-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-medium">Learn More Button</p>
                      <Switch checked={state.formData.showLearnMore} onCheckedChange={(checked) => state.setFormData(prev => ({ ...prev, showLearnMore: checked }))} />
                    </div>
                    {state.formData.showLearnMore && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {LEARN_PRESETS.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => state.setFormData(prev => ({ ...prev, learnMoreText: preset }))}
                              className={cn(
                                "text-xs px-2 py-1 rounded-md border transition-colors",
                                (state.formData.learnMoreText || 'Learn More') === preset
                                  ? "bg-primary/20 border-primary text-primary"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                        <Input name="learnMoreText" placeholder='Button text (default: "Learn More")' value={state.formData.learnMoreText} onChange={state.handleInputChange} />
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input name="learnMoreLink" placeholder="Link URL (defaults to #about)" value={state.formData.learnMoreLink} onChange={state.handleInputChange} className="pl-10" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Button Preview */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground font-medium mb-3">Preview</p>
                    <div className="p-4 rounded-lg bg-background/50 border border-border flex items-center justify-center gap-3 min-h-[52px]">
                      {state.formData.showBuyNow && <Button variant="glow" size="sm" className="pointer-events-none">{state.formData.buyNowText || 'Buy Now'}</Button>}
                      {state.formData.showLearnMore && <Button variant="outline" size="sm" className="pointer-events-none">{state.formData.learnMoreText || 'Learn More'}</Button>}
                      {!state.formData.showBuyNow && !state.formData.showLearnMore && <p className="text-xs text-muted-foreground italic">No buttons visible</p>}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Tokenomics */}
              <Collapsible open={openSections.tokenomics} onOpenChange={() => toggleSection('tokenomics')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /><span className="font-semibold">Tokenomics</span></div>
                  {openSections.tokenomics ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="totalSupply">Total Supply</Label>
                    <Input id="totalSupply" name="totalSupply" placeholder="1,000,000,000" value={state.formData.totalSupply} onChange={state.handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="circulatingSupply">Circulating Supply</Label>
                    <Input id="circulatingSupply" name="circulatingSupply" placeholder="500,000,000" value={state.formData.circulatingSupply} onChange={state.handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractAddress">Contract Address</Label>
                    <Input id="contractAddress" name="contractAddress" placeholder="0x..." value={state.formData.contractAddress} onChange={state.handleInputChange} className="font-mono text-sm" />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* FAQ */}
              <Collapsible open={openSections.faq} onOpenChange={() => toggleSection('faq')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary" /><span className="font-semibold">FAQ</span></div>
                  {openSections.faq ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <FaqEditor items={state.faqItems} onChange={state.setFaqItems} />
                </CollapsibleContent>
              </Collapsible>

              {/* Roadmap */}
              <Collapsible open={openSections.roadmap} onOpenChange={() => toggleSection('roadmap')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Map className="w-5 h-5 text-primary" /><span className="font-semibold">Roadmap</span></div>
                  {openSections.roadmap ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <RoadmapEditor phases={state.roadmapPhases} onChange={state.setRoadmapPhases} />
                </CollapsibleContent>
              </Collapsible>

              {/* Team */}
              <Collapsible open={openSections.team} onOpenChange={() => toggleSection('team')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /><span className="font-semibold">Team</span></div>
                  {openSections.team ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <TeamEditor members={state.teamMembers} onChange={state.setTeamMembers} />
                </CollapsibleContent>
              </Collapsible>

              {/* Features */}
              <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /><span className="font-semibold">Features</span></div>
                  {openSections.features ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <FeaturesEditor features={state.features} onChange={state.setFeatures} />
                </CollapsibleContent>
              </Collapsible>

              {/* Gallery */}
              <Collapsible open={openSections.gallery} onOpenChange={() => toggleSection('gallery')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Image className="w-5 h-5 text-primary" /><span className="font-semibold">Gallery</span></div>
                  {openSections.gallery ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <GalleryEditor images={state.galleryImages} onChange={state.setGalleryImages} />
                </CollapsibleContent>
              </Collapsible>

              {/* Partners */}
              <Collapsible open={openSections.partners} onOpenChange={() => toggleSection('partners')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Award className="w-5 h-5 text-primary" /><span className="font-semibold">Partners / Sponsors</span></div>
                  {openSections.partners ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <PartnersEditor partners={state.partners} onChange={state.setPartners} />
                </CollapsibleContent>
              </Collapsible>

              {/* Stats */}
              <Collapsible open={openSections.stats} onOpenChange={() => toggleSection('stats')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /><span className="font-semibold">Stats / Metrics</span></div>
                  {openSections.stats ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <StatsEditor stats={state.stats} onChange={state.setStats} />
                </CollapsibleContent>
              </Collapsible>

              {/* Section Manager */}
              <Collapsible open={openSections.sections} onOpenChange={() => toggleSection('sections')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-primary" /><span className="font-semibold">Page Sections</span></div>
                  {openSections.sections ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <SectionManager sections={state.sections} onChange={state.setSections} />
                </CollapsibleContent>
              </Collapsible>

              {/* Subdomain */}
              {!generatedProject && (
                <div className="p-4 rounded-xl glass border border-border">
                  <Label className="text-sm font-medium mb-2 block">Subdomain</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={subdomain.customSubdomain} 
                      onChange={(e) => subdomain.handleSubdomainChange(e.target.value)}
                      placeholder="yourcoin"
                      className="flex-1"
                    />
                    <span className="text-muted-foreground text-sm">.solsite.fun</span>
                  </div>
                  {subdomain.checkingSubdomain && <p className="text-xs text-muted-foreground mt-2">Checking availability...</p>}
                  {subdomain.subdomainAvailable === true && <p className="text-xs text-accent mt-2">✓ Available</p>}
                  {subdomain.subdomainAvailable === false && <p className="text-xs text-destructive mt-2">✗ Already taken</p>}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 flex gap-3">
                {generatedProject ? (
                  <Button 
                    variant="glow" 
                    className="flex-1 gap-2" 
                    onClick={actions.saveChanges}
                    disabled={actions.isSaving}
                  >
                    {actions.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </Button>
                ) : (
                  <Button 
                    variant="glow" 
                    className="flex-1 gap-2" 
                    onClick={actions.handleGenerate}
                    disabled={actions.isGenerating || !state.formData.coinName || !state.formData.ticker}
                  >
                    {actions.isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                    Generate Website
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-full lg:w-1/2 xl:w-3/5 bg-secondary/30 p-6 lg:p-8 overflow-hidden flex flex-col">
            <PreviewControls
              subdomain={generatedProject?.subdomain || state.formData.ticker?.toLowerCase() || 'preview'}
              previewUrl={generatedProject ? `https://${generatedProject.subdomain}.shipmemecoin.com` : null}
              isGeneratedProject={!!generatedProject}
              isSaving={actions.isSaving}
              isRefreshing={isRefreshingPreview}
              deviceSize={deviceSize}
              currentTemplateKey={template.selectedTemplateId || ''}
              currentBlueprintId={template.blueprintId}
              currentLayout={template.currentLayout}
              currentPersonality={template.currentPersonality}
              onRefresh={refreshPreview}
              onSave={actions.saveChanges}
              onDeviceChange={setDeviceSize}
              onTemplateChange={template.handleTemplateChange}
              onFullscreen={() => {
                const iframe = document.querySelector('iframe');
                if (iframe) iframe.requestFullscreen?.();
              }}
            />
            
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <div 
                className="bg-background rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
                style={{ 
                  width: deviceWidths[deviceSize], 
                  maxWidth: '100%',
                  height: deviceSize === 'mobile' ? '667px' : deviceSize === 'tablet' ? '100%' : '100%'
                }}
              >
                <iframe
                  key={previewKey}
                  srcDoc={state.livePreviewHtml}
                  className="w-full h-full border-0"
                  title="Website Preview"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={actions.showPaymentModal} 
        onClose={() => actions.setShowPaymentModal(false)}
        onSuccess={() => {
          actions.setHasPaid(true);
          actions.setShowPaymentModal(false);
          actions.handleGenerate();
        }}
        paymentType="website"
        userId={user?.id || ''}
        walletAddress={user?.wallet_address || ''}
      />

      {/* Logo Cropper */}
      <LogoCropper
        open={state.showLogoCropper && !!state.tempLogoSrc}
        onOpenChange={(open) => !open && state.setShowLogoCropper(false)}
        imageSrc={state.tempLogoSrc || ''}
        onCropComplete={state.handleCropComplete}
      />
    </div>
  );
};

export default Builder;
