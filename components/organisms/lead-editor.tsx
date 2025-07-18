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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { LeadManagementService } from "@/services/lead-management-service";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import type { Lead, CreateLeadData, LeadStatus } from "@/types/lead-management";

interface LeadEditorProps {
  leadId?: string;
  onBack: () => void;
  onSave: () => void;
}

export function LeadEditor({ leadId, onBack, onSave }: LeadEditorProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [themes, setThemes] = useState<LeadStatus[]>([]);
  const [formData, setFormData] = useState<CreateLeadData>({
    clientName: "",
    status: "Send" as LeadStatus,
    workteamId: "",
    serviceId: "",
    userId: "",
    description: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    estimatedStartDate: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadThemes();
    if (leadId) {
      loadLead(leadId);
    }
  }, [leadId]);

  const loadLead = async (id: string) => {
    try {
      const leadData = await LeadManagementService.getLeadById(id);
      if (leadData) {
        setLead(leadData);
        setFormData({
          clientName: leadData.clientName || "",
          status: leadData.status || "Send",
          workteamId: leadData.workteamId || "",
          serviceId: leadData.serviceId || "",
          userId: leadData.userId || "",
          description: leadData.description || "",
          clientEmail: leadData.clientEmail || "",
          clientPhone: leadData.clientPhone || "",
          clientAddress: leadData.clientAddress || "",
          estimatedStartDate: leadData.estimatedStartDate || "",
        });
      }
    } catch (error) {
      console.error("Error loading lead:", error);
    }
  };

  const loadThemes = async () => {
    try {
      const themesData = await LeadManagementService.getLeadStatuses();
      setThemes(themesData);
    } catch (error) {
      console.error("Error loading themes:", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (leadId) {
        // Update existing lead
        await LeadManagementService.updateLead(leadId, formData);
      } else {
        // Create new lead
        await LeadManagementService.createLead(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving lead:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (leadId) {
      try {
        await LeadManagementService.deleteLead(leadId);
        setShowDeleteDialog(false);
        onBack();
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="h-full w-screen max-w-none px-6">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Lead Editor</h1>
        </div>
        <div className="space-x-2">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {isLoading ? "Saving..." : leadId ? "Update Lead" : "Create Lead"}
          </Button>
          {leadId && (
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
            >
              Delete Lead
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6 flex-1 flex w-full">
        {/* Left Column - Lead Information */}
        <div className="flex-1 bg-white rounded-lg p-8 mr-6 max-w-none">
          {/* Creation Date */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Creation Date:</span>
              <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
                {lead && lead.createdAt
                  ? formatDate(new Date(lead.createdAt))
                  : formatDate(new Date())}
              </span>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Client Name
              </Label>
              <Input
                value={formData.clientName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientName: e.target.value,
                  }))
                }
                placeholder="Enter client name..."
                className="mb-4"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Client Email
              </Label>
              <Input
                value={formData.clientEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientEmail: e.target.value,
                  }))
                }
                placeholder="Enter client email..."
                className="mb-4"
                type="email"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Client Phone
              </Label>
              <Input
                value={formData.clientPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientPhone: e.target.value,
                  }))
                }
                placeholder="Enter client phone..."
                className="mb-4"
                type="tel"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Client Address
              </Label>
              <Textarea
                value={formData.clientAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientAddress: e.target.value,
                  }))
                }
                placeholder="Enter client address..."
                rows={3}
                className="mb-4"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Description
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter lead description..."
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Lead Details */}
        <div className="w-96 space-y-6 flex-shrink-0">
          {/* Status */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as LeadStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Workteam
                </Label>
                <Input
                  value={formData.workteamId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      workteamId: e.target.value,
                    }))
                  }
                  placeholder="Select workteam..."
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Service
                </Label>
                <Input
                  value={formData.serviceId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      serviceId: e.target.value,
                    }))
                  }
                  placeholder="Select service..."
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Assigned User
                </Label>
                <Input
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, userId: e.target.value }))
                  }
                  placeholder="Select user..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Estimated Start Date */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Estimated Start Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                value={formData.estimatedStartDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedStartDate: e.target.value,
                  }))
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        description={`Are you sure you want to delete this lead for "${formData.clientName}"? This action cannot be undone.`}
      />
    </div>
  );
}
