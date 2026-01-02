import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const SubdomainClaimer = () => {
  const [subdomain, setSubdomain] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const checkTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const sanitizeSubdomain = useCallback((value: string): string => {
    return value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/^-+|-+$/g, "")
      .slice(0, 63);
  }, []);

  const checkAvailability = useCallback(async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from("domains")
        .select("subdomain")
        .eq("subdomain", value)
        .maybeSingle();

      if (error) {
        console.error("Error checking subdomain:", error);
        setIsAvailable(null);
        return;
      }

      setIsAvailable(!data);
    } catch (err) {
      console.error("Failed to check subdomain:", err);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeSubdomain(e.target.value);
    setSubdomain(sanitized);
    setIsAvailable(null);

    if (checkTimeout.current) {
      clearTimeout(checkTimeout.current);
    }

    if (sanitized.length >= 3) {
      checkTimeout.current = setTimeout(() => {
        checkAvailability(sanitized);
      }, 400);
    }
  };

  const handleClaim = () => {
    if (subdomain && isAvailable) {
      navigate(`/builder?subdomain=${encodeURIComponent(subdomain)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && subdomain && isAvailable) {
      handleClaim();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (checkTimeout.current) {
        clearTimeout(checkTimeout.current);
      }
    };
  }, []);

  const showStatus = subdomain.length >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="w-full max-w-xl mx-auto px-4"
    >
      <div
        className={cn(
          "relative flex items-center rounded-xl sm:rounded-2xl p-1.5 sm:p-2 transition-all duration-300",
          "bg-background/80 backdrop-blur-xl border-2",
          isFocused
            ? "border-primary shadow-lg shadow-primary/20"
            : "border-border/50 hover:border-border"
        )}
      >
        {/* Input wrapper */}
        <div className="flex-1 flex items-center">
          <Input
            type="text"
            value={subdomain}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="yourproject"
            className={cn(
              "border-0 bg-transparent text-base sm:text-lg font-medium",
              "placeholder:text-muted-foreground/50",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "h-10 sm:h-12 px-3 sm:px-4"
            )}
          />
          <span className="text-sm sm:text-base text-muted-foreground font-medium whitespace-nowrap pr-2 sm:pr-3">
            .solsite.fun
          </span>
        </div>

        {/* Status indicator */}
        <AnimatePresence mode="wait">
          {showStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 pr-2"
            >
              {isChecking ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground animate-spin" />
              ) : isAvailable === true ? (
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  <span className="text-xs sm:text-sm text-green-500 font-medium hidden sm:inline">
                    Available!
                  </span>
                </div>
              ) : isAvailable === false ? (
                <div className="flex items-center gap-1.5">
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                  <span className="text-xs sm:text-sm text-destructive font-medium hidden sm:inline">
                    Taken
                  </span>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Claim button */}
        <Button
          onClick={handleClaim}
          disabled={!subdomain || subdomain.length < 3 || !isAvailable || isChecking}
          variant="hero"
          size="default"
          className={cn(
            "h-9 sm:h-11 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold",
            "transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <span className="hidden sm:inline">Claim</span>
          <ArrowRight className="h-4 w-4 sm:ml-2" />
        </Button>
      </div>

      {/* Helper text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-xs sm:text-sm text-muted-foreground mt-3"
      >
        {subdomain.length > 0 && subdomain.length < 3 ? (
          "Subdomain must be at least 3 characters"
        ) : isAvailable === false ? (
          "Try a different name or add numbers"
        ) : (
          "Free subdomain • No credit card required • Deploy in 60 seconds"
        )}
      </motion.p>
    </motion.div>
  );
};
