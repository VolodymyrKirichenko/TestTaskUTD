import {useMutation} from '@tanstack/react-query';
import {axiosInstance, queries} from '@/config/api.config';
import {useUserStore} from '@/store/useUserStore';
import type {RegistrationFormData} from '@/lib/validation';

interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
    };
  };
}

export const useEventRegistration = (eventId: string) => {
  const {login} = useUserStore();

  return useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const {confirmPassword, ...payload} = data;
      const response = await axiosInstance.post<RegistrationResponse>(
        queries.events.endpoints.register(eventId),
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      login(data.data.user);
    },
  });
};
