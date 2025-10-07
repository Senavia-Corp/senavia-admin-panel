import { z } from "zod";

export const contractFormSchema = z.object({
  title: z.string().min(3, "Contract title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  state: z.enum(
    ["DRAFT", "SENT", "SIGNED", "ACTIVE", "EXPIRED", "TERMINATED"] as const,
    {
      required_error: "Please select a status for the contract.",
    }
  ),
  signedDate: z.string().min(1, "Deadline to sign is required"),
  userId: z.number().optional().nullable(),
  leadId: z.number().optional().nullable(),
  // Sign Information
  companyEmail: z.string().email("Invalid email address"),
  companyAdd: z.string().optional(),
  companyPhone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/i, "Invalid phone number format"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  ownerSignDate: z.string().optional().nullable(),
  recipientName: z.string().min(2, "Client name must be at least 2 characters"),
  recipientSignDate: z.string().optional().nullable(),
});
