import { create } from "zustand";
import { Product } from "@/lib/types";

interface ShirtStore {
  shirts: Product[];
  setShirts: (shirts: Product[]) => void;
}

const useShirtStore = create<ShirtStore>((set) => ({
  shirts: [],
  setShirts: (shirts) => set({ shirts }),
}));

export default useShirtStore;
