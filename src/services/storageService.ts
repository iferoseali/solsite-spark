// Storage service - handles file uploads to Supabase storage

import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  url: string;
  path: string;
}

export const storageService = {
  /**
   * Upload a project logo
   */
  async uploadProjectLogo(projectId: string, file: File): Promise<UploadResult> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${projectId}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("project-logos")
      .upload(fileName, file, { upsert: true });
    
    if (uploadError) {
      console.error("Logo upload error:", uploadError);
      throw uploadError;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from("project-logos")
      .getPublicUrl(fileName);
    
    return {
      url: publicUrl,
      path: fileName,
    };
  },

  /**
   * Delete a project logo
   */
  async deleteProjectLogo(fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from("project-logos")
      .remove([fileName]);
    
    if (error) {
      console.error("Error deleting logo:", error);
      throw error;
    }
  },

  /**
   * Get the public URL for a file
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  },

  /**
   * Check if a file exists in a bucket
   */
  async fileExists(bucket: string, path: string): Promise<boolean> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path.split("/").slice(0, -1).join("/"), {
        search: path.split("/").pop(),
      });
    
    if (error) {
      return false;
    }
    
    return data.length > 0;
  },
};
