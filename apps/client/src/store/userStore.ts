import { User } from "../types/types";
import { create } from "zustand";
import { getUserById } from "../api/userService";

interface UserState {
  user?: User
  setUser: (newUser: User) => void;
  fetchUser: (
    userId: string,
    setLoading?: (value: boolean) => void
  ) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: undefined,
  setUser: (newUser) => set({ user: newUser }),
  fetchUser: async (
    userId: string,
    setLoading?: (value: boolean) => void
  ) => {
    try {
      const response = await getUserById(userId);
      set({ user: response });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Erro desconhecido");
      }
    } finally {
      if (setLoading) setLoading(false);
    }
  },
}));
