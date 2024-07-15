import create from "zustand";
import { getMyInfo } from "@/services/auth";

interface UserState {
  userInfo: any;
  loading: boolean;
  fetchUserInfo: () => Promise<void>;
  setUserInfo: (newInfo: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  loading: true,

  fetchUserInfo: async () => {
    set({ loading: true });
    try {
      const data = await getMyInfo();
      set({ userInfo: data });
    } catch (error) {
      console.error("Error fetching user info:", error);
      set({ userInfo: null });
    } finally {
      set({ loading: false });
    }
  },

  setUserInfo: (newInfo) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...newInfo },
    })),
}));
