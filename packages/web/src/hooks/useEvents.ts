import {useQuery} from '@tanstack/react-query';
import type {EventListItem, PaginatedResponse} from '@fullstack/shared';
import {axiosInstance, queries} from '@/config/api.config';
import {useUserStore} from '@/store/useUserStore';

interface UseEventsParams {
  page: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const useEvents = ({
  page,
  limit = 6,
  search = '',
  dateFrom = '',
  dateTo = '',
}: UseEventsParams) => {
  const user = useUserStore((s) => s.user);

  return useQuery({
    queryKey: [
      queries.events.queryKeys.list,
      page,
      limit,
      search,
      dateFrom,
      dateTo,
      user?.email,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) {
        params.set('search', search);
      }

      if (dateFrom) {
        params.set('dateFrom', dateFrom);
      }

      if (dateTo) {
        params.set('dateTo', dateTo);
      }

      if (user?.email) {
        params.set('email', user.email);
      }

      const response = await axiosInstance.get<
        PaginatedResponse<EventListItem>
      >(`${queries.events.endpoints.list}?${params.toString()}`);

      return response.data;
    },
    staleTime: 5 * 60_000,
  });
};
