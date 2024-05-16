import { create } from 'zustand';

interface EmailState {
  email: string;
  setEmail: (email: string) => void;
}

const useUserEmail = create<EmailState>((set) => ({
  email: '',
  setEmail: (email) => set({ email }),
}));

export default useUserEmail;