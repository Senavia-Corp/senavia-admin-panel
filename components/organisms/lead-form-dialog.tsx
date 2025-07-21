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
import type { Lead, CreateLeadData, LeadStatus } from "@/types/lead-management";

// interface LeadFormDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: CreateLeadData) => Promise<void>;
//   lead?: Lead;
//   mode: "create" | "edit";
// }

// export function LeadFormDialog({
//   open,
//   onClose,
//   onSubmit,
//   lead,
//   mode,
// }: LeadFormDialogProps) {
//   const [formData, setFormData] = useState<CreateLeadData>({
//     clientName: "",
//     status: "Send" as LeadStatus,
//     workteamId: "",
//     serviceId: "",
//     userId: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientAddress: "",
//     estimatedStartDate: "",
//     description: "",
//   });

//   useEffect(() => {
//     if (lead && mode === "edit") {
//       setFormData({
//         clientName: lead.clientName || "",
//         status: lead.status,
//         workteamId: lead.workteamId,
//         serviceId: lead.serviceId,
//         userId: lead.userId,
//         clientEmail: lead.clientEmail,
//         clientPhone: lead.clientPhone,
//         clientAddress: lead.clientAddress,
//         estimatedStartDate: lead.estimatedStartDate,
//         description: lead.description,
//       });
//     } else {
//       setFormData({
//         clientName: "",
//         status: "Send" as LeadStatus,
//         workteamId: "",
//         serviceId: "",
//         userId: "",
//         clientEmail: "",
//         clientPhone: "",
//         clientAddress: "",
//         estimatedStartDate: "",
//         description: "",
//       });
//     }
//   }, [lead, mode]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await onSubmit(formData);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>
//             {mode === "create" ? "Create New Lead" : "Edit Lead"}
//           </DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <label htmlFor="customerName" className="text-sm font-medium">
//               ServiceId
//             </label>
//             <Input
//               id="serviceId"
//               value={formData.serviceId}
//               onChange={(e) =>
//                 setFormData({ ...formData, serviceId: e.target.value })
//               }
//               placeholder="Enter id the lead"
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="customerName" className="text-sm font-medium">
//               UserId
//             </label>
//             <Input
//               id="userId"
//               value={formData.userId}
//               onChange={(e) =>
//                 setFormData({ ...formData, userId: e.target.value })
//               }
//               placeholder="Enter id the user"
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="customerName" className="text-sm font-medium">
//               WorkteamId
//             </label>
//             <Input
//               id="workteamId"
//               value={formData.workteamId}
//               onChange={(e) =>
//                 setFormData({ ...formData, workteamId: e.target.value })
//               }
//               placeholder="Enter id the WorkTeamId"
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="customerName" className="text-sm font-medium">
//               Client Name
//             </label>
//             <Input
//               id="clientName"
//               value={formData.clientName}
//               onChange={(e) =>
//                 setFormData({ ...formData, clientName: e.target.value })
//               }
//               placeholder="Enter client name"
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="customerName" className="text-sm font-medium">
//               Estimate Start Date
//             </label>
//             <Input
//               id="estimatestartDate"
//               value={formData.estimatedStartDate}
//               onChange={(e) =>
//                 setFormData({ ...formData, estimatedStartDate: e.target.value })
//               }
//               placeholder="MM/DD/AA"
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="customerName" className="text-sm font-medium">
//               Client Email
//             </label>
//             <Input
//               id="clientEmail"
//               value={formData.clientEmail}
//               onChange={(e) =>
//                 setFormData({ ...formData, clientEmail: e.target.value })
//               }
//               placeholder="Enter client email"
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="customerName" className="text-sm font-medium">
//               Client Phone
//             </label>
//             <Input
//               id="clientPhone"
//               value={formData.clientPhone}
//               onChange={(e) =>
//                 setFormData({ ...formData, clientPhone: e.target.value })
//               }
//               placeholder="Enter Client Phone"
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="customerName" className="text-sm font-medium">
//               Client Address
//             </label>
//             <Input
//               id="clientAddress"
//               value={formData.clientAddress}
//               onChange={(e) =>
//                 setFormData({ ...formData, clientAddress: e.target.value })
//               }
//               placeholder="Enter client address"
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="customerName" className="text-sm font-medium">
//               Description
//             </label>
//             <Input
//               id="description"
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               placeholder="Enter description"
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="status" className="text-sm font-medium">
//               Status
//             </label>
//             <Select
//               value={formData.status}
//               onValueChange={(value: LeadStatus) =>
//                 setFormData({ ...formData, status: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 {LeadManagementService.getLeadStatuses().map((status) => (
//                   <SelectItem key={status} value={status}>
//                     {status}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="flex justify-end space-x-2 pt-4">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit">
//               {mode === "create" ? "Create" : "Save"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
