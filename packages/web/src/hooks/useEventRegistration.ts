import {useMutation, useQueryClient} from '@tanstack/react-query';
import {axiosInstance, queries} from '@/config/api.config';
import type {RegistrationFormData} from '@/lib/validation';

interface RegistrationResponse {
  success: boolean;
  message: string;
}

export const useEventRegistration = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const response = await axiosInstance.post<RegistrationResponse>(
        queries.events.endpoints.register(eventId),
        data
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
