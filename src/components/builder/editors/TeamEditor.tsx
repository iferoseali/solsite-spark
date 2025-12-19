import { useCallback } from "react";
import { Plus, Trash2, Twitter, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { TeamMember, generateItemId } from "@/types/builder";

interface TeamEditorProps {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

export const TeamEditor = ({ members, onChange }: TeamEditorProps) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Team Members</Label>
        <Button variant="outline" size="sm" onClick={handleAdd} className="h-8">
          <Plus className="w-4 h-4 mr-1" />
          Add Member
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {members.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl border border-border bg-card/50 space-y-3"
          >
            <div className="flex items-start gap-3">
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
                    onChange={(e) => handleChange(member.id, 'name', e.target.value)}
                    className="font-medium"
                  />
                  <Input
                    placeholder="Role (e.g., Lead Dev)"
                    value={member.role}
                    onChange={(e) => handleChange(member.id, 'role', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Avatar URL (optional)"
                      value={member.avatar || ''}
                      onChange={(e) => handleChange(member.id, 'avatar', e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Twitter (optional)"
                      value={member.twitter || ''}
                      onChange={(e) => handleChange(member.id, 'twitter', e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(member.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {members.length === 0 && (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl">
          <p className="text-sm">No team members yet</p>
          <p className="text-xs">Click "Add Member" to introduce your team</p>
        </div>
      )}
    </div>
  );
};
