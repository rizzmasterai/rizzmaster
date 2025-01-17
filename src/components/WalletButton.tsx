'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const WalletButton = () => {
  const { connected, publicKey,wallets,wallet} = useWallet();
  const router = useRouter();
  const isFirstConnect = useRef(true);


  useEffect(() => {
    if (connected && publicKey && isFirstConnect.current) {
      isFirstConnect.current = false;
      setTimeout(() => {
        router.push('/chat');
      }, 500);
    }
  }, [connected, publicKey, router]);

  const handleClick = () => {
    if (!wallet) {
      alert('No wallet selected. Please choose a wallet.');
      return;
    }
    if (connected && publicKey) {
      router.push('/chat');
    }
  };

  return (
    <div className="wallet-container" onClick={handleClick}>
      
      <WalletMultiButton  >
      {connected ? 'GO TO CHAT' : 'TRY NOW'}
      </WalletMultiButton>    
    </div>
  );
}