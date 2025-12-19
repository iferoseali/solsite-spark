// Project service - handles all project-related database operations

import { supabase } from "@/integrations/supabase/client";
import type { Project, CreateProjectData, UpdateProjectData, ProjectConfig } from "@/types/project";
import type { Json } from "@/integrations/supabase/types";

export const projectService = {
  /**
   * Get a project by ID with optional template data
   */
  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        templates (
          layout_id,
          personality_id
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      throw error;
    }

    return data as Project | null;
  },

  /**
   * Get all projects for a user
   */
  async getByUserId(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user projects:", error);
      throw error;
    }

    return (data || []) as Project[];
  },

  /**
   * Get a project by subdomain
   */
  async getBySubdomain(subdomain: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("subdomain", subdomain)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching project by subdomain:", error);
      throw error;
    }

    return data as Project | null;
  },

  /**
   * Check if a subdomain is available
   */
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const { data } = await supabase
      .from("projects")
      .select("id")
      .eq("subdomain", subdomain)
      .maybeSingle();

    return !data;
  },

  /**
   * Create a new project
   */
  async create(projectData: CreateProjectData): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        coin_name: projectData.coinName,
        ticker: projectData.ticker,
        tagline: projectData.tagline || null,
        description: projectData.description || null,
        twitter_url: projectData.twitter || null,
        discord_url: projectData.discord || null,
        telegram_url: projectData.telegram || null,
        dex_link: projectData.dexLink || null,
        show_roadmap: projectData.showRoadmap ?? true,
        show_faq: projectData.showFaq ?? true,
        template_id: projectData.templateId || null,
        subdomain: projectData.subdomain,
        user_id: projectData.userId,
        config: (projectData.config || {}) as Json,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      throw error;
    }

    return data as Project;
  },

  /**
   * Update an existing project
   * If the project is published, invalidates the cache for re-rendering
   */
  async update(id: string, updateData: UpdateProjectData): Promise<Project> {
    // Convert config to Json type if present
    const dataToUpdate = {
      ...updateData,
      config: updateData.config ? (updateData.config as Json) : undefined,
    };

    const { data, error } = await supabase
      .from("projects")
      .update(dataToUpdate)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating project:", error);
      throw error;
    }

    const project = data as Project;

    // If the project is published and we're updating content (not just status),
    // invalidate the cache and trigger re-render
    if (project.status === "published" && !updateData.status) {
      this.triggerPrerender(id).catch((err) => {
        console.error("Failed to re-render after update:", err);
      });
    }

    return project;
  },

  /**
   * Delete a project
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  /**
   * Publish a project (change status to published)
   * Also triggers pre-rendering for faster serving
   */
  async publish(id: string): Promise<Project> {
    const project = await this.update(id, { status: "published" });
    
    // Trigger pre-rendering in the background (don't await to avoid blocking)
    this.triggerPrerender(id).catch((err) => {
      console.error("Failed to trigger pre-render:", err);
    });
    
    return project;
  },

  /**
   * Unpublish a project (change status to draft)
   * Also invalidates the pre-rendered cache
   */
  async unpublish(id: string): Promise<Project> {
    const project = await this.update(id, { status: "draft" });
    
    // Invalidate the cache in the background
    this.invalidateCache(id).catch((err) => {
      console.error("Failed to invalidate cache:", err);
    });
    
    return project;
  },

  /**
   * Trigger pre-rendering for a project
   */
  async triggerPrerender(projectId: string): Promise<void> {
    try {
      const response = await supabase.functions.invoke('prerender-site', {
        body: { projectId, action: 'prerender' },
      });
      
      if (response.error) {
        console.error("Pre-render error:", response.error);
      } else {
        console.log("Pre-render triggered:", response.data);
      }
    } catch (error) {
      console.error("Failed to trigger pre-render:", error);
    }
  },

  /**
   * Invalidate cached pre-rendered content
   */
  async invalidateCache(projectId: string): Promise<void> {
    try {
      const response = await supabase.functions.invoke('prerender-site', {
        body: { projectId, action: 'invalidate' },
      });
      
      if (response.error) {
        console.error("Cache invalidation error:", response.error);
      } else {
        console.log("Cache invalidated:", response.data);
      }
    } catch (error) {
      console.error("Failed to invalidate cache:", error);
    }
  },

  /**
   * Duplicate a project
   */
  async duplicate(id: string, userId: string): Promise<Project> {
    // First fetch the original project
    const original = await this.getById(id);
    if (!original) {
      throw new Error("Project not found");
    }

    // Generate a unique subdomain for the copy
    const newSubdomain = await this.getUniqueSubdomain(`${original.coin_name}-copy`);

    // Create the duplicate
    const { data, error } = await supabase
      .from("projects")
      .insert({
        coin_name: `${original.coin_name} (Copy)`,
        ticker: original.ticker,
        tagline: original.tagline,
        description: original.description,
        logo_url: original.logo_url,
        twitter_url: original.twitter_url,
        discord_url: original.discord_url,
        telegram_url: original.telegram_url,
        dex_link: original.dex_link,
        show_roadmap: original.show_roadmap,
        show_faq: original.show_faq,
        template_id: original.template_id,
        config: original.config as Json,
        subdomain: newSubdomain,
        user_id: userId,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Error duplicating project:", error);
      throw error;
    }

    return data as Project;
  },

  /**
   * Generate a unique subdomain from coin name
   */
  generateSubdomain(coinName: string): string {
    return coinName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 30);
  },

  /**
   * Get a unique subdomain (adds suffix if taken)
   */
  async getUniqueSubdomain(coinName: string): Promise<string> {
    const baseSubdomain = this.generateSubdomain(coinName);
    const isAvailable = await this.isSubdomainAvailable(baseSubdomain);
    
    if (isAvailable) {
      return baseSubdomain;
    }
    
    // Add random suffix if taken
    return `${baseSubdomain}-${Math.random().toString(36).substring(2, 6)}`;
  },
};
