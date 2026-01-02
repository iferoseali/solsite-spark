import { useCallback, memo } from "react";
import { Plus, Trash2, GripVertical, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { StatItem, generateItemId } from "@/types/builder";

interface StatsEditorProps {
  stats: StatItem[];
  onChange: (stats: StatItem[]) => void;
}

interface SortableStatProps {
  stat: StatItem;
  onChange: (id: string, field: keyof StatItem, value: string) => void;
  onRemove: (id: string) => void;
}

const ICON_OPTIONS = ['📈', '👥', '💎', '🔥', '🚀', '💰', '⭐', '🎯', '🏆', '📊'];

const SortableStat = ({ stat, onChange, onRemove }: SortableStatProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stat.id });

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
      className="p-4 rounded-xl border border-border bg-card/50"
    >
      <div className="flex items-start gap-3">
        <div 
          className="cursor-grab active:cursor-grabbing pt-2"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Value (e.g., 10K+)"
              value={stat.value}
              onChange={(e) => onChange(stat.id, 'value', e.target.value)}
              className="font-bold text-lg"
            />
            <Input
              placeholder="Label (e.g., Holders)"
              value={stat.label}
              onChange={(e) => onChange(stat.id, 'label', e.target.value)}
            />
            <div className="flex gap-1 flex-wrap">
              {ICON_OPTIONS.slice(0, 5).map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => onChange(stat.id, 'icon', icon)}
                  className={`w-8 h-8 rounded border text-lg flex items-center justify-center transition-colors ${
                    stat.icon === icon 
                      ? 'bg-primary/20 border-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            {ICON_OPTIONS.slice(5).map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => onChange(stat.id, 'icon', icon)}
                className={`w-8 h-8 rounded border text-lg flex items-center justify-center transition-colors ${
                  stat.icon === icon 
                    ? 'bg-primary/20 border-primary' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(stat.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export const StatsEditor = memo(function StatsEditor({ stats, onChange }: StatsEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = useCallback(() => {
    const newStat: StatItem = {
      id: generateItemId('stat'),
      value: '',
      label: '',
      icon: '📈',
    };
    onChange([...stats, newStat]);
  }, [stats, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(stats.filter(stat => stat.id !== id));
  }, [stats, onChange]);

  const handleChange = useCallback((id: string, field: keyof StatItem, value: string) => {
    onChange(stats.map(stat => 
      stat.id === id ? { ...stat, [field]: value } : stat
    ));
  }, [stats, onChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stats.findIndex(s => s.id === active.id);
      const newIndex = stats.findIndex(s => s.id === over.id);
      onChange(arrayMove(stats, oldIndex, newIndex));
    }
  }, [stats, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Stats / Metrics</Label>
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8" disabled={stats.length >= 6}>
          <Plus className="w-4 h-4 mr-1" />
          Add Stat
        </Button>
      </div>

      <DndContext id="stats-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={stats.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {stats.map((stat) => (
              <SortableStat
                key={stat.id}
                stat={stat}
                onChange={handleChange}
                onRemove={handleRemove}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {stats.length === 0 && (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No stats yet</p>
          <p className="text-xs">Add key metrics to showcase your project</p>
        </div>
      )}
    </div>
  );
});
