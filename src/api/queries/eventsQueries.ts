import { useMutation, useQuery, useQueryClient } from 'react-query';
import apiClient from '../apiClient';
import { EventPayload, FullEventSchema, PublicEventsResponseSchema, SingleEventSchema } from '../schemas/eventSchema';


// Custom hook to fetch public events using the brief schema
export const usePublicEvents = (companyId: string) => {
  return useQuery(
    ['publicEvents', companyId],
    async () => {
      const { data } = await apiClient.get(`/admin/event/upcoming?companyId=${companyId}`);
      // Validate the response using the brief schema
      return PublicEventsResponseSchema.parse(data);
    },
    {
      retry: false,
      // Prevent refetch on mount if data is fresh
      refetchOnMount: false,
      // Disable refetch when the window regains focus
      refetchOnWindowFocus: false,
    }
  );
};
export const useSingleEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['singleEvent', eventId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/event?eventId=${eventId}`);
      // Validate the response using the single event schema
      return SingleEventSchema.parse(data);
    },
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};


// Mutation: Create a new event using the full event schema
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newEvent: EventPayload) => {
      // Validate the payload before sending
      FullEventSchema.parse(newEvent);
      const { data } = await apiClient.post('/admin/event', newEvent);
      return data;
    },
    {
      onSuccess: () => {
        // Invalidate all public events queries (regardless of companyId)
        queryClient.invalidateQueries({ queryKey: ['publicEvents'] });
      },
    }
  );
};
