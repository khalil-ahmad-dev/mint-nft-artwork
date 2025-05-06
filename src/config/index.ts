interface ArtI_CONFIG {
  CHAIN_ID: number;
  THIRDWEB_CLIENT_ID: string;
  SMART_CONTRACT_ADDRESS: string;
}

const config: ArtI_CONFIG = {
  CHAIN_ID: Number(import.meta.env.VITE_CHAIN_ID),
  THIRDWEB_CLIENT_ID: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
  SMART_CONTRACT_ADDRESS: import.meta.env.VITE_SMART_CONTRACT_ADDRESS,
};

export const Environment = config;
