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
  AboutSection,
  FaqSection,
  CommunitySection,
  StorySection,
  UtilitySection,
  TeamSection,
  WebsiteFooter,
} from "@/components/website";
import { getTemplateById } from "@/lib/templateRegistry";

// Section variants
import { HeroCentered, HeroSplit, HeroFullScreen, HeroMinimal, HeroAsymmetric } from "@/components/website/sections/hero";
import { TokenomicsGrid, TokenomicsCards, TokenomicsHorizontal, TokenomicsCircular } from "@/components/website/sections/tokenomics";
import { RoadmapTimeline, RoadmapHorizontal, RoadmapCards, RoadmapZigzag } from "@/components/website/sections/roadmap";

const WebsiteRenderer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const projectId = searchParams.get('id');
  const previewLayout = searchParams.get('layout');
  const previewPersonality = searchParams.get('personality');
  const templateId = searchParams.get('template');
  const isPreviewMode = !projectId && (previewLayout || templateId);

  const [project, setProject] = useState<ProjectData | null>(null);
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (isPreviewMode) {
        setProject({
          coinName: 'MoonDoge',
          ticker: '$MDOGE',
          tagline: 'To the moon and beyond 🚀',
          description: 'MoonDoge is the ultimate meme coin on Solana.',
          logoUrl: null,
          twitter: 'https://twitter.com/moondoge',
          discord: 'https://discord.gg/moondoge',
          telegram: 'https://t.me/moondoge',
          dexLink: 'https://raydium.io',
          showRoadmap: true,
          showFaq: true,
        });
        setTemplateConfig({
          layout: previewLayout || templateId || 'cult_minimal',
          personality: previewPersonality || 'professional',
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
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`*, templates (layout_id, personality_id, config)`)
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;
        if (!projectData) { setError('Project not found'); setIsLoading(false); return; }

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

        const template = projectData.templates as { layout_id: string; personality_id: string } | null;
        setTemplateConfig({
          layout: template?.layout_id || 'cult_minimal',
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
  }, [projectId, isPreviewMode, previewLayout, previewPersonality, templateId]);

  const styles = useMemo(() => getPersonalityStyles(templateConfig?.personality || 'professional'), [templateConfig?.personality]);
  const templateDef = useMemo(() => getTemplateById(templateConfig?.layout || 'cult_minimal'), [templateConfig?.layout]);

  const handleEdit = () => { if (project?.id) navigate(`/builder?edit=${project.id}`); };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: styles.bgGradient }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: styles.primary }} />
      </div>
    );
  }

  if (error || !project || !templateConfig) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%)' }}>
        <h1 className="text-2xl font-bold text-white">Site Not Found</h1>
        <p className="text-white/60">{error || 'This website does not exist'}</p>
        <Button onClick={() => navigate('/')} variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Go Home</Button>
      </div>
    );
  }

  // Get hero variant
  const heroVariant = templateDef?.sections.find(s => s.type === 'hero')?.variant || 'centered';
  const tokenomicsVariant = templateDef?.sections.find(s => s.type === 'tokenomics')?.variant || 'grid';
  const roadmapVariant = templateDef?.sections.find(s => s.type === 'roadmap')?.variant || 'timeline';

  const renderHero = () => {
    switch (heroVariant) {
      case 'split': return <HeroSplit project={project} styles={styles} />;
      case 'fullscreen': return <HeroFullScreen project={project} styles={styles} />;
      case 'minimal': return <HeroMinimal project={project} styles={styles} />;
      case 'asymmetric': return <HeroAsymmetric project={project} styles={styles} />;
      default: return <HeroCentered project={project} styles={styles} />;
    }
  };

  const renderTokenomics = () => {
    switch (tokenomicsVariant) {
      case 'cards': return <TokenomicsCards project={project} styles={styles} />;
      case 'horizontal': return <TokenomicsHorizontal project={project} styles={styles} />;
      case 'circular': return <TokenomicsCircular project={project} styles={styles} />;
      default: return <TokenomicsGrid project={project} styles={styles} />;
    }
  };

  const renderRoadmap = () => {
    if (!project.showRoadmap) return null;
    switch (roadmapVariant) {
      case 'horizontal': return <RoadmapHorizontal project={project} styles={styles} />;
      case 'cards': return <RoadmapCards project={project} styles={styles} />;
      case 'zigzag': return <RoadmapZigzag project={project} styles={styles} />;
      default: return <RoadmapTimeline project={project} styles={styles} />;
    }
  };

  const hasStory = templateDef?.sections.some(s => s.type === 'story');
  const hasUtility = templateDef?.sections.some(s => s.type === 'utility');
  const hasTeam = templateDef?.sections.some(s => s.type === 'team');
  const hasCommunity = templateDef?.sections.some(s => s.type === 'community');

  return (
    <div className="min-h-screen" style={{ background: styles.bgGradient }}>
      {isPreviewMode && (
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={() => navigate(`/builder?template=${templateConfig.layout}`)} style={{ background: styles.primary, color: '#000' }}>
            <Edit className="w-4 h-4 mr-2" />Use This Template
          </Button>
        </div>
      )}

      <WebsiteHeader project={project} styles={styles} isEditing={!!project.id} onEdit={handleEdit} />
      {renderHero()}
      <AboutSection project={project} styles={styles} />
      {renderTokenomics()}
      {hasCommunity && <CommunitySection project={project} styles={styles} />}
      {hasStory && <StorySection project={project} styles={styles} />}
      {hasUtility && <UtilitySection project={project} styles={styles} />}
      {hasTeam && <TeamSection project={project} styles={styles} />}
      {renderRoadmap()}
      <FaqSection project={project} styles={styles} />
      <WebsiteFooter styles={styles} />
    </div>
  );
};

export default WebsiteRenderer;
