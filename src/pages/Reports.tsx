import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DataTable, Column } from "@/components/ui/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Download, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDropdownData } from "@/hooks/api/useUpload";
import { useTranscriptKpi } from "@/hooks/api/useDashboard";

interface ReportRow {
  lpName: string;
  keywordsFound: number;
}

const columns: Column<ReportRow>[] = [
  { key: "lpName", header: "LP Name" },
  { key: "keywordsFound", header: "Keywords Found", className: "text-right" },
];

export default function Reports() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isSuperAdmin = user?.role === "Super Admin";

  const [filters, setFilters] = useState({
    division: "",
    lp: "",
    startDate: "",
    endDate: "",
  });
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Fetch dropdown data for filters
  const { data: dropdownData, isLoading: dropdownLoading } = useDropdownData(
    isSuperAdmin ? undefined : user?.division,
  );

  // Fetch KPI data for reports
  const apiParams = {
    division: filters.division && filters.division !== "All" ? filters.division : undefined,
    loco_pilot: filters.lp && filters.lp !== "All" ? filters.lp : undefined,
    start_date: filters.startDate || undefined,
    end_date: filters.endDate || undefined,
  };

  const { data: kpiData, isLoading: kpiLoading } = useTranscriptKpi(apiParams, filtersApplied);

  // Transform KPI breakdown data into table rows
  const reportData: ReportRow[] = kpiData
    ? Object.entries(kpiData.breakdown_by_loco_pilot).map(([lpName, keywordsFound]) => ({
      lpName,
      keywordsFound,
    }))
    : [];

  const handleApplyFilters = () => {
    setFiltersApplied(true);
  };

  const handleDownload = () => {
    if (reportData.length === 0) return;
    const csv = [
      "LP Name,Keywords Found",
      ...reportData.map((r) => `${r.lpName},${r.keywordsFound}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const divisions = ["All", ...(dropdownData?.divisions ?? [])];
  const lps = ["All", ...(dropdownData?.loco_pilots ?? [])];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppShell>
      <PageHeader
        title="Reports"
        description="LP-wise performance analytics and keyword analysis"
      />

      <div className="container py-8 space-y-6">
        {/* Filter Panel */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-secondary" />
            Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isSuperAdmin && (
              <div className="space-y-2">
                <Label>Division</Label>
                <Select
                  value={filters.division}
                  onValueChange={(v) => setFilters({ ...filters, division: v })}
                  disabled={dropdownLoading}
                >
                  <SelectTrigger className="input-premium">
                    <SelectValue placeholder={dropdownLoading ? "Loading..." : "All"} />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>LP Name</Label>
              <Select
                value={filters.lp}
                onValueChange={(v) => setFilters({ ...filters, lp: v })}
                disabled={dropdownLoading}
              >
                <SelectTrigger className="input-premium">
                  <SelectValue placeholder={dropdownLoading ? "Loading..." : "All"} />
                </SelectTrigger>
                <SelectContent>
                  {lps.map((lp) => (
                    <SelectItem key={lp} value={lp}>{lp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="input-premium w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="input-premium w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              className="bg-secondary hover:bg-secondary/90"
              onClick={handleApplyFilters}
              disabled={kpiLoading}
            >
              {kpiLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Apply Filters"
              )}
            </Button>
            <Button
              variant="outline"
              className="border-secondary/30"
              onClick={handleDownload}
              disabled={reportData.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {kpiData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-elevated p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{kpiData.total_files}</p>
              <p className="text-sm text-muted-foreground">Total Files</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{kpiData.total_keywords_found}</p>
              <p className="text-sm text-muted-foreground">Keywords Found</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{reportData.length}</p>
              <p className="text-sm text-muted-foreground">Loco Pilots</p>
            </div>
          </div>
        )}

        {/* Data Table */}
        {kpiLoading ? (
          <div className="card-elevated p-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <span className="ml-3 text-muted-foreground">Loading report data...</span>
          </div>
        ) : filtersApplied && reportData.length > 0 ? (
          <DataTable columns={columns} data={reportData} />
        ) : filtersApplied ? (
          <div className="card-elevated p-12 text-center text-muted-foreground">
            No report data found. Try adjusting your filters.
          </div>
        ) : (
          <div className="card-elevated p-12 text-center text-muted-foreground">
            Apply filters to generate report data.
          </div>
        )}
      </div>
    </AppShell>
  );
}