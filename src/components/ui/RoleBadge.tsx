 import { cn } from "@/lib/utils";
 
 interface RoleBadgeProps {
   role: "Admin" | "Super Admin";
   className?: string;
 }
 
 export function RoleBadge({ role, className }: RoleBadgeProps) {
   return (
     <span
       className={cn(
         "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
         role === "Super Admin"
          ? "bg-accent/15 text-accent border border-accent/30"
          : "bg-secondary/15 text-secondary border border-secondary/30",
         className
       )}
     >
       {role}
     </span>
   );
 }