import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Monitor, Tablet, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DeviceType = "desktop" | "tablet" | "mobile";

interface DeviceConfig {
  width: string;
  height: string;
  label: string;
  icon: React.ReactNode;
}

const deviceConfigs: Record<DeviceType, DeviceConfig> = {
  desktop: {
    width: "100%",
    height: "100%",
    label: "Desktop",
    icon: <Monitor className="w-4 h-4" />,
  },
  tablet: {
    width: "768px",
    height: "1024px",
    label: "Tablet",
    icon: <Tablet className="w-4 h-4" />,
  },
  mobile: {
    width: "375px",
    height: "812px",
    label: "Mobile",
    icon: <Smartphone className="w-4 h-4" />,
  },
};

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  templateId: string;
  blueprintId: string;
  previewHtml: string | null;
  isLoading: boolean;
}

export const PreviewModal = ({
  isOpen,
  onClose,
  templateName,
  templateId,
  blueprintId,
  previewHtml,
  isLoading,
}: PreviewModalProps) => {
  const [device, setDevice] = useState<DeviceType>("desktop");

  if (!isOpen) return null;

  const currentDevice = deviceConfigs[device];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden bg-background border border-border shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with controls */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold">{templateName}</h3>
              
              {/* Device toggles */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-background border border-border">
                {(Object.keys(deviceConfigs) as DeviceType[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDevice(d)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      device === d
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {deviceConfigs[d].icon}
                    <span className="hidden sm:inline">{deviceConfigs[d].label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to={`/builder?templateId=${templateId}&blueprintId=${blueprintId}`}>
                <Button variant="glow" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Use This Template
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-hidden bg-muted/20 flex items-center justify-center p-4">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : previewHtml ? (
              <motion.div
                key={device}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`relative bg-background rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
                  device === "desktop" ? "w-full h-full" : ""
                }`}
                style={
                  device !== "desktop"
                    ? {
                        width: currentDevice.width,
                        height: currentDevice.height,
                        maxHeight: "100%",
                      }
                    : undefined
                }
              >
                {/* Device frame for mobile/tablet */}
                {device !== "desktop" && (
                  <>
                    {/* Device chrome */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-black/90 flex items-center justify-center z-10 rounded-t-xl">
                      {device === "mobile" && (
                        <div className="w-20 h-4 bg-black rounded-full" />
                      )}
                      {device === "tablet" && (
                        <div className="w-2 h-2 bg-gray-700 rounded-full" />
                      )}
                    </div>
                    {/* Bottom bar for mobile */}
                    {device === "mobile" && (
                      <div className="absolute bottom-0 left-0 right-0 h-5 bg-black/90 flex items-center justify-center z-10 rounded-b-xl">
                        <div className="w-24 h-1 bg-gray-600 rounded-full" />
                      </div>
                    )}
                  </>
                )}
                
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title={`Preview: ${templateName}`}
                  sandbox="allow-scripts"
                  style={
                    device !== "desktop"
                      ? { paddingTop: "24px", paddingBottom: device === "mobile" ? "20px" : "0" }
                      : undefined
                  }
                />
              </motion.div>
            ) : null}
          </div>

          {/* Footer with device info */}
          <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">
              Viewing at {device === "desktop" ? "full width" : currentDevice.width} × {device === "desktop" ? "full height" : currentDevice.height}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
