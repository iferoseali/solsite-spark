import { useCallback, useRef, memo } from "react";
import { Plus, Trash2, GripVertical, Upload, Image } from "lucide-react";
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
import { GalleryImage, generateItemId } from "@/types/builder";

interface GalleryEditorProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

interface SortableImageProps {
  image: GalleryImage;
  onChange: (id: string, field: keyof GalleryImage, value: string) => void;
  onRemove: (id: string) => void;
  onUpload: (id: string, file: File) => void;
}

const SortableImage = ({ image, onChange, onRemove, onUpload }: SortableImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(image.id, file);
    }
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
        
        {/* Image Preview or Upload */}
        <div 
          className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden cursor-pointer border-2 border-dashed border-border hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {image.url ? (
            <img src={image.url} alt={image.caption || 'Gallery image'} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Upload className="w-5 h-5" />
              <span className="text-xs">Upload</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="flex-1 space-y-2">
          <Input
            placeholder="Image URL (or upload)"
            value={image.url}
            onChange={(e) => onChange(image.id, 'url', e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Caption (optional)"
            value={image.caption || ''}
            onChange={(e) => onChange(image.id, 'caption', e.target.value)}
            className="text-sm"
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(image.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export const GalleryEditor = memo(function GalleryEditor({ images, onChange }: GalleryEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = useCallback(() => {
    const newImage: GalleryImage = {
      id: generateItemId('gallery'),
      url: '',
      caption: '',
    };
    onChange([...images, newImage]);
  }, [images, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(images.filter(image => image.id !== id));
  }, [images, onChange]);

  const handleChange = useCallback((id: string, field: keyof GalleryImage, value: string) => {
    onChange(images.map(image => 
      image.id === id ? { ...image, [field]: value } : image
    ));
  }, [images, onChange]);

  const handleUpload = useCallback((id: string, file: File) => {
    // Create a preview URL for the uploaded file
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(images.map(image => 
        image.id === id ? { ...image, url: reader.result as string } : image
      ));
    };
    reader.readAsDataURL(file);
  }, [images, onChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(i => i.id === active.id);
      const newIndex = images.findIndex(i => i.id === over.id);
      onChange(arrayMove(images, oldIndex, newIndex));
    }
  }, [images, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Gallery Images</Label>
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8" disabled={images.length >= 12}>
          <Plus className="w-4 h-4 mr-1" />
          Add Image
        </Button>
      </div>

      <DndContext id="gallery-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {images.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onChange={handleChange}
                onRemove={handleRemove}
                onUpload={handleUpload}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {images.length === 0 && (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl">
          <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No gallery images yet</p>
          <p className="text-xs">Click "Add Image" to showcase your project</p>
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">{images.length}/12 images</p>
      )}
    </div>
  );
});
