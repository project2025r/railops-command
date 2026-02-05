 import { cn } from "@/lib/utils";
 import { LucideIcon } from "lucide-react";
 
 interface StatCardProps {
   title: string;
   value: string | number;
   icon?: LucideIcon;
   description?: string;
   className?: string;
   variant?: "default" | "primary" | "success" | "warning";
 }
 
 export function StatCard({
   title,
   value,
   icon: Icon,
   description,
   className,
   variant = "default",
 }: StatCardProps) {
   const variantStyles = {
     default: "bg-card",
    primary: "bg-secondary/5 border-secondary/20",
    success: "bg-accent/5 border-accent/20",
    warning: "bg-primary/5 border-primary/20",
   };
 
   return (
     <div
       className={cn(
         "card-elevated p-6 transition-all duration-200 hover:shadow-elevated-md",
         variantStyles[variant],
         className
       )}
     >
       <div className="flex items-start justify-between">
         <div className="flex-1">
           <p className="text-sm font-medium text-muted-foreground">{title}</p>
           <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{value}</p>
           {description && (
             <p className="text-xs text-muted-foreground mt-2">{description}</p>
           )}
         </div>
         {Icon && (
          <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-secondary" />
           </div>
         )}
       </div>
     </div>
   );
 }