import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './app';
import { Web3Provider } from '@features/global/providers/web3-provider';
import { ConnectKitButton } from 'connectkit';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Web3Provider>
      <ConnectKitButton />
    </Web3Provider>
  </React.StrictMode>
);
