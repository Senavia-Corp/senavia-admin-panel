import { z } from "zod";

export const leadFormSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientEmail: z.string().email("Invalid email address"),
  clientPhone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .regex(/^[\+]?[1-9][\d\-\s\(\)]{8,}$/i, "Invalid phone number format"),
  clientAddress: z.string().min(5, "Address must be at least 5 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description cannot exceed 200 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  serviceId: z.number().optional(),
  userId: z.number().optional(),
  workTeamId: z.number().optional(),
  state: z.enum(["SEND", "PROCESSING", "ESTIMATING", "FINISHED"] as const, {
    required_error: "Please select a status for the lead.",
  }),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
