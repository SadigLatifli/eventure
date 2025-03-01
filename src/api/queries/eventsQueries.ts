import { useMutation, useQuery, useQueryClient } from 'react-query';
import apiClient from '../apiClient';
import { EventPayload } from '../schemas/eventSchema';


// Custom hook to fetch public events
export const usePublicEvents = (companyId: string) => {
    return useQuery(['publicEvents', companyId], async () => {
        const { data } = await apiClient.get(`/admin/event/upcoming?companyId=${companyId}`);
        return data;
    }, { retry: false } );
};
  
  // Mutation: Create New Event
  export const useCreateEvent = () => {
    const queryClient = useQueryClient();
  
    return useMutation(
      async (newEvent: EventPayload) => {
        const { data } = await apiClient.post('/admin/event', newEvent);
        return data;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('publicEvents');
        },
      }
    );
  };
