import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { UploadForm, UploadFormData, UploadFormErrors } from "@/components/upload/UploadForm";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { ContextBar } from "@/components/upload/ContextBar";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUploadAudio } from "@/hooks/api/useUpload";

export default function UploadAudio() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const uploadMutation = useUploadAudio();

  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<UploadFormData>({
    trainNumber: "",
    locoNumber: "",
    lpName: "",
    designation: "",
    alpName: "",
    section: "",
    hq: "",
  });
  const [errors, setErrors] = useState<UploadFormErrors>({});

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = useCallback((): boolean => {
    const newErrors: UploadFormErrors = {};

    if (!formData.trainNumber.trim()) {
      newErrors.trainNumber = "Train number is required";
    }
    if (!formData.lpName) {
      newErrors.lpName = "LP name is required";
    }
    if (!formData.section) {
      newErrors.section = "Section is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

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
        title: "No Files",
        description: "Please select at least one audio file to upload",
        variant: "destructive",
      });
      return;
    }

    // Upload each file
    for (const file of files) {
      try {
        await uploadMutation.mutateAsync({
          file,
          metadata: {
            division: user?.division || "",
            train_number: formData.trainNumber || undefined,
            loco_number: formData.locoNumber || undefined,
            loco_pilot: formData.lpName || undefined,
            alp_name: formData.alpName || undefined,
            section: formData.section || undefined,
            designation: formData.designation || undefined,
          },
        });

        toast({
          title: "Upload Successful",
          description: `${file.name} uploaded successfully.`,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        toast({
          title: "Upload Failed",
          description: `${file.name}: ${message}`,
          variant: "destructive",
        });
      }
    }

    // Reset form after successful upload
    if (!uploadMutation.isError) {
      setFiles([]);
      setFormData({
        trainNumber: "",
        locoNumber: "",
        lpName: "",
        designation: "",
        alpName: "",
        section: "",
        hq: "",
      });
    }
  }, [files, validateForm, toast, uploadMutation, user]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppShell>
      <PageHeader
        title="Upload Audio"
        description="Upload audio recordings for transcription and analysis"
      />

      <div className="container py-8 space-y-6">
        {/* Context Bar */}
        <ContextBar />

        {/* Form */}
        <div className="card-elevated p-6">
          <h3 className="font-semibold mb-4">Audio Metadata</h3>
          <UploadForm
            formData={formData}
            onFormChange={setFormData}
            errors={errors}
          />
        </div>

        {/* File Dropzone */}
        <div className="card-elevated p-6">
          <h3 className="font-semibold mb-4">Audio Files</h3>
          <FileDropzone
            files={files}
            onFilesChange={setFiles}
          />
        </div>

        {/* Upload Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 min-w-[200px]"
            onClick={handleUpload}
            disabled={uploadMutation.isPending || files.length === 0}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : uploadMutation.isSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Upload Complete
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload {files.length > 0 ? `${files.length} File(s)` : "Files"}
              </>
            )}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
