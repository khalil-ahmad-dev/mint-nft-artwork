import { Environment } from "@/config";
import type { IMintArtworkStore, IProfile } from "@/types/artwork.types";
import { create } from "zustand";
import { setProfileHelper } from "./min-artwork-helpers";

const initialState: IMintArtworkStore = {
  profile: {
    isConnected: false,
    network: {
      chainId: Environment.CHAIN_ID,
      name: "",
      iconUrl: "",
      symbol: "",
    },
  },
  setProfile: () => {},
};

export const useArtworkStore = create<IMintArtworkStore>(
  (set): IMintArtworkStore => ({
    ...initialState,
    setProfile: (profile: IProfile) =>
      set((state) => setProfileHelper(state, profile)),
  })
);
