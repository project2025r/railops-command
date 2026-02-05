 import { useState } from "react";
 import { AppShell } from "@/components/layout/AppShell";
 import { PageHeader } from "@/components/ui/PageHeader";
 import { FilterPanel } from "@/components/ui/FilterPanel";
 import { DataTable, Column } from "@/components/ui/DataTable";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 import { Input } from "@/components/ui/input";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Download } from "lucide-react";
 
 interface ReportRow {
   lpName: string;
   division: string;
   totalFiles: number;
   relevant: number;
   irrelevant: number;
   sections: number;
   trains: number;
   lastActivity: string;
 }
 
 const sampleData: ReportRow[] = [
   {
     lpName: "Ram Sumer Yadav",
     division: "Jodhpur",
     totalFiles: 115,
     relevant: 48892,
     irrelevant: 12552,
     sections: 14,
     trains: 28,
     lastActivity: "1/27/2026",
   },
   {
     lpName: "Virendra Singh Tanwar",
     division: "Jodhpur",
     totalFiles: 28,
     relevant: 13156,
     irrelevant: 3046,
     sections: 3,
     trains: 3,
     lastActivity: "1/31/2026",
   },
   {
     lpName: "Naval Kishor Meena",
     division: "Jodhpur",
     totalFiles: 26,
     relevant: 11220,
     irrelevant: 2828,
     sections: 5,
     trains: 4,
     lastActivity: "12/19/2025",
   },
   {
     lpName: "Hukam Singh Rathore",
     division: "Jodhpur",
     totalFiles: 19,
     relevant: 7367,
     irrelevant: 1471,
     sections: 5,
     trains: 8,
     lastActivity: "1/26/2026",
   },
 ];
 
 const columns: Column<ReportRow>[] = [
   { key: "lpName", header: "LP Name", className: "font-medium" },
   { key: "division", header: "Division" },
   { key: "totalFiles", header: "Total Files", className: "text-right" },
   {
     key: "relevant",
     header: "Relevant",
     className: "text-right",
     render: (value) => (
       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success">
         {value.toLocaleString()}
       </span>
     ),
   },
   {
     key: "irrelevant",
     header: "Irrelevant",
     className: "text-right",
     render: (value) => (
       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/15 text-destructive">
         {value.toLocaleString()}
       </span>
     ),
   },
   { key: "sections", header: "Sections", className: "text-center" },
   { key: "trains", header: "Trains", className: "text-center" },
   { key: "lastActivity", header: "Last Activity" },
   {
     key: "actions",
     header: "Actions",
     className: "text-right",
     render: () => (
       <Button size="sm" className="bg-success hover:bg-success/90">
         <Download className="h-4 w-4 mr-1" />
         Download
       </Button>
     ),
   },
 ];
 
 export default function Reports() {
   const [filters, setFilters] = useState({
     division: "",
     lpName: "",
     fromDate: "01-11-2024",
     toDate: "04-02-2026",
   });
 
   const handleApply = () => {};
   const handleClear = () =>
     setFilters({ division: "", lpName: "", fromDate: "", toDate: "" });
 
   return (
     <AppShell>
       <PageHeader
         title="Reports & Analytics"
         description="LP-wise performance reports with advanced filtering"
       />
 
       <div className="container py-8 space-y-6">
         {/* Filters */}
         <FilterPanel onApply={handleApply} onClear={handleClear}>
           <div className="space-y-2">
             <Label>Division</Label>
             <Select
               value={filters.division}
               onValueChange={(v) => setFilters({ ...filters, division: v })}
             >
               <SelectTrigger className="input-premium">
                 <SelectValue placeholder="All Divisions" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Divisions</SelectItem>
                 <SelectItem value="jodhpur">Jodhpur</SelectItem>
                 <SelectItem value="jaipur">Jaipur</SelectItem>
                 <SelectItem value="bikaner">Bikaner</SelectItem>
                 <SelectItem value="ajmer">Ajmer</SelectItem>
               </SelectContent>
             </Select>
           </div>
 
           <div className="space-y-2">
             <Label>LP Name</Label>
             <Select
               value={filters.lpName}
               onValueChange={(v) => setFilters({ ...filters, lpName: v })}
             >
               <SelectTrigger className="input-premium">
                 <SelectValue placeholder="All LPs" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All LPs</SelectItem>
                 <SelectItem value="ram">Ram Sumer Yadav</SelectItem>
                 <SelectItem value="virendra">Virendra Singh Tanwar</SelectItem>
               </SelectContent>
             </Select>
           </div>
 
           <div className="space-y-2">
             <Label>From Date</Label>
             <Input
               type="date"
               value={filters.fromDate}
               onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
               className="input-premium"
             />
           </div>
 
           <div className="space-y-2">
             <Label>To Date</Label>
             <Input
               type="date"
               value={filters.toDate}
               onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
               className="input-premium"
             />
           </div>
         </FilterPanel>
 
         {/* Results Table */}
         <div className="space-y-4">
           <div className="flex items-center justify-between">
             <h3 className="text-lg font-semibold text-foreground">LP Reports Summary</h3>
             <span className="text-sm text-muted-foreground">
               Showing {sampleData.length} of {sampleData.length} results
             </span>
           </div>
           <DataTable columns={columns} data={sampleData} />
         </div>
       </div>
     </AppShell>
   );
 }