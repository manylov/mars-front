import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { ADD_ETH_REQUEST_PAYLOAD } from '@global/constants';
import { useBalance } from '@global/hooks/useBalance';
import useContracts from '@global/hooks/useContracts';
import {
  CONNECT_EVENTS,
  ConnectEventsType,
  PROVIDER_EVENTS,
} from '@global/types';

import { getProviderOptions } from '@global/utils/cryptoHelpers';
import { wrongChainToast } from '@global/utils/utilModals';
import {
  isConnecting,
  isInitializedSelector,
  providerSelector,
} from '@redux/selectors/commonAppSelectors';
import {
  toggleConnectionPopup,
  toggleMyLandsPopup,
} from '@redux/slices/appPartsSlice';
import {
  resetInitializationOnDisconnect,
  setInitialized,
  setIsConnected,
  setIsLoading,
  setUserProvider,
} from '@redux/slices/commonAppStateSlice';
import {
  resetUserBalance,
  resetUserTokens,
  setAddress,
} from '@redux/slices/userStatsSlice';
import { NETWORK_DATA } from '@root/settings';
import { CURRENT_CHAIN, CURRENT_NET } from '@root/settings/chains';
import { addressSelector } from '@selectors/userStatsSelectors';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

declare global {
  interface Window {
    isZerion?: boolean;
  }
}

