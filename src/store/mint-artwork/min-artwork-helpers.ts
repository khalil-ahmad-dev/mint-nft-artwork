import type { IMintArtworkStore, IProfile } from "@/types/artwork.types";

export const setProfileHelper = (
  state: IMintArtworkStore,
  profile: IProfile
): IMintArtworkStore => {
  return {
    ...state,
    profile,
  };
};
