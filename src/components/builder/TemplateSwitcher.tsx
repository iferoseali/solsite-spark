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

interface Template {
  id: string;
  name: string;
  personality: string | null;
  layout_category: string | null;
}

interface TemplateSwitcherProps {
  currentTemplateId: string | null;
  currentLayout: string;
  currentPersonality: string;
  onTemplateChange: (templateId: string | null, layout: string, personality: string) => void;
}

// Fallback templates if no blueprints exist
const FALLBACK_TEMPLATES = [
  { id: null, name: 'Minimal Degen', layout: 'minimal', personality: 'degen' },
  { id: null, name: 'Professional', layout: 'minimal', personality: 'professional' },
  { id: null, name: 'Dark Cult', layout: 'minimal', personality: 'dark-cult' },
  { id: null, name: 'Playful', layout: 'minimal', personality: 'playful' },
  { id: null, name: 'Premium', layout: 'minimal', personality: 'premium' },
];

export const TemplateSwitcher = ({
  currentTemplateId,
  currentLayout,
  currentPersonality,
  onTemplateChange,
}: TemplateSwitcherProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('template_blueprints')
          .select('id, name, personality, layout_category')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setTemplates(data || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const getCurrentTemplateName = () => {
    if (currentTemplateId) {
      const template = templates.find(t => t.id === currentTemplateId);
      if (template) return template.name;
    }
    // Show layout/personality combo
    return `${currentLayout.replace('-', ' ')} × ${currentPersonality.replace('-', ' ')}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8" disabled={isLoading}>
          <Palette className="w-4 h-4" />
          <span className="max-w-[120px] truncate capitalize">{getCurrentTemplateName()}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Template</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {templates.length > 0 ? (
          templates.map((template) => (
            <DropdownMenuItem
              key={template.id}
              onClick={() => onTemplateChange(
                template.id,
                template.layout_category || 'minimal',
                template.personality || 'degen'
              )}
              className={cn(
                "cursor-pointer",
                currentTemplateId === template.id && "bg-primary/10"
              )}
            >
              <span className="flex-1">{template.name}</span>
              {currentTemplateId === template.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Style Presets
            </DropdownMenuLabel>
            {FALLBACK_TEMPLATES.map((template, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => onTemplateChange(null, template.layout, template.personality)}
                className={cn(
                  "cursor-pointer",
                  currentLayout === template.layout && 
                  currentPersonality === template.personality && 
                  "bg-primary/10"
                )}
              >
                <span className="flex-1">{template.name}</span>
                {currentLayout === template.layout && 
                 currentPersonality === template.personality && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
