import { usePublicEvents } from "@/api/queries/eventsQueries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // adjust your shadcn table components
import { AddEventDialog } from "../modals/AddEventModal";
import { useSelector } from "react-redux";
import { selectUserData } from "@/redux/userSlice";
import { EventPayload } from "@/api/schemas/eventSchema";

const PublicEventsList = () => {
  const userData = useSelector(selectUserData);
  const companyId = userData?.roles[0]?.companyId;

  // Pass the companyId to the custom hook
  const { data } = usePublicEvents(companyId || "");

  //   if (isLoading) return <div>Loading events...</div>;
  //   if (error) return <div>Error loading events: {error instanceof Error ? error.message : 'unknown error'}</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Public Events</h2>
        <AddEventDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Privacy</TableHead>
            <TableHead>Company ID</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.events.map((event: EventPayload) => (
            <TableRow key={event.endTime}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.eventType}</TableCell>
              <TableCell>{event.eventPrivacyType}</TableCell>
              <TableCell>{event.companyId}</TableCell>
              <TableCell>
                {new Date(event.startTime).toLocaleString()}
              </TableCell>
              <TableCell>{new Date(event.endTime).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PublicEventsList;
