import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Sparkles, Save, Eye, Plus, Trash2, GripVertical } from "lucide-react";
import { SectionMapper } from "@/components/admin/SectionMapper";
import { StyleEditor } from "@/components/admin/StyleEditor";
import { AnimationConfig } from "@/components/admin/AnimationConfig";
import { TemplatePreview } from "@/components/admin/TemplatePreview";
import { WalletButton } from "@/components/wallet/WalletButton";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import {
  TemplateBlueprint,
  SectionDefinition,
  StyleConfig,
  AnimationConfig as AnimConfigType,
  AnalysisResult,
  DEFAULT_SECTIONS,
  DEFAULT_STYLES,
  DEFAULT_ANIMATIONS,
  LAYOUT_CATEGORIES,
  PERSONALITY_OPTIONS,
} from "@/lib/templateTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TemplateBuilder = () => {
  const navigate = useNavigate();
  const { walletAddress, isVerified } = useWalletAuth();
  const [referenceUrl, setReferenceUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [templateName, setTemplateName] = useState("New Template");
  const [layoutCategory, setLayoutCategory] = useState("hero-roadmap");
  const [personality, setPersonality] = useState("professional");
  const [sections, setSections] = useState<SectionDefinition[]>(DEFAULT_SECTIONS);
  const [styles, setStyles] = useState<StyleConfig>(DEFAULT_STYLES);
  const [animations, setAnimations] = useState<AnimConfigType>(DEFAULT_ANIMATIONS);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!referenceUrl) {
      toast.error("Please enter a reference URL");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-reference', {
        body: { url: referenceUrl }
      });

      if (error) throw error;

      if (data?.analysis) {
        const analysis = data.analysis as AnalysisResult;
        setAnalysisResult(analysis);
        
        // Apply analysis results
        if (analysis.sections) {
          const mappedSections: SectionDefinition[] = analysis.sections
            .filter(s => s.confidence > 0.5)
            .map((s, i) => ({
              type: s.type as SectionDefinition['type'],
              order: i + 1,
              visible: true,
              animation: 'fade-in' as const,
            }));
          if (mappedSections.length > 0) {
            setSections(mappedSections);
          }
        }
        
        if (analysis.colors) {
          setStyles(prev => ({
            ...prev,
            primaryColor: analysis.colors.primary || prev.primaryColor,
            accentColor: analysis.colors.accent || prev.accentColor,
            bgGradient: analysis.colors.background || prev.bgGradient,
          }));
        }

        if (analysis.layoutCategory) {
          setLayoutCategory(analysis.layoutCategory);
        }

        if (analysis.personality) {
          setPersonality(analysis.personality);
        }

        toast.success("Analysis complete! Review and adjust the settings.");
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze website. Using defaults.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-template', {
        body: {
          action: 'create',
          wallet_address: walletAddress,
          template: {
            name: templateName,
            reference_url: referenceUrl || null,
            sections: sections,
            styles: styles,
            animations: animations,
            layout_category: layoutCategory,
            personality: personality,
            is_active: true,
          },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success("Template saved successfully!");
      navigate('/templates');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || "Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Template Builder</h1>
          </div>
          <div className="flex items-center gap-2">
            <WalletButton />
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !walletAddress}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Template
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-4xl mx-auto'}`}>
          {/* Builder Panel */}
          <div className="space-y-6">
            {/* Reference URL Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Reference Analyzer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste reference website URL..."
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                </div>
                {analysisResult && (
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium text-foreground">Analysis Results:</p>
                    <p className="text-muted-foreground">
                      Detected {analysisResult.sections?.length || 0} sections • 
                      {analysisResult.layoutCategory} layout • 
                      {analysisResult.personality} style
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Template Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Layout Category</Label>
                    <Select value={layoutCategory} onValueChange={setLayoutCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LAYOUT_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Personality</Label>
                    <Select value={personality} onValueChange={setPersonality}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PERSONALITY_OPTIONS.map(p => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Mapper */}
            <SectionMapper sections={sections} onChange={setSections} />

            {/* Style Editor */}
            <StyleEditor styles={styles} onChange={setStyles} />

            {/* Animation Config */}
            <AnimationConfig animations={animations} onChange={setAnimations} />
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:sticky lg:top-4 h-fit">
              <Card className="overflow-hidden">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <TemplatePreview
                    sections={sections}
                    styles={styles}
                    animations={animations}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;
