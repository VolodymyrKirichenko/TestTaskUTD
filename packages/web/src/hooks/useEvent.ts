import {useQuery} from '@tanstack/react-query';
import type {Event, ApiResponse} from '@fullstack/shared';
import {axiosInstance, queries} from '@/config/api.config';
import {useUserStore} from '@/store/useUserStore';

export const useEvent = (id: string) => {
  const user = useUserStore((s) => s.user);

  return useQuery({
    queryKey: [queries.events.queryKeys.detail, id, user?.email],
    queryFn: async () => {
      const params = user?.email ? {email: user.email} : {};
      const response = await axiosInstance.get<ApiResponse<Event>>(
        queries.events.endpoints.detail(id),
        {params}
      );
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60_000,
  });
};
