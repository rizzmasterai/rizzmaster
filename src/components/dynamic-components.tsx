'use client';

import dynamic from 'next/dynamic';

export const WalletButton = dynamic(
  () => import('./WalletButton').then(mod => mod.WalletButton),
  { 
    ssr: false,
    loading: () => <div className="wallet-placeholder text-white">Loading wallet...</div>
  }
);