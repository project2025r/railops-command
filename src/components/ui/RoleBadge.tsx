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
           ? "bg-success/15 text-success border border-success/30"
           : "bg-primary/15 text-primary border border-primary/30",
         className
       )}
     >
       {role}
     </span>
   );
 }