 import { useState } from "react";
 import { AppShell } from "@/components/layout/AppShell";
 import { PageHeader } from "@/components/ui/PageHeader";
 import { StatCard } from "@/components/ui/StatCard";
 import { DataTable, Column } from "@/components/ui/DataTable";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Files, Building2, HardDrive, Clock, RefreshCw, X } from "lucide-react";
 
 interface DivisionStats {
   division: string;
   files: number;
   size: string;
   lastUpdated: string;
 }
 
 const divisionData: DivisionStats[] = [
   { division: "Bikaner", files: 738, size: "189.4 GB", lastUpdated: "2/4/2026, 6:20:55 AM" },
   { division: "Jaipur", files: 668, size: "147.68 GB", lastUpdated: "2/4/2026, 4:22:35 AM" },
   { division: "Ajmer", files: 668, size: "187.94 GB", lastUpdated: "2/4/2026, 4:29:13 AM" },
   { division: "Jodhpur", files: 628, size: "277.76 GB", lastUpdated: "2/4/2026, 6:24:47 AM" },
 ];
 
 const columns: Column<DivisionStats>[] = [
   { key: "division", header: "DIVISION", className: "font-medium" },
   {
     key: "files",
     header: "FILES",
     render: (value) => (
       <a href="#" className="text-primary hover:underline font-medium">
         {value}
       </a>
     ),
   },
   { key: "size", header: "SIZE" },
   { key: "lastUpdated", header: "LAST UPDATED" },
 ];
 
 export default function UploadStatistics() {
   const [dateRange, setDateRange] = useState({ from: "", to: "" });
 
   const stats = {
     totalFiles: 2702,
     divisions: 4,
     totalSize: "802.78 GB",
     lastUpdated: "2/4/2026",
   };
 
   return (
     <AppShell>
       <PageHeader
         title="File Upload Statistics"
         description="Monitor file uploads across divisions with real-time tracking"
       />
 
       <div className="container py-8 space-y-6">
         {/* Date Range Controls */}
         <div className="card-elevated p-5">
           <div className="flex flex-wrap items-end gap-4">
             <div className="space-y-2">
               <label className="text-sm font-medium text-muted-foreground">From</label>
               <Input
                 type="date"
                 value={dateRange.from}
                 onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                 className="input-premium w-40"
                 placeholder="dd-mm-yyyy"
               />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-muted-foreground">To</label>
               <Input
                 type="date"
                 value={dateRange.to}
                 onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                 className="input-premium w-40"
               />
             </div>
             <Button
               variant="outline"
               onClick={() => setDateRange({ from: "", to: "" })}
               className="text-destructive border-destructive/30 hover:bg-destructive/10"
             >
               <X className="h-4 w-4 mr-1" />
               Clear
             </Button>
            <Button className="bg-secondary hover:bg-secondary/90">
               <RefreshCw className="h-4 w-4 mr-2" />
               Refresh
             </Button>
           </div>
         </div>
 
         {/* Summary Stats */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard
             title="Total Files"
             value={stats.totalFiles.toLocaleString()}
             icon={Files}
           />
           <StatCard
             title="Divisions"
             value={stats.divisions}
             icon={Building2}
           />
           <StatCard
             title="Total Size"
             value={stats.totalSize}
             icon={HardDrive}
           />
           <StatCard
             title="Last Updated"
             value={stats.lastUpdated}
             icon={Clock}
           />
         </div>
 
         {/* Division Statistics Table */}
         <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary">Division Statistics</h3>
           <DataTable columns={columns} data={divisionData} />
           <p className="text-center text-sm text-muted-foreground">
             Real-time tracking (All Divisions)
           </p>
         </div>
       </div>
     </AppShell>
   );
 }