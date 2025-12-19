import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Edit, 
  ExternalLink, 
  Trash2, 
  Globe, 
  GlobeLock,
  Calendar,
  MoreVertical,
  Copy,
  Pencil,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  coin_name: string;
  ticker: string;
  subdomain: string | null;
  status: string | null;
  created_at: string;
  template_id: string | null;
  config: {
    templateId?: string;
    blueprintId?: string;
  } | null;
}

interface ProjectCardProps {
  project: Project;
  onDelete: (project: Project) => void;
  onTogglePublish: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onRename: (project: Project, newName: string) => void;
}

export function ProjectCard({ project, onDelete, onTogglePublish, onDuplicate, onRename }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.coin_name);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isPublished = project.status === "published";
  const templateId = project.config?.templateId || project.template_id || "cult_minimal";
  const previewUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/render-site?preview=true&templateId=${templateId}&projectId=${project.id}`;
  
  const formattedDate = new Date(project.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditName(project.coin_name);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditName(project.coin_name);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== project.coin_name && trimmedName.length <= 50) {
      onRename(project, trimmedName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
      {/* Preview Thumbnail */}
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        <div className="w-full h-full rounded-t-xl bg-black/40 overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-black/50 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-red-400/80" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/80" />
            <div className="w-2 h-2 rounded-full bg-green-400/80" />
            <span className="ml-2 text-xs text-muted-foreground truncate">
              {project.subdomain ? `${project.subdomain}.memesite.com` : "preview"}
            </span>
          </div>
          
          {/* Scaled iframe preview */}
          <div className="relative flex-1 h-[calc(100%-28px)] overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <div 
              className="absolute inset-0 origin-top-left" 
              style={{ transform: "scale(0.25)", width: "400%", height: "400%" }}
            >
              <iframe
                src={previewUrl}
                className="w-full h-full border-0 pointer-events-none"
                title={`Preview: ${project.coin_name}`}
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        </div>

        {/* Hover overlay with quick actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link to={`/builder?projectId=${project.id}`}>
            <Button variant="secondary" size="sm" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <a 
            href={previewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Preview
            </Button>
          </a>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  ref={inputRef}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value.slice(0, 50))}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveEdit}
                  className="h-8 text-base font-semibold"
                  maxLength={50}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 shrink-0 text-green-500 hover:text-green-400"
                  onClick={handleSaveEdit}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={handleCancelEdit}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group/name">
                <h3 
                  className="font-semibold text-lg truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={handleStartEdit}
                  title="Click to rename"
                >
                  {project.coin_name}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover/name:opacity-100 transition-opacity"
                  onClick={handleStartEdit}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">${project.ticker}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleStartEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/builder?projectId=${project.id}`} className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(previewUrl, "_blank")}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Preview
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDuplicate(project)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTogglePublish(project)}>
                {isPublished ? (
                  <>
                    <GlobeLock className="w-4 h-4 mr-2" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Publish
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(project)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status and date */}
        <div className="flex items-center justify-between">
          <Badge 
            variant={isPublished ? "default" : "secondary"}
            className={cn(
              "gap-1.5",
              isPublished && "bg-green-500/20 text-green-400 hover:bg-green-500/30"
            )}
          >
            {isPublished ? (
              <>
                <Globe className="w-3 h-3" />
                Published
              </>
            ) : (
              <>
                <GlobeLock className="w-3 h-3" />
                Draft
              </>
            )}
          </Badge>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
