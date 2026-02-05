import { useNavigate } from "react-router-dom";
import { FileText, LayoutDashboard, BarChart3, Upload, Music } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ActionTile } from "@/components/ui/ActionTile";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const isSuperAdmin = user?.role === "Super Admin";

  const baseModules = [
    {
      title: "Transcripts",
      description:
        "Gain insights from your transcripts with AI-powered analytics. View statistics, trends, and key information extracted from audio data.",
      icon: FileText,
      actionLabel: "View Transcripts",
      href: "/transcripts",
      variant: "orange" as const,
    },
    {
      title: "Dashboard",
      description:
        "Visualize audio data and key performance indicators in an interactive dashboard. Track progress and make data-driven decisions.",
      icon: LayoutDashboard,
      actionLabel: "View Dashboard",
      href: "/dashboard",
      variant: "blue" as const,
    },
    {
      title: "Reports",
      description:
        "Generate comprehensive reports with LP-wise analytics. View total files, relevant and irrelevant counts with advanced filtering options.",
      icon: BarChart3,
      actionLabel: "View Reports",
      href: "/reports",
      variant: "purple" as const,
    },
  ];

  // Super Admin sees Upload Statistics, Division User sees Upload Audio
  const lastModule = isSuperAdmin
    ? {
        title: "Upload Statistics",
        description:
          "Monitor file upload statistics across divisions with real-time tracking. View comprehensive stats for uploaded files, storage usage across date ranges.",
        icon: Upload,
        actionLabel: "View Statistics",
        href: "/upload-statistics",
        variant: "blue" as const,
      }
    : {
        title: "Upload Audio",
        description:
          "Upload audio recordings for transcription and analysis. Supports WAV, MP3, M4A, FLAC, AAC, OGG formats up to 5GB each.",
        icon: Music,
        actionLabel: "Upload Files",
        href: "/upload-audio",
        variant: "blue" as const,
      };

  const modules = [...baseModules, lastModule];

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <AppShell>
      {/* Hero Section */}
      <div className="text-center py-12 px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-gradient mb-3">
          AiSPRY - North Western Railways
        </h1>
        <p className="text-muted-foreground text-lg">
          Railway Operations & Audio Analysis Platform
        </p>
      </div>

      {/* Module Tiles */}
      <div className="container pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => (
            <ActionTile
              key={module.title}
              title={module.title}
              description={module.description}
              icon={module.icon}
              actionLabel={module.actionLabel}
              onAction={() => navigate(module.href)}
              variant={module.variant}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
