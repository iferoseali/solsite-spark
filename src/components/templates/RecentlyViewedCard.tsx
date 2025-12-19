import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTemplateMeta } from "@/lib/templateData";
import type { TemplateBlueprint } from "@/types/template";

interface RecentlyViewedCardProps {
  template: TemplateBlueprint;
  templateId: string;
  onPreview: () => void;
}

export const RecentlyViewedCard: React.FC<RecentlyViewedCardProps> = ({
  template,
  templateId,
  onPreview,
}) => {
  const meta = getTemplateMeta(templateId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-shrink-0 w-48 rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onPreview}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{meta.emoji}</span>
          <h4 className="font-medium text-sm truncate">{template.name}</h4>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{meta.tagline}</p>
      </div>
      <div className="px-3 pb-3">
        <Link to={`/builder?templateId=${templateId}&blueprintId=${template.id}`} onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" className="w-full gap-1 text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Sparkles className="w-3 h-3" />
            Use Template
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