const usePersonalInfo = (withInitialize = false) => {
  // REFS
  const web3 = React.useRef<Web3 | null>(null);
  const addressRef = React.useRef<string>('');
  const web3ModalRef = React.useRef<Web3Modal | null>(null);

  // Initialize web3Modal
  useEffect(() => {
    const initializeWeb3Modal = (isZerion: boolean) => {
      web3ModalRef.current = new Web3Modal({
        cacheProvider: true,
        providerOptions: getProviderOptions(isZerion),
        theme: 'dark',
      });
    };

    // Initial initialization
    initializeWeb3Modal(!!window.isZerion);

    // Listen for provider announcements
    const handleProviderAnnouncement = (event: any) => {
      if (event.detail.info.name === 'Zerion') {
        window.isZerion = true;
      }

      initializeWeb3Modal(!!window.isZerion);
    };

    window.addEventListener(
      'eip6963:announceProvider',
      handleProviderAnnouncement
    );
    // Request providers
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener(
        'eip6963:announceProvider',
        handleProviderAnnouncement
      );
    };
  }, []);

  // SELECTORS
  const connecting = useSelector(isConnecting);
  const isInitialized = useSelector(isInitializedSelector);
  const stateAddress = useSelector(addressSelector) ?? window.address;
  const provider = useSelector(providerSelector);

  // UTILS
  const dispatch = useDispatch();
  const { addToast, removeToast } = useToasts();

  // FEATURES
  const { initializeContracts } = useContracts();
  const { getAccountAssets } = useBalance();

  const toastData = React.useMemo(() => ({ id: '' }), []);

  const disconnect = (window.disconnect = React.useCallback(
    async (event: React.MouseEvent<HTMLElement> | null = null) => {
      event?.preventDefault?.();
      web3ModalRef.current?.clearCachedProvider();
      window.xweb3 = web3.current = null;
      addressRef.current = '';
      dispatch(resetUserBalance());
      dispatch(resetInitializationOnDisconnect());
      dispatch(toggleMyLandsPopup(null));
      dispatch(toggleConnectionPopup(false));
    },
    []
  ));

  const connect = React.useCallback(
    async (to = '', type: ConnectEventsType = CONNECT_EVENTS.click) => {
      if (connecting) return;

      let provider: any;

      try {
        if (to !== '') {
          provider = await web3ModalRef.current?.connectTo(to);
        } else {
          provider = await web3ModalRef.current?.connect();
        }

        dispatch(setIsConnected(true));
      } catch (error) {
        dispatch(setIsConnected(false));
      }

      dispatch(setUserProvider(provider));
      dispatch(setInitialized(false));
      dispatch(toggleMyLandsPopup('lands'));

      await subscribeProvider(provider);

      window.xweb3 = web3.current = new Web3(provider);
      initializeContracts();

      let chainId: number = 0;
      try {
        chainId = await web3.current.eth.getChainId();
      } catch (error: any) {
        addToast(error.message, { appearance: 'error' });
        return;
      }

      if (chainId !== CURRENT_NET) {
        showWrongChain();
        await disconnect();
        dispatch(setIsConnected(false));

        return;
      }

      const accounts = await web3.current.eth.getAccounts();
      const addressValue = accounts[0];

      await updateAddress(addressValue);
      dispatch(setIsConnected(false));

      // https://ethereum.stackexchange.com/questions/75851/metamask-rpc-error-internal-json-rpc-error?rq=1
      await window.ethereum?.enable?.();
    },
    [connecting, addressRef.current]
  );

  const subscribeProvider = React.useCallback(
    async (provider: any) => {
      dispatch(setIsLoading({ field: 'tokensLoading', value: true }));
      if (!provider?.on) {
        return;
      }
      provider.on(PROVIDER_EVENTS.disconnect, () => {
        disconnect();
      });

      provider.on(
        PROVIDER_EVENTS.accountsChanged,
        async (accounts: string[]) => {
          await updateAddress(accounts[0]);
          await getAccountAssets(addressRef, web3.current);
        }
      );

      provider.on(PROVIDER_EVENTS.chainChanged, async (chainId: number) => {
        if (+chainId !== CURRENT_NET) {
          await disconnect();
          showWrongChain();

          window.dataLayer.push({
            event: 'chain.wrong',
            id: chainId,
            name: CURRENT_CHAIN?.name,
          });
          return;
        }

        await getAccountAssets(addressRef, web3.current);
      });
    },
    [
      addToast,
      disconnect,
      getAccountAssets,
      addressRef.current,
      dispatch,
      CURRENT_NET,
      web3.current,
    ]
  );

  const switchAddress = (address: string) => {
    addressRef.current = address;
    dispatch(setAddress(address));
    window.address = address;
  };

  const updateAddress = React.useCallback(
    async (_address: string) => {
      if (_address !== addressRef.current) {
        switchAddress(_address);
        dispatch(resetUserTokens());

        await getAccountAssets(addressRef, web3.current);
      }
    },
    [dispatch, addressRef.current]
  );

  const switchNetwork = React.useCallback(async (toastData: { id: string }) => {
    const ERROR_CHAIN_NOT_ADDED = 4902;
    const ERROR_CHAIN_NOT_ADDED_MOBILE = -32603;
    const chainId = '0x' + NETWORK_DATA.ID.toString(16);

    if (window.ethereum && toastData) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
        if (toastData.id !== '') {
          removeToast(toastData.id);
          toastData.id = '';
        }
        await connect('injected');
      } catch (error: any) {
        if (
          error?.code === ERROR_CHAIN_NOT_ADDED ||
          error?.data?.originalError?.code === ERROR_CHAIN_NOT_ADDED ||
          // SOURCE: https://github.com/MetaMask/metamask-mobile/issues/3629#issuecomment-1031304504
          error?.data?.originalError?.code === ERROR_CHAIN_NOT_ADDED_MOBILE
        ) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [ADD_ETH_REQUEST_PAYLOAD(chainId)],
            });
            if (toastData.id !== '') {
              removeToast(toastData.id);
              toastData.id = '';
            }
            await connect('injected');
          } catch (error: any) {
            addToast(error?.message ?? 'Switch error', { appearance: 'error' });
          }
        }
      }
    } else addToast('Metamask not found', { appearance: 'error' });
  }, []);

  const showWrongChain = React.useCallback(() => {
    if (toastData.id !== '') {
      return;
    }
    addToast(
      wrongChainToast(() => {
        return switchNetwork(toastData);
      }),
      {
        appearance: 'info',
        autoDismiss: false,
        onDismiss: () => {
          toastData.id = '';
        },
      },
      (id: string) => {
        toastData.id = id;
      }
    );
  }, []);

  React.useEffect(() => {
    (async () => {
      if (
        web3ModalRef.current?.cachedProvider &&
        !isInitialized &&
        withInitialize
      ) {
        await connect();
      }
    })();
  }, [connect]);

  window.connect = connect;
  window.toast = addToast;

  return {
    address: stateAddress ?? addressRef.current,
    web3Instance: web3.current ?? window.xweb3,
    disconnect,
    connect,
    subscribeProvider,
    switchNetwork,
    updateAddress,
    showWrongChain,
    connecting,
    provider,
    isInitialized,
  };
};

export default usePersonalInfo;
