import {useMutation, useQueryClient} from '@tanstack/react-query';
import {axiosInstance, queries} from '@/config/api.config';

export const useEventUnregister = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosInstance.delete(
        queries.events.endpoints.register(eventId),
        {params: {email}}
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queries.events.queryKeys.detail, eventId],
      });
      queryClient.invalidateQueries({
        queryKey: [queries.events.queryKeys.list],
      });
    },
  });
};
