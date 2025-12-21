import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { purgeCache } from "@/lib/cachePurge";
import { usePayment } from "@/hooks/usePayment";
import type { BuilderFormData } from "./useBuilderState";
import type { SectionConfig } from "@/types/section";
import type { FaqItem, RoadmapPhase, TeamMember, Feature } from "@/types/builder";

export interface UseBuilderActionsProps {
  formData: BuilderFormData;
  sections: SectionConfig[];
  faqItems: FaqItem[];
  roadmapPhases: RoadmapPhase[];
  teamMembers: TeamMember[];
  features: Feature[];
  logoFile: File | null;
  showRoadmap: boolean;
  showFaq: boolean;
  selectedTemplateId: string | null;
  blueprintId: string | null;
  templateId: string | null;
  user: { id: string; wallet_address: string } | null;
  connected: boolean;
  isVerified: boolean;
  generatedProject: { id: string; subdomain: string } | null;
  customSubdomain: string;
  subdomainAvailable: boolean | null;
  clearDraft: () => void;
  setVisible: (visible: boolean) => void;
  onProjectCreated: (project: { id: string; subdomain: string }) => void;
  refreshPreview: () => void;
}

export interface UseBuilderActionsReturn {
  isGenerating: boolean;
  isSaving: boolean;
  isUploadingLogo: boolean;
  showPaymentModal: boolean;
  hasPaid: boolean;
  setShowPaymentModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHasPaid: React.Dispatch<React.SetStateAction<boolean>>;
  handleGenerate: () => Promise<void>;
  saveChanges: () => Promise<void>;
  uploadLogo: (projectId: string) => Promise<string | null>;
}

