import { usePublicEvents } from "@/api/queries/eventsQueries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSelector } from "react-redux";
import { selectUserData } from "@/redux/userSlice";
import { formatDateTime } from "@/utils/functions";
import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const PublicEventsList = () => {
  const router = useRouter();
  const navigate = useNavigate()
  const userData = useSelector(selectUserData);
  const companyId = userData?.roles[0]?.companyId;
  const { data, isLoading, error } = usePublicEvents(companyId || "");

  const handleView = (eventId: string) => {
    // Navigate to the event view page using TanStack Router
    router.navigate({ to: `/events/${eventId}` });
  };

  const handleEdit = (eventId: string) => {
    // Navigate to an edit page using TanStack Router
    router.navigate({ to: `/admin/event/edit/${eventId}` });
  };

  const handleDelete = (eventId: string) => {
    // Implement your delete functionality or open a delete confirmation modal
    console.log("Delete event", eventId);
  };

  if (isLoading) return <div>Loading events...</div>;
  if (error)
    return (
      <div>
        Error loading events:{" "}
        {error instanceof Error ? error.message : "unknown error"}
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Public Events</h2>
        <Button onClick={() => navigate({to: '/add-event'})}>
          Add event
        </Button>
        {/* <AddEventDialog /> */}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.events.map((event) => (
            <TableRow key={event.eventId}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.eventType}</TableCell>
              <TableCell>{event.company_name}</TableCell>
              <TableCell>{formatDateTime(event.startDate)}</TableCell>
              <TableCell>{formatDateTime(event.endDate)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>...</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleView(event.eventId)}>
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(event.eventId)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(event.eventId)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PublicEventsList;
