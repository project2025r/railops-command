 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { AppShell } from "@/components/layout/AppShell";
 import { PageHeader } from "@/components/ui/PageHeader";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Building2, ArrowLeft } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 export default function CreateDivision() {
   const navigate = useNavigate();
   const { toast } = useToast();
   const [formData, setFormData] = useState({
     divisionName: "",
     description: "",
   });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (!formData.divisionName.trim()) {
       toast({
         title: "Validation Error",
         description: "Division name is required",
         variant: "destructive",
       });
       return;
     }
     toast({
       title: "Division Created",
       description: `Division "${formData.divisionName}" has been created successfully.`,
     });
     navigate("/home");
   };
 
   return (
     <AppShell>
       <PageHeader title="Create Division" description="Add a new division to the system" />
 
       <div className="container py-8 max-w-lg">
         <Button
           variant="ghost"
           onClick={() => navigate("/home")}
           className="mb-6"
         >
           <ArrowLeft className="h-4 w-4 mr-2" />
           Back to Home
         </Button>
 
         <div className="card-elevated p-6">
           <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
             <Building2 className="h-5 w-5 text-primary" />
             Create New Division
           </h2>
 
           <form onSubmit={handleSubmit} className="space-y-5">
             <div className="space-y-2">
               <Label htmlFor="divisionName">
                 Division Name <span className="text-destructive">*</span>
               </Label>
               <Input
                 id="divisionName"
                 placeholder="Enter division name (e.g., Delhi, Mumbai, Chennai)"
                 value={formData.divisionName}
                 onChange={(e) =>
                   setFormData({ ...formData, divisionName: e.target.value })
                 }
                 className="input-premium"
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="description">Description</Label>
               <Textarea
                 id="description"
                 placeholder="Enter division description (optional)"
                 value={formData.description}
                 onChange={(e) =>
                   setFormData({ ...formData, description: e.target.value })
                 }
                 className="input-premium min-h-[100px]"
               />
             </div>
 
             <Button type="submit" className="w-full bg-success hover:bg-success/90">
               <Building2 className="h-4 w-4 mr-2" />
               Create Division
             </Button>
           </form>
         </div>
       </div>
     </AppShell>
   );
 }