import { useState, useCallback, useEffect, useRef, useTransition } from "react";
import { generatePreviewHtml } from "@/lib/preview";
import type { SectionConfig } from "@/types/section";
import type { FaqItem, RoadmapPhase, TeamMember, Feature, GalleryImage, Partner, StatItem } from "@/types/builder";
import { DEFAULT_FAQ_ITEMS, DEFAULT_ROADMAP_PHASES, DEFAULT_FEATURES, DEFAULT_GALLERY_IMAGES, DEFAULT_PARTNERS, DEFAULT_STATS } from "@/types/builder";
import { DEFAULT_SECTIONS } from "@/types/section";
import { useAutoSave, type AutoSaveData } from "@/hooks/useAutoSave";
import { toast } from "sonner";

export interface BuilderFormData {
  coinName: string;
  ticker: string;
  tagline: string;
  description: string;
  twitter: string;
  discord: string;
  telegram: string;
  dexLink: string;
  buyNowLink: string;
  buyNowText: string;
  showBuyNow: boolean;
  learnMoreLink: string;
  learnMoreText: string;
  showLearnMore: boolean;
  showRoadmap: boolean;
  showFaq: boolean;
  totalSupply: string;
  circulatingSupply: string;
  contractAddress: string;
}

export const initialFormData: BuilderFormData = {
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
  showBuyNow: true,
  learnMoreLink: "",
  learnMoreText: "",
  showLearnMore: true,
  showRoadmap: true,
  showFaq: true,
  totalSupply: "",
  circulatingSupply: "",
  contractAddress: "",
};

export interface BuilderSnapshot {
  formData: BuilderFormData;
  faqItems: FaqItem[];
  roadmapPhases: RoadmapPhase[];
  teamMembers: TeamMember[];
  features: Feature[];
  galleryImages: GalleryImage[];
  partners: Partner[];
  stats: StatItem[];
  sections: SectionConfig[];
  logoPreview: string | null;
}

export interface UseBuilderStateProps {
  editProjectId: string | null;
  generatedProject: { id: string; subdomain: string } | null;
}

export interface UseBuilderStateReturn {
  // Form data
  formData: BuilderFormData;
  setFormData: React.Dispatch<React.SetStateAction<BuilderFormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  
  // Content arrays
  faqItems: FaqItem[];
  setFaqItems: React.Dispatch<React.SetStateAction<FaqItem[]>>;
  roadmapPhases: RoadmapPhase[];
  setRoadmapPhases: React.Dispatch<React.SetStateAction<RoadmapPhase[]>>;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
  galleryImages: GalleryImage[];
  setGalleryImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  stats: StatItem[];
  setStats: React.Dispatch<React.SetStateAction<StatItem[]>>;
  
  // Sections
  sections: SectionConfig[];
  setSections: React.Dispatch<React.SetStateAction<SectionConfig[]>>;
  
  // Logo
  logoPreview: string | null;
  setLogoPreview: React.Dispatch<React.SetStateAction<string | null>>;
  logoFile: File | null;
  setLogoFile: React.Dispatch<React.SetStateAction<File | null>>;
  tempLogoSrc: string | null;
  setTempLogoSrc: React.Dispatch<React.SetStateAction<string | null>>;
  showLogoCropper: boolean;
  setShowLogoCropper: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCropComplete: (croppedImageUrl: string) => void;
  
  // Derived state
  showRoadmap: boolean;
  showFaq: boolean;
  
  // Template/Preview state (managed internally for live preview)
  currentLayout: string;
  setCurrentLayout: React.Dispatch<React.SetStateAction<string>>;
  currentPersonality: string;
  setCurrentPersonality: React.Dispatch<React.SetStateAction<string>>;
  selectedTemplateId: string | null;
  setSelectedTemplateId: React.Dispatch<React.SetStateAction<string | null>>;
  
  // Preview
  livePreviewHtml: string;
  isPendingPreview: boolean;
  
  // Draft management
  showDraftBanner: boolean;
  savedDraft: AutoSaveData | null;
  restoreDraft: () => void;
  dismissDraft: () => void;
  clearDraft: () => void;
  
  // Snapshot for history
  createSnapshot: () => BuilderSnapshot;
  applySnapshot: (snapshot: BuilderSnapshot) => void;
}

