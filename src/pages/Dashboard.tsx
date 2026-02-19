import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChartCard } from "@/components/ui/ChartCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  BarChart3,
  MapPin,
  Lightbulb,
  FileText,
  AlertTriangle,
  Filter,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDropdownData } from "@/hooks/api/useUpload";
import { useDashboardData, useTranscriptKpi, useViolationAnalysis } from "@/hooks/api/useDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isSuperAdmin = user?.role === "Super Admin";

  const [filters, setFilters] = useState({
    division: "",
    date: "",
    lp: "",
    trainNumber: "",
    section: "",
    lobby: "",
  });
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Fetch dropdown data from API
  const { data: dropdownData, isLoading: dropdownLoading } = useDropdownData(
    isSuperAdmin ? undefined : user?.division,
  );

  // Build filter params for API calls
  const apiParams = {
    division: filters.division && filters.division !== "All Divisions" ? filters.division : undefined,
    loco_pilot: filters.lp && filters.lp !== "All LPs" ? filters.lp : undefined,
    start_date: filters.date || undefined,
  };

  // Dashboard data queries — only run when filters are applied
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
  } = useDashboardData(apiParams, filtersApplied);

  const {
    data: kpiData,
    isLoading: kpiLoading,
  } = useTranscriptKpi(apiParams, filtersApplied);

  const {
    data: violationData,
    isLoading: violationLoading,
  } = useViolationAnalysis(apiParams, filtersApplied);

  const dataLoaded = filtersApplied && !dashboardLoading && !!dashboardData;
  const isAnyLoading = dashboardLoading || kpiLoading || violationLoading;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Set division filter to user's division for non-Super Admin users
  useEffect(() => {
    if (user && !isSuperAdmin && user.division) {
      setFilters((prev) => ({ ...prev, division: user.division }));
    }
  }, [user, isSuperAdmin]);

  const handleApplyFilters = () => {
    setFiltersApplied(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  // Build dropdown options from API data
  const divisions = ["All Divisions", ...(dropdownData?.divisions ?? [])];
  const lps = ["All LPs", ...(dropdownData?.loco_pilots ?? [])];
  const sections = ["All Sections", ...(dropdownData?.sections ?? [])];

  return (
    <AppShell>
      <PageHeader
        title="Railway Operations Dashboard"
        description="Real-time analytics and performance metrics"
      />

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card-elevated p-5 sticky top-24 space-y-5">
              <h3 className="font-semibold text-secondary flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>

              <div className="space-y-4">
                {/* Division filter - only show for Super Admin */}
                {isSuperAdmin && (
                  <div className="space-y-2">
                    <Label className="text-secondary font-medium">Division</Label>
                    <Select
                      value={filters.division}
                      onValueChange={(v) => setFilters({ ...filters, division: v })}
                      disabled={dropdownLoading}
                    >
                      <SelectTrigger className="input-premium">
                        <SelectValue placeholder={dropdownLoading ? "Loading..." : "All Divisions"} />
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
                  <Label className="text-secondary font-medium">Select Date</Label>
                  <Select
                    value={filters.date}
                    onValueChange={(v) => setFilters({ ...filters, date: v })}
                  >
                    <SelectTrigger className="input-premium">
                      <SelectValue placeholder="All dates..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-secondary font-medium">LP</Label>
                  <Select
                    value={filters.lp}
                    onValueChange={(v) => setFilters({ ...filters, lp: v })}
                    disabled={dropdownLoading}
                  >
                    <SelectTrigger className="input-premium">
                      <SelectValue placeholder={dropdownLoading ? "Loading..." : "All LPs"} />
                    </SelectTrigger>
                    <SelectContent>
                      {lps.map((lp) => (
                        <SelectItem key={lp} value={lp}>{lp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-secondary font-medium">Section</Label>
                  <Select
                    value={filters.section}
                    onValueChange={(v) => setFilters({ ...filters, section: v })}
                    disabled={dropdownLoading}
                  >
                    <SelectTrigger className="input-premium">
                      <SelectValue placeholder={dropdownLoading ? "Loading..." : "All Sections"} />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleApplyFilters}
                className="w-full bg-secondary hover:bg-secondary/90"
                disabled={isAnyLoading}
              >
                {isAnyLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Apply Filters"
                )}
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Top Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ChartCard
                title="Safety Analysis"
                description="Relevant vs Irrelevant Transcript Lines"
                icon={Shield}
                isEmpty={!dataLoaded}
                emptyMessage="Click 'Apply Filters' to view safety metrics"
                emptyAction={{
                  label: "Load KPI Data",
                  onClick: handleApplyFilters,
                }}
              >
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  {kpiLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : kpiData ? (
                    <>
                      <p className="text-2xl font-bold text-foreground">{kpiData.total_keywords_found}</p>
                      <p className="text-sm">Total keywords found in {kpiData.total_files} files</p>
                    </>
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              </ChartCard>

              <ChartCard
                title="LP Performance"
                description="Weekly Journey Frequency per LP"
                icon={BarChart3}
                isEmpty={!dataLoaded}
                emptyMessage="Load dashboard data to view LP performance"
              >
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  {dashboardLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : dashboardData ? (
                    <>
                      <p className="text-2xl font-bold text-foreground">{dashboardData.total_files}</p>
                      <p className="text-sm">Total files processed</p>
                      <p className="text-sm">{dashboardData.total_records} total records</p>
                    </>
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              </ChartCard>

              <ChartCard
                title="Route Distribution"
                description="Operations by Section"
                icon={MapPin}
                isEmpty={!dataLoaded}
                emptyMessage="Load dashboard data to view route distribution"
              >
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  {kpiLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : kpiData ? (
                    <div className="w-full px-4 space-y-1 max-h-44 overflow-y-auto">
                      {Object.entries(kpiData.breakdown_by_section).map(([section, count]) => (
                        <div key={section} className="flex justify-between text-sm">
                          <span className="text-foreground">{section}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                      {Object.keys(kpiData.breakdown_by_section).length === 0 && (
                        <p className="text-center">No section data</p>
                      )}
                    </div>
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              </ChartCard>
            </div>

            {/* Operational Insights */}
            <ChartCard
              title="Operational Insights"
              description="Key Safety & Performance Metrics"
              icon={Lightbulb}
              isEmpty={!dataLoaded}
              emptyMessage="Load dashboard and KPI data to view insights"
            >
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                {dashboardLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : dashboardData ? (
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{dashboardData.keywords_found}</p>
                      <p className="text-sm">Keywords Found</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{dashboardData.total_files}</p>
                      <p className="text-sm">Total Files</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{dashboardData.total_records}</p>
                      <p className="text-sm">Records</p>
                    </div>
                  </div>
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </ChartCard>

            {/* LP Transcript Analysis */}
            <ChartCard
              title="LP Transcript Analysis"
              description="Relevant vs Irrelevant lines by LP"
              icon={FileText}
              isEmpty={!dataLoaded}
              emptyMessage="Apply filters to view LP analysis"
              headerAction={
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={handleApplyFilters}
                  disabled={violationLoading}
                >
                  {violationLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-1" />
                  )}
                  Load Violations
                </Button>
              }
            >
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground space-y-2">
                {violationLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : violationData ? (
                  <div className="w-full px-4 space-y-2">
                    <p className="text-center text-lg font-semibold text-foreground">
                      {violationData.violation_summary.total_violations} Total Violations
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Object.entries(violationData.violation_summary.by_keyword).slice(0, 5).map(
                        ([keyword, count]) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/15 text-destructive"
                          >
                            {keyword}: {count}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}