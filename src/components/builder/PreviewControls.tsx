import { RefreshCw, Monitor, Tablet, Smartphone, Maximize2, ExternalLink, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateSwitcher } from "./TemplateSwitcher";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/config";

type DeviceSize = 'desktop' | 'tablet' | 'mobile';

interface PreviewControlsProps {
  subdomain: string;
  previewUrl: string | null;
  isGeneratedProject: boolean;
  isSaving: boolean;
  isRefreshing: boolean;
  deviceSize: DeviceSize;
  currentTemplateKey: string;
  currentBlueprintId: string | null;
  currentLayout: string;
  currentPersonality: string;
  onRefresh: () => void;
  onSave: () => void;
  onDeviceChange: (size: DeviceSize) => void;
  onTemplateChange: (args: {
    templateKey: string;
    blueprintId: string;
    layout: string;
    personality: string;
  }) => void;
  onFullscreen: () => void;
}

export const PreviewControls = ({
  subdomain,
  previewUrl,
  isGeneratedProject,
  isSaving,
  isRefreshing,
  deviceSize,
  currentTemplateKey,
  currentBlueprintId,
  currentLayout,
  currentPersonality,
  onRefresh,
  onSave,
  onDeviceChange,
  onTemplateChange,
  onFullscreen,
}: PreviewControlsProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-accent/60" />
        </div>
        <span className="text-xs text-muted-foreground ml-2 font-mono">{SITE_CONFIG.getSubdomainDisplay(subdomain)}</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Template Switcher */}
        <TemplateSwitcher
          currentTemplateKey={currentTemplateKey}
          currentBlueprintId={currentBlueprintId}
          currentLayout={currentLayout}
          currentPersonality={currentPersonality}
          onTemplateChange={onTemplateChange}
        />

        <div className="w-px h-6 bg-border mx-1" />

        {/* Device Size Toggle */}
        <div className="flex items-center rounded-lg border border-border p-0.5">
          <button
            onClick={() => onDeviceChange('desktop')}
            className={cn(
              "p-1.5 rounded transition-colors",
              deviceSize === 'desktop' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeviceChange('tablet')}
            className={cn(
              "p-1.5 rounded transition-colors",
              deviceSize === 'tablet' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeviceChange('mobile')}
            className={cn(
              "p-1.5 rounded transition-colors",
              deviceSize === 'mobile' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Refresh - Always visible */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 h-8"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
        </Button>

        {/* Save - Only for generated projects */}
        {isGeneratedProject && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-8"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
        )}

        {/* Fullscreen */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 h-8"
          onClick={onFullscreen}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>

        {/* External Link */}
        {isGeneratedProject && previewUrl && (
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="gap-1 h-8">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};

export type { DeviceSize };
