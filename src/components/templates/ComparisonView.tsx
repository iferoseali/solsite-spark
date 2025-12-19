import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Columns, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATE_ID_MAP, getTemplateMeta } from "@/lib/templateData";
import type { TemplateBlueprint } from "@/types/template";

interface ComparisonViewProps {
  templates: TemplateBlueprint[];
  compareIds: string[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  templates,
  compareIds,
  onRemove,
  onClose,
}) => {
  const compareTemplates = templates.filter((t) => compareIds.includes(t.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Columns className="w-5 h-5 text-primary" />
          Compare Templates ({compareTemplates.length})
        </h2>
        <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
          <X className="w-4 h-4" />
          Close
        </Button>
      </div>

      {/* Comparison Grid */}
      <div className="flex-1 overflow-hidden p-4">
        <div className={`grid h-full gap-4 ${compareTemplates.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {compareTemplates.map((template) => {
            const templateId = TEMPLATE_ID_MAP[template.name] || "cult_minimal";
            const meta = getTemplateMeta(templateId);
            const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&templateId=${templateId}`;

            return (
              <motion.div 
                key={template.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col rounded-xl overflow-hidden border border-border bg-card"
              >
                {/* Template header */}
                <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="font-semibold">{template.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/builder?templateId=${templateId}&blueprintId=${template.id}`}>
                      <Button variant="glow" size="sm" className="gap-1">
                        <Sparkles className="w-3 h-3" />
                        Use
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => onRemove(template.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Live preview iframe */}
                <div className="flex-1 relative">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title={`Compare: ${template.name}`}
                    sandbox="allow-scripts"
                  />
                </div>

                {/* Features footer */}
                <div className="p-3 border-t border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">{meta.tagline}</p>
                  <div className="flex flex-wrap gap-1">
                    {meta.features.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{f}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
