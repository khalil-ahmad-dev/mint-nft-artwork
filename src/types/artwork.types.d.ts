export type ToastVariantType =
  | "default"
  | "success"
  | "error"
  | "info"
  | "warning";

export interface IProfile {
  address?: `0x${string}`;
  isConnected: boolean;
  network: {
    chainId: number;
    name: string;
    iconUrl: string;
    symbol: string;
  };
}

export interface IMintArtworkStore {
  profile: IProfile;
  setProfile: (profile: IProfile) => void;
}
