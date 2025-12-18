import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { StyleConfig } from "@/lib/templateTypes";

interface StyleEditorProps {
  styles: StyleConfig;
  onChange: (styles: StyleConfig) => void;
}

export const StyleEditor = ({ styles, onChange }: StyleEditorProps) => {
  const updateStyle = (key: keyof StyleConfig, value: any) => {
    onChange({ ...styles, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Styles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={styles.primaryColor}
                onChange={(e) => updateStyle('primaryColor', e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={styles.primaryColor}
                onChange={(e) => updateStyle('primaryColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label>Accent Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={styles.accentColor}
                onChange={(e) => updateStyle('accentColor', e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={styles.accentColor}
                onChange={(e) => updateStyle('accentColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Background Gradient</Label>
          <Input
            value={styles.bgGradient}
            onChange={(e) => updateStyle('bgGradient', e.target.value)}
            placeholder="linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%)"
          />
          <div 
            className="mt-2 h-12 rounded-lg border"
            style={{ background: styles.bgGradient }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Heading Font</Label>
            <Input
              value={styles.fontHeading || ''}
              onChange={(e) => updateStyle('fontHeading', e.target.value)}
              placeholder="Outfit"
            />
          </div>
          <div>
            <Label>Body Font</Label>
            <Input
              value={styles.fontBody || ''}
              onChange={(e) => updateStyle('fontBody', e.target.value)}
              placeholder="Space Grotesk"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Border Radius</Label>
            <Input
              value={styles.borderRadius || ''}
              onChange={(e) => updateStyle('borderRadius', e.target.value)}
              placeholder="12px"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch
              checked={styles.glowEffect ?? true}
              onCheckedChange={(checked) => updateStyle('glowEffect', checked)}
            />
            <Label>Glow Effects</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
