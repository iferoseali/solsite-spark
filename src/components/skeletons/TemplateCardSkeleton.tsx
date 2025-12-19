import { motion } from "framer-motion";

interface TemplateCardSkeletonProps {
  viewMode?: "grid" | "list";
}

export const TemplateCardSkeleton = ({ viewMode = "grid" }: TemplateCardSkeletonProps) => {
  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border animate-pulse">
        {/* Thumbnail */}
        <div className="w-32 h-24 rounded-lg bg-muted flex-shrink-0" />
        
        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-muted" />
            <div className="h-5 w-32 rounded bg-muted" />
          </div>
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="flex gap-1">
            <div className="h-5 w-20 rounded-full bg-muted" />
            <div className="h-5 w-24 rounded-full bg-muted" />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded bg-muted" />
          <div className="w-8 h-8 rounded bg-muted" />
          <div className="w-20 h-8 rounded bg-muted" />
          <div className="w-16 h-8 rounded bg-muted" />
        </div>
      </div>
    );
  }

  // Grid view skeleton
  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border animate-pulse">
      {/* Background gradient placeholder */}
      <div className="relative aspect-[4/5] p-4 bg-gradient-to-br from-muted to-muted/50">
        {/* Top actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <div className="w-8 h-8 rounded-lg bg-black/20" />
          <div className="w-8 h-8 rounded-lg bg-black/20" />
        </div>
        
        {/* Preview area */}
        <div className="w-full h-full rounded-xl bg-black/20 flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
      
      {/* Label section */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-muted" />
          <div className="h-5 w-28 rounded bg-muted" />
        </div>
        <div className="h-4 w-full rounded bg-muted" />
        <div className="flex gap-1.5">
          <div className="h-5 w-20 rounded-full bg-muted" />
          <div className="h-5 w-24 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
};

export const TemplateGridSkeleton = ({ count = 8, viewMode = "grid" }: { count?: number; viewMode?: "grid" | "list" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={viewMode === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-3"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <TemplateCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </motion.div>
  );
};