export function useBuilderActions({
  formData,
  sections,
  faqItems,
  roadmapPhases,
  teamMembers,
  features,
  logoFile,
  showRoadmap,
  showFaq,
  selectedTemplateId,
  blueprintId,
  templateId,
  user,
  connected,
  isVerified,
  generatedProject,
  customSubdomain,
  subdomainAvailable,
  clearDraft,
  setVisible,
  onProjectCreated,
  refreshPreview,
}: UseBuilderActionsProps): UseBuilderActionsReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(import.meta.env.DEV);
  
  const { checkExistingPayment } = usePayment();
  const logoFileRef = useRef(logoFile);
  logoFileRef.current = logoFile;

  const generateSubdomain = (coinName: string): string => 
    coinName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 30);

  const uploadLogo = useCallback(async (projectId: string): Promise<string | null> => {
    const file = logoFileRef.current;
    if (!file) return null;
    setIsUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('project-logos').upload(fileName, file, { upsert: true });
      if (uploadError) return null;
      const { data: { publicUrl } } = supabase.storage.from('project-logos').getPublicUrl(fileName);
      return publicUrl;
    } catch { 
      return null; 
    } finally { 
      setIsUploadingLogo(false); 
    }
  }, []);

  const createProject = useCallback(async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const finalSubdomain = customSubdomain || generateSubdomain(formData.coinName);

      const projectConfig = {
        tokenomics: { 
          totalSupply: formData.totalSupply || null, 
          circulatingSupply: formData.circulatingSupply || null, 
          contractAddress: formData.contractAddress || null 
        },
        sections: sections.map(s => ({ id: s.id, type: s.type as string, variant: s.variant, visible: s.visible, order: s.order })),
        faqItems: faqItems.map(f => ({ id: f.id, question: f.question, answer: f.answer })),
        roadmapPhases: roadmapPhases.map(p => ({ id: p.id, phase: p.phase, title: p.title, items: p.items, completed: p.completed })),
        teamMembers: teamMembers.map(m => ({ id: m.id, name: m.name, role: m.role, avatar: m.avatar, twitter: m.twitter })),
        features: features.map(f => ({ id: f.id, title: f.title, description: f.description, icon: f.icon })),
        templateId: selectedTemplateId || null,
        blueprintId: blueprintId || null,
      };

      const { data, error } = await supabase.functions.invoke('manage-project', {
        body: {
          action: 'create',
          user_id: user.id,
          wallet_address: user.wallet_address,
          template_id: templateId || undefined,
          coin_name: formData.coinName,
          ticker: formData.ticker,
          tagline: formData.tagline || undefined,
          description: formData.description || undefined,
          twitter_url: formData.twitter || undefined,
          discord_url: formData.discord || undefined,
          telegram_url: formData.telegram || undefined,
          dex_link: formData.dexLink || undefined,
          show_roadmap: showRoadmap,
          show_faq: showFaq,
          subdomain: finalSubdomain,
          config: projectConfig,
        },
      });

      const project = (data as any)?.project;
      if (error || !project?.id) {
        console.error('Failed to create project:', error, data);
        toast.error((data as any)?.error || 'Failed to create website');
        return;
      }

      if (logoFileRef.current) {
        const logoUrl = await uploadLogo(project.id);
        if (logoUrl) {
          await supabase.functions.invoke('manage-project', {
            body: {
              action: 'update',
              project_id: project.id,
              user_id: user.id,
              wallet_address: user.wallet_address,
              updates: { logo_url: logoUrl },
            },
          });
        }
      }

      onProjectCreated({ id: project.id, subdomain: project.subdomain || finalSubdomain });
      clearDraft();
      toast.success('Website generated successfully!');
    } catch (err) {
      console.error('Project generation failed:', err);
      toast.error('Failed to generate website');
    } finally {
      setIsGenerating(false);
    }
  }, [
    user, customSubdomain, formData, sections, faqItems, roadmapPhases, 
    teamMembers, features, selectedTemplateId, blueprintId, templateId,
    showRoadmap, showFaq, uploadLogo, onProjectCreated, clearDraft
  ]);

  const handleGenerate = useCallback(async () => {
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
    if (customSubdomain.length < 3) { 
      toast.error("Subdomain must be at least 3 characters"); 
      return; 
    }
    if (subdomainAvailable === false) { 
      toast.error("This subdomain is already taken"); 
      return; 
    }
    
    const alreadyPaid = await checkExistingPayment(user.id, 'website');
    if (!alreadyPaid && !hasPaid) { 
      setShowPaymentModal(true); 
      return; 
    }
    
    await createProject();
  }, [
    formData.coinName, formData.ticker, connected, isVerified, user,
    customSubdomain, subdomainAvailable, checkExistingPayment, hasPaid,
    setVisible, createProject
  ]);

  const saveChanges = useCallback(async () => {
    if (!generatedProject || !user) return;
    setIsSaving(true);
    try {
      let logoUrl: string | null | undefined = undefined;
      if (logoFileRef.current) logoUrl = await uploadLogo(generatedProject.id);

      const config = {
        tokenomics: { 
          totalSupply: formData.totalSupply || null, 
          circulatingSupply: formData.circulatingSupply || null, 
          contractAddress: formData.contractAddress || null 
        },
        sections: sections.map(s => ({ id: s.id, type: s.type, variant: s.variant, visible: s.visible, order: s.order })),
        faqItems,
        roadmapPhases,
        teamMembers,
        features,
        templateId: selectedTemplateId || null,
        blueprintId: blueprintId || null,
        buyNowLink: formData.buyNowLink || null,
        buyNowText: formData.buyNowText || null,
        showBuyNow: formData.showBuyNow,
        learnMoreLink: formData.learnMoreLink || null,
        learnMoreText: formData.learnMoreText || null,
        showLearnMore: formData.showLearnMore,
      };

      const { data, error } = await supabase.functions.invoke('manage-project', {
        body: {
          action: 'update',
          project_id: generatedProject.id,
          user_id: user.id,
          wallet_address: user.wallet_address,
          updates: {
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
            config,
            ...(logoUrl ? { logo_url: logoUrl } : {}),
          },
        },
      });

      if (error) {
        console.error('Save changes failed:', error, data);
        toast.error((data as any)?.error || 'Failed to save changes');
        return;
      }

      if (generatedProject.subdomain) {
        purgeCache(generatedProject.subdomain).then(success => {
          if (success) {
            console.log(`Cache purged for ${generatedProject.subdomain}`);
          }
        });
      }

      toast.success('Changes saved!');
      refreshPreview();
    } catch (err) {
      console.error('Save changes failed:', err);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [
    generatedProject, user, formData, sections, faqItems, roadmapPhases,
    teamMembers, features, selectedTemplateId, blueprintId, showRoadmap,
    showFaq, uploadLogo, refreshPreview
  ]);

  return {
    isGenerating,
    isSaving,
    isUploadingLogo,
    showPaymentModal,
    hasPaid,
    setShowPaymentModal,
    setHasPaid,
    handleGenerate,
    saveChanges,
    uploadLogo,
  };
}