export function useBuilderState({
  editProjectId,
  generatedProject,
}: UseBuilderStateProps): UseBuilderStateReturn {
  // Form data
  const [formData, setFormData] = useState<BuilderFormData>(initialFormData);
  
  // Content arrays
  const [faqItems, setFaqItems] = useState<FaqItem[]>(DEFAULT_FAQ_ITEMS);
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>(DEFAULT_ROADMAP_PHASES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(DEFAULT_GALLERY_IMAGES);
  const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);
  
  // Sections
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);
  
  // Template/Preview configuration state (managed here for reactivity)
  const [currentLayout, setCurrentLayout] = useState('minimal');
  const [currentPersonality, setCurrentPersonality] = useState('degen');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  // Logo state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [tempLogoSrc, setTempLogoSrc] = useState<string | null>(null);
  const [showLogoCropper, setShowLogoCropper] = useState(false);
  
  // Draft state
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [savedDraft, setSavedDraft] = useState<AutoSaveData | null>(null);
  
  // Preview state with transition
  const [isPendingPreview, startPreviewTransition] = useTransition();
  const [livePreviewHtml, setLivePreviewHtml] = useState('');
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempLogoSrc(reader.result as string);
        setShowLogoCropper(true);
      };
      reader.readAsDataURL(file);
      setLogoFile(file);
    }
  }, []);
  
  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    setLogoPreview(croppedImageUrl);
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'logo.png', { type: 'image/png' });
        setLogoFile(file);
      });
  }, []);
  
  // Derived state
  const showRoadmap = sections.some(s => s.type === 'roadmap' && s.visible);
  const showFaq = sections.some(s => s.type === 'faq' && s.visible);
  
  // Auto-save - cast formData to match the expected type
  const { loadDraft, clearDraft } = useAutoSave(
    { 
      formData: formData as unknown as Record<string, unknown>, 
      faqItems, 
      roadmapPhases, 
      teamMembers, 
      features, 
      sections, 
      logoPreview 
    },
    !!editProjectId || !!generatedProject
  );
  
  // Check for saved draft on mount
  useEffect(() => {
    if (editProjectId) return;
    const draft = loadDraft();
    if (draft && draft.formData && (draft.formData as { coinName?: string }).coinName) {
      setSavedDraft(draft);
      setShowDraftBanner(true);
    }
  }, [editProjectId, loadDraft]);
  
  const restoreDraft = useCallback(() => {
    if (!savedDraft) return;
    const fd = savedDraft.formData as unknown as BuilderFormData;
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
  
  const dismissDraft = useCallback(() => {
    setShowDraftBanner(false);
    clearDraft();
  }, [clearDraft]);
  
  // Snapshot functions for history
  const createSnapshot = useCallback((): BuilderSnapshot => ({
    formData: { ...formData },
    faqItems: JSON.parse(JSON.stringify(faqItems)),
    roadmapPhases: JSON.parse(JSON.stringify(roadmapPhases)),
    teamMembers: JSON.parse(JSON.stringify(teamMembers)),
    features: JSON.parse(JSON.stringify(features)),
    galleryImages: JSON.parse(JSON.stringify(galleryImages)),
    partners: JSON.parse(JSON.stringify(partners)),
    stats: JSON.parse(JSON.stringify(stats)),
    sections: JSON.parse(JSON.stringify(sections)),
    logoPreview,
  }), [formData, faqItems, roadmapPhases, teamMembers, features, galleryImages, partners, stats, sections, logoPreview]);
  
  const applySnapshot = useCallback((snapshot: BuilderSnapshot) => {
    setFormData(snapshot.formData);
    setFaqItems(snapshot.faqItems);
    setRoadmapPhases(snapshot.roadmapPhases);
    setTeamMembers(snapshot.teamMembers);
    setFeatures(snapshot.features);
    setGalleryImages(snapshot.galleryImages || []);
    setPartners(snapshot.partners || []);
    setStats(snapshot.stats || []);
    setSections(snapshot.sections);
    setLogoPreview(snapshot.logoPreview);
  }, []);
  
  // Throttled preview generation
  useEffect(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    
    previewTimeoutRef.current = setTimeout(() => {
      startPreviewTransition(() => {
        const html = generatePreviewHtml(
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
            buyNowLink: formData.buyNowLink,
            buyNowText: formData.buyNowText,
            showBuyNow: formData.showBuyNow,
            learnMoreLink: formData.learnMoreLink,
            learnMoreText: formData.learnMoreText,
            showLearnMore: formData.showLearnMore,
            showRoadmap,
            showFaq,
            tokenomics: {
              totalSupply: formData.totalSupply,
              circulatingSupply: formData.circulatingSupply,
              contractAddress: formData.contractAddress,
            },
            sections,
            faqItems: faqItems.filter(f => f.question && f.answer),
            roadmapPhases: roadmapPhases.filter(p => p.title),
            teamMembers: teamMembers.filter(m => m.name),
            features: features.filter(f => f.title),
            galleryImages: galleryImages.filter(g => g.url),
            partners: partners.filter(p => p.name || p.logo),
            stats: stats.filter(s => s.value || s.label),
          },
          { layout: currentLayout, personality: currentPersonality, templateId: selectedTemplateId || undefined }
        );
        setLivePreviewHtml(html);
      });
    }, 800);
    
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [formData, logoPreview, currentLayout, currentPersonality, selectedTemplateId, showRoadmap, showFaq, sections, faqItems, roadmapPhases, teamMembers, features, galleryImages, partners, stats]);
  
  return {
    formData,
    setFormData,
    handleInputChange,
    faqItems,
    setFaqItems,
    roadmapPhases,
    setRoadmapPhases,
    teamMembers,
    setTeamMembers,
    features,
    setFeatures,
    galleryImages,
    setGalleryImages,
    partners,
    setPartners,
    stats,
    setStats,
    sections,
    setSections,
    logoPreview,
    setLogoPreview,
    logoFile,
    setLogoFile,
    tempLogoSrc,
    setTempLogoSrc,
    showLogoCropper,
    setShowLogoCropper,
    handleLogoUpload,
    handleCropComplete,
    showRoadmap,
    showFaq,
    currentLayout,
    setCurrentLayout,
    currentPersonality,
    setCurrentPersonality,
    selectedTemplateId,
    setSelectedTemplateId,
    livePreviewHtml,
    isPendingPreview,
    showDraftBanner,
    savedDraft,
    restoreDraft,
    dismissDraft,
    clearDraft,
    createSnapshot,
    applySnapshot,
  };
}
