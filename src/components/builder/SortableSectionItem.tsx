import React, { memo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical, Eye, EyeOff, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SectionConfig, SECTION_LABELS, SECTION_ICONS, SECTION_VARIANTS } from "./sectionTypes";

interface SortableSectionItemProps {
  section: SectionConfig;
  onToggleVisibility: (id: string) => void;
  onChangeVariant: (id: string, variant: string) => void;
  onRemove: (id: string) => void;
  isRemovable: boolean;
}

export const SortableSectionItem = memo(({
  section,
  onToggleVisibility,
  onChangeVariant,
  onRemove,
  isRemovable,
}: SortableSectionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const variants = SECTION_VARIANTS[section.type] || [];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border transition-all ${
        isDragging 
          ? 'border-primary bg-primary/5 shadow-lg z-50' 
          : section.visible 
            ? 'border-border bg-card' 
            : 'border-border/50 bg-card/50 opacity-60'
      }`}
      layout
    >
      <div className="flex items-center gap-3 p-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Icon & Label */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-lg">{SECTION_ICONS[section.type]}</span>
          <span className="font-medium text-sm truncate">
            {SECTION_LABELS[section.type]}
          </span>
          <span className="text-xs text-muted-foreground">
            ({variants.find(v => v.value === section.variant)?.label || section.variant})
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleVisibility(section.id)}
          >
            {section.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
          
          {variants.length > 1 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          )}

          {isRemovable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onRemove(section.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Variant Selector */}
      {variants.length > 1 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <div className="px-3 pb-3 pt-1 border-t border-border/50">
              <label className="text-xs text-muted-foreground mb-2 block">Layout Variant</label>
              <Select
                value={section.variant}
                onValueChange={(value) => onChangeVariant(section.id, value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((variant) => (
                    <SelectItem key={variant.value} value={variant.value}>
                      {variant.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </motion.div>
  );
});

SortableSectionItem.displayName = "SortableSectionItem";
