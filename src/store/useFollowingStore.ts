import create from "zustand";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface FollowingState {
  following: Array<{ memberId: string; nickName: string }>;
  loading: boolean;
  fetchFollowing: (memberId: string) => Promise<void>;
  setFollowing: (
    newFollowing: Array<{ memberId: string; nickName: string }>
  ) => void;
}

export const useFollowingStore = create<FollowingState>((set) => ({
  following: [],
  loading: false,

  fetchFollowing: async (memberId: string) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${backendUrl}/api/member/following?memberId=${memberId}`
      );
      set({ following: response.data.result, loading: false });
    } catch (error) {
      console.error("Error fetching following data:", error);
      set({ loading: false });
    }
  },

  setFollowing: (newFollowing) => set({ following: newFollowing }),
}));
