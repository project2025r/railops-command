import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  FileText,
  BarChart3,
  Upload,
  Settings,
  LogOut,
  ChevronDown,
  Users,
  Building2,
  UserPlus,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { useAuth } from "@/contexts/AuthContext";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "Super Admin" || user?.role === "Admin";
  const isSuperAdmin = user?.role === "Super Admin";

  // Build navigation based on role
  const navigation = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transcripts", href: "/transcripts", icon: FileText },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    // Show Upload Statistics for Super Admin, Upload Audio for Division User
    isSuperAdmin
      ? { name: "Upload Statistics", href: "/upload-statistics", icon: Upload }
      : { name: "Upload Audio", href: "/upload-audio", icon: Music },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 header-gradient border-b border-white/10">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/home" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center">
                <span className="text-brand-orange font-bold text-lg">A</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-header-foreground font-semibold text-lg leading-tight">
                  AiSPRY
                </h1>
                <p className="text-header-foreground/60 text-xs">
                  North Western Railways
                </p>
              </div>
            </Link>

            {/* Primary Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-header-foreground/80 text-sm">
                Welcome, {user?.username || "Guest"}
              </span>
              {user?.role && (
                <RoleBadge role={user.role as "Admin" | "Super Admin"} />
              )}
            </div>

            {/* Admin Menu - only visible for Admin/Super Admin */}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-header-foreground/80 hover:text-header-foreground hover:bg-white/10"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-fade-in">
                  <DropdownMenuItem onClick={() => navigate("/admin/create-division")}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Create Division
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/create-user")}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/manage-users")}>
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Logout */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white hover:text-white hover:bg-white/10 border border-white/30"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="animate-fade-in">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2025 AiSPRY. All rights reserved. Powered by{" "}
          <span className="font-semibold">AiSPRY</span>.
        </div>
      </footer>
    </div>
  );
}
