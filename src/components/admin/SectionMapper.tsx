import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { SectionDefinition, SECTION_OPTIONS } from "@/lib/templateTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SectionMapperProps {
  sections: SectionDefinition[];
  onChange: (sections: SectionDefinition[]) => void;
}

const ANIMATION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'fade-up', label: 'Fade Up' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'scale', label: 'Scale' },
];

export const SectionMapper = ({ sections, onChange }: SectionMapperProps) => {
  const addSection = () => {
    const usedTypes = sections.map(s => s.type);
    const availableType = SECTION_OPTIONS.find(o => !usedTypes.includes(o.value as any))?.value || 'about';
    
    onChange([
      ...sections,
      {
        type: availableType as SectionDefinition['type'],
        order: sections.length + 1,
        visible: true,
        animation: 'fade-in',
      }
    ]);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    // Reorder
    onChange(newSections.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const updateSection = (index: number, updates: Partial<SectionDefinition>) => {
    onChange(sections.map((s, i) => i === index ? { ...s, ...updates } : s));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Update order values
    onChange(newSections.map((s, i) => ({ ...s, order: i + 1 })));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sections</CardTitle>
        <Button size="sm" variant="outline" onClick={addSection}>
          <Plus className="w-4 h-4 mr-1" />
          Add Section
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.map((section, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex flex-col gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5"
                onClick={() => moveSection(index, 'up')}
                disabled={index === 0}
              >
                <span className="text-xs">↑</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5"
                onClick={() => moveSection(index, 'down')}
                disabled={index === sections.length - 1}
              >
                <span className="text-xs">↓</span>
              </Button>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-3">
              <Select
                value={section.type}
                onValueChange={(value) => updateSection(index, { type: value as SectionDefinition['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={section.animation || 'none'}
                onValueChange={(value) => updateSection(index, { animation: value as SectionDefinition['animation'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ANIMATION_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Switch
                  checked={section.visible}
                  onCheckedChange={(checked) => updateSection(index, { visible: checked })}
                />
                <Label className="text-sm">Visible</Label>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => removeSection(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
