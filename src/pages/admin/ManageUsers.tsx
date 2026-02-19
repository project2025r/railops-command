import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { Pencil, Trash2, ArrowLeft, Search, Loader2 } from "lucide-react";
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
import { useUsers, useDeleteUser } from "@/hooks/api/useUsers";

export default function ManageUsers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: usersData, isLoading } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const [searchQuery, setSearchQuery] = useState("");

  const users = usersData?.users ?? [];

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.division ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteUser = async (userId: number, username: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      toast({
        title: "User Deleted",
        description: `User "${username}" has been deleted successfully.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete user";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  // Helper to get role badges
  const getUserRoles = (user: { is_admin: boolean; is_super_admin: boolean }) => {
    const roles: ("Admin" | "Super Admin")[] = [];
    if (user.is_super_admin) roles.push("Super Admin");
    if (user.is_admin) roles.push("Admin");
    return roles;
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <span className="ml-3 text-muted-foreground">Loading users...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => {
              const roles = getUserRoles(user);
              return (
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
                        {roles.map((role) => (
                          <RoleBadge key={role} role={role} />
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="bg-muted/50 rounded-lg px-4 py-2.5">
                          <span className="text-primary font-medium">Division:</span>{" "}
                          <span className="text-foreground">{user.division ?? "N/A"}</span>
                        </div>
                        <div className="bg-muted/50 rounded-lg px-4 py-2.5">
                          <span className="text-warning font-medium">Password:</span>{" "}
                          <span className="text-foreground">
                            {user.original_password || "Not available"}
                          </span>
                        </div>
                        <div className="bg-muted/50 rounded-lg px-4 py-2.5">
                          <span className="text-success font-medium">Created:</span>{" "}
                          <span className="text-foreground">
                            {user.created_at
                              ? new Date(user.created_at).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="bg-muted/50 rounded-lg px-4 py-2.5">
                          <span className="text-primary font-medium">Last login:</span>{" "}
                          <span className="text-foreground">
                            {user.last_loggedin
                              ? new Date(user.last_loggedin).toLocaleDateString()
                              : "Never"}
                          </span>
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
                            disabled={deleteUserMutation.isPending}
                          >
                            {deleteUserMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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
                              onClick={() => handleDeleteUser(user.id, user.username)}
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
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No users found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}