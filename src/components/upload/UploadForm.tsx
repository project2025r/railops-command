import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useDropdownData } from "@/hooks/api/useUpload";

export interface UploadFormData {
  trainNumber: string;
  locoNumber: string;
  lpName: string;
  designation: string;
  alpName: string;
  section: string;
  hq: string;
}

export interface UploadFormErrors {
  trainNumber?: string;
  locoNumber?: string;
  lpName?: string;
  designation?: string;
  alpName?: string;
  section?: string;
  hq?: string;
}

interface UploadFormProps {
  formData: UploadFormData;
  onFormChange: (data: UploadFormData) => void;
  errors: UploadFormErrors;
}

export function UploadForm({ formData, onFormChange, errors }: UploadFormProps) {
  const { user } = useAuth();
  const { data: dropdownData, isLoading } = useDropdownData(user?.division);

  const lpNames = dropdownData?.loco_pilots ?? [];
  const designations = dropdownData?.designations ?? [];
  const sections = dropdownData?.sections ?? [];
  const divisions = dropdownData?.divisions ?? [];

  const handleInputChange = (field: keyof UploadFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {/* Train Number */}
      <div className="space-y-2">
        <Label htmlFor="trainNumber" className="text-sm font-medium">
          Train Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="trainNumber"
          placeholder="Enter train number"
          value={formData.trainNumber}
          onChange={(e) => handleInputChange("trainNumber", e.target.value)}
          className={cn(errors.trainNumber && "border-destructive focus-visible:ring-destructive")}
        />
        {errors.trainNumber && (
          <p className="text-xs text-destructive animate-fade-in">{errors.trainNumber}</p>
        )}
      </div>

      {/* Loco Number */}
      <div className="space-y-2">
        <Label htmlFor="locoNumber" className="text-sm font-medium">
          Loco Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="locoNumber"
          placeholder="Enter loco number (optional)"
          value={formData.locoNumber}
          onChange={(e) => handleInputChange("locoNumber", e.target.value)}
          className={cn(errors.locoNumber && "border-destructive focus-visible:ring-destructive")}
        />
        {errors.locoNumber && (
          <p className="text-xs text-destructive animate-fade-in">{errors.locoNumber}</p>
        )}
      </div>

      {/* LP Name */}
      <div className="space-y-2">
        <Label htmlFor="lpName" className="text-sm font-medium">
          LP Name <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.lpName}
          onValueChange={(value) => handleInputChange("lpName", value)}
          disabled={isLoading}
        >
          <SelectTrigger
            id="lpName"
            className={cn(errors.lpName && "border-destructive focus:ring-destructive")}
          >
            <SelectValue placeholder={isLoading ? "Loading..." : "Select LP Name"} />
          </SelectTrigger>
          <SelectContent>
            {lpNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.lpName && (
          <p className="text-xs text-destructive animate-fade-in">{errors.lpName}</p>
        )}
      </div>

      {/* Designation */}
      <div className="space-y-2">
        <Label htmlFor="designation" className="text-sm font-medium">
          Designation <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.designation}
          onValueChange={(value) => handleInputChange("designation", value)}
          disabled={isLoading}
        >
          <SelectTrigger
            id="designation"
            className={cn(errors.designation && "border-destructive focus:ring-destructive")}
          >
            <SelectValue placeholder={isLoading ? "Loading..." : "Select Designation"} />
          </SelectTrigger>
          <SelectContent>
            {designations.map((designation) => (
              <SelectItem key={designation} value={designation}>
                {designation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.designation && (
          <p className="text-xs text-destructive animate-fade-in">{errors.designation}</p>
        )}
      </div>

      {/* ALP Name */}
      <div className="space-y-2">
        <Label htmlFor="alpName" className="text-sm font-medium">
          ALP Name <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.alpName}
          onValueChange={(value) => handleInputChange("alpName", value)}
          disabled={isLoading}
        >
          <SelectTrigger
            id="alpName"
            className={cn(errors.alpName && "border-destructive focus:ring-destructive")}
          >
            <SelectValue placeholder={isLoading ? "Loading..." : "Select ALP Name"} />
          </SelectTrigger>
          <SelectContent>
            {lpNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.alpName && (
          <p className="text-xs text-destructive animate-fade-in">{errors.alpName}</p>
        )}
      </div>

      {/* Section */}
      <div className="space-y-2">
        <Label htmlFor="section" className="text-sm font-medium">
          Section <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.section}
          onValueChange={(value) => handleInputChange("section", value)}
          disabled={isLoading}
        >
          <SelectTrigger
            id="section"
            className={cn(errors.section && "border-destructive focus:ring-destructive")}
          >
            <SelectValue placeholder={isLoading ? "Loading..." : "Select Section"} />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectItem key={section} value={section}>
                {section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.section && (
          <p className="text-xs text-destructive animate-fade-in">{errors.section}</p>
        )}
      </div>

      {/* HQ */}
      <div className="space-y-2">
        <Label htmlFor="hq" className="text-sm font-medium">
          HQ <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.hq}
          onValueChange={(value) => handleInputChange("hq", value)}
          disabled={isLoading}
        >
          <SelectTrigger
            id="hq"
            className={cn(errors.hq && "border-destructive focus:ring-destructive")}
          >
            <SelectValue placeholder={isLoading ? "Loading..." : "Select HQ"} />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((div) => (
              <SelectItem key={div} value={div}>
                {div}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.hq && (
          <p className="text-xs text-destructive animate-fade-in">{errors.hq}</p>
        )}
      </div>
    </div>
  );
}
