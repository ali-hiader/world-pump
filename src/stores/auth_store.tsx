import { create } from "zustand";

interface AuthState {
  userIdAuthS: string | undefined;
  setUserIdAuthS: (userId: string | undefined) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userIdAuthS: undefined,
  setUserIdAuthS: (userId) => set({ userIdAuthS: userId }),
}));
