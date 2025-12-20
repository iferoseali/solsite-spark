import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useProject } from "@/hooks/queries/useProjects";
import { domainService, type Domain } from "@/services/domainService";
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
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const DomainSettings = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId");
  const { isVerified, user } = useWalletAuth();

  const { data: project, isLoading: projectLoading } = useProject(projectId || undefined);

  const [domain, setDomain] = useState<Domain | null>(null);
  const [customDomain, setCustomDomain] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Load domain data
  useEffect(() => {
    if (projectId) {
      loadDomain();
    }
  }, [projectId]);

  const loadDomain = async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const domainData = await domainService.getByProjectId(projectId);
      setDomain(domainData);
      if (domainData?.custom_domain) {
        setCustomDomain(domainData.custom_domain);
      }
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

  // Get DNS instructions
  const dnsInstructions = projectId 
    ? domainService.getDNSInstructions(customDomain || "", projectId)
    : null;

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
              {/* Current Domain Status */}
              <Card>
                <CardHeader>
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

              {/* Default Subdomain Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Default Subdomain</CardTitle>
                  <CardDescription>
                    Your site is always available at this address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
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
