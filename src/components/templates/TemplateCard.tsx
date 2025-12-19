import React, { useState, useEffect, forwardRef, memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Columns, Eye, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTemplateMeta } from "@/lib/templateData";
import type { TemplateBlueprint } from "@/types/template";

interface TemplateCardProps {
  template: TemplateBlueprint;
  templateId: string;
  isSelected: boolean;
  onSelect: () => void;
  isComparing: boolean;
  onToggleCompare: () => void;
  compareCount: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPreview: () => void;
  viewMode: "grid" | "list";
  index: number;
}

export const TemplateCard = memo(forwardRef<HTMLDivElement, TemplateCardProps>(({
  template,
  templateId,
  isSelected,
  onSelect,
  isComparing,
  onToggleCompare,
  compareCount,
  isFavorite,
  onToggleFavorite,
  onPreview,
  viewMode,
  index,
}, ref) => {
  const [thumbnailHtml, setThumbnailHtml] = useState<string | null>(null);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&templateId=${templateId}`;
  const meta = getTemplateMeta(templateId);

  useEffect(() => {
    const key = `tplthumb:v4:${templateId}`;
    const fromCache = (() => {
      try { return localStorage.getItem(key); } catch { return null; }
    })();

    if (fromCache) {
      setThumbnailHtml(fromCache);
      setThumbnailLoaded(true);
      return;
    }

    const loadThumbnail = async () => {
      try {
        const response = await fetch(previewUrl);
        const html = await response.text();
        setThumbnailHtml(html);
        setThumbnailLoaded(true);
        try { localStorage.setItem(key, html); } catch { /* ignore */ }
      } catch (error) {
        console.error("Error loading thumbnail:", error);
      }
    };
    loadThumbnail();
  }, [previewUrl, templateId]);

  if (viewMode === "list") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        onClick={onSelect}
        className={`group relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 bg-card border ${
          isSelected
            ? "border-primary shadow-lg shadow-primary/20"
            : isComparing
            ? "border-accent shadow-md shadow-accent/10"
            : "border-border hover:border-primary/50 hover:shadow-md"
        }`}
      >
        {/* Thumbnail */}
        <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/50">
          {thumbnailLoaded && thumbnailHtml ? (
            <div className="w-full h-full relative overflow-hidden">
              <div className="absolute inset-0 origin-top-left" style={{ transform: "scale(0.15)", width: "667%", height: "667%" }}>
                <iframe srcDoc={thumbnailHtml} className="w-full h-full border-0 pointer-events-none" title={`Thumbnail: ${template.name}`} sandbox="allow-scripts" loading="lazy" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full" style={{ background: `linear-gradient(135deg, ${template.styles?.primary || "#00d4ff"}, ${template.styles?.background || "#0a0a0a"})` }} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{meta.emoji}</span>
            <h3 className="font-semibold text-foreground truncate">{template.name}</h3>
            {isFavorite && <Heart className="w-4 h-4 fill-red-500 text-red-500" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{meta.tagline}</p>
          <div className="flex flex-wrap gap-1">
            {meta.features.slice(0, 3).map((feature, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{feature}</span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${isComparing ? "text-accent" : "text-muted-foreground"}`}
            onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
            disabled={compareCount >= 3 && !isComparing}
          >
            <Columns className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
          >
            <Eye className="w-3 h-3" />
            Preview
          </Button>
          <Link to={`/builder?templateId=${templateId}&blueprintId=${template.id}`} onClick={(e) => e.stopPropagation()}>
            <Button variant="glow" size="sm" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Use
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
        isSelected
          ? "ring-2 ring-primary shadow-2xl shadow-primary/30 scale-[1.02]"
          : isComparing
          ? "ring-2 ring-accent shadow-xl shadow-accent/20"
          : "hover:ring-1 hover:ring-primary/50 hover:shadow-xl"
      }`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(135deg, ${template.styles?.background || "#0a0a0a"} 0%, ${template.styles?.primary || "#00d4ff"}20 100%)`,
        }}
      />

      {/* Top actions */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
          className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
            isComparing
              ? "bg-accent border-accent text-accent-foreground"
              : "bg-black/40 border-white/30 text-white/60 hover:border-white/60"
          } ${compareCount >= 3 && !isComparing ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={compareCount >= 3 && !isComparing}
        >
          {isComparing ? <Check className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
        </button>
        
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="w-8 h-8 rounded-lg bg-black/40 border-2 border-white/30 flex items-center justify-center transition-all hover:border-white/60"
        >
          <Heart className={`w-4 h-4 transition-all ${isFavorite ? "fill-red-500 text-red-500" : "text-white/60"}`} />
        </button>
      </div>

      {/* Preview thumbnail */}
      <div className="relative aspect-[4/5] p-4">
        <div className="w-full h-full rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-black/30 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <div className="flex-1 mx-3 h-4 rounded bg-white/5 flex items-center px-2">
              <span className="text-[8px] text-white/40 truncate">solsite.xyz/preview</span>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
            {thumbnailLoaded && thumbnailHtml ? (
              <div className="absolute inset-0 origin-top-left" style={{ transform: "scale(0.22)", width: "455%", height: "455%" }}>
                <iframe srcDoc={thumbnailHtml} className="w-full h-full border-0 pointer-events-none" title={`Thumbnail: ${template.name}`} sandbox="allow-scripts" loading="lazy" />
              </div>
            ) : (
              <div className="flex-1 p-3 flex flex-col gap-2 animate-pulse h-full items-center justify-center">
                <div className="w-16 h-16 rounded-full" style={{ background: `linear-gradient(135deg, ${template.styles?.primary || "#00d4ff"}, ${template.styles?.background || "#0a0a0a"})` }} />
                <div className="w-24 h-3 rounded bg-white/20" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-14 right-5 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <Check className="w-5 h-5 text-primary-foreground" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
        >
          <Eye className="w-4 h-4" />
          Full Preview
        </Button>
      </div>

      {/* Label section */}
      <div className="relative p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent -mt-8 pt-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{meta.emoji}</span>
          <h3 className="font-bold text-lg text-white">{template.name}</h3>
        </div>
        <p className="text-sm text-white/60 mb-3 line-clamp-2">{meta.tagline}</p>
        <div className="flex flex-wrap gap-1.5">
          {meta.features.slice(0, 2).map((feature, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">{feature}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}));

TemplateCard.displayName = "TemplateCard";
