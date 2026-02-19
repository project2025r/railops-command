import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { Files, Building2, HardDrive, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFileCountsSummary, useRealTimeFileCounts } from "@/hooks/api/useAdmin";

interface DivisionStats {
  division: string;
  total: number;
  today: number;
}

const columns: Column<DivisionStats>[] = [
  { key: "division", header: "Division" },
  { key: "total", header: "Total Files", className: "text-right" },
  { key: "today", header: "Today", className: "text-right" },
];

export default function UploadStatistics() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Fetch file counts summary and real-time counts
  const { data: fileCounts, isLoading: countsLoading } = useFileCountsSummary({
    start_date: dateRange.start || undefined,
    end_date: dateRange.end || undefined,
  });

  const { data: realTimeCounts, isLoading: realTimeLoading } = useRealTimeFileCounts();

  const isLoading = countsLoading || realTimeLoading;

  // Transform real-time counts into table data
  const divisionData: DivisionStats[] = realTimeCounts
    ? Object.entries(realTimeCounts.by_division).map(([division, counts]) => ({
      division,
      total: counts.total,
      today: counts.today,
    }))
    : [];

  const totalFiles = realTimeCounts?.total_files ?? 0;
  const filesToday = realTimeCounts?.files_today ?? 0;
  const pendingIngestion = realTimeCounts?.pending_ingestion ?? 0;
  const totalDivisions = divisionData.length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppShell>
      <PageHeader
        title="Upload Statistics"
        description="File upload statistics across all divisions"
      />

      <div className="container py-8 space-y-6">
        {/* Date Range Filter */}
        <div className="card-elevated p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="input-premium h-10 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="input-premium h-10 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <span className="ml-3 text-muted-foreground">Loading statistics...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Files"
                value={totalFiles.toLocaleString()}
                icon={Files}
              />
              <StatCard
                title="Divisions"
                value={totalDivisions.toString()}
                icon={Building2}
              />
              <StatCard
                title="Files Today"
                value={filesToday.toLocaleString()}
                icon={HardDrive}
              />
              <StatCard
                title="Pending Ingestion"
                value={pendingIngestion.toLocaleString()}
                icon={Clock}
              />
            </div>

            {/* Division Table */}
            {divisionData.length > 0 ? (
              <DataTable columns={columns} data={divisionData} />
            ) : (
              <div className="card-elevated p-12 text-center text-muted-foreground">
                No division data available.
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}