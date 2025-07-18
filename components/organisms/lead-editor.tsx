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
              <Input
                value={leadId || "0000"}
                disabled
                placeholder="0000"
                className="mt-1"
              />
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
                  placeholder="0000"
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
                  placeholder="0000"
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
                  placeholder="0000"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Client Name
                </Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  placeholder="Client Name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Client E-mail
                </Label>
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, clientEmail: e.target.value })
                  }
                  placeholder="e-mail@client.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Client Phone
                </Label>
                <Input
                  value={formData.clientPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, clientPhone: e.target.value })
                  }
                  placeholder="000-000-0000"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Client Address
                </Label>
                <Input
                  value={formData.clientAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, clientAddress: e.target.value })
                  }
                  placeholder="Client Address"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Estimated Time
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="date"
                    value={formData.estimatedStartDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedStartDate: e.target.value,
                      })
                    }
                    placeholder="dd/mm/aaaa"
                  />
                  <span className="px-2">-</span>
                  <Input type="date" placeholder="dd/mm/aaaa" />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter description"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-[#95C11F] hover:bg-[#84AD1B] text-white py-3"
            >
              {isLoading ? "Saving..." : leadId ? "Update User" : "Add User"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
