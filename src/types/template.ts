// Shared template types

export interface TemplateBlueprint {
  id: string;
  name: string;
  personality: string;
  layout_category: string;
  styles: {
    background?: string;
    primary?: string;
    text?: string;
  };
  sections: unknown[];
  animations: Record<string, string>;
  is_active: boolean;
}

export interface TemplateStyles {
  background?: string;
  primary?: string;
  text?: string;
}
