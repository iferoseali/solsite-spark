import { useCallback } from "react";
import { Plus, Trash2, GripVertical, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { RoadmapPhase, generateItemId } from "@/types/builder";

interface RoadmapEditorProps {
  phases: RoadmapPhase[];
  onChange: (phases: RoadmapPhase[]) => void;
}

export const RoadmapEditor = ({ phases, onChange }: RoadmapEditorProps) => {
  const handleAdd = useCallback(() => {
    const phaseNum = phases.length + 1;
    const newPhase: RoadmapPhase = {
      id: generateItemId('phase'),
      phase: `Phase ${phaseNum}`,
      title: '',
      items: [''],
      completed: false,
    };
    onChange([...phases, newPhase]);
  }, [phases, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(phases.filter(phase => phase.id !== id));
  }, [phases, onChange]);

  const handleChange = useCallback((id: string, field: keyof RoadmapPhase, value: unknown) => {
    onChange(phases.map(phase => 
      phase.id === id ? { ...phase, [field]: value } : phase
    ));
  }, [phases, onChange]);

  const handleAddItem = useCallback((phaseId: string) => {
    onChange(phases.map(phase => 
      phase.id === phaseId ? { ...phase, items: [...phase.items, ''] } : phase
    ));
  }, [phases, onChange]);

  const handleRemoveItem = useCallback((phaseId: string, itemIndex: number) => {
    onChange(phases.map(phase => 
      phase.id === phaseId ? { ...phase, items: phase.items.filter((_, i) => i !== itemIndex) } : phase
    ));
  }, [phases, onChange]);

  const handleItemChange = useCallback((phaseId: string, itemIndex: number, value: string) => {
    onChange(phases.map(phase => 
      phase.id === phaseId ? {
        ...phase,
        items: phase.items.map((item, i) => i === itemIndex ? value : item)
      } : phase
    ));
  }, [phases, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Roadmap Phases</Label>
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8">
          <Plus className="w-4 h-4 mr-1" />
          Add Phase
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl border border-border bg-card/50 space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-muted-foreground pt-2">
                <GripVertical className="w-4 h-4 cursor-grab" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Phase 1"
                    value={phase.phase}
                    onChange={(e) => handleChange(phase.id, 'phase', e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Input
                    placeholder="Title (e.g., Launch)"
                    value={phase.title}
                    onChange={(e) => handleChange(phase.id, 'title', e.target.value)}
                    className="font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Milestones</Label>
                  {phase.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-2">
                      <Input
                        placeholder={`Milestone ${itemIndex + 1}...`}
                        value={item}
                        onChange={(e) => handleItemChange(phase.id, itemIndex, e.target.value)}
                        className="text-sm"
                      />
                      {phase.items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(phase.id, itemIndex)}
                          className="shrink-0 h-10 w-10 text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddItem(phase.id)}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Milestone
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={phase.completed}
                    onCheckedChange={(checked) => handleChange(phase.id, 'completed', checked)}
                  />
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    {phase.completed && <Check className="w-3 h-3 text-accent" />}
                    {phase.completed ? 'Completed' : 'Mark as completed'}
                  </Label>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(phase.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {phases.length === 0 && (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl">
          <p className="text-sm">No roadmap phases yet</p>
          <p className="text-xs">Click "Add Phase" to get started</p>
        </div>
      )}
    </div>
  );
};
