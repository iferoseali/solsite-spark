import { useCallback } from "react";
import { Plus, Trash2, Twitter, User, GripVertical } from "lucide-react";
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
import { TeamMember, generateItemId } from "@/types/builder";

interface TeamEditorProps {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

interface SortableMemberProps {
  member: TeamMember;
  onChange: (id: string, field: keyof TeamMember, value: string) => void;
  onRemove: (id: string) => void;
}

const SortableMember = ({ member, onChange, onRemove }: SortableMemberProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

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
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Name"
              value={member.name}
              onChange={(e) => onChange(member.id, 'name', e.target.value)}
              className="font-medium"
            />
            <Input
              placeholder="Role (e.g., Lead Dev)"
              value={member.role}
              onChange={(e) => onChange(member.id, 'role', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Avatar URL (optional)"
                value={member.avatar || ''}
                onChange={(e) => onChange(member.id, 'avatar', e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Twitter (optional)"
                value={member.twitter || ''}
                onChange={(e) => onChange(member.id, 'twitter', e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(member.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export const TeamEditor = ({ members, onChange }: TeamEditorProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = useCallback(() => {
    const newMember: TeamMember = {
      id: generateItemId('team'),
      name: '',
      role: '',
      avatar: '',
      twitter: '',
    };
    onChange([...members, newMember]);
  }, [members, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(members.filter(member => member.id !== id));
  }, [members, onChange]);

  const handleChange = useCallback((id: string, field: keyof TeamMember, value: string) => {
    onChange(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  }, [members, onChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = members.findIndex(m => m.id === active.id);
      const newIndex = members.findIndex(m => m.id === over.id);
      onChange(arrayMove(members, oldIndex, newIndex));
    }
  }, [members, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Team Members</Label>
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8">
          <Plus className="w-4 h-4 mr-1" />
          Add Member
        </Button>
      </div>

      <DndContext id="team-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={members.map(m => m.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {members.map((member) => (
              <SortableMember
                key={member.id}
                member={member}
                onChange={handleChange}
                onRemove={handleRemove}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {members.length === 0 && (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl">
          <p className="text-sm">No team members yet</p>
          <p className="text-xs">Click "Add Member" to introduce your team</p>
        </div>
      )}
    </div>
  );
};
