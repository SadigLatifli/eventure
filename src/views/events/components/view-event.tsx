"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  Globe,
  Lock,
  MapPin,
  Users,
  Building,
  Tag,
  // Facebook,
  // Instagram,
  // Linkedin,
  // Mail,
  // Phone,
} from "lucide-react";
import { useSingleEvent } from "@/api/queries/eventsQueries";
import dayjs from "dayjs";
import { useParams } from "@tanstack/react-router";

// Define TypeScript interfaces for the data structures
interface Speaker {
  fullName: string;
  description?: string;
  contactEmail?: string;
  contactPhoneNo?: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
}

interface Session {
  queueNo: number;
  startDate: string;
  location: string;
  price: number;
  speaker: Speaker;
}

interface EventData {
  eventId: string;
  name: string;
  eventType: "SEMINAR" | "WORKSHOP" | "CONFERENCE";
  companyName: string;
  companyLogoPath: string | null;
  startDate: string;
  endDate: string | null;
  eventPrivacyType: "PRIVATE" | "PUBLIC";
  sessionViewList: Session[];
}

// Define props interfaces for components
interface EventInfoCardProps {
  event: EventData;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

interface CompanyCardProps {
  companyName: string;
  companyLogoPath: string | null;
}

interface SessionsListProps {
  sessions: Session[];
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

// interface SessionsTableProps {
//   sessions: Session[];
//   formatDate: (dateString: string) => string;
//   formatTime: (dateString: string) => string;
// }

// interface SpeakerCardProps {
//   speaker: Speaker;
// }

export default function EventDashboard() {
  const params = useParams({ from: "/events/$eventId" });
  const eventId = typeof params.eventId === "string" ? params.eventId : "";
  const { data: event, isLoading, error } = useSingleEvent(eventId);

  if (isLoading) {
    return <EventSkeleton />;
  }

  if (error || !event) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load event details</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    return dayjs(dateString).format("MMM D, YYYY");
  };

  const formatTime = (dateString: string): string => {
    return dayjs(dateString).format("h:mm A");
  };

  const eventTypeColor: Record<string, string> = {
    SEMINAR: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    WORKSHOP:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    CONFERENCE:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  };

  const privacyTypeIcon =
    event.detailedEventView?.eventPrivacyType === "PRIVATE" ? (
      <Lock className="h-4 w-4" />
    ) : (
      <Globe className="h-4 w-4" />
    );

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {event.detailedEventView?.name}
            </h1>
            <Badge
              variant="outline"
              className={`${eventTypeColor[event.detailedEventView?.eventType]} border-none`}
            >
              {event.detailedEventView?.eventType}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{event.detailedEventView?.companyName}</span>
            <span className="mx-1">•</span>
            <div className="flex items-center gap-1">
              {privacyTypeIcon}
              <span>{event.detailedEventView?.eventPrivacyType}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Event</Button>
          <Button>Manage Attendees</Button>
        </div>
      </div>

      <div  className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EventInfoCard
            event={event.detailedEventView}
            formatDate={formatDate}
            formatTime={formatTime}
          />
          <CompanyCard
            companyName={event.detailedEventView?.companyName}
            companyLogoPath={event.detailedEventView?.companyLogoPath}
          />
          <QuickStatsCard />
        </div>

        {event.detailedEventView?.sessionViewList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>
                The next sessions for this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SessionsList
                sessions={event.detailedEventView?.sessionViewList.slice(0, 3)}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            </CardContent>
            {event.detailedEventView?.sessionViewList.length > 3 && (
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  View All Sessions
                </Button>
              </CardFooter>
            )}
          </Card>
        )}
      </div>

