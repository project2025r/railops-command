import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, RotateCcw, Loader2, CheckCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ContextBar } from "@/components/upload/ContextBar";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { UploadForm, UploadFormData, UploadFormErrors } from "@/components/upload/UploadForm";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const initialFormData: UploadFormData = {
  trainNumber: "",
  locoNumber: "",
  lpName: "",
  designation: "",
  alpName: "",
  section: "",
  hq: "",
};

export default function UploadAudio() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<UploadFormData>(initialFormData);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<UploadFormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Mock user context - in production this would come from auth context
  const userContext = {
    username: "Ajuser1",
    division: "Ajmer",
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: UploadFormErrors = {};

    if (!formData.trainNumber.trim()) {
      newErrors.trainNumber = "Train number is required";
    }
    if (!formData.locoNumber.trim()) {
      newErrors.locoNumber = "Loco number is required";
    }
    if (!formData.lpName) {
      newErrors.lpName = "LP Name is required";
    }
    if (!formData.designation) {
      newErrors.designation = "Designation is required";
    }
    if (!formData.alpName) {
      newErrors.alpName = "ALP Name is required";
    }
    if (!formData.section) {
      newErrors.section = "Section is required";
    }
    if (!formData.hq) {
      newErrors.hq = "HQ is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isFormValid = 
    formData.trainNumber.trim() &&
    formData.locoNumber.trim() &&
    formData.lpName &&
    formData.designation &&
    formData.alpName &&
    formData.section &&
    formData.hq &&
    files.length > 0;

  const handleReset = useCallback(() => {
    setFormData(initialFormData);
    setFiles([]);
    setErrors({});
    setUploadProgress(0);
    setUploadComplete(false);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one audio file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      setUploadComplete(true);
      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded successfully`,
      });
    }, 3000);
  }, [files, validateForm, toast]);

  return (
    <AppShell>
      <PageHeader
        title="Upload Audio Files"
        description="Upload audio recordings for transcription and analysis"
      />

      <div className="container py-8 space-y-6">
        {/* Context Bar */}
        <ContextBar username={userContext.username} division={userContext.division} />

        {/* Upload Form Card */}
        <div className="card-elevated p-6 space-y-6">
          {/* Form Fields */}
          <UploadForm
            formData={formData}
            onFormChange={setFormData}
            errors={errors}
          />

          {/* File Dropzone */}
          <FileDropzone files={files} onFilesChange={setFiles} />

          {/* Upload Progress */}
          {(isUploading || uploadComplete) && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {uploadComplete ? "Upload Complete" : "Uploading..."}
                </span>
                <span className="font-medium text-foreground">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              {uploadComplete && (
                <div className="flex items-center gap-2 text-accent text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Files uploaded successfully
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!isFormValid || isUploading}
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
