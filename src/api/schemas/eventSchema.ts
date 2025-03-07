import { z } from 'zod';

// Schema for Speaker (used in full event payload)
export const SpeakerSchema = z.object({
  contactEmail: z.string().email(),
  contactPhoneNo: z.string(),
  description: z.string(),
  facebookLink: z.string().url().optional(),
  fullName: z.string(),
  instagramLink: z.string().url().optional(),
  linkedinLink: z.string().url().optional(),
});

// Schema for Session (used in full event payload)
export const SessionSchema = z.object({
  endDate: z.string(), // or transform to Date if needed
  location: z.string(),
  price: z.number(),
  queueNo: z.number(),
  speaker: SpeakerSchema,
  startDate: z.string(),
});

export const SingleEventSchema = z.object({
  detailedEventView: z.object({
      eventId: z.string(),
  name: z.string(),
  eventType: z.enum(['SEMINAR', 'WORKSHOP', 'CONFERENCE']),
  companyName: z.string(),
  companyLogoPath: z.string().nullable(), // Already correct
  startDate: z.string(),
  endDate: z.string().nullable(), // Update: allow null values
  eventPrivacyType: z.enum(['PRIVATE', 'PUBLIC']),
  sessionViewList: z.array(SessionSchema), 
  }),
  users: z.array(z.any())
// Already correct (empty array is valid)
});



// Full event schema for creating a new event (POST payload)
export const FullEventSchema = z.object({
  companyId: z.string(),
  description: z.string(),
  endTime: z.string(),
  eventPrivacyType: z.enum(['PRIVATE', 'PUBLIC']),
  eventType: z.enum(['SEMINAR', 'WORKSHOP', 'CONFERENCE']), // adjust as needed
  location: z.string(),
  locationLink: z.string().url().optional(),
  maxAttendeeCount: z.number(),
  name: z.string(),
  sessions: z.array(SessionSchema),
  startTime: z.string(),
  tags: z.array(z.string()),
  userId: z.string(),
});

// Brief event schema for GET response (public events)
export const EventSchemaBrief = z.object({
  eventId: z.string(),
  name: z.string(),
  eventType: z.string(),
  company_name: z.string(),
  logoPath: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string().nullable(),
});

// Schema for the public events response, using the brief event schema
export const PublicEventsResponseSchema = z.object({
  events: z.array(EventSchemaBrief),
  count: z.number(),
});

// Type inferred for creating a new event
export type EventPayload = z.infer<typeof FullEventSchema>;
export type SingleEventResponse = z.infer<typeof SingleEventSchema>;
export type SessionView = z.infer<typeof SessionSchema>;
