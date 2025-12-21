import { useState, useCallback, memo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SortableSectionItem } from "./SortableSectionItem";
import {
  SectionConfig,
  SectionType,
  SECTION_LABELS,
  SECTION_ICONS,
  SECTION_VARIANTS,
  DEFAULT_SECTIONS,
  generateSectionId,
} from "./sectionTypes";

interface SectionManagerProps {
  sections: SectionConfig[];
  onChange: (sections: SectionConfig[]) => void;
}

export const SectionManager = memo(function SectionManager({ sections, onChange }: SectionManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
        ...s,
        order: i,
      }));
      
      onChange(newSections);
    }
  }, [sections, onChange]);

  const handleToggleVisibility = useCallback((id: string) => {
    onChange(
      sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      )
    );
  }, [sections, onChange]);

  const handleChangeVariant = useCallback((id: string, variant: string) => {
    onChange(
      sections.map((s) =>
        s.id === id ? { ...s, variant } : s
      )
    );
  }, [sections, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(sections.filter((s) => s.id !== id));
  }, [sections, onChange]);

  const handleAddSection = useCallback((type: SectionType) => {
    const defaultVariant = SECTION_VARIANTS[type]?.[0]?.value || 'default';
    const newSection: SectionConfig = {
      id: generateSectionId(type),
      type,
      variant: defaultVariant,
      visible: true,
      order: sections.length,
    };
    onChange([...sections, newSection]);
    setIsAddDialogOpen(false);
  }, [sections, onChange]);

  // Available section types to add (excluding ones that already exist as single instances)
  const singleInstanceTypes: SectionType[] = ['hero'];
  const availableTypes = (Object.keys(SECTION_LABELS) as SectionType[]).filter(
    (type) => !singleInstanceTypes.includes(type) || !sections.some((s) => s.type === type)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Sections</h3>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Section</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 pt-4">
              {availableTypes.map((type) => (
                <motion.button
                  key={type}
                  className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                  onClick={() => handleAddSection(type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl mb-2 block">{SECTION_ICONS[type]}</span>
                  <span className="font-medium text-sm">{SECTION_LABELS[type]}</span>
                </motion.button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        id="sections-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    onToggleVisibility={handleToggleVisibility}
                    onChangeVariant={handleChangeVariant}
                    onRemove={handleRemove}
                    isRemovable={section.type !== 'hero'}
                  />
                ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No sections added yet.</p>
          <p className="text-xs">Click "Add" to get started.</p>
        </div>
      )}
    </div>
  );
});

// Re-export for backwards compatibility
export { DEFAULT_SECTIONS } from "./sectionTypes";
export type { SectionConfig } from "@/types/section";
