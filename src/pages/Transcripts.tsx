 import { useState } from "react";
 import { AppShell } from "@/components/layout/AppShell";
 import { PageHeader } from "@/components/ui/PageHeader";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 import { Input } from "@/components/ui/input";
 import { DataTable, Column } from "@/components/ui/DataTable";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import {
   Play,
   Volume2,
   MoreVertical,
   Pencil,
   Filter,
   X,
   Music,
 } from "lucide-react";
 
 interface TranscriptLine {
   audioTime: string;
   timestamp: string;
   text: string;
 }
 
 const sampleTranscripts: TranscriptLine[] = [
   { audioTime: "01:05", timestamp: "22:01:09", text: "नॉन होम चैनल" },
   { audioTime: "03:05", timestamp: "22:03:09", text: "नॉन होम चैनल" },
   { audioTime: "04:32", timestamp: "22:04:36", text: "सरवन जी कोटा से" },
   { audioTime: "04:35", timestamp: "22:04:39", text: "बड़ाओ बड़ाओ भाईजान बड़ाओ" },
   { audioTime: "04:39", timestamp: "22:04:43", text: "कोठी लाइन नंबर छे स्टार्टर येलो" },
   { audioTime: "04:40", timestamp: "22:04:44", text: "हेलो" },
   { audioTime: "04:43", timestamp: "22:04:47", text: "कोठी लाइन नंबर छे स्टार्टर येलो" },
   { audioTime: "05:05", timestamp: "22:05:09", text: "नॉन होम चैनल" },
   { audioTime: "05:39", timestamp: "22:05:43", text: "कोठी लाइन नंबर छे स्टार्टर येलो पासिंग" },
   { audioTime: "05:42", timestamp: "22:05:46", text: "स्टार्टर येलो पासिंग" },
   { audioTime: "06:12", timestamp: "22:06:16", text: "P C K T incoming starter 4 3 8" },
   { audioTime: "06:57", timestamp: "22:07:01", text: "वन बी एक रिमेडी एक स्टार्टर था" },
 ];
 
 const metadata = {
   date: "2026-12-26",
   trainNo: "ECR",
   locoNo: "12345",
   lpName: "Tara Singh",
   designation: "LPG",
   alpName: "Prema Ram Choudhary",
   hq: "JU",
   section: "JU-MJ",
 };
 
 const columns: Column<TranscriptLine>[] = [
   { key: "audioTime", header: "Audio Time", className: "w-24" },
   { key: "timestamp", header: "Timestamp(IST)", className: "w-32" },
   { key: "text", header: "Text" },
   {
     key: "actions",
     header: "Actions",
     className: "w-20 text-right",
     render: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
         <Pencil className="h-4 w-4" />
       </Button>
     ),
   },
 ];
 
 export default function Transcripts() {
   const [date, setDate] = useState("26/12/2026");
   const [audioFile, setAudioFile] = useState("Jodhpur_20261226220004-Tra");
   const [filterOption, setFilterOption] = useState("all");
   const [showTranscript, setShowTranscript] = useState(true);
 
   return (
     <AppShell>
       <PageHeader title="Transcripts" description="Audio transcript analysis and review" />
 
       <div className="container py-8">
         <div className="flex flex-col lg:flex-row gap-8">
           {/* Left Sidebar - Filters */}
           <aside className="lg:w-72 flex-shrink-0 space-y-6">
             <div className="card-elevated p-5">
               <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-secondary-foreground font-bold">A</span>
                 </div>
                <h3 className="text-lg font-semibold text-secondary">Audio Analysis</h3>
               </div>
 
               <div className="space-y-4">
                 <div className="space-y-2">
                   <Label className="font-medium">Select Date</Label>
                   <Select value={date} onValueChange={setDate}>
                     <SelectTrigger className="input-premium">
                       <SelectValue placeholder="Select date" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="26/12/2026">26/12/2026</SelectItem>
                       <SelectItem value="25/12/2026">25/12/2026</SelectItem>
                       <SelectItem value="24/12/2026">24/12/2026</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
 
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90">
                      <Filter className="h-4 w-4 mr-1" />
                      Advanced Filters
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
 
                 <div className="space-y-2">
                   <Label className="font-medium">Select Audio File</Label>
                   <p className="text-xs text-success font-medium">
                     1 file matches your filters
                   </p>
                   <Select value={audioFile} onValueChange={setAudioFile}>
                     <SelectTrigger className="input-premium">
                       <SelectValue placeholder="Select audio file" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Jodhpur_20261226220004-Tra">
                         Jodhpur_20261226220004-Tra
                       </SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
 
                <Button onClick={() => setShowTranscript(true)} className="w-full bg-secondary hover:bg-secondary/90">
                   Show Transcript
                 </Button>
 
                 <div className="space-y-2">
                   <Label className="font-medium">Filter Options:</Label>
                   <div className="flex flex-wrap gap-2">
                     {["all", "relevant", "irrelevant"].map((opt) => (
                       <Button
                         key={opt}
                        size="sm" 
                        variant={filterOption === opt ? "default" : "outline"} 
                         onClick={() => setFilterOption(opt)}
                        className={`capitalize ${filterOption === opt ? "bg-secondary hover:bg-secondary/90" : ""}`}
                       >
                         {opt === "all" ? "Show All" : opt}
                       </Button>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           </aside>
 
           {/* Main Content */}
           <div className="flex-1 space-y-6">
             {/* Audio Player */}
             <div className="card-elevated p-5">
               <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                 <Music className="h-4 w-4" />
                 Click to play audio
               </div>
               <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-secondary/10">
                   <Play className="h-5 w-5" />
                 </Button>
                 <span className="text-sm text-muted-foreground">0:00 / 20:00</span>
                 <div className="flex-1 h-1 bg-muted rounded-full">
                  <div className="h-full w-0 bg-secondary rounded-full" />
                 </div>
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                   <Volume2 className="h-4 w-4" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                   <MoreVertical className="h-4 w-4" />
                 </Button>
               </div>
             </div>
 
             {/* Metadata + Transcript Table */}
             <div className="flex flex-col xl:flex-row gap-6">
               {/* Metadata Panel */}
               <div className="xl:w-64 flex-shrink-0">
                 <div className="card-elevated">
                   <table className="w-full text-sm">
                     <tbody>
                       {Object.entries({
                         Date: metadata.date,
                         "Train No": metadata.trainNo,
                         "Loco No": metadata.locoNo,
                         "LP Name": metadata.lpName,
                         Designation: metadata.designation,
                         "ALP Name": metadata.alpName,
                         HQ: metadata.hq,
                         Section: metadata.section,
                       }).map(([key, value]) => (
                         <tr key={key} className="border-b border-border/50 last:border-0">
                           <td className="py-3 px-4 font-medium text-muted-foreground">
                             {key}
                           </td>
                           <td className="py-3 px-4 text-foreground">{value}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
 
               {/* Transcript Table */}
               <div className="flex-1">
                 {showTranscript && (
                   <DataTable columns={columns} data={sampleTranscripts} />
                 )}
               </div>
             </div>
           </div>
         </div>
       </div>
     </AppShell>
   );
 }