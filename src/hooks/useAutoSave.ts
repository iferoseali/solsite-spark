import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface AutoSaveData {
  formData: Record<string, unknown>;
  faqItems: unknown[];
  roadmapPhases: unknown[];
  teamMembers: unknown[];
  features: unknown[];
  sections: unknown[];
  logoPreview: string | null;
  lastSaved: number;
}

const STORAGE_KEY = 'builder-draft';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function useAutoSave(
  data: Omit<AutoSaveData, 'lastSaved'>,
  isEditing: boolean // Don't auto-save when editing existing project
) {
  const lastSaveRef = useRef<number>(0);
  const hasChangesRef = useRef<boolean>(false);

  // Mark as having changes when data changes
  useEffect(() => {
    hasChangesRef.current = true;
  }, [data.formData, data.faqItems, data.roadmapPhases, data.teamMembers, data.features, data.sections]);

  // Save to localStorage
  const saveDraft = useCallback(() => {
    if (isEditing) return; // Don't save drafts for existing projects
    
    try {
      const saveData: AutoSaveData = {
        ...data,
        lastSaved: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      lastSaveRef.current = Date.now();
      hasChangesRef.current = false;
      return true;
    } catch (error) {
      console.error('Failed to save draft:', error);
      return false;
    }
  }, [data, isEditing]);

  // Auto-save interval
  useEffect(() => {
    if (isEditing) return;

    const interval = setInterval(() => {
      if (hasChangesRef.current && data.formData && (data.formData as { coinName?: string }).coinName) {
        const success = saveDraft();
        if (success) {
          toast.success('Draft auto-saved', { duration: 2000 });
        }
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [saveDraft, isEditing, data.formData]);

  // Load draft on mount
  const loadDraft = useCallback((): AutoSaveData | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AutoSaveData;
        // Check if draft is less than 24 hours old
        if (Date.now() - parsed.lastSaved < 24 * 60 * 60 * 1000) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    return null;
  }, []);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, []);

  // Manual save
  const manualSave = useCallback(() => {
    const success = saveDraft();
    if (success) {
      toast.success('Draft saved');
    }
  }, [saveDraft]);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    manualSave,
    lastSaved: lastSaveRef.current,
  };
}

export type { AutoSaveData };
