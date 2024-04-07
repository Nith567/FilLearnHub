'use client';
import {defineChain} from 'viem';
import {PrivyProvider} from '@privy-io/react-auth';

import {sepolia, polygon, polygonMumbai} from 'viem/chains';
export const myCustomChain = defineChain({
  id: 314159, // Replace this with your chain's ID
  name: 'Filecoin - Calibration testnet',
  network: 'Filecoin - Calibration testnet',
  nativeCurrency: {
    decimals: 18, // Replace this with the number of decimals for your chain's native token
    name: 'FIL',
    symbol: 'tFIL',
  },

  rpcUrls: {
    default: {
      http: ['https://api.calibration.node.glif.io/rpc/v1'],
    },
  },
  blockExplorers: {
    default: {name: 'Explorer', url: 'https://calibration.filfox.info/en'},
  },
});

export default function Providerss({children}) {
  return (
    <PrivyProvider
      appId='clu43ma1g02yz1y4ob9gk96cg' 
      config={{
        gasLimit:2000000,

        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.Sg034aXqfDmRi4ufNLF5NQAAAA%26pid%3DApi&f=1&ipt=4dc4aa0cd5fa3db36fb56383bdb89ea997e337b354a2f521289b3dc052291735&ipo=images',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defineChain:myCustomChain,
        supportedChains:[myCustomChain,sepolia]
      }}
    >
      {children}
    </PrivyProvider>
  );
}