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


import { Button } from "@/components/ui/button";

import { Eye, Pencil, Trash2 } from "lucide-react";

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
            <TableHead>Tədbir Adı</TableHead>
            <TableHead>Növü</TableHead>
            <TableHead>kategoriya</TableHead>
            <TableHead>Məkan</TableHead>
            <TableHead>Tarix</TableHead>
            <TableHead>İştirakçı Sayı</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.events.map((event) => (
            <TableRow key={event.eventId}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.eventType}</TableCell>
              <TableCell>{event.company_name}</TableCell>
              <TableCell></TableCell>
              <TableCell>{formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(event.eventId)}
                    className="text-gray-600 hover:text-primary hover:bg-primary/10"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(event.eventId)}
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-100"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(event.eventId)}
                    className="text-gray-600 hover:text-destructive hover:bg-destructive/10"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PublicEventsList;
