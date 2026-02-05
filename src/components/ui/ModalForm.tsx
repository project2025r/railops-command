 import { cn } from "@/lib/utils";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 
 interface ModalFormProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   title: string;
   description?: string;
   children: React.ReactNode;
   className?: string;
 }
 
 export function ModalForm({
   open,
   onOpenChange,
   title,
   description,
   children,
   className,
 }: ModalFormProps) {
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className={cn("sm:max-w-[500px] animate-scale-in", className)}>
         <DialogHeader>
           <DialogTitle className="text-xl">{title}</DialogTitle>
           {description && (
             <DialogDescription>{description}</DialogDescription>
           )}
         </DialogHeader>
         <div className="mt-4">{children}</div>
       </DialogContent>
     </Dialog>
   );
 }