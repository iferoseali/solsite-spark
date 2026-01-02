import { useCallback, useRef, memo } from "react";
import { Plus, Trash2, GripVertical, Upload, Building2 } from "lucide-react";
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
import { Partner, generateItemId } from "@/types/builder";

interface PartnersEditorProps {
  partners: Partner[];
  onChange: (partners: Partner[]) => void;
}

interface SortablePartnerProps {
  partner: Partner;
  onChange: (id: string, field: keyof Partner, value: string) => void;
  onRemove: (id: string) => void;
  onUpload: (id: string, file: File) => void;
}

const SortablePartner = ({ partner, onChange, onRemove, onUpload }: SortablePartnerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: partner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(partner.id, file);
    }
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
      <div className="flex items-center gap-3">
        <div 
          className="cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        
        {/* Logo Preview or Upload */}
        <div 
          className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden cursor-pointer border-2 border-dashed border-border hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {partner.logo ? (
            <img src={partner.logo} alt={partner.name || 'Partner logo'} className="w-full h-full object-contain p-1" />
          ) : (
            <Upload className="w-4 h-4 text-muted-foreground" />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-2">
          <Input
            placeholder="Partner name"
            value={partner.name}
            onChange={(e) => onChange(partner.id, 'name', e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Website URL (optional)"
            value={partner.url || ''}
            onChange={(e) => onChange(partner.id, 'url', e.target.value)}
            className="text-sm"
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(partner.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export const PartnersEditor = memo(function PartnersEditor({ partners, onChange }: PartnersEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = useCallback(() => {
    const newPartner: Partner = {
      id: generateItemId('partner'),
      name: '',
      logo: '',
      url: '',
    };
    onChange([...partners, newPartner]);
  }, [partners, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(partners.filter(partner => partner.id !== id));
  }, [partners, onChange]);

  const handleChange = useCallback((id: string, field: keyof Partner, value: string) => {
    onChange(partners.map(partner => 
      partner.id === id ? { ...partner, [field]: value } : partner
    ));
  }, [partners, onChange]);

  const handleUpload = useCallback((id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(partners.map(partner => 
        partner.id === id ? { ...partner, logo: reader.result as string } : partner
      ));
    };
    reader.readAsDataURL(file);
  }, [partners, onChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = partners.findIndex(p => p.id === active.id);
      const newIndex = partners.findIndex(p => p.id === over.id);
      onChange(arrayMove(partners, oldIndex, newIndex));
    }
  }, [partners, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Partners / Sponsors</Label>
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8" disabled={partners.length >= 10}>
          <Plus className="w-4 h-4 mr-1" />
          Add Partner
        </Button>
      </div>

      <DndContext id="partners-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={partners.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {partners.map((partner) => (
              <SortablePartner
                key={partner.id}
                partner={partner}
                onChange={handleChange}
                onRemove={handleRemove}
                onUpload={handleUpload}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {partners.length === 0 && (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl">
          <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No partners yet</p>
          <p className="text-xs">Showcase your backers and partners</p>
        </div>
      )}
    </div>
  );
});
