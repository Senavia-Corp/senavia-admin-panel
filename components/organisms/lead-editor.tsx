"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { LeadManagementService } from "@/services/lead-management-service";
import type { Lead, CreateLeadData, LeadStatus } from "@/types/lead-management";
import { toast } from "sonner";

interface LeadEditorProps {
  leadId?: string;
  onBack: () => void;
  onSave: () => void;
}

export function LeadEditor({ leadId, onBack, onSave }: LeadEditorProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [statuses, setStatuses] = useState<LeadStatus[]>([]);
  const [formData, setFormData] = useState<CreateLeadData>({
    clientName: "",
    state: "SEND",
    workteamId: "",
    serviceId: "",
    userId: "",
    description: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatuses();
    if (leadId) {
      loadLead(leadId);
    }
  }, [leadId]);

  const loadLead = async (id: string) => {
    try {
      setError(null);
      const leadData = await LeadManagementService.getLeadById(id);
      if (leadData) {
        setLead(leadData);
        setFormData({
          clientName: leadData.clientName || "",
          state: leadData.state || "SEND",
          workteamId: leadData.workteamId ? leadData.workteamId.toString() : "",
          serviceId: leadData.serviceId ? leadData.serviceId.toString() : "",
          userId: leadData.userId ? leadData.userId.toString() : "",
          description: leadData.description || "",
          clientEmail: leadData.clientEmail || "",
          clientPhone: leadData.clientPhone || "",
          clientAddress: leadData.clientAddress || "",
          startDate:
            leadData.startDate || new Date().toISOString().split("T")[0],
          endDate: leadData.endDate || new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Load lead error:", error);
      let errorMessage = "Error loading lead";

      if (error instanceof Error) {
        if (error.message.includes("HTTP error! status: 404")) {
          errorMessage = "Lead not found or API endpoint not available.";
        } else if (error.message.includes("Unexpected token")) {
          errorMessage =
            "Invalid response from server. Please check your API configuration.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const loadStatuses = async () => {
    try {
      const statusesData = await LeadManagementService.getLeadStatuses();
      setStatuses(statusesData);
    } catch (error) {
      console.error("Error loading statuses:", error);
      toast.error("Error loading statuses");
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    // Validate form data before sending
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      toast.error(validationErrors.join(", "));
      setIsLoading(false);
      return;
    }

    try {
      // Clean the data before sending
      const cleanData = {
        ...formData,
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim(),
        clientPhone: formData.clientPhone.trim(),
        clientAddress: formData.clientAddress.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate.trim(),
        endDate: formData.endDate?.trim() || "",
        serviceId: formData.serviceId?.trim() || undefined,
        userId: formData.userId?.trim() || undefined,
        workteamId: formData.workteamId?.trim() || undefined,
      };

      if (leadId) {
        await LeadManagementService.updateLead(leadId, cleanData);
        toast.success("Lead updated successfully");
      } else {
        await LeadManagementService.createLead(cleanData);
        toast.success("Lead created successfully");
      }
      onSave();
    } catch (error) {
      console.error("Save error:", error);
      let errorMessage = "Error saving lead";

      if (error instanceof Error) {
        if (error.message.includes("HTTP error! status: 404")) {
          errorMessage =
            "API endpoint not found. Please check your server configuration.";
        } else if (error.message.includes("HTTP error! status: 500")) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.message.includes("Unexpected token")) {
          errorMessage =
            "Invalid response from server. Please check your API configuration.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.clientName.trim() !== "" &&
      formData.clientEmail.trim() !== "" &&
      formData.clientPhone.trim() !== "" &&
      formData.clientAddress.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.startDate.trim() !== ""
    );
  };

  const validateFormData = () => {
    const errors: string[] = [];

    if (!formData.clientName.trim()) errors.push("Client name is required");
    if (!formData.clientEmail.trim()) errors.push("Client email is required");
    if (!formData.clientPhone.trim()) errors.push("Client phone is required");
    if (!formData.clientAddress.trim())
      errors.push("Client address is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.startDate.trim()) errors.push("Start date is required");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      formData.clientEmail.trim() &&
      !emailRegex.test(formData.clientEmail.trim())
    ) {
      errors.push("Invalid email format");
    }

    return errors;
  };

  return (
    <div className="h-full w-screen max-w-none px-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="bg-white rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Lead ID
              </Label>
              <Input value={leadId || "New Lead"} disabled className="mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Service ID
                </Label>
                <Input
                  value={formData.serviceId}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceId: e.target.value })
                  }
                  placeholder="Service ID"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  User ID
                </Label>
                <Input
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  placeholder="User ID"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Workteam ID
                </Label>
                <Input
                  value={formData.workteamId}
                  onChange={(e) =>
                    setFormData({ ...formData, workteamId: e.target.value })
                  }
                  placeholder="Workteam ID"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Client Name *
                </Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  placeholder="Client Name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Client E-mail *
                </Label>
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, clientEmail: e.target.value })
                  }
                  placeholder="client@example.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Client Phone *
                </Label>
                <Input
                  value={formData.clientPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, clientPhone: e.target.value })
                  }
                  placeholder="Phone number"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Client Address *
                </Label>
                <Input
                  value={formData.clientAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, clientAddress: e.target.value })
                  }
                  placeholder="Client Address"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Status *
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) =>
                    setFormData({ ...formData, state: value as LeadStatus })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Dates *
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate: e.target.value,
                      })
                    }
                    required
                  />
                  <span className="px-2">-</span>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Description *
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter description"
                required
                className="mt-1 min-h-[100px]"
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button
              onClick={handleSave}
              disabled={isLoading || !isFormValid()}
              className="w-full bg-[#95C11F] hover:bg-[#84AD1B] text-white py-3"
            >
              {isLoading ? "Saving..." : leadId ? "Update Lead" : "Create Lead"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
