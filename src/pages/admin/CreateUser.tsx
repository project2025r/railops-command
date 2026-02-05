 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { AppShell } from "@/components/layout/AppShell";
 import { PageHeader } from "@/components/ui/PageHeader";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { UserPlus, ArrowLeft, Eye, EyeOff, Info } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 const divisions = ["Jodhpur", "Jaipur", "Bikaner", "Ajmer"];
 
 export default function CreateUser() {
   const navigate = useNavigate();
   const { toast } = useToast();
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [formData, setFormData] = useState({
     username: "",
     division: "",
     password: "",
     confirmPassword: "",
   });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (!formData.username || !formData.division || !formData.password) {
       toast({
         title: "Validation Error",
         description: "Please fill in all required fields",
         variant: "destructive",
       });
       return;
     }
     if (formData.password !== formData.confirmPassword) {
       toast({
         title: "Password Mismatch",
         description: "Passwords do not match",
         variant: "destructive",
       });
       return;
     }
     if (formData.password.length < 6) {
       toast({
         title: "Weak Password",
         description: "Password must be at least 6 characters",
         variant: "destructive",
       });
       return;
     }
     toast({
       title: "User Created",
       description: `User "${formData.username}" has been created successfully.`,
     });
     navigate("/admin/manage-users");
   };
 
   return (
     <AppShell>
       <PageHeader title="Create User" description="Add a new user to the system" />
 
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
            <UserPlus className="h-5 w-5 text-secondary" />
             Create New User
           </h2>
 
           <form onSubmit={handleSubmit} className="space-y-5">
             <div className="space-y-2">
               <Label htmlFor="username">
                 Username <span className="text-destructive">*</span>
               </Label>
               <Input
                 id="username"
                 placeholder="Enter username"
                 value={formData.username}
                 onChange={(e) =>
                   setFormData({ ...formData, username: e.target.value })
                 }
                 className="input-premium"
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="division">
                 Division <span className="text-destructive">*</span>
               </Label>
               <Select
                 value={formData.division}
                 onValueChange={(v) => setFormData({ ...formData, division: v })}
               >
                 <SelectTrigger className="input-premium">
                   <SelectValue placeholder="Loading divisions..." />
                 </SelectTrigger>
                 <SelectContent>
                   {divisions.map((div) => (
                     <SelectItem key={div} value={div}>
                       {div}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
               <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3 text-secondary" />
                 Select the division where this user will be assigned.
               </p>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="password">
                 Password <span className="text-destructive">*</span>
               </Label>
               <div className="relative">
                 <Input
                   id="password"
                   type={showPassword ? "text" : "password"}
                   placeholder="Enter password (min 6 characters)"
                   value={formData.password}
                   onChange={(e) =>
                     setFormData({ ...formData, password: e.target.value })
                   }
                   className="input-premium pr-10"
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                 >
                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </button>
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="confirmPassword">
                 Confirm Password <span className="text-destructive">*</span>
               </Label>
               <div className="relative">
                 <Input
                   id="confirmPassword"
                   type={showConfirmPassword ? "text" : "password"}
                   placeholder="Confirm password"
                   value={formData.confirmPassword}
                   onChange={(e) =>
                     setFormData({ ...formData, confirmPassword: e.target.value })
                   }
                   className="input-premium pr-10"
                 />
                 <button
                   type="button"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                 >
                   {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </button>
               </div>
             </div>
 
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
               <UserPlus className="h-4 w-4 mr-2" />
               Create User
             </Button>
           </form>
         </div>
       </div>
     </AppShell>
   );
 }