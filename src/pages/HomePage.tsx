import MintArtworkDialog from '@/components/custom/mint-nft/MintArtworkDialog';
import { Button } from '@/components/ui/button';
import { Environment } from '@/config';
import { handleShowNotificationToast } from '@/lib/helpers';
import { useArtworkStore } from '@/store/mint-artwork';
import { useState } from 'react';


const HomePage = () => {
  const { profile } = useArtworkStore(state => state);

  const [openMintArtworkDialog, setMintArtworkDialog] = useState(false);
  const handleOpenMintArtworkDialog = () => {

    if (!profile.isConnected) {
      handleShowNotificationToast(
        "warning",
        "Please connect your wallet first",
        "Your wallet is not connected, Please connect your wallet to mint your NFT.",
      );
      return;
    }

    setMintArtworkDialog(true);

  };

  return (
    <div className='space-y-2' >

      <header className='flex flex-col gap-6 lg:gap-0 lg:flex-row lg:items-center lg:justify-between my-10' >
        <div>
          <h2 className='font-bold text-2xl text-primary' >Mint Your NFT Artwork</h2>
          <p className='text-muted-foreground lg:w-2/3' >
            Start the minting process by clicking the <span className='text-primary font-bold'>Mint</span> button. Provide the necessary details—such as the NFT name, artist, Metadata URL, Total Shares, Initial Owners and their Shares. Once completed, your NFT will be securely minted and instantly delivered to your wallet.</p>
        </div>


        <Button variant="default" onClick={handleOpenMintArtworkDialog} >Mint Artwork</Button>
      </header>

      <div className='grid lg:grid-cols-2 gap-6' >
        <Button
          className='col-span-1'
          variant="outline"
          onClick={() => window.open(`https://sepolia.etherscan.io/address/${Environment.SMART_CONTRACT_ADDRESS}`)}
        >
          <img src="/assets/etherscan.svg" className='size-4' alt="" />
          <span>View Transactions</span>
        </Button>

        <Button
          className='col-span-1'
          variant="outline"
          onClick={() => window.open(`https://testnets.opensea.io/${profile.address}`)}
        >
          <img src="/assets/opensea.svg" className='size-4' alt="" />
          <span>View NFT Assets Owned</span>
        </Button>
      </div>

      <MintArtworkDialog
        open={openMintArtworkDialog}
        setOpen={setMintArtworkDialog}
      />
    </div>
  );
};

export default HomePage;