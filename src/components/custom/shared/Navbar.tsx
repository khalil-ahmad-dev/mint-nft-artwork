import { thirdWebClient } from "@/lib/thirdwebClient";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet", {
    walletConfig: { options: "smartWalletOnly" }
  })
];

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-accent px-6 lg:px-10 py-2 lg:py-4" >
      <div className="flex items-center gap-2" >
        <img src="/assets/nft.svg" alt="" className="size-10" />
        <h1 className="text-2xl font-bold" >Artwork</h1>
      </div>


      <ConnectButton
        client={thirdWebClient}
        wallets={wallets}
      />
    </nav>
  );
};

export default Navbar;