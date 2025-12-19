import React, { useRef, useCallback, memo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TemplateCard } from "./TemplateCard";
import { TemplateGridSkeleton } from "@/components/skeletons";
import type { TemplateBlueprint } from "@/types/template";

interface VirtualTemplateGridProps {
  templates: TemplateBlueprint[];
  viewMode: "grid" | "list";
  selectedTemplate: string | null;
  compareIds: string[];
  onSelect: (id: string) => void;
  onToggleCompare: (id: string) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onPreview: (template: TemplateBlueprint, templateId: string) => void;
  getTemplateId: (name: string) => string;
  isLoading?: boolean;
}

// Calculate columns based on viewport width
const getColumnsForWidth = (width: number): number => {
  if (width >= 1280) return 4; // xl
  if (width >= 1024) return 3; // lg
  if (width >= 640) return 2;  // sm
  return 1;
};

// Row heights for different view modes
const GRID_ROW_HEIGHT = 480; // Approximate height of grid card
const LIST_ROW_HEIGHT = 120; // Height of list item
const GAP = 24;

export const VirtualTemplateGrid = memo<VirtualTemplateGridProps>(({
  templates,
  viewMode,
  selectedTemplate,
  compareIds,
  onSelect,
  onToggleCompare,
  isFavorite,
  onToggleFavorite,
  onPreview,
  getTemplateId,
  isLoading,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(1200);

  // Update container width on resize
  React.useEffect(() => {
    const updateWidth = () => {
      if (parentRef.current) {
        setContainerWidth(parentRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const columns = viewMode === "grid" ? getColumnsForWidth(containerWidth) : 1;
  const rowCount = Math.ceil(templates.length / columns);
  const rowHeight = viewMode === "grid" ? GRID_ROW_HEIGHT : LIST_ROW_HEIGHT;

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => rowHeight + GAP, [rowHeight]),
    overscan: 2,
  });

  if (isLoading) {
    return <TemplateGridSkeleton count={8} viewMode={viewMode} />;
  }

  if (templates.length === 0) {
    return null;
  }

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="w-full overflow-auto"
      style={{ height: "100%", maxHeight: "calc(100vh - 400px)" }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualRows.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowTemplates = templates.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-3"
                }
              >
                {rowTemplates.map((template, colIndex) => {
                  const templateId = getTemplateId(template.name);
                  const globalIndex = startIndex + colIndex;
                  
                  return (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      templateId={templateId}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => onSelect(template.id)}
                      isComparing={compareIds.includes(template.id)}
                      onToggleCompare={() => onToggleCompare(template.id)}
                      compareCount={compareIds.length}
                      isFavorite={isFavorite(template.id)}
                      onToggleFavorite={() => onToggleFavorite(template.id)}
                      onPreview={() => onPreview(template, templateId)}
                      viewMode={viewMode}
                      index={globalIndex}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualTemplateGrid.displayName = "VirtualTemplateGrid";
