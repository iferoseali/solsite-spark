import { useState, useDeferredValue, useMemo, useCallback } from "react";
import { generatePreviewHtml } from "@/lib/preview";
import type { SectionConfig } from "@/types/section";
import type { FaqItem, RoadmapPhase, TeamMember, Feature } from "@/types/builder";
import { DEFAULT_FAQ_ITEMS, DEFAULT_ROADMAP_PHASES } from "@/types/builder";
import { DEFAULT_SECTIONS } from "@/types/section";

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

export interface UseBuilderStateReturn {
  formData: BuilderFormData;
  setFormData: React.Dispatch<React.SetStateAction<BuilderFormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  
  faqItems: FaqItem[];
  setFaqItems: React.Dispatch<React.SetStateAction<FaqItem[]>>;
  roadmapPhases: RoadmapPhase[];
  setRoadmapPhases: React.Dispatch<React.SetStateAction<RoadmapPhase[]>>;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
  
  sections: SectionConfig[];
  setSections: React.Dispatch<React.SetStateAction<SectionConfig[]>>;
  
  logoPreview: string | null;
  setLogoPreview: React.Dispatch<React.SetStateAction<string | null>>;
  logoFile: File | null;
  setLogoFile: React.Dispatch<React.SetStateAction<File | null>>;
  
  showRoadmap: boolean;
  showFaq: boolean;
  
  livePreviewHtml: string;
}

export function useBuilderState(
  currentLayout: string,
  currentPersonality: string,
  selectedTemplateId: string | null
): UseBuilderStateReturn {
  const [formData, setFormData] = useState<BuilderFormData>(initialFormData);
  
  const [faqItems, setFaqItems] = useState<FaqItem[]>(DEFAULT_FAQ_ITEMS);
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>(DEFAULT_ROADMAP_PHASES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const showRoadmap = sections.some(s => s.type === 'roadmap' && s.visible);
  const showFaq = sections.some(s => s.type === 'faq' && s.visible);
  
  // Deferred values for preview performance
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
        showBuyNow: deferredFormData.showBuyNow,
        learnMoreLink: deferredFormData.learnMoreLink,
        learnMoreText: deferredFormData.learnMoreText,
        showLearnMore: deferredFormData.showLearnMore,
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
  }, [
    deferredFormData,
    deferredLogoPreview,
    currentLayout,
    currentPersonality,
    selectedTemplateId,
    showRoadmap,
    showFaq,
    deferredSections,
    deferredFaqItems,
    deferredRoadmapPhases,
    deferredTeamMembers,
    deferredFeatures,
  ]);
  
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
    sections,
    setSections,
    logoPreview,
    setLogoPreview,
    logoFile,
    setLogoFile,
    showRoadmap,
    showFaq,
    livePreviewHtml,
  };
}
