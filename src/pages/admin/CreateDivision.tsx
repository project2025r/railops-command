import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateDivision } from "@/hooks/api/useDivisions";

export default function CreateDivision() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createDivisionMutation = useCreateDivision();

  const [formData, setFormData] = useState({
    divisionName: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.divisionName.trim()) {
      toast({
        title: "Validation Error",
        description: "Division name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createDivisionMutation.mutateAsync({
        division_name: formData.divisionName.trim(),
        description: formData.description.trim() || undefined,
      });
      toast({
        title: "Division Created",
        description: `Division "${formData.divisionName}" has been created successfully.`,
      });
      navigate("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create division";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <AppShell>
      <PageHeader title="Create Division" description="Add a new division to the system" />

      <div className="container py-8 max-w-lg">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="card-elevated p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-secondary" />
            Create New Division
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="divisionName">
                Division Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="divisionName"
                placeholder="Enter division name (e.g., Delhi, Mumbai, Chennai)"
                value={formData.divisionName}
                onChange={(e) =>
                  setFormData({ ...formData, divisionName: e.target.value })
                }
                className="input-premium"
                disabled={createDivisionMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter division description (optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-premium min-h-[100px]"
                disabled={createDivisionMutation.isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90"
              disabled={createDivisionMutation.isPending}
            >
              {createDivisionMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
                  Create Division
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}