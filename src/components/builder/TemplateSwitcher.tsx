import { useState, useEffect } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { getTemplateId } from "@/lib/templates";

interface TemplateBlueprintRow {
  id: string;
  name: string;
  personality: string | null;
  layout_category: string | null;
  is_active?: boolean | null;
}

interface TemplateOption {
  blueprintId: string;
  name: string;
  templateKey: string; // e.g. "cult_minimal" used by preview renderer
  personality: string | null;
  layout_category: string | null;
}

interface TemplateSwitcherProps {
  currentTemplateKey: string;
  currentBlueprintId: string | null;
  currentLayout: string;
  currentPersonality: string;
  onTemplateChange: (args: {
    templateKey: string;
    blueprintId: string;
    layout: string;
    personality: string;
  }) => void;
}

export const TemplateSwitcher = ({
  currentTemplateKey,
  currentBlueprintId,
  currentLayout,
  currentPersonality,
  onTemplateChange,
}: TemplateSwitcherProps) => {
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from("template_blueprints")
          .select("id, name, personality, layout_category, is_active")
          // Some rows may have is_active = NULL; treat that as active for now
          .or("is_active.is.null,is_active.eq.true")
          .order("name");

        if (error) throw error;

        const rows = (data || []) as TemplateBlueprintRow[];
        const mapped: TemplateOption[] = rows.map((t) => ({
          blueprintId: t.id,
          name: t.name,
          templateKey: getTemplateId(t.name),
          personality: t.personality,
          layout_category: t.layout_category,
        }));

        setTemplates(mapped);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const getCurrentTemplateName = () => {
    if (currentBlueprintId) {
      const template = templates.find((t) => t.blueprintId === currentBlueprintId);
      if (template) return template.name;
    }
    return `${currentLayout.replace("-", " ")} × ${currentPersonality.replace("-", " ")}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8" disabled={isLoading}>
          <Palette className="w-4 h-4" />
          <span className="max-w-[140px] truncate">{getCurrentTemplateName()}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Switch Template</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {templates.length > 0 ? (
          templates.map((template) => {
            const isActive = currentBlueprintId === template.blueprintId;
            return (
              <DropdownMenuItem
                key={template.blueprintId}
                onClick={() =>
                  onTemplateChange({
                    blueprintId: template.blueprintId,
                    templateKey: template.templateKey,
                    layout: template.layout_category || "minimal",
                    personality: template.personality || "degen",
                  })
                }
                className={cn("cursor-pointer", isActive && "bg-primary/10")}
              >
                <span className="flex-1">{template.name}</span>
                {isActive && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
            );
          })
        ) : (
          <DropdownMenuItem disabled className="text-muted-foreground">
            No templates found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
