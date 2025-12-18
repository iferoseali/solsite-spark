import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AnimationConfig as AnimConfigType } from "@/lib/templateTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnimationConfigProps {
  animations: AnimConfigType;
  onChange: (animations: AnimConfigType) => void;
}

const HERO_ANIMATION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'float', label: 'Float' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'glow', label: 'Glow' },
];

export const AnimationConfig = ({ animations, onChange }: AnimationConfigProps) => {
  const updateAnimation = (key: keyof AnimConfigType, value: any) => {
    onChange({ ...animations, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Animations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Scroll Fade</Label>
            <p className="text-xs text-muted-foreground">Fade in sections on scroll</p>
          </div>
          <Switch
            checked={animations.scrollFade}
            onCheckedChange={(checked) => updateAnimation('scrollFade', checked)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Hover Scale</Label>
            <span className="text-sm text-muted-foreground">{animations.hoverScale}x</span>
          </div>
          <Slider
            value={[animations.hoverScale]}
            onValueChange={([value]) => updateAnimation('hoverScale', value)}
            min={1}
            max={1.2}
            step={0.01}
          />
        </div>

        <div>
          <Label>Transition Duration</Label>
          <Input
            value={animations.transitionDuration}
            onChange={(e) => updateAnimation('transitionDuration', e.target.value)}
            placeholder="0.3s"
          />
        </div>

        <div>
          <Label>Hero Animation</Label>
          <Select
            value={animations.heroAnimation || 'none'}
            onValueChange={(value) => updateAnimation('heroAnimation', value as AnimConfigType['heroAnimation'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HERO_ANIMATION_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
