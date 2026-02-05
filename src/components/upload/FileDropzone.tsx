import { useCallback, useState } from "react";
import { Music, X, FileAudio, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedFormats?: string[];
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function FileDropzone({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeBytes = 5 * 1024 * 1024 * 1024, // 5GB
  acceptedFormats = ["WAV", "MP3", "M4A", "FLAC", "AAC", "OGG"],
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptMimeTypes = [
    "audio/wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/m4a",
    "audio/x-m4a",
    "audio/flac",
    "audio/aac",
    "audio/ogg",
  ];

  const validateFiles = (newFiles: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    const fileArray = Array.from(newFiles);

    for (const file of fileArray) {
      // Check if we've reached max files
      if (files.length + validFiles.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        break;
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        setError(`File "${file.name}" exceeds 5GB limit`);
        continue;
      }

      // Check file type
      const isValidType = acceptMimeTypes.some(
        (type) => file.type === type || file.name.toLowerCase().endsWith(type.split("/")[1])
      );
      if (!isValidType) {
        setError(`File "${file.name}" is not a supported audio format`);
        continue;
      }

      // Check for duplicates
      const isDuplicate = files.some((f) => f.name === file.name && f.size === file.size);
      if (isDuplicate) {
        setError(`File "${file.name}" already added`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setError(null);

      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        onFilesChange([...files, ...validFiles]);
      }
    },
    [files, onFilesChange]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      if (e.target.files) {
        const validFiles = validateFiles(e.target.files);
        if (validFiles.length > 0) {
          onFilesChange([...files, ...validFiles]);
        }
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [files, onFilesChange]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      onFilesChange(newFiles);
      setError(null);
    },
    [files, onFilesChange]
  );

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragging
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-border bg-muted/30",
          files.length >= maxFiles && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          multiple
          accept={acceptMimeTypes.join(",")}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={files.length >= maxFiles}
        />
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "p-4 rounded-full transition-colors duration-200",
              isDragging ? "bg-primary/20" : "bg-secondary/10"
            )}
          >
            <Music
              className={cn(
                "h-8 w-8 transition-colors duration-200",
                isDragging ? "text-primary" : "text-secondary"
              )}
            />
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium text-foreground">
              Choose audio files (up to {maxFiles})
            </p>
            <p className="text-sm text-muted-foreground">
              {acceptedFormats.join(", ")} (max 5GB each)
            </p>
          </div>
          {isDragging && (
            <p className="text-sm font-medium text-primary animate-pulse">
              Drop files here...
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive font-medium animate-fade-in">{error}</p>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2 animate-fade-in">
          <p className="text-sm font-medium text-muted-foreground">
            Selected Files ({files.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg group hover:bg-muted transition-colors duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileAudio className="h-5 w-5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
