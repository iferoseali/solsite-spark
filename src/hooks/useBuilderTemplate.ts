import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mapBlueprintTypeToSectionType, generateSectionId } from "@/types/section";
import type { SectionConfig } from "@/types/section";

export interface UseBuilderTemplateProps {
  urlTemplateId: string | null;
  urlBlueprintId: string | null;
  preselectedLayout: string;
  preselectedPersonality: string;
  editProjectId: string | null;
  setSections: React.Dispatch<React.SetStateAction<SectionConfig[]>>;
}

export interface UseBuilderTemplateReturn {
  templateId: string | null;
  setTemplateId: React.Dispatch<React.SetStateAction<string | null>>;
  blueprintId: string | null;
  setBlueprintId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTemplateId: string | null;
  setSelectedTemplateId: React.Dispatch<React.SetStateAction<string | null>>;
  blueprintName: string;
  setBlueprintName: React.Dispatch<React.SetStateAction<string>>;
  currentLayout: string;
  setCurrentLayout: React.Dispatch<React.SetStateAction<string>>;
  currentPersonality: string;
  setCurrentPersonality: React.Dispatch<React.SetStateAction<string>>;
  templatePreviewHtml: string | null;
  isLoadingTemplatePreview: boolean;
  handleTemplateChange: (args: { 
    templateKey: string; 
    blueprintId: string; 
    layout: string; 
    personality: string 
  }) => Promise<void>;
}

export function useBuilderTemplate({
  urlTemplateId,
  urlBlueprintId,
  preselectedLayout,
  preselectedPersonality,
  editProjectId,
  setSections,
}: UseBuilderTemplateProps): UseBuilderTemplateReturn {
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [blueprintId, setBlueprintId] = useState<string | null>(urlBlueprintId);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(urlTemplateId);
  const [blueprintName, setBlueprintName] = useState<string>("");
  const [currentLayout, setCurrentLayout] = useState(preselectedLayout);
  const [currentPersonality, setCurrentPersonality] = useState(preselectedPersonality);
  const [templatePreviewHtml, setTemplatePreviewHtml] = useState<string | null>(null);
  const [isLoadingTemplatePreview, setIsLoadingTemplatePreview] = useState(false);

  // Load template preview
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

  // Fetch template ID
  useEffect(() => {
    if (editProjectId || urlBlueprintId) return;
    const fetchTemplate = async () => {
      const { data } = await supabase
        .from('templates')
        .select('id')
        .eq('layout_id', preselectedLayout)
        .eq('personality_id', preselectedPersonality)
        .maybeSingle();
      if (data) setTemplateId(data.id);
    };
    fetchTemplate();
  }, [preselectedLayout, preselectedPersonality, editProjectId, urlBlueprintId]);

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

        if (blueprint?.sections && Array.isArray(blueprint.sections)) {
          const blueprintSections = blueprint.sections as Array<
            string | { id?: string; type?: string; variant?: string; layout?: string; visible?: boolean; order?: number }
          >;

          const mappedSections: SectionConfig[] = [];
          blueprintSections.forEach((s, i) => {
            if (typeof s === 'string') {
              const mappedType = mapBlueprintTypeToSectionType(s);
              if (mappedType) {
                mappedSections.push({
                  id: generateSectionId(mappedType),
                  type: mappedType,
                  variant: 'default',
                  visible: true,
                  order: i,
                });
              }
            } else if (typeof s === 'object' && s !== null) {
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
    [setSections]
  );

  return {
    templateId,
    setTemplateId,
    blueprintId,
    setBlueprintId,
    selectedTemplateId,
    setSelectedTemplateId,
    blueprintName,
    setBlueprintName,
    currentLayout,
    setCurrentLayout,
    currentPersonality,
    setCurrentPersonality,
    templatePreviewHtml,
    isLoadingTemplatePreview,
    handleTemplateChange,
  };
}
