// Template-related types

export interface TemplateBlueprint {
  id: string;
  name: string;
  personality: string;
  layout_category: string;
  styles: TemplateStyles;
  sections: unknown[];
  animations: Record<string, string>;
  is_active: boolean;
  reference_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateStyles {
  background?: string;
  primary?: string;
  text?: string;
}

export interface Template {
  id: string;
  name: string;
  layout_id: string;
  personality_id: string;
  config: Record<string, unknown> | null;
  created_at: string;
}

export interface TemplatePreviewConfig {
  layout: string;
  personality: string;
  templateId?: string;
}
