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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const divisions = ["All Divisions", "Jodhpur", "Jaipur", "Bikaner", "Ajmer"];
const lps = ["All LPs", "Ram Sumer Yadav", "Virendra Singh Tanwar", "Naval Kishor Meena"];
const trains = ["All Trains", "ECR", "12345", "14853"];
const sections = ["All Sections", "JU-MJ", "JU-BKN", "JP-AII"];
const lobbies = ["All HQs", "JU", "JP", "BKN", "AII"];

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
  const [dataLoaded, setDataLoaded] = useState(false);

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
    setDataLoaded(true);
  };

  if (!isAuthenticated) {
    return null;
  }

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
                    >
                      <SelectTrigger className="input-premium">
                        <SelectValue placeholder="All Divisions" />
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
                   >
                     <SelectTrigger className="input-premium">
                       <SelectValue placeholder="All LPs" />
                     </SelectTrigger>
                     <SelectContent>
                       {lps.map((lp) => (
                         <SelectItem key={lp} value={lp}>{lp}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
 
                 <div className="space-y-2">
                  <Label className="text-secondary font-medium">Train Number</Label>
                   <Select
                     value={filters.trainNumber}
                     onValueChange={(v) => setFilters({ ...filters, trainNumber: v })}
                   >
                     <SelectTrigger className="input-premium">
                       <SelectValue placeholder="All Trains" />
                     </SelectTrigger>
                     <SelectContent>
                       {trains.map((t) => (
                         <SelectItem key={t} value={t}>{t}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
 
                 <div className="space-y-2">
                  <Label className="text-secondary font-medium">Section</Label>
                   <Select
                     value={filters.section}
                     onValueChange={(v) => setFilters({ ...filters, section: v })}
                   >
                     <SelectTrigger className="input-premium">
                       <SelectValue placeholder="All Sections" />
                     </SelectTrigger>
                     <SelectContent>
                       {sections.map((s) => (
                         <SelectItem key={s} value={s}>{s}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
 
                 <div className="space-y-2">
                  <Label className="text-secondary font-medium">Lobby</Label>
                   <Select
                     value={filters.lobby}
                     onValueChange={(v) => setFilters({ ...filters, lobby: v })}
                   >
                     <SelectTrigger className="input-premium">
                       <SelectValue placeholder="All HQs" />
                     </SelectTrigger>
                     <SelectContent>
                       {lobbies.map((l) => (
                         <SelectItem key={l} value={l}>{l}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               </div>
 
              <Button onClick={handleApplyFilters} className="w-full bg-secondary hover:bg-secondary/90">
                 Apply Filters
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
                 emptyMessage="Click 'Load KPI Data' to view safety metrics"
                 emptyAction={{
                   label: "Load KPI Data",
                   onClick: () => setDataLoaded(true),
                 }}
               >
                 <div className="h-48 flex items-center justify-center text-muted-foreground">
                   Chart data loaded
                 </div>
               </ChartCard>
 
               <ChartCard
                 title="LP Performance"
                 description="Weekly Journey Frequency per LP"
                 icon={BarChart3}
                 isEmpty={!dataLoaded}
                 emptyMessage="Load dashboard data to view LP performance"
               >
                 <div className="h-48 flex items-center justify-center text-muted-foreground">
                   Chart data loaded
                 </div>
               </ChartCard>
 
               <ChartCard
                 title="Route Distribution"
                 description="Operations by Section"
                 icon={MapPin}
                 isEmpty={!dataLoaded}
                 emptyMessage="Load dashboard data to view route distribution"
               >
                 <div className="h-48 flex items-center justify-center text-muted-foreground">
                   Chart data loaded
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
               <div className="h-32 flex items-center justify-center text-muted-foreground">
                 Insights data loaded
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
                   onClick={() => {}}
                 >
                   <AlertTriangle className="h-4 w-4 mr-1" />
                   Load Violations
                 </Button>
               }
             >
               <div className="h-32 flex items-center justify-center text-muted-foreground">
                 Analysis data loaded
               </div>
             </ChartCard>
           </div>
         </div>
       </div>
     </AppShell>
   );
 }