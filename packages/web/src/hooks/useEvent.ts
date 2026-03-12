import {useQuery} from '@tanstack/react-query';
import type {Event, ApiResponse} from '@fullstack/shared';
import {axiosInstance, queries} from '@/config/api.config';

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: [queries.events.queryKeys.detail, id],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<Event>>(
        queries.events.endpoints.detail(id)
      );
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60_000,
  });
};