      {/* <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 md:w-auto md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions ({event.detailedEventView?.sessionViewList.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <EventInfoCard event={event.detailedEventView} formatDate={formatDate} formatTime={formatTime} />
            <CompanyCard companyName={event.detailedEventView?.companyName} companyLogoPath={event.detailedEventView?.companyLogoPath} />
            <QuickStatsCard />
          </div>

          {event.detailedEventView?.sessionViewList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>The next sessions for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <SessionsList
                  sessions={event.detailedEventView?.sessionViewList.slice(0, 3)}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              </CardContent>
              {event.detailedEventView?.sessionViewList.length > 3 && (
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    View All Sessions
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Sessions</CardTitle>
                <CardDescription>Manage all sessions for this event</CardDescription>
              </div>
              <Button>Add Session</Button>
            </CardHeader>
            <CardContent>
              {event.detailedEventView?.sessionViewList.length > 0 ? (
                <SessionsTable sessions={event.detailedEventView?.sessionViewList} formatDate={formatDate} formatTime={formatTime} />
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <h3 className="mb-2 text-lg font-semibold">No Sessions Yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Get started by creating your first session</p>
                  <Button>Add Your First Session</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
              <CardDescription>Track attendance and engagement</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Analytics dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}

function EventInfoCard({ event, formatDate, formatTime }: EventInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(event.startDate)}
              {event.endDate && ` - ${formatDate(event.endDate)}`}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Time</p>
            <p className="text-sm text-muted-foreground">
              {formatTime(event.startDate)}
            </p>
          </div>
        </div>
        {event.sessionViewList.length > 0 &&
          event.sessionViewList[0].location && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {event.sessionViewList[0].location}
                </p>
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}

function CompanyCard({ companyName, companyLogoPath }: CompanyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizer</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {companyLogoPath ? (
            <AvatarImage src={companyLogoPath} alt={companyName} />
          ) : (
            <AvatarFallback className="text-lg">
              {companyName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{companyName}</p>
          <Button variant="link" className="h-auto p-0 text-sm">
            View Company Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickStatsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Users className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Registered Attendees</p>
            <p className="text-sm text-muted-foreground">0 / Unlimited</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Tag className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Sessions</p>
            <p className="text-sm text-muted-foreground">0 Sessions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SessionsList({ sessions, formatDate, formatTime }: SessionsListProps) {
  return (
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Session #{session.queueNo}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{formatDate(session.startDate)}</span>
                <span>•</span>
                <Clock className="h-3.5 w-3.5" />
                <span>{formatTime(session.startDate)}</span>
              </div>
            </div>
            <Badge variant="outline">${session.price.toFixed(2)}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{session.location}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {session.speaker.fullName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {session.speaker.fullName}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// function SessionsTable({
//   sessions,
//   formatDate,
//   formatTime,
// }: SessionsTableProps) {
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>No.</TableHead>
//           <TableHead>Date & Time</TableHead>
//           <TableHead>Location</TableHead>
//           <TableHead>Speaker</TableHead>
//           <TableHead>Price</TableHead>
//           <TableHead className="text-right">Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {sessions.map((session, index) => (
//           <TableRow key={index}>
//             <TableCell className="font-medium">{session.queueNo}</TableCell>
//             <TableCell>
//               <div className="flex flex-col">
//                 <span>{formatDate(session.startDate)}</span>
//                 <span className="text-sm text-muted-foreground">
//                   {formatTime(session.startDate)}
//                 </span>
//               </div>
//             </TableCell>
//             <TableCell>{session.location}</TableCell>
//             <TableCell>
//               <div className="flex items-center gap-2">
//                 <Avatar className="h-6 w-6">
//                   <AvatarFallback>
//                     {session.speaker.fullName.substring(0, 2)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <span>{session.speaker.fullName}</span>
//               </div>
//             </TableCell>
//             <TableCell>${session.price.toFixed(2)}</TableCell>
//             <TableCell className="text-right">
//               <Button variant="ghost" size="sm">
//                 Edit
//               </Button>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

// function SpeakerCard({ speaker }: SpeakerCardProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Speaker Information</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex items-center gap-4">
//           <Avatar className="h-16 w-16">
//             <AvatarFallback>
//               {speaker.fullName.substring(0, 2).toUpperCase()}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <p className="font-medium">{speaker.fullName}</p>
//             <p className="text-sm text-muted-foreground">
//               {speaker.description}
//             </p>
//           </div>
//         </div>
//         <Separator />
//         <div className="space-y-2">
//           {speaker.contactEmail && (
//             <div className="flex items-center gap-2">
//               <Mail className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm">{speaker.contactEmail}</span>
//             </div>
//           )}
//           {speaker.contactPhoneNo && (
//             <div className="flex items-center gap-2">
//               <Phone className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm">{speaker.contactPhoneNo}</span>
//             </div>
//           )}
//         </div>
//         <div className="flex gap-2">
//           {speaker.facebookLink && (
//             <Button variant="outline" size="icon" asChild>
//               <a
//                 href={speaker.facebookLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <Facebook className="h-4 w-4" />
//               </a>
//             </Button>
//           )}
//           {speaker.instagramLink && (
//             <Button variant="outline" size="icon" asChild>
//               <a
//                 href={speaker.instagramLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <Instagram className="h-4 w-4" />
//               </a>
//             </Button>
//           )}
//           {speaker.linkedinLink && (
//             <Button variant="outline" size="icon" asChild>
//               <a
//                 href={speaker.linkedinLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <Linkedin className="h-4 w-4" />
//               </a>
//             </Button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

function EventSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-2 h-5 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="h-10 w-72" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
