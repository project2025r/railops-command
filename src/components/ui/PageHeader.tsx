 import { cn } from "@/lib/utils";
 
 interface PageHeaderProps {
   title: string;
   description?: string;
   children?: React.ReactNode;
   className?: string;
 }
 
 export function PageHeader({ title, description, children, className }: PageHeaderProps) {
   return (
     <div className={cn("page-header-gradient py-8 px-6", className)}>
       <div className="container">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
           <div>
             <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
             {description && (
               <p className="text-white/70 mt-1 text-sm sm:text-base">{description}</p>
             )}
           </div>
           {children && <div className="flex items-center gap-3">{children}</div>}
         </div>
       </div>
     </div>
   );
 }