import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

const Site = () => {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [html, setHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sourceUrl = useMemo(() => {
    if (!subdomain) return null;
    return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?subdomain=${encodeURIComponent(subdomain)}`;
  }, [subdomain]);

  useEffect(() => {
    if (!subdomain) return;
    document.title = `${subdomain} - Live Site | Solsite`;
  }, [subdomain]);

  useEffect(() => {
    const run = async () => {
      if (!sourceUrl) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${sourceUrl}&t=${Date.now()}`);
        const text = await res.text();
        setHtml(text);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load site");
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [sourceUrl]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-10">
        <div className="container px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
              </Button>
              <h1 className="text-lg sm:text-xl font-semibold font-display">
                {subdomain ? `${subdomain}.solsite.xyz` : "Live Site"}
              </h1>
            </div>
          </header>

          <section className="rounded-2xl border border-border overflow-hidden bg-background shadow-2xl h-[80vh]">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center p-6 text-center">
                <div>
                  <p className="text-sm text-destructive mb-2">Failed to load site</p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : html ? (
              <iframe
                srcDoc={html}
                className="w-full h-full border-0"
                title={subdomain ? `${subdomain} live site` : "Live site"}
                sandbox="allow-scripts allow-same-origin"
              />
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Site;
