import { useState, useEffect, useMemo, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Eye, Sparkles, X, 
  Search, Heart, Grid3X3, List, SlidersHorizontal,
  ArrowUpDown, ChevronDown, Clock, Trash2
} from "lucide-react";
import { useTemplateFavorites } from "@/hooks/useTemplateFavorites";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useTemplateBlueprints, useTemplatePreview } from "@/hooks/queries/useTemplates";
import { PreviewModal } from "@/components/templates/PreviewModal";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { RecentlyViewedCard } from "@/components/templates/RecentlyViewedCard";
import { ComparisonView } from "@/components/templates/ComparisonView";
import { TemplateGridSkeleton } from "@/components/skeletons";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  TEMPLATE_META, 
  TEMPLATE_CATEGORIES, 
  SORT_OPTIONS,
  getTemplateId,
  type Category,
  type SortOption,
} from "@/lib/templates";
import type { TemplateBlueprint } from "@/types/template";

const Templates = () => {
  // Use React Query for templates (cached, auto-refetch)
  const { data: templates = [], isLoading } = useTemplateBlueprints();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeCategories, setActiveCategories] = useState<Category[]>(["all"]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Preview modal state
  const [previewTemplate, setPreviewTemplate] = useState<{ template: TemplateBlueprint; templateId: string } | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  // Use React Query for preview HTML (cached per template)
  const { data: previewHtml, isLoading: previewLoading } = useTemplatePreview(previewTemplateId);

  const { favorites, toggleFavorite, isFavorite } = useTemplateFavorites();
  const { recentlyViewed, addRecentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("template-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openPreview = useCallback((template: TemplateBlueprint, templateId: string) => {
    setPreviewTemplate({ template, templateId });
    setPreviewTemplateId(templateId);
    addRecentlyViewed(template.id);
  }, [addRecentlyViewed]);

  const closePreview = useCallback(() => {
    setPreviewTemplate(null);
    setPreviewTemplateId(null);
  }, []);

  // Memoize handlers to prevent unnecessary re-renders
  const handleSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
  }, []);

  const handleToggleCompare = useCallback((id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const toggleCategory = useCallback((cat: Category) => {
    if (cat === "all") {
      setActiveCategories(["all"]);
    } else {
      setActiveCategories((prev) => {
        const withoutAll = prev.filter((c) => c !== "all");
        if (withoutAll.includes(cat)) {
          const newCats = withoutAll.filter((c) => c !== cat);
          return newCats.length === 0 ? ["all"] : newCats;
        }
        return [...withoutAll, cat];
      });
    }
  }, []);

  const filteredAndSortedTemplates = useMemo(() => {
    let result = templates;

    // Filter by favorites
    if (showFavoritesOnly) {
      result = result.filter((t) => isFavorite(t.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((t) => {
        const templateId = getTemplateId(t.name);
        const meta = TEMPLATE_META[templateId];
        return (
          t.name.toLowerCase().includes(query) ||
          meta?.tagline.toLowerCase().includes(query) ||
          meta?.features.some((f) => f.toLowerCase().includes(query))
        );
      });
    }

    // Filter by categories
    if (!activeCategories.includes("all")) {
      result = result.filter((t) => {
        const templateId = getTemplateId(t.name);
        const meta = TEMPLATE_META[templateId];
        if (!meta) return false;
        
        // Check if premium filter is selected
        if (activeCategories.includes("premium" as Category) && meta.isPremium) {
          return true;
        }
        
        // Check other categories
        const nonPremiumCategories = activeCategories.filter(c => c !== "premium") as string[];
        if (nonPremiumCategories.length > 0 && !meta.isPremium) {
          return nonPremiumCategories.includes(meta.category as string);
        }
        
        // If only premium is selected and template is not premium, exclude it
        if (activeCategories.length === 1 && activeCategories.includes("premium" as Category)) {
          return meta.isPremium === true;
        }
        
        return false;
      });
    }

    // Sort
    result = [...result].sort((a, b) => {
      const aId = getTemplateId(a.name);
      const bId = getTemplateId(b.name);
      const aMeta = TEMPLATE_META[aId];
      const bMeta = TEMPLATE_META[bId];

      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return b.name.localeCompare(a.name);
        case "popular":
          return (bMeta?.popularity || 0) - (aMeta?.popularity || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [templates, searchQuery, activeCategories, sortBy, showFavoritesOnly, isFavorite]);


  const recentTemplates = useMemo(() => {
    return recentlyViewed
      .map((id) => templates.find((t) => t.id === id))
      .filter((t): t is TemplateBlueprint => t !== undefined);
  }, [recentlyViewed, templates]);

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);
  const selectedTemplateId = selectedTemplateData ? getTemplateId(selectedTemplateData.name) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
              Choose Your <span className="text-gradient-primary">Template</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              20+ unique designs with distinct personalities, animations, and visual effects.
            </p>
          </motion.div>

          {/* Recently Viewed Section */}
          {recentTemplates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h2 className="font-semibold text-sm text-muted-foreground">Recently Viewed</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentlyViewed}
                  className="text-xs text-muted-foreground hover:text-foreground gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </Button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {recentTemplates.map((template) => {
                  const templateId = getTemplateId(template.name);
                  return (
                    <RecentlyViewedCard
                      key={template.id}
                      template={template}
                      templateId={templateId}
                      onPreview={() => openPreview(template, templateId)}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Search & Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3 md:space-y-4 mb-6 md:mb-8"
          >
            {/* Search bar - mobile optimized */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="template-search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 md:h-auto"
                />
              </div>
              
              {/* View mode toggle */}
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort dropdown - responsive text */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 md:gap-2 px-2 md:px-4">
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden sm:inline">{SORT_OPTIONS.find((o) => o.id === sortBy)?.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem key={option.id} onClick={() => setSortBy(option.id)}>
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Favorites filter - icon only on mobile */}
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="gap-1 md:gap-2 px-2 md:px-4"
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
                <span className="hidden sm:inline">Favorites</span>
                {favorites.length > 0 && <span className="text-xs">({favorites.length})</span>}
              </Button>
            </div>

            {/* Category filters - horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategories.includes(cat.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Compare bar - mobile responsive */}
          <AnimatePresence>
            {compareIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 md:bottom-6 left-2 right-2 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40 bg-card border border-border rounded-xl md:rounded-2xl shadow-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between md:justify-start gap-2 md:gap-4"
              >
                <span className="text-xs md:text-sm font-medium">
                  {compareIds.length} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => setShowComparison(true)}
                    disabled={compareIds.length < 2}
                    className="gap-1 md:gap-2 text-xs md:text-sm"
                  >
                    <SlidersHorizontal className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Compare</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setCompareIds([])} className="p-2">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Template grid/list */}
          {isLoading ? (
            <TemplateGridSkeleton count={8} viewMode={viewMode} />
          ) : filteredAndSortedTemplates.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No templates found matching your criteria</p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategories(["all"]); setShowFavoritesOnly(false); }}>
                Clear filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              {filteredAndSortedTemplates.map((template, index) => {
                const templateId = getTemplateId(template.name);
                return (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    templateId={templateId}
                    isSelected={selectedTemplate === template.id}
                    onSelect={() => handleSelect(template.id)}
                    isComparing={compareIds.includes(template.id)}
                    onToggleCompare={() => handleToggleCompare(template.id)}
                    compareCount={compareIds.length}
                    isFavorite={isFavorite(template.id)}
                    onToggleFavorite={() => handleToggleFavorite(template.id)}
                    onPreview={() => openPreview(template, templateId)}
                    viewMode={viewMode}
                    index={index}
                  />
                );
              })}
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedTemplates.map((template, index) => {
                const templateId = getTemplateId(template.name);
                return (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    templateId={templateId}
                    isSelected={selectedTemplate === template.id}
                    onSelect={() => handleSelect(template.id)}
                    isComparing={compareIds.includes(template.id)}
                    onToggleCompare={() => handleToggleCompare(template.id)}
                    compareCount={compareIds.length}
                    isFavorite={isFavorite(template.id)}
                    onToggleFavorite={() => handleToggleFavorite(template.id)}
                    onPreview={() => openPreview(template, templateId)}
                    viewMode={viewMode}
                    index={index}
                  />
                );
              })}
            </div>
          )}

          {/* CTA */}
          {selectedTemplateData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center"
            >
              <Link to={`/builder?templateId=${selectedTemplateId}&blueprintId=${selectedTemplateData.id}`}>
                <Button variant="glow" size="lg" className="gap-2">
                  <Sparkles className="w-5 h-5" />
                  Use {selectedTemplateData.name} Template
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <PreviewModal
            isOpen={!!previewTemplate}
            templateName={previewTemplate.template.name}
            templateId={previewTemplate.templateId}
            blueprintId={previewTemplate.template.id}
            previewHtml={previewHtml}
            isLoading={previewLoading}
            onClose={closePreview}
          />
        )}
      </AnimatePresence>

      {/* Comparison View */}
      <AnimatePresence>
        {showComparison && (
          <ComparisonView
            templates={templates}
            compareIds={compareIds}
            onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Templates;
