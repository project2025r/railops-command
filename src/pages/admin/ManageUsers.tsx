 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { AppShell } from "@/components/layout/AppShell";
 import { PageHeader } from "@/components/ui/PageHeader";
 import { Button } from "@/components/ui/button";
 import { RoleBadge } from "@/components/ui/RoleBadge";
 import { Pencil, Trash2, ArrowLeft, Search } from "lucide-react";
 import { Input } from "@/components/ui/input";
 import { useToast } from "@/hooks/use-toast";
 import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
 } from "@/components/ui/alert-dialog";
 
 interface User {
   id: string;
   username: string;
   division: string;
   roles: ("Admin" | "Super Admin")[];
   createdAt: string;
   lastLogin: string;
 }
 
 const initialUsers: User[] = [
   {
     id: "1",
     username: "admin",
     division: "NR",
     roles: ["Admin", "Super Admin"],
     createdAt: "Invalid Date",
     lastLogin: "2/4/2026",
   },
   {
     id: "2",
     username: "Ajuser1",
     division: "Ajmer",
     roles: ["Admin"],
     createdAt: "Invalid Date",
     lastLogin: "2/4/2026",
   },
 ];
 
 export default function ManageUsers() {
   const navigate = useNavigate();
   const { toast } = useToast();
   const [users, setUsers] = useState(initialUsers);
   const [searchQuery, setSearchQuery] = useState("");
 
   const filteredUsers = users.filter(
     (user) =>
       user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.division.toLowerCase().includes(searchQuery.toLowerCase())
   );
 
   const handleDeleteUser = (userId: string) => {
     setUsers(users.filter((u) => u.id !== userId));
     toast({
       title: "User Deleted",
       description: "The user has been deleted successfully.",
     });
   };
 
   return (
     <AppShell>
       <PageHeader title="Manage Users" description="View and manage system users" />
 
       <div className="container py-8">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
           <Button variant="ghost" onClick={() => navigate("/home")}>
             <ArrowLeft className="h-4 w-4 mr-2" />
             Back to Home
           </Button>
           <div className="relative w-full sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search users..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 input-premium"
             />
           </div>
         </div>
 
         <div className="space-y-4">
           {filteredUsers.map((user) => (
             <div
               key={user.id}
               className="card-elevated p-6 animate-fade-in"
             >
               <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                 <div className="flex-1">
                   <div className="flex flex-wrap items-center gap-2 mb-4">
                     <h3 className="text-lg font-semibold text-foreground">
                       Username: {user.username}
                     </h3>
                     {user.roles.map((role) => (
                       <RoleBadge key={role} role={role} />
                     ))}
                   </div>
 
                   <div className="space-y-2">
                     <div className="bg-muted/50 rounded-lg px-4 py-2.5">
                       <span className="text-primary font-medium">Division:</span>{" "}
                       <span className="text-foreground">{user.division}</span>
                     </div>
                     <div className="bg-muted/50 rounded-lg px-4 py-2.5">
                       <span className="text-warning font-medium">Password:</span>{" "}
                       <span className="text-muted-foreground">Not available</span>
                     </div>
                     <div className="bg-muted/50 rounded-lg px-4 py-2.5">
                       <span className="text-success font-medium">Created:</span>{" "}
                       <span className="text-foreground">{user.createdAt}</span>
                     </div>
                     <div className="bg-muted/50 rounded-lg px-4 py-2.5">
                       <span className="text-primary font-medium">Last login:</span>{" "}
                       <span className="text-foreground">{user.lastLogin}</span>
                     </div>
                   </div>
                 </div>
 
                 <div className="flex gap-2">
                   <Button
                     size="icon"
                    className="bg-secondary hover:bg-secondary/90"
                     onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                   >
                     <Pencil className="h-4 w-4" />
                   </Button>
                   <AlertDialog>
                     <AlertDialogTrigger asChild>
                       <Button
                         size="icon"
                         variant="destructive"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                       <AlertDialogHeader>
                         <AlertDialogTitle>Delete User</AlertDialogTitle>
                         <AlertDialogDescription>
                           Are you sure you want to delete user "{user.username}"? This action cannot be undone.
                         </AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter>
                         <AlertDialogCancel>Cancel</AlertDialogCancel>
                         <AlertDialogAction
                           onClick={() => handleDeleteUser(user.id)}
                           className="bg-destructive hover:bg-destructive/90"
                         >
                           Delete
                         </AlertDialogAction>
                       </AlertDialogFooter>
                     </AlertDialogContent>
                   </AlertDialog>
                 </div>
               </div>
             </div>
           ))}
 
           {filteredUsers.length === 0 && (
             <div className="text-center py-12 text-muted-foreground">
               No users found matching your search.
             </div>
           )}
         </div>
       </div>
     </AppShell>
   );
 }