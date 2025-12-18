import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { WalletVerification } from "@/components/wallet/WalletVerification";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Globe, 
  Calendar, 
  ExternalLink,
  Wallet,
  Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  coin_name: string;
  ticker: string;
  subdomain: string | null;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { isVerified, user } = useWalletAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('id, coin_name, ticker, subdomain, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
      setIsLoading(false);
    };

    if (isVerified && user) {
      fetchProjects();
    }
  }, [isVerified, user]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">
                Connect Your Wallet
              </h1>
              <p className="text-muted-foreground mb-8">
                Connect your Solana wallet to access your dashboard and manage your meme coin websites.
              </p>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setVisible(true)}
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-display font-bold mb-6 text-center">
                Verify Your Wallet
              </h1>
              <WalletVerification />
            </div>
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
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">
                My Projects
              </h1>
              <p className="text-muted-foreground">
                Manage your meme coin websites
              </p>
            </div>
            <Link to="/builder">
              <Button variant="glow" className="gap-2">
                <Plus className="w-4 h-4" />
                Create New Site
              </Button>
            </Link>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-2xl glass animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-muted mb-4" />
                  <div className="w-2/3 h-5 rounded bg-muted mb-2" />
                  <div className="w-1/2 h-4 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">
                No Projects Yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first meme coin website in seconds. Choose from 30 stunning templates.
              </p>
              <Link to="/builder">
                <Button variant="hero" size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Create Your First Site
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="p-6 rounded-2xl glass hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {project.ticker?.[1] || '?'}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'published' 
                        ? 'bg-accent/20 text-accent' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                    {project.coin_name}
                  </h3>
                  <p className="text-sm text-primary font-mono mb-3">
                    {project.ticker}
                  </p>
                  
                  {project.subdomain && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Globe className="w-4 h-4" />
                      <span className="font-mono">{project.subdomain}.solsite.xyz</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    {project.status === 'published' && project.subdomain && (
                      <Button variant="ghost" size="sm" asChild>
                        <a 
                          href={`https://${project.subdomain}.solsite.xyz`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
