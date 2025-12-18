import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ProjectData,
  TemplateConfig,
  getPersonalityStyles,
  WebsiteHeader,
  HeroSection,
  AboutSection,
  TokenomicsSection,
  RoadmapSection,
  FaqSection,
  CommunitySection,
  StorySection,
  UtilitySection,
  TeamSection,
  WebsiteFooter,
} from "@/components/website";

const WebsiteRenderer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const projectId = searchParams.get('id');
  const previewLayout = searchParams.get('layout');
  const previewPersonality = searchParams.get('personality');
  const isPreviewMode = !projectId && previewLayout && previewPersonality;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data from Supabase
  useEffect(() => {
    const fetchProject = async () => {
      if (isPreviewMode) {
        // Demo mode with sample data
        setProject({
          coinName: 'MoonDoge',
          ticker: '$MDOGE',
          tagline: 'To the moon and beyond 🚀',
          description: 'MoonDoge is the ultimate meme coin on Solana. Born from the dreams of diamond-handed degens, we\'re building a community that believes in the power of memes.',
          logoUrl: null,
          twitter: 'https://twitter.com/moondoge',
          discord: 'https://discord.gg/moondoge',
          telegram: 'https://t.me/moondoge',
          dexLink: 'https://raydium.io',
          showRoadmap: true,
          showFaq: true,
        });
        setTemplateConfig({
          layout: previewLayout!,
          personality: previewPersonality!,
        });
        setIsLoading(false);
        return;
      }

      if (!projectId) {
        setError('No project specified');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch project with template
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            *,
            templates (
              layout_id,
              personality_id,
              config
            )
          `)
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;

        if (!projectData) {
          setError('Project not found');
          setIsLoading(false);
          return;
        }

        // Map database fields to ProjectData
        setProject({
          id: projectData.id,
          coinName: projectData.coin_name,
          ticker: projectData.ticker,
          tagline: projectData.tagline || '',
          description: projectData.description || '',
          logoUrl: projectData.logo_url,
          twitter: projectData.twitter_url || '',
          discord: projectData.discord_url || '',
          telegram: projectData.telegram_url || '',
          dexLink: projectData.dex_link || '',
          showRoadmap: projectData.show_roadmap ?? true,
          showFaq: projectData.show_faq ?? true,
        });

        // Get template config
        const template = projectData.templates as { layout_id: string; personality_id: string; config: any } | null;
        setTemplateConfig({
          layout: template?.layout_id || 'minimal',
          personality: template?.personality_id || 'professional',
        });

      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, isPreviewMode, previewLayout, previewPersonality]);

  const styles = useMemo(() => {
    return getPersonalityStyles(templateConfig?.personality || 'professional');
  }, [templateConfig?.personality]);

  const handleEdit = () => {
    if (project?.id) {
      navigate(`/builder?edit=${project.id}`);
    }
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: styles.bgGradient }}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: styles.primary }} />
      </div>
    );
  }

  if (error || !project || !templateConfig) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%)' }}
      >
        <h1 className="text-2xl font-bold text-white">Site Not Found</h1>
        <p className="text-white/60">{error || 'This website does not exist'}</p>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>
    );
  }

  // Determine which sections to show based on layout
  const { layout } = templateConfig;
  const showStats = layout === 'stats-heavy' || layout === 'hero-roadmap';
  const showCommunity = layout === 'community' || layout === 'hero-roadmap';
  const showStory = layout === 'story-lore';
  const showUtility = layout === 'utility';
  const showTeam = layout === 'community' || layout === 'utility';

  return (
    <div 
      className="min-h-screen"
      style={{ background: styles.bgGradient }}
    >
      {/* Edit button for preview mode */}
      {isPreviewMode && (
        <div className="fixed top-4 right-4 z-50">
          <Button 
            onClick={() => navigate(`/builder?layout=${previewLayout}&personality=${previewPersonality}`)}
            style={{ background: styles.primary, color: '#000' }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Use This Template
          </Button>
        </div>
      )}

      {/* Header */}
      <WebsiteHeader 
        project={project} 
        styles={styles} 
        isEditing={!!project.id}
        onEdit={handleEdit}
      />

      {/* Hero */}
      <HeroSection project={project} styles={styles} />

      {/* About */}
      <AboutSection project={project} styles={styles} />

      {/* Stats/Tokenomics - for stats-heavy and hero-roadmap layouts */}
      {showStats && <TokenomicsSection project={project} styles={styles} />}

      {/* Community Section - for community and hero-roadmap layouts */}
      {showCommunity && <CommunitySection project={project} styles={styles} />}

      {/* Story/Lore - for story-lore layout */}
      {showStory && <StorySection project={project} styles={styles} />}

      {/* Utility - for utility layout */}
      {showUtility && <UtilitySection project={project} styles={styles} />}

      {/* Team - for community and utility layouts */}
      {showTeam && <TeamSection project={project} styles={styles} />}

      {/* Roadmap */}
      <RoadmapSection project={project} styles={styles} />

      {/* FAQ */}
      <FaqSection project={project} styles={styles} />

      {/* Footer */}
      <WebsiteFooter styles={styles} />
    </div>
  );
};

export default WebsiteRenderer;
