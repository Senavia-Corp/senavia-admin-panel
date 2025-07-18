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
import { Card } from "@/components/ui/card";
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
        await LeadManagementService.updateLead(leadId, formData);
      } else {
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

  return (
    <div className="h-full w-full max-w-[1200px] mx-auto px-6">
      {/* Header */}
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full bg-gray-900 text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Lead Editor</h1>
        </div>
        <div className="flex gap-2">
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
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="col-span-2 space-y-6">
          <Card className="p-6 bg-white">
            <div className="space-y-4">
              <div>
                <Label>Service ID</Label>
                <Input
                  value={formData.serviceId}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceId: e.target.value })
                  }
                  placeholder="Enter service ID"
                />
              </div>
              <div>
                <Label>User ID</Label>
                <Input
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  placeholder="Enter user ID"
                />
              </div>
              <div>
                <Label>Workteam ID</Label>
                <Input
                  value={formData.workteamId}
                  onChange={(e) =>
                    setFormData({ ...formData, workteamId: e.target.value })
                  }
                  placeholder="Enter workteam ID"
                />
              </div>
              <div>
                <Label>Client Name</Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter description"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Additional Information */}
        <div className="space-y-6">
          <Card className="p-6 bg-white">
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as LeadStatus })
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
              </div>
              <div>
                <Label>Estimated Start Date</Label>
                <Input
                  type="date"
                  value={formData.estimatedStartDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedStartDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Client Email</Label>
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, clientEmail: e.target.value })
                  }
                  placeholder="Enter client email"
                />
              </div>
              <div>
                <Label>Client Phone</Label>
                <Input
                  value={formData.clientPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, clientPhone: e.target.value })
                  }
                  placeholder="Enter client phone"
                />
              </div>
              <div>
                <Label>Client Address</Label>
                <Textarea
                  value={formData.clientAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, clientAddress: e.target.value })
                  }
                  placeholder="Enter client address"
                />
              </div>
            </div>
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
