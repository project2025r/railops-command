 import { cn } from "@/lib/utils";
 import { Button } from "./button";
 import { Filter, X } from "lucide-react";
 
 interface FilterPanelProps {
   children: React.ReactNode;
   onApply: () => void;
   onClear: () => void;
   className?: string;
   title?: string;
 }
 
 export function FilterPanel({
   children,
   onApply,
   onClear,
   className,
   title = "Filters",
 }: FilterPanelProps) {
   return (
     <div className={cn("filter-panel animate-fade-in", className)}>
       <div className="flex items-center justify-between mb-5">
         <div className="flex items-center gap-2">
           <Filter className="h-4 w-4 text-muted-foreground" />
           <h3 className="font-semibold text-foreground">{title}</h3>
         </div>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
         {children}
       </div>
       <div className="flex items-center justify-end gap-3">
        <Button onClick={onApply} className="bg-secondary hover:bg-secondary/90">
           <Filter className="h-4 w-4 mr-2" />
           Apply Filters
         </Button>
         <Button variant="outline" onClick={onClear} className="text-destructive border-destructive/30 hover:bg-destructive/10">
           <X className="h-4 w-4 mr-2" />
           Clear All
         </Button>
       </div>
     </div>
   );
 }