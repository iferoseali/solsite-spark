import { useState, useEffect, useMemo, useDeferredValue, useCallback, useRef } from "react";
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
  RotateCcw,
  X,
  Undo2,
  Redo2
} from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { generatePreviewHtml } from "@/lib/preview";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { usePayment } from "@/hooks/usePayment";
import { SectionManager, DEFAULT_SECTIONS, type SectionConfig } from "@/components/builder/SectionManager";
import { mapBlueprintTypeToSectionType, generateSectionId } from "@/types/section";
import { LogoCropper } from "@/components/builder/LogoCropper";
import { PreviewControls, type DeviceSize } from "@/components/builder/PreviewControls";
import { FaqEditor, RoadmapEditor, TeamEditor, FeaturesEditor } from "@/components/builder/editors";
import { 
  FaqItem, RoadmapPhase, TeamMember, Feature,
  DEFAULT_FAQ_ITEMS, DEFAULT_ROADMAP_PHASES
} from "@/types/builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useAutoSave, type AutoSaveData } from "@/hooks/useAutoSave";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// History state type for undo/redo
interface BuilderSnapshot {
  formData: typeof initialFormData;
  faqItems: FaqItem[];
  roadmapPhases: RoadmapPhase[];
  teamMembers: TeamMember[];
  features: Feature[];
  sections: SectionConfig[];
  logoPreview: string | null;
}

const initialFormData = {
  coinName: "",
  ticker: "",
  tagline: "",
  description: "",
  twitter: "",
  discord: "",
  telegram: "",
  dexLink: "",
  buyNowLink: "",
  buyNowText: "",
  learnMoreLink: "",
  learnMoreText: "",
  showRoadmap: true,
  showFaq: true,
  totalSupply: "",
  circulatingSupply: "",
  contractAddress: "",
};

const MAX_HISTORY = 50;

