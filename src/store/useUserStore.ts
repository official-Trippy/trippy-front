import create from "zustand";
import { getMyInfo } from "@/services/auth";

interface UserState {
  userInfo: any;
  loading: boolean;
  fetchUserInfo: () => Promise<void>;

  updateUserInfo: (newUserInfo: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  loading: true,

  fetchUserInfo: async () => {
    set({ loading: true });
    try {
      const data = await getMyInfo();
      console.log(data);
      set({ userInfo: data });
    } catch (error) {
      console.error("Error fetching user info:", error);
      set({ userInfo: null });
    } finally {
      set({ loading: false });
    }
  },

  updateUserInfo: (newUserInfo) =>
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        ...newUserInfo,
      },
    })),
}));
