import { Address } from "../types/interfaces";
import { create } from "zustand";
import { getUserAddresses } from "../api/userService";

interface AddressState {
  addresses: Address[];
  setAddresses: (newAddresses: Address[]) => void;
  fetchAddresses: (
    userId: string,
    setLoading?: (value: boolean) => void
  ) => void;
}

export const useAddressStore = create<AddressState>()((set) => ({
  addresses: [],
  setAddresses: (newAddresses) => set({ addresses: newAddresses }),
  fetchAddresses: async (
    userId: string,
    setLoading?: (value: boolean) => void
  ) => {
    try {
      const response = await getUserAddresses(userId);
      set({ addresses: response });
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