const Builder = () => {
  const [searchParams] = useSearchParams();
  const editProjectId = searchParams.get('edit');
  const urlTemplateId = searchParams.get('templateId');
  const urlBlueprintId = searchParams.get('blueprintId');
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
    sections: false,
  });

  const [formData, setFormData] = useState(initialFormData);

  // Custom content states
  const [faqItems, setFaqItems] = useState<FaqItem[]>(DEFAULT_FAQ_ITEMS);
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>(DEFAULT_ROADMAP_PHASES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showLogoCropper, setShowLogoCropper] = useState(false);
  const [tempLogoSrc, setTempLogoSrc] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const { checkExistingPayment } = usePayment();

  // Draft restore state
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [savedDraft, setSavedDraft] = useState<AutoSaveData | null>(null);

  // History for undo/redo
  const [history, setHistory] = useState<BuilderSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyDebounce = useRef<NodeJS.Timeout | null>(null);
  const isRestoringHistory = useRef(false);

  // Create a snapshot of current state
  const createSnapshot = useCallback((): BuilderSnapshot => ({
    formData: { ...formData },
    faqItems: JSON.parse(JSON.stringify(faqItems)),
    roadmapPhases: JSON.parse(JSON.stringify(roadmapPhases)),
    teamMembers: JSON.parse(JSON.stringify(teamMembers)),
    features: JSON.parse(JSON.stringify(features)),
    sections: JSON.parse(JSON.stringify(sections)),
    logoPreview,
  }), [formData, faqItems, roadmapPhases, teamMembers, features, sections, logoPreview]);

  // Push to history with debounce
  const pushToHistory = useCallback(() => {
    if (isRestoringHistory.current) return;
    
    if (historyDebounce.current) {
      clearTimeout(historyDebounce.current);
    }
    
    historyDebounce.current = setTimeout(() => {
      const snapshot = createSnapshot();
      setHistory(prev => {
        // Remove any future states if we're not at the end
        const newHistory = prev.slice(0, historyIndex + 1);
        // Add new snapshot
        newHistory.push(snapshot);
        // Limit history size
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
          return newHistory;
        }
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
    }, 500);
  }, [createSnapshot, historyIndex]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const snapshot = history[newIndex];
    if (!snapshot) return;
    
    isRestoringHistory.current = true;
    setFormData(snapshot.formData);
    setFaqItems(snapshot.faqItems);
    setRoadmapPhases(snapshot.roadmapPhases);
    setTeamMembers(snapshot.teamMembers);
    setFeatures(snapshot.features);
    setSections(snapshot.sections);
    setLogoPreview(snapshot.logoPreview);
    setHistoryIndex(newIndex);
    
    setTimeout(() => {
      isRestoringHistory.current = false;
    }, 100);
    
    toast.success('Undone');
  }, [history, historyIndex]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const snapshot = history[newIndex];
    if (!snapshot) return;
    
    isRestoringHistory.current = true;
    setFormData(snapshot.formData);
    setFaqItems(snapshot.faqItems);
    setRoadmapPhases(snapshot.roadmapPhases);
    setTeamMembers(snapshot.teamMembers);
    setFeatures(snapshot.features);
    setSections(snapshot.sections);
    setLogoPreview(snapshot.logoPreview);
    setHistoryIndex(newIndex);
    
    setTimeout(() => {
      isRestoringHistory.current = false;
    }, 100);
    
    toast.success('Redone');
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Initialize history with first snapshot
  useEffect(() => {
    if (history.length === 0 && !editProjectId) {
      const initialSnapshot = createSnapshot();
      setHistory([initialSnapshot]);
      setHistoryIndex(0);
    }
  }, []);

  // Track changes for history
  useEffect(() => {
    if (history.length > 0) {
      pushToHistory();
    }
  }, [formData, faqItems, roadmapPhases, teamMembers, features, sections, logoPreview]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Auto-save hook
  const { loadDraft, clearDraft } = useAutoSave(
    { formData, faqItems, roadmapPhases, teamMembers, features, sections, logoPreview },
    !!editProjectId || !!generatedProject
  );

  // Check for saved draft on mount
  useEffect(() => {
    if (editProjectId) return; // Don't restore draft when editing
    const draft = loadDraft();
    if (draft && draft.formData && (draft.formData as { coinName?: string }).coinName) {
      setSavedDraft(draft);
      setShowDraftBanner(true);
    }
  }, [editProjectId, loadDraft]);

  // Restore draft function
  const restoreDraft = useCallback(() => {
    if (!savedDraft) return;
    const fd = savedDraft.formData as typeof formData;
    setFormData(fd);
    setFaqItems(savedDraft.faqItems as FaqItem[]);
    setRoadmapPhases(savedDraft.roadmapPhases as RoadmapPhase[]);
    setTeamMembers(savedDraft.teamMembers as TeamMember[]);
    setFeatures(savedDraft.features as Feature[]);
    setSections(savedDraft.sections as SectionConfig[]);
    if (savedDraft.logoPreview) setLogoPreview(savedDraft.logoPreview);
    setShowDraftBanner(false);
    toast.success('Draft restored');
  }, [savedDraft]);

  // Dismiss draft
  const dismissDraft = useCallback(() => {
    setShowDraftBanner(false);
    clearDraft();
  }, [clearDraft]);

  // Load existing project for editing
  useEffect(() => {
    const loadProject = async () => {
      if (!editProjectId) return;
      
      setIsLoadingProject(true);
      try {
        const { data: project, error } = await supabase
          .from('projects')
          .select(`*, templates (layout_id, personality_id)`)
          .eq('id', editProjectId)
          .single();

        if (error) throw error;

        if (project) {
          const config = project.config as { 
            tokenomics?: { totalSupply?: string; circulatingSupply?: string; contractAddress?: string };
            sections?: SectionConfig[];
            faqItems?: FaqItem[];
            roadmapPhases?: RoadmapPhase[];
            teamMembers?: TeamMember[];
            features?: Feature[];
            buyNowLink?: string;
            buyNowText?: string;
            learnMoreLink?: string;
            learnMoreText?: string;
          } | null;
          
          setFormData({
            coinName: project.coin_name || "",
            ticker: project.ticker || "",
            tagline: project.tagline || "",
            description: project.description || "",
            twitter: project.twitter_url || "",
            discord: project.discord_url || "",
            telegram: project.telegram_url || "",
            dexLink: project.dex_link || "",
            buyNowLink: config?.buyNowLink || "",
            buyNowText: config?.buyNowText || "",
            learnMoreLink: config?.learnMoreLink || "",
            learnMoreText: config?.learnMoreText || "",
            showRoadmap: project.show_roadmap ?? true,
            showFaq: project.show_faq ?? true,
            totalSupply: config?.tokenomics?.totalSupply || "",
            circulatingSupply: config?.tokenomics?.circulatingSupply || "",
            contractAddress: config?.tokenomics?.contractAddress || "",
          });

          if (config?.sections) setSections(config.sections);
          if (config?.faqItems) setFaqItems(config.faqItems);
          if (config?.roadmapPhases) setRoadmapPhases(config.roadmapPhases);
          if (config?.teamMembers) setTeamMembers(config.teamMembers);
          if (config?.features) setFeatures(config.features);
          if (project.logo_url) setLogoPreview(project.logo_url);

          const template = project.templates as { layout_id: string; personality_id: string } | null;
          if (template) {
            setCurrentLayout(template.layout_id);
            setCurrentPersonality(template.personality_id);
          }

          setGeneratedProject({ id: project.id, subdomain: project.subdomain || '' });
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

  const showRoadmap = sections.some(s => s.type === 'roadmap' && s.visible);
  const showFaq = sections.some(s => s.type === 'faq' && s.visible);

  const deferredFormData = useDeferredValue(formData);
  const deferredLogoPreview = useDeferredValue(logoPreview);
  const deferredSections = useDeferredValue(sections);
  const deferredFaqItems = useDeferredValue(faqItems);
  const deferredRoadmapPhases = useDeferredValue(roadmapPhases);
  const deferredTeamMembers = useDeferredValue(teamMembers);
  const deferredFeatures = useDeferredValue(features);

  const livePreviewHtml = useMemo(() => {
    return generatePreviewHtml(
      {
        coinName: deferredFormData.coinName,
        ticker: deferredFormData.ticker,
        tagline: deferredFormData.tagline,
        description: deferredFormData.description,
        logoUrl: deferredLogoPreview,
        twitter: deferredFormData.twitter,
        discord: deferredFormData.discord,
        telegram: deferredFormData.telegram,
        dexLink: deferredFormData.dexLink,
        buyNowLink: deferredFormData.buyNowLink,
        buyNowText: deferredFormData.buyNowText,
        learnMoreLink: deferredFormData.learnMoreLink,
        learnMoreText: deferredFormData.learnMoreText,
        showRoadmap,
        showFaq,
        tokenomics: {
          totalSupply: deferredFormData.totalSupply,
          circulatingSupply: deferredFormData.circulatingSupply,
          contractAddress: deferredFormData.contractAddress,
        },
        sections: deferredSections,
        faqItems: deferredFaqItems.filter(f => f.question && f.answer),
        roadmapPhases: deferredRoadmapPhases.filter(p => p.title),
        teamMembers: deferredTeamMembers.filter(m => m.name),
        features: deferredFeatures.filter(f => f.title),
      },
      { layout: currentLayout, personality: currentPersonality, templateId: selectedTemplateId || undefined }
    );
  }, [deferredFormData, deferredLogoPreview, currentLayout, currentPersonality, selectedTemplateId, showRoadmap, showFaq, deferredSections, deferredFaqItems, deferredRoadmapPhases, deferredTeamMembers, deferredFeatures]);

  useEffect(() => {
    const loadTemplatePreview = async () => {
      if (!urlTemplateId) return;
      setIsLoadingTemplatePreview(true);
      try {
        const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&templateId=${urlTemplateId}`;
        const response = await fetch(previewUrl);
        const html = await response.text();
        setTemplatePreviewHtml(html);
        setSelectedTemplateId(urlTemplateId);

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

  useEffect(() => {
    if (editProjectId || urlBlueprintId) return;
    const fetchTemplate = async () => {
      const { data } = await supabase.from('templates').select('id').eq('layout_id', preselectedLayout).eq('personality_id', preselectedPersonality).maybeSingle();
      if (data) setTemplateId(data.id);
    };
    fetchTemplate();
  }, [preselectedLayout, preselectedPersonality, editProjectId, urlBlueprintId]);

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

  const handleTemplateChange = useCallback(
    async (args: { templateKey: string; blueprintId: string; layout: string; personality: string }) => {
      const { templateKey, blueprintId: nextBlueprintId, layout, personality } = args;

      setSelectedTemplateId(templateKey);
      setBlueprintId(nextBlueprintId);
      setCurrentLayout(layout);
      setCurrentPersonality(personality);

      try {
        const { data: blueprint, error } = await supabase
          .from('template_blueprints')
          .select('name, sections')
          .eq('id', nextBlueprintId)
          .maybeSingle();

        if (error) throw error;

        if (blueprint?.name) setBlueprintName(blueprint.name);

        // Apply blueprint sections if available, mapping types correctly
        if (blueprint?.sections && Array.isArray(blueprint.sections)) {
          const blueprintSections = blueprint.sections as Array<{
            id?: string;
            type: string;
            variant?: string;
            layout?: string;
            visible?: boolean;
            order?: number;
          }>;

          // Map and filter valid sections
          const mappedSections: SectionConfig[] = [];
          blueprintSections.forEach((s, i) => {
            const mappedType = mapBlueprintTypeToSectionType(s.type);
            if (mappedType) {
              mappedSections.push({
                id: s.id || generateSectionId(mappedType),
                type: mappedType,
                variant: s.variant || s.layout || 'default',
                visible: s.visible ?? true,
                order: s.order ?? i,
              });
            }
          });

          if (mappedSections.length > 0) {
            setSections(mappedSections);
          }
        }

        toast.success(`Switched to ${blueprint?.name || 'template'}`);
      } catch (error) {
        console.error('Error fetching blueprint:', error);
        toast.success('Template switched');
      }
    },
    []
  );

  const saveChanges = async () => {
    if (!generatedProject || !user) return;
    setIsSaving(true);
    try {
      let logoUrl = undefined;
      if (logoFile) logoUrl = await uploadLogo(generatedProject.id);

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
          tokenomics: { totalSupply: formData.totalSupply || null, circulatingSupply: formData.circulatingSupply || null, contractAddress: formData.contractAddress || null },
          sections: sections.map(s => ({ id: s.id, type: s.type, variant: s.variant, visible: s.visible, order: s.order })),
          faqItems, roadmapPhases, teamMembers, features,
          templateId: selectedTemplateId || null,
          blueprintId: blueprintId || null,
          buyNowLink: formData.buyNowLink || null,
          buyNowText: formData.buyNowText || null,
          learnMoreLink: formData.learnMoreLink || null,
          learnMoreText: formData.learnMoreText || null,
        },
      };
      if (logoUrl) updateData.logo_url = logoUrl;

      const { error } = await supabase.from('projects').update(updateData).eq('id', generatedProject.id);
      if (error) { toast.error('Failed to save changes'); return; }
      toast.success('Changes saved!');
      refreshPreview();
    } catch (error) {
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempLogoSrc(reader.result as string);
        setShowLogoCropper(true);
      };
      reader.readAsDataURL(file);
      // Keep the file reference for upload
      setLogoFile(file);
    }
  };

  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    setLogoPreview(croppedImageUrl);
    // Convert data URL to File for upload
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'logo.png', { type: 'image/png' });
        setLogoFile(file);
      });
  }, []);

  const uploadLogo = async (projectId: string): Promise<string | null> => {
    if (!logoFile) return null;
    setIsUploadingLogo(true);
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${projectId}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('project-logos').upload(fileName, logoFile, { upsert: true });
      if (uploadError) return null;
      const { data: { publicUrl } } = supabase.storage.from('project-logos').getPublicUrl(fileName);
      return publicUrl;
    } catch { return null; } 
    finally { setIsUploadingLogo(false); }
  };

  const generateSubdomain = (coinName: string): string => coinName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 30);

  const handleGenerate = async () => {
    if (!formData.coinName || !formData.ticker) { toast.error("Please fill in at least the coin name and ticker"); return; }
    if (!connected) { toast.error("Please connect your wallet first"); setVisible(true); return; }
    if (!isVerified || !user) { toast.error("Please verify your wallet on the dashboard first"); return; }
    const alreadyPaid = await checkExistingPayment(user.id, 'website');
    if (!alreadyPaid && !hasPaid) { setShowPaymentModal(true); return; }
    await createProject();
  };

  const createProject = async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const subdomain = generateSubdomain(formData.coinName);
      const { data: existingProject } = await supabase.from('projects').select('id').eq('subdomain', subdomain).maybeSingle();
      let finalSubdomain = subdomain;
      if (existingProject) finalSubdomain = `${subdomain}-${Math.random().toString(36).substring(2, 6)}`;

      const projectConfig = {
        tokenomics: { totalSupply: formData.totalSupply || null, circulatingSupply: formData.circulatingSupply || null, contractAddress: formData.contractAddress || null },
        sections: sections.map(s => ({ id: s.id, type: s.type as string, variant: s.variant, visible: s.visible, order: s.order })),
        faqItems: faqItems.map(f => ({ id: f.id, question: f.question, answer: f.answer })),
        roadmapPhases: roadmapPhases.map(p => ({ id: p.id, phase: p.phase, title: p.title, items: p.items, completed: p.completed })),
        teamMembers: teamMembers.map(m => ({ id: m.id, name: m.name, role: m.role, avatar: m.avatar, twitter: m.twitter })),
        features: features.map(f => ({ id: f.id, title: f.title, description: f.description, icon: f.icon })),
        templateId: selectedTemplateId || null,
        blueprintId: blueprintId || null,
      } as unknown as Json;

      const { data: project, error } = await supabase.from('projects').insert([{
        user_id: user.id, template_id: templateId, coin_name: formData.coinName, ticker: formData.ticker,
        tagline: formData.tagline || null, description: formData.description || null, logo_url: null,
        twitter_url: formData.twitter || null, discord_url: formData.discord || null, telegram_url: formData.telegram || null,
        dex_link: formData.dexLink || null, show_roadmap: showRoadmap, show_faq: showFaq,
        subdomain: finalSubdomain, status: 'published', generated_url: `https://${finalSubdomain}.solsite.xyz`, config: projectConfig
      }]).select().single();

      if (error) { toast.error('Failed to create website'); return; }
      if (logoFile) { const logoUrl = await uploadLogo(project.id); if (logoUrl) await supabase.from('projects').update({ logo_url: logoUrl }).eq('id', project.id); }
      await supabase.from('domains').insert({ project_id: project.id, subdomain: finalSubdomain, status: 'active' });
      setGeneratedProject({ id: project.id, subdomain: finalSubdomain });
      clearDraft(); // Clear draft after successful generation
      toast.success('Website generated successfully!');
    } catch { toast.error('Failed to generate website'); } 
    finally { setIsGenerating(false); }
  };

  const subdomain = formData.coinName ? generateSubdomain(formData.coinName) : 'yourcoin';
  const previewUrl = generatedProject ? `/site/${generatedProject.subdomain}` : null;

  useEffect(() => { if (generatedProject) refreshPreview(); }, [generatedProject?.subdomain]);

  const toggleSection = (key: keyof typeof openSections) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
          {/* Form Panel */}
          <div className="w-full lg:w-1/2 xl:w-2/5 p-6 lg:p-8 overflow-y-auto border-r border-border">
            <div className="max-w-xl mx-auto space-y-4">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">{editProjectId ? 'Edit Your Site' : 'Build Your Site'}</h1>
                  <p className="text-muted-foreground text-sm">Template: <span className="text-primary">{blueprintName || `${currentLayout} × ${currentPersonality}`}</span></p>
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={undo}
                        disabled={!canUndo}
                        className="h-9 w-9"
                      >
                        <Undo2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={redo}
                        disabled={!canRedo}
                        className="h-9 w-9"
                      >
                        <Redo2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Restore Draft Banner */}
              {showDraftBanner && savedDraft && (
                <div className="p-4 rounded-xl glass border border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Unsaved draft found</p>
                      <p className="text-xs text-muted-foreground">
                        From {new Date(savedDraft.lastSaved).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={restoreDraft} className="gap-1">
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </Button>
                    <Button variant="ghost" size="icon" onClick={dismissDraft} className="h-8 w-8">
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
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"><Check className="w-5 h-5 text-accent" /></div>
                    <div><p className="font-semibold text-accent">Website Live!</p><p className="text-sm text-muted-foreground">{generatedProject.subdomain}.solsite.xyz</p></div>
                  </div>
                  <div className="flex gap-2">
                    <a href={previewUrl!} target="_blank" rel="noopener noreferrer" className="flex-1"><Button variant="accent" className="w-full gap-2"><ExternalLink className="w-4 h-4" />View Live</Button></a>
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
                    <div className="space-y-2"><Label htmlFor="coinName">Coin Name *</Label><Input id="coinName" name="coinName" placeholder="Moon Doge" value={formData.coinName} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="ticker">Ticker *</Label><Input id="ticker" name="ticker" placeholder="$MDOGE" value={formData.ticker} onChange={handleInputChange} /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="tagline">Tagline</Label><Input id="tagline" name="tagline" placeholder="To the moon and beyond 🚀" value={formData.tagline} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" placeholder="Tell the world about your coin..." value={formData.description} onChange={handleInputChange} rows={3} /></div>
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border hover:border-primary/50 transition-colors bg-secondary/30">
                          <Upload className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-muted-foreground">{logoPreview ? 'Change logo' : 'Upload logo'}</span>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                      {logoPreview && (
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-border">
                            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setTempLogoSrc(logoPreview);
                              setShowLogoCropper(true);
                            }}
                          >
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
                  <div className="relative"><Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input name="twitter" placeholder="twitter.com/yourcoin" value={formData.twitter} onChange={handleInputChange} className="pl-10" /></div>
                  <div className="relative"><MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input name="discord" placeholder="discord.gg/yourcoin" value={formData.discord} onChange={handleInputChange} className="pl-10" /></div>
                  <div className="relative"><MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input name="telegram" placeholder="t.me/yourcoin" value={formData.telegram} onChange={handleInputChange} className="pl-10" /></div>
                  <div className="relative"><Rocket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input name="dexLink" placeholder="DEX / Buy Link" value={formData.dexLink} onChange={handleInputChange} className="pl-10" /></div>
                </CollapsibleContent>
              </Collapsible>

              {/* Hero Buttons */}
              <Collapsible open={openSections.heroButtons} onOpenChange={() => toggleSection('heroButtons')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><ExternalLink className="w-5 h-5 text-primary" /><span className="font-semibold">Hero Buttons</span></div>
                  {openSections.heroButtons ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground font-medium">Buy Now Button</p>
                    <div className="space-y-2">
                      <Input name="buyNowText" placeholder={`Button text (default: "Buy Now")`} value={formData.buyNowText} onChange={handleInputChange} />
                      <div className="relative"><ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input name="buyNowLink" placeholder="Link URL (defaults to DEX link)" value={formData.buyNowLink} onChange={handleInputChange} className="pl-10" /></div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground font-medium">Learn More Button</p>
                    <div className="space-y-2">
                      <Input name="learnMoreText" placeholder={`Button text (default: "Learn More")`} value={formData.learnMoreText} onChange={handleInputChange} />
                      <div className="relative"><ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input name="learnMoreLink" placeholder="Link URL (defaults to #about)" value={formData.learnMoreLink} onChange={handleInputChange} className="pl-10" /></div>
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
                  <div className="space-y-2"><Label htmlFor="totalSupply">Total Supply</Label><Input id="totalSupply" name="totalSupply" placeholder="1,000,000,000" value={formData.totalSupply} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="circulatingSupply">Circulating Supply</Label><Input id="circulatingSupply" name="circulatingSupply" placeholder="850,000,000" value={formData.circulatingSupply} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label htmlFor="contractAddress">Contract Address</Label><Input id="contractAddress" name="contractAddress" placeholder="0x..." value={formData.contractAddress} onChange={handleInputChange} className="font-mono text-sm" /></div>
                </CollapsibleContent>
              </Collapsible>

              {/* FAQ Editor */}
              <Collapsible open={openSections.faq} onOpenChange={() => toggleSection('faq')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary" /><span className="font-semibold">FAQ Content</span><span className="text-xs text-muted-foreground">({faqItems.length})</span></div>
                  {openSections.faq ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4"><FaqEditor items={faqItems} onChange={setFaqItems} /></CollapsibleContent>
              </Collapsible>

              {/* Roadmap Editor */}
              <Collapsible open={openSections.roadmap} onOpenChange={() => toggleSection('roadmap')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Map className="w-5 h-5 text-primary" /><span className="font-semibold">Roadmap</span><span className="text-xs text-muted-foreground">({roadmapPhases.length} phases)</span></div>
                  {openSections.roadmap ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4"><RoadmapEditor phases={roadmapPhases} onChange={setRoadmapPhases} /></CollapsibleContent>
              </Collapsible>

              {/* Team Editor */}
              <Collapsible open={openSections.team} onOpenChange={() => toggleSection('team')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /><span className="font-semibold">Team</span><span className="text-xs text-muted-foreground">({teamMembers.length})</span></div>
                  {openSections.team ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4"><TeamEditor members={teamMembers} onChange={setTeamMembers} /></CollapsibleContent>
              </Collapsible>

              {/* Features Editor */}
              <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /><span className="font-semibold">Features</span><span className="text-xs text-muted-foreground">({features.length})</span></div>
                  {openSections.features ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4"><FeaturesEditor features={features} onChange={setFeatures} /></CollapsibleContent>
              </Collapsible>

              {/* Section Manager */}
              <Collapsible open={openSections.sections} onOpenChange={() => toggleSection('sections')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl glass hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-primary" /><span className="font-semibold">Section Order & Visibility</span></div>
                  {openSections.sections ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4"><div className="p-4 rounded-xl glass border border-border"><SectionManager sections={sections} onChange={setSections} /></div></CollapsibleContent>
              </Collapsible>

              {/* Domain Preview */}
              <div className="p-4 rounded-xl glass">
                <p className="text-sm text-muted-foreground mb-1">{generatedProject ? 'Your site is live at:' : 'Your site will be live at:'}</p>
                <p className="text-primary font-mono text-sm">{generatedProject?.subdomain || subdomain}.solsite.xyz</p>
              </div>

              {/* Generate / Save Button */}
              {!generatedProject ? (
                <Button variant="hero" size="xl" className="w-full" onClick={handleGenerate} disabled={isGenerating || !formData.coinName || !formData.ticker}>
                  {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</> : <><Rocket className="w-5 h-5 mr-2" />Generate Website</>}
                </Button>
              ) : (
                <Button variant="hero" size="xl" className="w-full" onClick={saveChanges} disabled={isSaving}>
                  {isSaving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</> : <><Save className="w-5 h-5 mr-2" />Save Changes</>}
                </Button>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 bg-secondary/30 relative">
            <div className="sticky top-20 p-4 lg:p-6 h-[calc(100vh-5rem)]">
              <div className="h-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl">
                <PreviewControls
                  subdomain={subdomain}
                  previewUrl={previewUrl}
                  isGeneratedProject={!!generatedProject}
                  isSaving={isSaving}
                  isRefreshing={isRefreshingPreview}
                  deviceSize={deviceSize}
                  currentTemplateKey={selectedTemplateId || 'cult_minimal'}
                  currentBlueprintId={blueprintId}
                  currentLayout={currentLayout}
                  currentPersonality={currentPersonality}
                  onRefresh={refreshPreview}
                  onSave={saveChanges}
                  onDeviceChange={setDeviceSize}
                  onTemplateChange={handleTemplateChange}
                  onFullscreen={() => window.open(previewUrl || '', '_blank')}
                />
                <div className="h-[calc(100%-3.5rem)] overflow-hidden flex justify-center bg-muted/20">
                  <div style={{ width: deviceWidths[deviceSize], maxWidth: '100%', transition: 'width 0.3s ease' }} className="h-full">
                    {generatedProject ? (
                      isRefreshingPreview && !previewHtml ? (
                        <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                      ) : previewHtml ? (
                        <iframe key={previewKey} srcDoc={previewHtml} className="w-full h-full border-0" title="Site Preview" sandbox="allow-scripts" />
                      ) : null
                    ) : isLoadingTemplatePreview ? (
                      <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                    ) : (
                      <iframe key={`preview-${previewKey}`} srcDoc={livePreviewHtml} className="w-full h-full border-0" title="Live Preview" sandbox="allow-scripts" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {user && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => { setHasPaid(true); setShowPaymentModal(false); createProject(); }}
          paymentType="website"
          userId={user.id}
          walletAddress={user.wallet_address}
        />
      )}

      {tempLogoSrc && (
        <LogoCropper
          open={showLogoCropper}
          onOpenChange={setShowLogoCropper}
          imageSrc={tempLogoSrc}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default Builder;
