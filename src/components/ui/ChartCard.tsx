 import { cn } from "@/lib/utils";
 import { LucideIcon } from "lucide-react";
 import { Button } from "./button";
 import { EmptyState } from "./EmptyState";
 
 interface ChartCardProps {
   title: string;
   description?: string;
   icon?: LucideIcon;
   children?: React.ReactNode;
   isEmpty?: boolean;
   emptyMessage?: string;
   emptyAction?: { label: string; onClick: () => void };
   className?: string;
   headerAction?: React.ReactNode;
 }
 
 export function ChartCard({
   title,
   description,
   icon: Icon,
   children,
   isEmpty = false,
   emptyMessage,
   emptyAction,
   className,
   headerAction,
 }: ChartCardProps) {
   return (
     <div className={cn("card-elevated overflow-hidden", className)}>
       <div className="p-5 border-b border-border/50">
         <div className="flex items-start justify-between">
           <div>
             <h3 className="font-semibold text-foreground flex items-center gap-2">
               {Icon && <Icon className="h-4 w-4 text-primary" />}
               {title}
             </h3>
             {description && (
               <p className="text-sm text-muted-foreground mt-1">{description}</p>
             )}
           </div>
           {headerAction}
         </div>
       </div>
       <div className="p-5">
         {isEmpty ? (
           <EmptyState
             icon={Icon || (() => null) as any}
             title={title}
             description={emptyMessage || `Click "${emptyAction?.label}" to view data`}
             action={
               emptyAction && (
                 <Button size="sm" onClick={emptyAction.onClick}>
                   {emptyAction.label}
                 </Button>
               )
             }
           />
         ) : (
           children
         )}
       </div>
     </div>
   );
 }