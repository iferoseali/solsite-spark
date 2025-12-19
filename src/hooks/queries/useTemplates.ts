import { useQuery } from "@tanstack/react-query";
import { templateService } from "@/services/templateService";
import type { TemplateBlueprint } from "@/types/template";

export const templateKeys = {
  all: ["templates"] as const,
  blueprints: () => [...templateKeys.all, "blueprints"] as const,
  blueprint: (id: string) => [...templateKeys.blueprints(), id] as const,
  preview: (templateId: string) => [...templateKeys.all, "preview", templateId] as const,
};

export function useTemplateBlueprints() {
  return useQuery({
    queryKey: templateKeys.blueprints(),
    queryFn: () => templateService.getAllBlueprints(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
}

export function useTemplatePreview(templateId: string | null) {
  return useQuery({
    queryKey: templateKeys.preview(templateId ?? ""),
    queryFn: () => templateService.fetchPreviewHtml(templateId!),
    enabled: !!templateId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
  });
}
