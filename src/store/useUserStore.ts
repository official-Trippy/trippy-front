import create from 'zustand';
import { getMyInfo } from '@/services/auth'; 

interface UserState {
  userInfo: any;
  loading: boolean;
  fetchUserInfo: () => Promise<void>;
  updateUserInfo: (newUserInfo: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  loading: false, 
  fetchUserInfo: async () => {
    try {
      set({ loading: true }); 
      const data = await getMyInfo();
      set({ userInfo: data });
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      set({ loading: false });
    }
  },
  updateUserInfo: (newUserInfo) => set((state) => ({
    userInfo: {
      ...state.userInfo,
      ...newUserInfo,
    },
  })),
}));
