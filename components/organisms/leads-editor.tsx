"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft,Bold, Italic, Underline, Type, Upload } from "lucide-react";
import { LeadManagementService } from "@/services/lead-management-service";// tabla de ejemplos
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import type { Lead, CreateLeadData } from "@/types/lead-management";

interface LeadEditorProps {
  leadId?: string;
  onBack: () => void;
  onSave: () => void;
}

export function LeadEditor({ leadId, onBack, onSave }: LeadEditorProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [services, setServices] = useState<LeadService[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: "0000",
    userId: "0000",
    workteamId: "0000",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    status: "",
    estimatedStartDate: "",
    estimatedEndDate: "",
    description: "",
  });

  useEffect(() => {
    loadServices();
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
          serviceId: leadData.serviceId,
          userId: leadData.userId,
          workteamId: leadData.workteamId,
          clientName: leadData.clientName,
          clientEmail: leadData.clientEmail,
          clientPhone: leadData.clientPhone,
          clientAddress: leadData.clientAddress,
          status: leadData.status,
          estimatedStartDate: leadData.estimatedStartDate
            .toISOString()
            .split("T")[0],
          estimatedEndDate: leadData.estimatedEndDate
            .toISOString()
            .split("T")[0],
          description: leadData.description,
        });
      }
    } catch (error) {
      console.error("Error loading lead:", error);
    }
  };

  const loadServices = async () => {
    try {
      const servicesData = await LeadManagementService.getLeadServices();
      setServices(servicesData);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const leadData = {
        ...formData,
        estimatedStartDate: new Date(formData.estimatedStartDate),
        estimatedEndDate: new Date(formData.estimatedEndDate),
      };

      if (leadId) {
        await LeadManagementService.updateLead(leadId, leadData);
      } else {
        await LeadManagementService.createLead(leadData);
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
        <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-lg p-6 flex-1">
        <Card className="bg-white p-6">
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Lead ID</Label>
                <Input value={leadId || "0000"} disabled />
              </div>
              <div>
                <Label>Service ID</Label>
                <Input value={formData.serviceId || "0000"} disabled />
              </div>
              <div>
                <Label>User ID</Label>
                <Input value={formData.userId} disabled />
              </div>
              <div>
                <Label>Workteam ID</Label>
                <Input value={formData.workteamId} disabled />
              </div>
            </div>

            {/* Client Information */}
            <div className="space-y-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label>Client Email</Label>
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientEmail: e.target.value,
                    }))
                  }
                  placeholder="client@email.com"
                />
              </div>
              <div>
                <Label>Client Phone</Label>
                <Input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientPhone: e.target.value,
                    }))
                  }
                  placeholder="000-000-0000"
                />
              </div>
              <div>
                <Label>Client Address</Label>
                <Input
                  value={formData.clientAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientAddress: e.target.value,
                    }))
                  }
                  placeholder="Enter address"
                />
              </div>
            </div>

            {/* Status and Time Estimation */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Start Date</Label>
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
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.estimatedEndDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      estimatedEndDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter lead description"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              {leadId && (
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                >
                  Delete Lead
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isLoading
                  ? "Saving..."
                  : leadId
                  ? "Update Lead"
                  : "Add/Update Lead"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        description={`Are you sure you want to delete this lead? This action cannot be undone.`}
      />
    </div>
  );
}
