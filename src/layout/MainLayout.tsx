import Navbar from '@/components/custom/shared/Navbar';
import { Environment } from '@/config';
import { useArtworkStore } from '@/store/mint-artwork';
import type { IProfile } from '@/types/artwork.types';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import type { Address } from 'thirdweb';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';

const MainLayout = () => {
  const { setProfile } = useArtworkStore((state) => state);

  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();


  useEffect(() => {

    const latestProfile: IProfile = {
      isConnected: false,
      network: {
        chainId: Environment.CHAIN_ID,
        name: '',
        iconUrl: '',
        symbol: '',
      }
    };

    if (activeAccount && activeChain) {
      // console.log('activeAccount', activeAccount);
      // console.log('activeChain', activeChain);

      latestProfile.isConnected = true;
      latestProfile.network.chainId = activeChain.id;
      latestProfile.network.iconUrl = activeChain.icon?.url ?? '';
      latestProfile.network.name = activeChain.name ?? '';
      latestProfile.network.symbol = activeChain.nativeCurrency?.symbol ?? '';
      latestProfile.address = (activeAccount.address ?? '') as Address;
    }

    setProfile(latestProfile);

  }, [activeAccount, activeChain]);

  return (
    <div className='space-y-2' >
      <Navbar />
      <section className='px-6 lg:px-10' >
        <Outlet />
      </section>
    </div>
  );
};

export default MainLayout;