import { useState, useEffect } from "react";
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
import {
  Play,
  Volume2,
  MoreVertical,
  Pencil,
  Filter,
  X,
  Music,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDatabaseFiles, useTranscriptSearch, getAudioFileUrl } from "@/hooks/api/useTranscripts";
import type { TranscriptSearchResult } from "@/types/api.types";

const columns: Column<TranscriptSearchResult>[] = [
  { key: "id", header: "ID", className: "w-16" },
  { key: "file_name", header: "File Name" },
  { key: "matched_text", header: "Text" },
  { key: "timestamp", header: "Timestamp", className: "w-40" },
  {
    key: "actions" as keyof TranscriptSearchResult,
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
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const userDivision = user?.division;

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [filterOption, setFilterOption] = useState("all");
  const [showTranscript, setShowTranscript] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Fetch database files for the user's division
  const { data: filesData, isLoading: filesLoading } = useDatabaseFiles(userDivision);
  const files = filesData?.files ?? [];

  /**
   * Extract YYYY-MM-DD date from a file record.
   * Audio filenames follow: DIVISION_YYYYMMDD_HHMMSS_... (e.g. NR_20241115_093045_...)
   * Falls back to the uploaded_at field if no 8-digit date block is found in the name.
   */
  const extractDateFromFile = (f: { file_name: string; uploaded_at: string }): string | null => {
    const match = f.file_name.match(/(\d{4})(\d{2})(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      const mo = parseInt(m, 10);
      const dy = parseInt(d, 10);
      if (mo >= 1 && mo <= 12 && dy >= 1 && dy <= 31) return `${y}-${m}-${d}`;
    }
    if (f.uploaded_at) {
      const dt = new Date(f.uploaded_at);
      if (!isNaN(dt.getTime())) return dt.toISOString().slice(0, 10);
    }
    return null;
  };

  // Unique dates derived from filenames, newest first
  const availableDates = Array.from(
    new Set(files.map(extractDateFromFile).filter(Boolean) as string[])
  ).sort((a, b) => (a > b ? -1 : 1));

  // Audio files matching the selected date; empty until a date is chosen
  const filteredFiles = selectedDate
    ? files.filter((f) => extractDateFromFile(f) === selectedDate)
    : [];


  // Search transcripts when user clicks "Show Transcript"
  const { data: transcriptData, isLoading: transcriptLoading } = useTranscriptSearch(
    {
      keyword: searchKeyword || undefined,
      division: userDivision,
      page: 1,
      limit: 50,
    },
    showTranscript,
  );

  const transcriptResults = transcriptData?.results ?? [];

  // Get audio URL for selected file
  const selectedFile = filteredFiles.find((f) => String(f.id) === selectedFileId);
  const audioUrl = selectedFile
    ? getAudioFileUrl(selectedFile.id, selectedFile.file_name)
    : undefined;

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedFileId(""); // reset audio selection when date changes
  };

  const handleClearFilters = () => {
    setSelectedDate("");
    setSelectedFileId("");
    setFilterOption("all");
    setShowTranscript(false);
    setSearchKeyword("");
  };

  if (!isAuthenticated) {
    return null;
  }


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
                {/* Date Filter */}
                <div className="space-y-2">
                  <Label className="font-medium flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5 text-secondary" />
                    Filter by Date
                  </Label>
                  <Select
                    value={selectedDate}
                    onValueChange={handleDateChange}
                    disabled={filesLoading}
                  >
                    <SelectTrigger className="input-premium">
                      <SelectValue placeholder={filesLoading ? "Loading..." : "Select date"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date) => {
                        const label = new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });
                        return (
                          <SelectItem key={date} value={date}>
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Audio File Selector */}
                <div className="space-y-2">
                  <Label className="font-medium">Select Audio File</Label>
                  <p className="text-xs text-success font-medium">
                    {filesLoading
                      ? "Loading files..."
                      : selectedDate
                        ? `${filteredFiles.length} file(s) on this date`
                        : "Select a date to see files"}
                  </p>
                  <Select
                    value={selectedFileId}
                    onValueChange={setSelectedFileId}
                    disabled={filesLoading || !selectedDate}
                  >
                    <SelectTrigger className="input-premium">
                      <SelectValue
                        placeholder={
                          filesLoading
                            ? "Loading..."
                            : !selectedDate
                              ? "Select a date first"
                              : "Select audio file"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredFiles.map((file) => (
                        <SelectItem key={file.id} value={String(file.id)}>
                          {file.file_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 min-w-0 bg-secondary hover:bg-secondary/90 text-xs px-2"
                    onClick={() => setShowTranscript(true)}
                    disabled={transcriptLoading}
                  >
                    {transcriptLoading ? (
                      <Loader2 className="h-3 w-3 mr-1 flex-shrink-0 animate-spin" />
                    ) : (
                      <Filter className="h-3 w-3 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">Show Transcript</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 min-w-0 text-destructive border-destructive/30 hover:bg-destructive/10 text-xs px-2"
                    onClick={handleClearFilters}
                  >
                    <X className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Clear</span>
                  </Button>
                </div>

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
                {audioUrl ? "Audio file loaded" : "Select a file to play audio"}
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-secondary/10">
                  <Play className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground">0:00 / --:--</span>
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
              {audioUrl && (
                <audio src={audioUrl} className="hidden" />
              )}
            </div>

            {/* Metadata + Transcript Table */}
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Metadata Panel */}
              {selectedFile && (
                <div className="xl:w-64 flex-shrink-0">
                  <div className="card-elevated">
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries({
                          "File Name": selectedFile.file_name,
                          Division: selectedFile.division,
                          "File Size": `${(selectedFile.file_size / 1024 / 1024).toFixed(2)} MB`,
                          "Uploaded At": new Date(selectedFile.uploaded_at).toLocaleString(),
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
              )}

              {/* Transcript Table */}
              <div className="flex-1">
                {transcriptLoading ? (
                  <div className="card-elevated p-12 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                    <span className="ml-3 text-muted-foreground">Loading transcripts...</span>
                  </div>
                ) : showTranscript && transcriptResults.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {transcriptResults.length} of {transcriptData?.total ?? 0} results
                      </p>
                    </div>
                    <DataTable columns={columns} data={transcriptResults} />
                  </>
                ) : showTranscript ? (
                  <div className="card-elevated p-12 text-center text-muted-foreground">
                    No transcript results found. Try adjusting your filters.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}