import { useCallback, memo } from "react";
import { Plus, Trash2, Sparkles, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Feature, generateItemId } from "@/types/builder";

interface FeaturesEditorProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
}

const ICON_OPTIONS = ['⚡', '🔒', '🚀', '💎', '🎯', '🔥', '💰', '🌟', '🎁', '🛡️'];

interface SortableFeatureProps {
  feature: Feature;
  onChange: (id: string, field: keyof Feature, value: string) => void;
  onRemove: (id: string) => void;
}

const SortableFeature = ({ feature, onChange, onRemove }: SortableFeatureProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: feature.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 rounded-xl border border-border bg-card/50 space-y-3"
    >
      <div className="flex items-start gap-3">
        <div 
          className="cursor-grab active:cursor-grabbing pt-2"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Icon</Label>
          <div className="flex flex-wrap gap-1">
            {ICON_OPTIONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => onChange(feature.id, 'icon', icon)}
                className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                  feature.icon === icon
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-secondary hover:bg-secondary/80 border border-border'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <Input
            placeholder="Feature title"
            value={feature.title}
            onChange={(e) => onChange(feature.id, 'title', e.target.value)}
            className="font-medium"
          />
          <Textarea
            placeholder="Feature description..."
            value={feature.description}
            onChange={(e) => onChange(feature.id, 'description', e.target.value)}
            rows={2}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(feature.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export const FeaturesEditor = memo(function FeaturesEditor({ features, onChange }: FeaturesEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = useCallback(() => {
    const newFeature: Feature = {
      id: generateItemId('feature'),
      title: '',
      description: '',
      icon: '⚡',
    };
    onChange([...features, newFeature]);
  }, [features, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(features.filter(feature => feature.id !== id));
  }, [features, onChange]);

  const handleChange = useCallback((id: string, field: keyof Feature, value: string) => {
    onChange(features.map(feature => 
      feature.id === id ? { ...feature, [field]: value } : feature
    ));
  }, [features, onChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = features.findIndex(f => f.id === active.id);
      const newIndex = features.findIndex(f => f.id === over.id);
      onChange(arrayMove(features, oldIndex, newIndex));
    }
  }, [features, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Features / Utilities</Label>
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8">
          <Plus className="w-4 h-4 mr-1" />
          Add Feature
        </Button>
      </div>

      <DndContext id="features-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={features.map(f => f.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {features.map((feature) => (
              <SortableFeature
                key={feature.id}
                feature={feature}
                onChange={handleChange}
                onRemove={handleRemove}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {features.length === 0 && (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl">
          <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No features yet</p>
          <p className="text-xs">Click "Add Feature" to highlight your project's utilities</p>
        </div>
      )}
    </div>
  );
});
