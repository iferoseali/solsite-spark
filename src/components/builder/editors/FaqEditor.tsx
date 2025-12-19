import { useCallback } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
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
import { FaqItem, generateItemId } from "@/types/builder";

interface FaqEditorProps {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}

interface SortableFaqItemProps {
  item: FaqItem;
  index: number;
  onChange: (id: string, field: keyof FaqItem, value: string) => void;
  onRemove: (id: string) => void;
}

const SortableFaqItem = ({ item, index, onChange, onRemove }: SortableFaqItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

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
          className="flex items-center gap-2 text-muted-foreground pt-2 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
          <span className="text-xs font-medium">Q{index + 1}</span>
        </div>
        <div className="flex-1 space-y-3">
          <Input
            placeholder="Question..."
            value={item.question}
            onChange={(e) => onChange(item.id, 'question', e.target.value)}
            className="font-medium"
          />
          <Textarea
            placeholder="Answer..."
            value={item.answer}
            onChange={(e) => onChange(item.id, 'answer', e.target.value)}
            rows={2}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export const FaqEditor = ({ items, onChange }: FaqEditorProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = useCallback(() => {
    const newItem: FaqItem = {
      id: generateItemId('faq'),
      question: '',
      answer: '',
    };
    onChange([...items, newItem]);
  }, [items, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(items.filter(item => item.id !== id));
  }, [items, onChange]);

  const handleChange = useCallback((id: string, field: keyof FaqItem, value: string) => {
    onChange(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  }, [items, onChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      onChange(arrayMove(items, oldIndex, newIndex));
    }
  }, [items, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">FAQ Items</Label>
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8">
          <Plus className="w-4 h-4 mr-1" />
          Add FAQ
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <SortableFaqItem
                key={item.id}
                item={item}
                index={index}
                onChange={handleChange}
                onRemove={handleRemove}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl">
          <p className="text-sm">No FAQ items yet</p>
          <p className="text-xs">Click "Add FAQ" to get started</p>
        </div>
      )}
    </div>
  );
};
