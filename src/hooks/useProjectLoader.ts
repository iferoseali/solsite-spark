import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { BuilderFormData } from "./useBuilderState";
import type { SectionConfig } from "@/types/section";
import type { FaqItem, RoadmapPhase, TeamMember, Feature } from "@/types/builder";

export interface UseProjectLoaderProps {
  editProjectId: string | null;
  setFormData: React.Dispatch<React.SetStateAction<BuilderFormData>>;
  setSections: React.Dispatch<React.SetStateAction<SectionConfig[]>>;
  setFaqItems: React.Dispatch<React.SetStateAction<FaqItem[]>>;
  setRoadmapPhases: React.Dispatch<React.SetStateAction<RoadmapPhase[]>>;
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
  setLogoPreview: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentLayout: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPersonality: React.Dispatch<React.SetStateAction<string>>;
  setTemplateId: React.Dispatch<React.SetStateAction<string | null>>;
  onProjectLoaded: (project: { id: string; subdomain: string }) => void;
}

export interface UseProjectLoaderReturn {
  isLoadingProject: boolean;
}

export function useProjectLoader({
  editProjectId,
  setFormData,
  setSections,
  setFaqItems,
  setRoadmapPhases,
  setTeamMembers,
  setFeatures,
  setLogoPreview,
  setCurrentLayout,
  setCurrentPersonality,
  setTemplateId,
  onProjectLoaded,
}: UseProjectLoaderProps): UseProjectLoaderReturn {
  const [isLoadingProject, setIsLoadingProject] = useState(!!editProjectId);

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
            showBuyNow?: boolean;
            learnMoreLink?: string;
            learnMoreText?: string;
            showLearnMore?: boolean;
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
            showBuyNow: config?.showBuyNow ?? true,
            learnMoreLink: config?.learnMoreLink || "",
            learnMoreText: config?.learnMoreText || "",
            showLearnMore: config?.showLearnMore ?? true,
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

          onProjectLoaded({ id: project.id, subdomain: project.subdomain || '' });
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

  return { isLoadingProject };
}
