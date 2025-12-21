import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useProject, projectKeys } from "@/hooks/queries/useProjects";
import { domainService, type Domain } from "@/services/domainService";
import { purgeCache } from "@/lib/cachePurge";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Copy, 
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Shield,
  Check,
  X,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const DomainSettings = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const projectId = searchParams.get("projectId");
  const { isVerified, user } = useWalletAuth();

  const { data: project, isLoading: projectLoading, refetch: refetchProject } = useProject(projectId || undefined);

  const [domain, setDomain] = useState<Domain | null>(null);
  const [customDomain, setCustomDomain] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Subdomain editing state
  const [editSubdomain, setEditSubdomain] = useState("");
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [isSavingSubdomain, setIsSavingSubdomain] = useState(false);
  const [subdomainChangesRemaining, setSubdomainChangesRemaining] = useState<number | null>(null);
  const subdomainCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load domain data
  useEffect(() => {
    if (projectId) {
      loadDomain();
    }
  }, [projectId]);

  // Initialize subdomain from project
  useEffect(() => {
    if (project?.subdomain) {
      setEditSubdomain(project.subdomain);
    }
  }, [project?.subdomain]);

  const loadDomain = async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const domainData = await domainService.getByProjectId(projectId);
      setDomain(domainData);
      if (domainData?.custom_domain) {
        setCustomDomain(domainData.custom_domain);
      }
      // Load subdomain changes count
      const changesCount = await domainService.getSubdomainChangesCount(projectId);
      setSubdomainChangesRemaining(2 - changesCount);
    } catch (error) {
      console.error("Failed to load domain:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDomain = async () => {
    if (!projectId || !customDomain.trim()) return;

    // Basic domain validation
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(customDomain.trim())) {
      toast.error("Please enter a valid domain name (e.g., example.com)");
      return;
    }

    setIsSaving(true);
    try {
      const updatedDomain = await domainService.upsert(projectId, customDomain.trim());
      setDomain(updatedDomain);
      toast.success("Custom domain saved! Now configure your DNS settings.");
    } catch (error) {
      toast.error("Failed to save domain");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!projectId) return;

    setIsVerifying(true);
    try {
      const result = await domainService.verifyDomain(projectId);
      if (result.verified) {
        toast.success("Domain verified successfully! SSL will be provisioned shortly.");
        await loadDomain();
      } else {
        toast.error(result.message || "Domain verification failed. Please check your DNS settings.");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemoveDomain = async () => {
    if (!projectId) return;

    try {
      await domainService.removeCustomDomain(projectId);
      setDomain(null);
      setCustomDomain("");
      toast.success("Custom domain removed");
    } catch (error) {
      toast.error("Failed to remove domain");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // Subdomain validation and availability check
  const sanitizeSubdomain = (value: string): string => {
    return value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '')
      .slice(0, 63);
  };

  const checkSubdomainAvailability = useCallback(async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainAvailable(null);
      setCheckingSubdomain(false);
      return;
    }

    // If same as current, it's available
    if (subdomain === project?.subdomain) {
      setSubdomainAvailable(true);
      setCheckingSubdomain(false);
      return;
    }

    setCheckingSubdomain(true);
    try {
      const isAvailable = await domainService.checkSubdomainAvailability(subdomain, projectId || undefined);
      setSubdomainAvailable(isAvailable);
    } catch (err) {
      console.error('Failed to check subdomain:', err);
      setSubdomainAvailable(null);
    } finally {
      setCheckingSubdomain(false);
    }
  }, [projectId, project?.subdomain]);

  const handleSubdomainChange = useCallback((value: string) => {
    const sanitized = sanitizeSubdomain(value);
    setEditSubdomain(sanitized);
    setSubdomainAvailable(null);

    if (subdomainCheckTimeout.current) {
      clearTimeout(subdomainCheckTimeout.current);
    }

    if (sanitized.length >= 3) {
      subdomainCheckTimeout.current = setTimeout(() => {
        checkSubdomainAvailability(sanitized);
      }, 500);
    }
  }, [checkSubdomainAvailability]);

  const handleSaveSubdomain = async () => {
    if (!projectId || !user || !editSubdomain || editSubdomain.length < 3) return;
    if (editSubdomain === project?.subdomain) {
      toast.info("Subdomain is unchanged");
      return;
    }
    if (subdomainAvailable === false) {
      toast.error("This subdomain is already taken");
      return;
    }
    if (subdomainChangesRemaining !== null && subdomainChangesRemaining <= 0) {
      toast.error("You have reached the maximum number of subdomain changes");
      return;
    }

    setIsSavingSubdomain(true);
    try {
      const result = await domainService.updateSubdomain(
        projectId,
        user.id,
        user.wallet_address,
        editSubdomain
      );

      if (result.success) {
        // Purge old cache if subdomain changed
        if (result.oldSubdomain && result.oldSubdomain !== editSubdomain) {
          await purgeCache(result.oldSubdomain);
        }
        // Update remaining changes count
        if (result.subdomainChangesRemaining !== undefined) {
          setSubdomainChangesRemaining(result.subdomainChangesRemaining);
        }
        toast.success("Subdomain updated successfully!");
        // Invalidate project lists so Dashboard updates
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        refetchProject();
        await loadDomain();
      } else {
        toast.error(result.message || "Failed to update subdomain");
      }
    } catch (error) {
      toast.error("Failed to update subdomain");
    } finally {
      setIsSavingSubdomain(false);
    }
  };

  const subdomainHasChanges = editSubdomain !== project?.subdomain;
  const hasChangesRemaining = subdomainChangesRemaining === null || subdomainChangesRemaining > 0;
  const canSaveSubdomain = subdomainHasChanges && editSubdomain.length >= 3 && subdomainAvailable !== false && !checkingSubdomain && hasChangesRemaining;

  // Get DNS instructions
  const dnsInstructions = projectId 
    ? domainService.getDNSInstructions(customDomain || "", projectId)
    : null;

  if (!isVerified) {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 gap-1.5">
            <CheckCircle className="w-3 h-3" />
            Active
          </Badge>
        );
      case "verifying":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            Verifying
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 gap-1.5">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground gap-1.5">
            <AlertCircle className="w-3 h-3" />
            Pending Setup
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 gap-1.5">
            <CheckCircle className="w-3 h-3" />
            Active
          </Badge>
        );
      case "verifying":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            Verifying
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 gap-1.5">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground gap-1.5">
            <AlertCircle className="w-3 h-3" />
            Pending Setup
          </Badge>
        );
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground">Please connect and verify your wallet to access domain settings.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground">No project selected.</p>
            <Link to="/dashboard">
              <Button variant="outline" className="mt-4">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" />
                Domain Settings
              </h1>
              {project && (
                <p className="text-muted-foreground mt-1">
                  {project.coin_name} • {project.subdomain}.solsite.fun
                </p>
              )}
            </div>
          </div>

          {isLoading || projectLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Custom Domain - Coming Soon */}
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-muted/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <Badge variant="secondary" className="text-base px-4 py-2 bg-primary/20 text-primary border-primary/30">
                    Coming Soon
                  </Badge>
                </div>
                <CardHeader className="opacity-60">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Custom Domain</CardTitle>
                      <CardDescription>
                        Connect your own domain to your meme coin website
                      </CardDescription>
                    </div>
                    {domain?.custom_domain && getStatusBadge(domain.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="yourdomain.com"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSaveDomain} 
                      disabled={isSaving || !customDomain.trim()}
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>

                  {domain?.custom_domain && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleVerifyDomain}
                        disabled={isVerifying}
                        className="gap-2"
                      >
                        {isVerifying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        Verify DNS
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveDomain}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                      {domain.status === "active" && (
                        <a
                          href={`https://${domain.custom_domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Visit
                          </Button>
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* DNS Instructions */}
              {domain?.custom_domain && dnsInstructions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      DNS Configuration
                    </CardTitle>
                    <CardDescription>
                      Add these DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* A Record for root */}
                    <DNSRecordRow
                      type={dnsInstructions.aRecord.type}
                      name={dnsInstructions.aRecord.name}
                      value={dnsInstructions.aRecord.value}
                      description={dnsInstructions.aRecord.description}
                      onCopy={copyToClipboard}
                    />

                    {/* A Record for www */}
                    <DNSRecordRow
                      type={dnsInstructions.wwwRecord.type}
                      name={dnsInstructions.wwwRecord.name}
                      value={dnsInstructions.wwwRecord.value}
                      description={dnsInstructions.wwwRecord.description}
                      onCopy={copyToClipboard}
                    />

                    {/* TXT Record for verification */}
                    <DNSRecordRow
                      type={dnsInstructions.txtRecord.type}
                      name={dnsInstructions.txtRecord.name}
                      value={dnsInstructions.txtRecord.value}
                      description={dnsInstructions.txtRecord.description}
                      onCopy={copyToClipboard}
                    />

                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> DNS changes can take up to 48 hours to propagate. 
                        Once verified, SSL will be automatically provisioned for your domain.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Default Subdomain - Editable */}
              <Card>
                <CardHeader>
                  <CardTitle>Subdomain</CardTitle>
                  <CardDescription>
                    Change your site's subdomain URL
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subdomain changes limit info */}
                  <div className={cn(
                    "flex items-start gap-2 p-3 rounded-lg text-sm",
                    subdomainChangesRemaining === 0 
                      ? "bg-destructive/10 text-destructive" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      {subdomainChangesRemaining === 0 ? (
                        <span>You have used all 2 subdomain changes. No more changes are allowed.</span>
                      ) : subdomainChangesRemaining === 1 ? (
                        <span>You have <strong>1 subdomain change</strong> remaining. Choose carefully!</span>
                      ) : subdomainChangesRemaining === 2 ? (
                        <span>You can change your subdomain up to <strong>2 times</strong>.</span>
                      ) : (
                        <span>Subdomain changes are limited.</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      value={editSubdomain}
                      onChange={(e) => handleSubdomainChange(e.target.value)}
                      placeholder="yoursite"
                      className="font-mono text-sm max-w-[200px]"
                      maxLength={63}
                      disabled={subdomainChangesRemaining === 0}
                    />
                    <span className="text-muted-foreground font-mono text-sm">.solsite.fun</span>
                    <div className="w-5 h-5 flex items-center justify-center">
                      {checkingSubdomain ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      ) : subdomainAvailable === true && subdomainHasChanges ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : subdomainAvailable === false ? (
                        <X className="w-4 h-4 text-destructive" />
                      ) : null}
                    </div>
                    <Button
                      onClick={handleSaveSubdomain}
                      disabled={!canSaveSubdomain || isSavingSubdomain}
                      size="sm"
                    >
                      {isSavingSubdomain ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                  
                  {editSubdomain.length > 0 && editSubdomain.length < 3 && (
                    <p className="text-xs text-destructive">Must be at least 3 characters</p>
                  )}
                  {subdomainAvailable === false && (
                    <p className="text-xs text-destructive">This subdomain is already taken</p>
                  )}
                  {subdomainAvailable === true && subdomainHasChanges && hasChangesRemaining && (
                    <p className="text-xs text-accent">Subdomain is available!</p>
                  )}
                  
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <code className="flex-1 px-4 py-2 bg-muted rounded-lg text-sm font-mono">
                      {project?.subdomain}.solsite.fun
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(`${project?.subdomain}.solsite.fun`, "URL")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <a
                      href={`https://${project?.subdomain}.solsite.fun`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// DNS Record Row Component
interface DNSRecordRowProps {
  type: string;
  name: string;
  value: string;
  description: string;
  onCopy: (text: string, label: string) => void;
}

const DNSRecordRow = ({ type, name, value, description, onCopy }: DNSRecordRowProps) => (
  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Badge variant="outline" className="font-mono">
        {type}
      </Badge>
      <span>{description}</span>
    </div>
    <div className="grid grid-cols-[80px_1fr_auto] gap-3 items-center">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Name</p>
        <code className="text-sm font-mono">{name}</code>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-1">Value</p>
        <code className="text-sm font-mono truncate block">{value}</code>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => onCopy(value, `${type} record value`)}
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default DomainSettings;
