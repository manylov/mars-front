import { getDefaultConfig } from 'connectkit';
import { createConfig, http, injected } from 'wagmi';
import { zeroNetwork } from 'wagmi/chains';

export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [zeroNetwork],
    connectors: [
      injected({
        target: 'metaMask',
      }),
    ],

    transports: {
      // RPC URL for each chain
      [zeroNetwork.id]: http('https://zero.drpc.org'),
    },

    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: 'Your App Name',

    // Optional App Info
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);
