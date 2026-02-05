import { User, MapPin } from "lucide-react";

interface ContextBarProps {
  username: string;
  division: string;
}

export function ContextBar({ username, division }: ContextBarProps) {
  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-secondary" />
          <span className="text-sm font-medium text-muted-foreground">User:</span>
          <span className="text-sm font-semibold text-foreground">{username}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Division:</span>
          <span className="text-sm font-semibold text-foreground">{division}</span>
        </div>
      </div>
    </div>
  );
}
