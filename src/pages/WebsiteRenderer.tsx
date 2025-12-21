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
import { AboutCentered, AboutSplit, AboutCards } from "@/components/website/sections/about";
import { FaqAccordion, FaqGrid } from "@/components/website/sections/faq";
import { CommunitySocials, CommunityCards } from "@/components/website/sections/community";
import { TeamGrid, TeamCards } from "@/components/website/sections/team";
import type { SectionConfig } from "@/types/section";

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
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (isPreviewMode) {
        setProject({
          coinName: 'MoonDoge',
          ticker: '$MDOGE',
          tagline: 'To the moon and beyond 🚀',
          description: 'MoonDoge is the ultimate meme coin on Solana. Built for the community, by the community.',
          logoUrl: null,
          twitter: 'https://twitter.com/moondoge',
          discord: 'https://discord.gg/moondoge',
          telegram: 'https://t.me/moondoge',
          dexLink: 'https://raydium.io',
          showRoadmap: true,
          showFaq: true,
        });
        
        // Map template to personality
        const personalityMap: Record<string, string> = {
          'degen_meme': 'degen',
          'cult_minimal': 'dark-cult',
          'vc_pro': 'professional',
          'dark_cult': 'dark-cult',
          'luxury_token': 'premium',
          'scroll_story': 'playful',
          'neo_grid': 'playful',
          'builder_utility': 'builder',
        };
        
        const selectedTemplate = templateId || previewLayout || 'cult_minimal';
        setTemplateConfig({
          layout: selectedTemplate,
          personality: previewPersonality || personalityMap[selectedTemplate] || 'professional',
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

        // Parse config for sections
        const config = projectData.config as { 
          sections?: SectionConfig[];
          templateId?: string;
        } | null;

        if (config?.sections && Array.isArray(config.sections)) {
          setSections(config.sections);
        }

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
          layout: config?.templateId || template?.layout_id || 'cult_minimal',
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
  const personality = templateConfig?.layout || 'professional';

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

  // Use sections from config if available, otherwise fall back to template definition
  const activeSections = sections.length > 0 
    ? sections.filter(s => s.visible).sort((a, b) => a.order - b.order)
    : templateDef?.sections || [];

  const getVariant = (type: string) => {
    const section = activeSections.find(s => s.type === type);
    return section?.variant || templateDef?.sections.find(s => s.type === type)?.variant || 'default';
  };

  const renderSection = (section: { type: string; variant?: string }) => {
    const variant = section.variant || getVariant(section.type);
    const props = { project, styles, personality };

    switch (section.type) {
      case 'hero':
        switch (variant) {
          case 'split': return <HeroSplit key="hero" {...props} />;
          case 'fullscreen': return <HeroFullScreen key="hero" {...props} />;
          case 'minimal': return <HeroMinimal key="hero" {...props} />;
          case 'asymmetric': return <HeroAsymmetric key="hero" {...props} />;
          default: return <HeroCentered key="hero" {...props} />;
        }
      case 'about':
        switch (variant) {
          case 'split': return <AboutSplit key="about" {...props} />;
          case 'cards': return <AboutCards key="about" {...props} />;
          default: return <AboutCentered key="about" {...props} />;
        }
      case 'tokenomics':
        switch (variant) {
          case 'cards': return <TokenomicsCards key="tokenomics" {...props} />;
          case 'horizontal': return <TokenomicsHorizontal key="tokenomics" {...props} />;
          case 'circular': return <TokenomicsCircular key="tokenomics" {...props} />;
          default: return <TokenomicsGrid key="tokenomics" {...props} />;
        }
      case 'roadmap':
        if (!project.showRoadmap) return null;
        switch (variant) {
          case 'horizontal': return <RoadmapHorizontal key="roadmap" {...props} />;
          case 'cards': return <RoadmapCards key="roadmap" {...props} />;
          case 'zigzag': return <RoadmapZigzag key="roadmap" {...props} />;
          default: return <RoadmapTimeline key="roadmap" {...props} />;
        }
      case 'faq':
        if (!project.showFaq) return null;
        switch (variant) {
          case 'grid': return <FaqGrid key="faq" {...props} />;
          default: return <FaqAccordion key="faq" {...props} />;
        }
      case 'community':
        switch (variant) {
          case 'cards': return <CommunityCards key="community" {...props} />;
          default: return <CommunitySocials key="community" {...props} />;
        }
      case 'team':
        switch (variant) {
          case 'cards': return <TeamCards key="team" {...props} />;
          default: return <TeamGrid key="team" {...props} />;
        }
      case 'story':
        return <StorySection key="story" project={project} styles={styles} />;
      case 'utility':
        return <UtilitySection key="utility" project={project} styles={styles} />;
      default:
        return null;
    }
  };

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
      
      {activeSections.map((section) => renderSection(section))}

      <WebsiteFooter styles={styles} />
    </div>
  );
};

export default WebsiteRenderer;
