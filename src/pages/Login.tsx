 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { User, Building2, Lock, Eye, EyeOff, Lightbulb } from "lucide-react";
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
 import railwayBg from "@/assets/railway-bg.jpg";
 
 const divisions = ["Jodhpur", "Jaipur", "Bikaner", "Ajmer"];
 
 export default function Login() {
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);
   const [formData, setFormData] = useState({
     username: "",
     division: "",
     password: "",
   });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     navigate("/home");
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
       {/* Background Image */}
       <div
         className="absolute inset-0 bg-cover bg-center"
         style={{ backgroundImage: `url(${railwayBg})` }}
       />
       <div className="absolute inset-0 bg-gradient-to-br from-header/80 via-header/60 to-header/80 backdrop-blur-sm" />
 
       {/* Login Card */}
       <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
         <div className="bg-card rounded-2xl shadow-elevated-lg p-8 border border-border/50">
           {/* Header */}
           <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-gradient mb-2">
               North Western Railway
             </h1>
             <p className="text-muted-foreground">Railcomm analytics platform</p>
           </div>
 
           <div className="text-center mb-8">
             <h2 className="text-xl font-semibold text-foreground">Welcome Back</h2>
             <p className="text-sm text-muted-foreground mt-1">
               Please sign in to your account
             </p>
           </div>
 
           {/* Form */}
           <form onSubmit={handleSubmit} className="space-y-5">
             {/* Username */}
             <div className="space-y-2">
               <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4 text-secondary" />
                 Username
               </Label>
               <Input
                 id="username"
                 placeholder="Enter your username"
                 value={formData.username}
                 onChange={(e) =>
                   setFormData({ ...formData, username: e.target.value })
                 }
                 className="input-premium"
               />
             </div>
 
             {/* Division */}
             <div className="space-y-2">
               <Label htmlFor="division" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-secondary" />
                 Division
               </Label>
               <Select
                 value={formData.division}
                 onValueChange={(value) =>
                   setFormData({ ...formData, division: value })
                 }
               >
                 <SelectTrigger className="input-premium">
                   <SelectValue placeholder="Select division" />
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
                <Lightbulb className="h-3 w-3 text-primary" />
                 Super Admin users can leave division empty to access all divisions
               </p>
             </div>
 
             {/* Password */}
             <div className="space-y-2">
               <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-secondary" />
                 Password
               </Label>
               <div className="relative">
                 <Input
                   id="password"
                   type={showPassword ? "text" : "password"}
                   placeholder="Enter your password"
                   value={formData.password}
                   onChange={(e) =>
                     setFormData({ ...formData, password: e.target.value })
                   }
                   className="input-premium pr-10"
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                 >
                   {showPassword ? (
                     <EyeOff className="h-4 w-4" />
                   ) : (
                     <Eye className="h-4 w-4" />
                   )}
                 </button>
               </div>
             </div>
 
             {/* Submit */}
            <Button type="submit" className="w-full h-11 text-base font-medium bg-secondary hover:bg-secondary/90">
               Sign In
             </Button>
           </form>
 
           <p className="text-center text-xs text-muted-foreground mt-6">
             Secure access to railway operations dashboard
           </p>
         </div>
       </div>
     </div>
   );
 }