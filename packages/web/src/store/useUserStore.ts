import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface UserData {
  id: string;
  fullName: string;
  email: string;
}

interface UserState {
  user: UserData | null;
  login: (data: UserData) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (data) => set({user: data}),
      logout: () => set({user: null}),
    }),
    {
      name: 'event_user',
    }
  )
);
