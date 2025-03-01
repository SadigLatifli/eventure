// src/api/schemas/userSchema.ts
import { z } from 'zod';

// Role schema
export const roleSchema = z.object({
  id: z.string(),
  role: z.string(),
  companyId: z.string(),
  companyName: z.string()
});

// User info schema
export const userInfoSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  companyEmail: z.string().email(),
  subscriptionType: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isVerified: z.boolean(),
  isBlocked: z.boolean(),
  isInvited: z.boolean().nullable(),
  roles: z.array(roleSchema)
});

// Export types derived from schemas
export type UserRole = z.infer<typeof roleSchema>;
export type UserInfo = z.infer<typeof userInfoSchema>;