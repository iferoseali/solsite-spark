import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UseSubdomainValidatorReturn {
  customSubdomain: string;
  setCustomSubdomain: (value: string) => void;
  subdomainAvailable: boolean | null;
  checkingSubdomain: boolean;
  handleSubdomainChange: (value: string) => void;
  generateSubdomain: (coinName: string) => string;
  sanitizeSubdomain: (value: string) => string;
}

export function useSubdomainValidator(
  editProjectId: string | null,
  coinName: string
): UseSubdomainValidatorReturn {
  const [customSubdomain, setCustomSubdomain] = useState("");
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const subdomainCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  const sanitizeSubdomain = useCallback((value: string): string => {
    return value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/^-+|-+$/g, "")
      .slice(0, 63);
  }, []);

  const generateSubdomain = useCallback((name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 30);
  }, []);

  const checkSubdomainAvailability = useCallback(
    async (subdomain: string) => {
      if (!subdomain || subdomain.length < 3) {
        setSubdomainAvailable(null);
        setCheckingSubdomain(false);
        return;
      }

      setCheckingSubdomain(true);
      try {
        const { data, error } = await supabase
          .from("domains")
          .select("subdomain, project_id")
          .eq("subdomain", subdomain)
          .maybeSingle();

        if (error) {
          console.error("Error checking subdomain:", error);
          setSubdomainAvailable(null);
          return;
        }

        // Available if no match found, or if it matches current project
        const isAvailable = !data || (editProjectId && data.project_id === editProjectId);
        setSubdomainAvailable(isAvailable);
      } catch (err) {
        console.error("Failed to check subdomain:", err);
        setSubdomainAvailable(null);
      } finally {
        setCheckingSubdomain(false);
      }
    },
    [editProjectId]
  );

  const handleSubdomainChange = useCallback(
    (value: string) => {
      const sanitized = sanitizeSubdomain(value);
      setCustomSubdomain(sanitized);
      setSubdomainAvailable(null);

      if (subdomainCheckTimeout.current) {
        clearTimeout(subdomainCheckTimeout.current);
      }

      if (sanitized.length >= 3) {
        subdomainCheckTimeout.current = setTimeout(() => {
          checkSubdomainAvailability(sanitized);
        }, 500);
      }
    },
    [sanitizeSubdomain, checkSubdomainAvailability]
  );

  // Auto-populate subdomain from coin name if user hasn't customized it
  useEffect(() => {
    if (!customSubdomain && coinName && !editProjectId) {
      const autoSubdomain = sanitizeSubdomain(coinName);
      setCustomSubdomain(autoSubdomain);
      if (autoSubdomain.length >= 3) {
        checkSubdomainAvailability(autoSubdomain);
      }
    }
  }, [coinName, customSubdomain, editProjectId, sanitizeSubdomain, checkSubdomainAvailability]);

  return {
    customSubdomain,
    setCustomSubdomain,
    subdomainAvailable,
    checkingSubdomain,
    handleSubdomainChange,
    generateSubdomain,
    sanitizeSubdomain,
  };
}
