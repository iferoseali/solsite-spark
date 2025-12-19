// Domain service - handles custom domain operations

import { supabase } from "@/integrations/supabase/client";

export interface Domain {
  id: string;
  project_id: string;
  subdomain: string;
  custom_domain: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDomainData {
  projectId: string;
  subdomain: string;
  customDomain?: string;
}

export const domainService = {
  /**
   * Get domain for a project
   */
  async getByProjectId(projectId: string): Promise<Domain | null> {
    const { data, error } = await supabase
      .from("domains")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching domain:", error);
      throw error;
    }

    return data as Domain | null;
  },

  /**
   * Create or update domain for a project
   */
  async upsert(projectId: string, customDomain: string): Promise<Domain> {
    // First check if domain entry exists
    const existing = await this.getByProjectId(projectId);

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from("domains")
        .update({
          custom_domain: customDomain.toLowerCase().trim(),
          status: "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating domain:", error);
        throw error;
      }

      return data as Domain;
    } else {
      // Get project subdomain
      const { data: project } = await supabase
        .from("projects")
        .select("subdomain")
        .eq("id", projectId)
        .single();

      // Create new
      const { data, error } = await supabase
        .from("domains")
        .insert({
          project_id: projectId,
          subdomain: project?.subdomain || projectId.slice(0, 8),
          custom_domain: customDomain.toLowerCase().trim(),
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating domain:", error);
        throw error;
      }

      return data as Domain;
    }
  },

  /**
   * Remove custom domain from a project
   */
  async removeCustomDomain(projectId: string): Promise<void> {
    const { error } = await supabase
      .from("domains")
      .update({
        custom_domain: null,
        status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("project_id", projectId);

    if (error) {
      console.error("Error removing custom domain:", error);
      throw error;
    }
  },

  /**
   * Trigger domain verification
   */
  async verifyDomain(projectId: string): Promise<{ success: boolean; message: string; verified?: boolean }> {
    try {
      const response = await supabase.functions.invoke("verify-domain", {
        body: { projectId },
      });

      if (response.error) {
        console.error("Domain verification error:", response.error);
        return { success: false, message: response.error.message || "Verification failed" };
      }

      return response.data;
    } catch (error) {
      console.error("Failed to verify domain:", error);
      return { success: false, message: "Failed to verify domain" };
    }
  },

  /**
   * Get DNS instructions for a domain
   */
  getDNSInstructions(customDomain: string, projectId: string) {
    const verificationCode = `solsite_verify_${projectId.slice(0, 12)}`;
    
    return {
      aRecord: {
        type: "A",
        name: "@",
        value: "185.158.133.1",
        description: "Points your domain to Solsite servers",
      },
      wwwRecord: {
        type: "A", 
        name: "www",
        value: "185.158.133.1",
        description: "Points www subdomain to Solsite servers",
      },
      txtRecord: {
        type: "TXT",
        name: "_solsite",
        value: verificationCode,
        description: "Verifies domain ownership",
      },
      verificationCode,
    };
  },
};
