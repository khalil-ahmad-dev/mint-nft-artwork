import MintArtworkDialog from '@/components/custom/mint-nft/MintArtworkDialog';
import { Button } from '@/components/ui/button';
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

      <header className='flex items-center justify-between my-10' >
        <div>
          <h2 className='font-bold text-2xl text-primary' >Mint Your NFT Artwork</h2>
          <p className='text-muted-foreground w-2/3' >
            Start the minting process by clicking the <span className='text-primary font-bold'>Mint</span> button. Provide the necessary details—such as the title, description, and artwork file. Once completed, your NFT will be securely minted and instantly delivered to your wallet</p>
        </div>


        <Button variant="default" onClick={handleOpenMintArtworkDialog} >Mint Artwork</Button>
      </header>

      <MintArtworkDialog
        open={openMintArtworkDialog}
        setOpen={setMintArtworkDialog}
      />
    </div>
  );
};

export default HomePage;