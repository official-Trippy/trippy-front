import create from 'zustand';
import { getMyInfo } from '@/services/auth'; 

interface UserState {
  userInfo: any;
  loading: boolean;
  fetchUserInfo: () => Promise<void>;
  updateUserInfo: (newUserInfo: any) => void;
  resetUserInfo: () => void; // 상태 초기화 함수 추가
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  loading: false,
  
  // 유저 정보 가져오기
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
  
  // 유저 정보 업데이트
  updateUserInfo: (newUserInfo) => set((state) => ({
    userInfo: {
      ...state.userInfo,
      ...newUserInfo,
    },
  })),
  
  // 상태 초기화 함수 (로그아웃 시 사용)
  resetUserInfo: () => set({ userInfo: null, loading: false }),
}));