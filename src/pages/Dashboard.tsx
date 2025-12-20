import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { WalletVerification } from "@/components/wallet/WalletVerification";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Plus, Wallet, RefreshCw } from "lucide-react";
import { useUserProjects, useDeleteProject, useUpdateProject, useDuplicateProject } from "@/hooks/queries/useProjects";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DeleteProjectDialog } from "@/components/dashboard/DeleteProjectDialog";
import { toast } from "sonner";

interface Project {
  id: string;
  coin_name: string;
  ticker: string;
  subdomain: string | null;
  status: string | null;
  created_at: string;
  template_id: string | null;
  config: {
    templateId?: string;
    blueprintId?: string;
  } | null;
}

const Dashboard = () => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { isVerified, user, isVerifying, isLoading: isAuthLoading } = useWalletAuth();
  
  const { data: projects = [], isLoading: isProjectsLoading, refetch, isFetching } = useUserProjects(user?.id);
  const deleteProjectMutation = useDeleteProject();
  const updateProjectMutation = useUpdateProject();
  const duplicateProjectMutation = useDuplicateProject();
  
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteProjectMutation.mutateAsync(projectToDelete.id);
      toast.success(`${projectToDelete.coin_name} deleted successfully`);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleTogglePublish = async (project: Project) => {
    const newStatus = project.status === "published" ? "draft" : "published";
    
    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        data: { status: newStatus },
      });
      toast.success(
        newStatus === "published" 
          ? `${project.coin_name} is now live!` 
          : `${project.coin_name} unpublished`
      );
    } catch (error) {
      toast.error("Failed to update project status");
    }
  };

  const handleDuplicate = async (project: Project) => {
    if (!user?.id) return;
    
    try {
      await duplicateProjectMutation.mutateAsync({
        id: project.id,
        userId: user.id,
      });
      toast.success(`${project.coin_name} duplicated successfully`);
    } catch (error) {
      toast.error("Failed to duplicate project");
    }
  };

  const handleRename = async (project: Project, newName: string) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        data: { coin_name: newName },
      });
      toast.success("Project renamed");
    } catch (error) {
      toast.error("Failed to rename project");
    }
  };

  // Loading auth state
  if (isAuthLoading && connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="aspect-[4/3] rounded-2xl bg-card border border-border animate-pulse" 
                />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not connected state
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

  // Not verified state
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-display font-bold mb-6 text-center">
                {isVerifying ? "Verifying..." : "Verify Your Wallet"}
              </h1>
              <WalletVerification />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const typedProjects = projects as unknown as Project[];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold">My Projects</h1>
              <p className="text-muted-foreground mt-1">
                {typedProjects.length > 0 
                  ? `${typedProjects.length} project${typedProjects.length > 1 ? "s" : ""}`
                  : "Manage your meme coin websites"
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                className="shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
              
              {typedProjects.length > 0 && (
                <Link to="/builder">
                  <Button variant="glow" className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Project
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Content */}
          {isProjectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="aspect-[4/3] rounded-2xl bg-card border border-border animate-pulse" 
                />
              ))}
            </div>
          ) : typedProjects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteClick}
                  onTogglePublish={handleTogglePublish}
                  onDuplicate={handleDuplicate}
                  onRename={handleRename}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (mobile) */}
      {typedProjects.length > 0 && (
        <Link 
          to="/builder"
          className="fixed bottom-6 right-6 md:hidden z-40"
        >
          <Button 
            variant="glow" 
            size="icon" 
            className="w-14 h-14 rounded-full shadow-2xl"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      )}

      <Footer />

      {/* Delete Confirmation Dialog */}
      <DeleteProjectDialog
        project={projectToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteProjectMutation.isPending}
      />
    </div>
  );
};

export default Dashboard;
