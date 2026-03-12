import {useMutation} from '@tanstack/react-query';
import {axiosInstance} from '@/config/api.config';
import {useUserStore} from '@/store/useUserStore';

interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
    };
  };
}

export const useLogin = () => {
  const {login} = useUserStore();

  return useMutation({
    mutationFn: async (payload: {email: string}) => {
      const response = await axiosInstance.post<AuthResponse>(
        '/auth/login',
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      login(data.data.user);
    },
  });
};

export const useSignUp = () => {
  const {login} = useUserStore();

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      fullName: string;
      phone: string;
    }) => {
      const response = await axiosInstance.post<AuthResponse>(
        '/auth/register',
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      login(data.data.user);
    },
  });
};
