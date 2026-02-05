 import { cn } from "@/lib/utils";
 import { LucideIcon } from "lucide-react";
 import { Button } from "./button";
 
 interface ActionTileProps {
   title: string;
   description: string;
   icon: LucideIcon;
   actionLabel: string;
   onAction: () => void;
   variant?: "blue" | "indigo" | "purple" | "orange";
   className?: string;
 }
 
 export function ActionTile({
   title,
   description,
   icon: Icon,
   actionLabel,
   onAction,
   variant = "blue",
   className,
 }: ActionTileProps) {
   const iconVariants = {
     blue: "bg-primary text-primary-foreground",
     indigo: "bg-[hsl(243_75%_59%)] text-white",
     purple: "bg-[hsl(280_65%_50%)] text-white",
     orange: "bg-warning text-warning-foreground",
   };
 
   return (
     <div
       className={cn(
         "card-elevated-lg p-6 flex flex-col items-center text-center group hover:shadow-elevated-lg transition-all duration-300",
         className
       )}
     >
       <div
         className={cn(
           "h-14 w-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
           iconVariants[variant]
         )}
       >
         <Icon className="h-7 w-7" />
       </div>
       <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
       <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{description}</p>
       <Button onClick={onAction} className="w-full max-w-[200px]">
         {actionLabel}
       </Button>
     </div>
   );
 }