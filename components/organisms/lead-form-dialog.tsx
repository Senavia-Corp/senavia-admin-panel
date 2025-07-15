import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadManagementService } from "@/services/lead-management-service";
import type {
  LeadRecord,
  CreateLeadData,
  LeadStatus,
} from "@/types/lead-management";

interface LeadFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadData) => Promise<void>;
  lead?: LeadRecord;
  mode: "create" | "edit";
}

export function LeadFormDialog({
  open,
  onClose,
  onSubmit,
  lead,
  mode,
}: LeadFormDialogProps) {
  const [formData, setFormData] = useState<CreateLeadData>({
    customerName: "",
    status: "Send" as LeadStatus,
  });

  useEffect(() => {
    if (lead && mode === "edit") {
      setFormData({
        customerName: lead.customerName,
        status: lead.status,
      });
    } else {
      setFormData({
        customerName: "",
        status: "Send" as LeadStatus,
      });
    }
  }, [lead, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Lead" : "Edit Lead"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="customerName" className="text-sm font-medium">
              Customer Name
            </label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              placeholder="Enter customer name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value: LeadStatus) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {LeadManagementService.getLeadStatuses().map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
