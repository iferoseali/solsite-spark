// Template service - handles all template-related database operations

import { supabase } from "@/integrations/supabase/client";
import type { TemplateBlueprint, Template } from "@/types/template";

export const templateService = {
  /**
   * Get all active template blueprints
   */
  async getAllBlueprints(): Promise<TemplateBlueprint[]> {
    const { data, error } = await supabase
      .from("template_blueprints")
      .select("*")
      // Some rows may have is_active = NULL; treat that as active for now
      .or("is_active.is.null,is_active.eq.true")
      .order("name");

    if (error) {
      console.error("Error fetching template blueprints:", error);
      throw error;
    }

    return (data || []) as TemplateBlueprint[];
  },

  /**
   * Get a single template blueprint by ID
   */
  async getBlueprintById(id: string): Promise<TemplateBlueprint | null> {
    const { data, error } = await supabase
      .from("template_blueprints")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching template blueprint:", error);
      throw error;
    }

    return data as TemplateBlueprint | null;
  },

  /**
   * Get a template by layout and personality
   */
  async getByLayoutAndPersonality(layoutId: string, personalityId: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .eq("layout_id", layoutId)
      .eq("personality_id", personalityId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching template:", error);
      throw error;
    }

    return data as Template | null;
  },

  /**
   * Get all templates
   */
  async getAll(): Promise<Template[]> {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }

    return (data || []) as Template[];
  },

  /**
   * Fetch preview HTML for a template
   */
  async fetchPreviewHtml(templateId: string): Promise<string> {
    const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&templateId=${templateId}`;
    
    try {
      const response = await fetch(previewUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch preview: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error fetching template preview:", error);
      throw error;
    }
  },

  /**
   * Get cached thumbnail HTML from localStorage
   */
  getCachedThumbnail(templateId: string): string | null {
    const key = `tplthumb:v4:${templateId}`;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  /**
   * Cache thumbnail HTML to localStorage
   */
  cacheThumbnail(templateId: string, html: string): void {
    const key = `tplthumb:v4:${templateId}`;
    try {
      localStorage.setItem(key, html);
    } catch {
      // Ignore storage errors
    }
  },
};
