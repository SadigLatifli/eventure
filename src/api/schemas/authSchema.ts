import { z } from "zod";

// Register schemas
export const registerPayloadSchema = z.object({
  address: z.string().min(1, "Address is required"),
  branch: z.string().min(1, "Branch is required"),
  companyName: z.string().min(1, "Company name is required"),
  contactNo: z.string().min(1, "Contact number is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  fromInvitation: z.boolean(),
  lastName: z.string().min(1, "Last name is required"),
  logoPath: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  position: z.string().min(1, "Position is required"),
});
export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

export const registerResponseSchema = z.object({}).optional();
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// Login schemas
export const loginPayloadSchema = z.object({
  admin: z.boolean().optional(),
  email: z.string().min(1, "email is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginPayload = z.infer<typeof loginPayloadSchema>;

export const loginResponseSchema = z.object({}).optional();
export type LoginResponse = z.infer<typeof loginResponseSchema>;

// Current user schema
export const currentUserSchema = z.object({
  id: z.number(),
  email: z.string(),
});
export type CurrentUser = z.infer<typeof currentUserSchema>;