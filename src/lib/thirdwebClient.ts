import { Environment } from "@/config";

import { createThirdwebClient, type Chain } from "thirdweb";
import { baseSepolia, sepolia, ethereum, base } from "thirdweb/chains";

const swapupAvailbleChains: Chain[] = [base, baseSepolia, sepolia, ethereum];

const clientId = Environment.THIRDWEB_CLIENT_ID;
const chainByEnvirnment = swapupAvailbleChains.find(
  (chain) => chain.id === Number(Environment.CHAIN_ID)
);

export const thirdWebClient = createThirdwebClient({ clientId });
export const currentChain = chainByEnvirnment ? chainByEnvirnment : baseSepolia;
