// eventSchemas.ts
import { z } from 'zod';

// Schema for Speaker
export const SpeakerSchema = z.object({
  contactEmail: z.string().email(),
  contactPhoneNo: z.string(),
  description: z.string(),
  facebookLink: z.string().url().optional(),
  fullName: z.string(),
  instagramLink: z.string().url().optional(),
  linkedinLink: z.string().url().optional(),
});

// Schema for Session
export const SessionSchema = z.object({
  endDate: z.string(), // could use z.date() if you transform input accordingly
  location: z.string(),
  price: z.number(),
  queueNo: z.number(),
  speaker: SpeakerSchema,
  startDate: z.string(),
});

// Main Event Schema
export const EventSchema = z.object({
  companyId: z.string(),
  description: z.string(),
  endTime: z.string(),
  eventPrivacyType: z.enum(['PRIVATE', 'PUBLIC']),
  eventType: z.enum(['SEMINAR', 'WORKSHOP', 'CONFERENCE']), // add or adjust event types as needed
  location: z.string(),
  locationLink: z.string().url().optional(),
  maxAttendeeCount: z.number(),
  name: z.string(),
  sessions: z.array(SessionSchema),
  startTime: z.string(),
  tags: z.array(z.string()),
  userId: z.string(),
});

export type EventPayload = z.infer<typeof EventSchema>;
