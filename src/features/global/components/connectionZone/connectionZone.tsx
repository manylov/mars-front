import { useBalance } from '@features/global/hooks/useBalance';
import {
  useCLNYBalance,
  useEthBalance,
} from '@features/global/hooks/useCallContracts';
import useMediaQuery from '@features/global/hooks/useMediaQuery';
import {
  copyTextToClipboard,
  formatWallet,
} from '@features/globus/utils/methods';
import Button from '@global/components/button';
import {
  BlockButton,
  MainAppContainer,
  MarsNavConnectedModal,
  MarsNavConnectedModalLink,
  MarsNavConnectedModalTitle,
  MarsNavConnectedWallet,
  MarsNavPanelItemFlexed,
  MobileTableBlock,
  MobileTableBlockBalance,
  MobileTableText,
  MobileTableWalletBlock,
  MobileTableWrapperWallet,
  NewHeaderAddressText,
  NewHeaderInfoWrapper,
  NewHeaderStatInnerWrapper,
  NewHeaderStatWrapper,
} from '@global/styles/app.styles';
import EthIconImg from '@images/photo/connection-zone-icons/eth.png';
import MarsIconImg from '@images/photo/connection-zone-icons/MarsIcon.png';
import PolygonIconImg from '@images/photo/connection-zone-icons/PolygonIcon.png';
import { Copy } from '@root/images/icons/Copy';
import { ImageIconWrapper } from '@root/images/icons/imageIconWrapper';
import { WalletIcon } from '@root/images/icons/WalletIcon';
import { NETWORK_DATA } from '@root/settings';
import { CURRENT_CHAIN } from '@root/settings/chains';
import { isConnectionPopupSelector } from '@selectors/appPartsSelectors';
import {
  clnyBalanceSelector,
  userBalanceSelector,
} from '@selectors/userStatsSelectors';
import { toggleConnectionPopup } from '@slices/appPartsSlice';
import { ConnectKitButton } from 'connectkit';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { useAccount, useDisconnect } from 'wagmi';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ConnectionZone = (_: {
  address: string;
  onConnect: () => void;
}) => {
  const dispatch = useDispatch();
  const popupRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToasts();
  // const clnyBalance = useSelector(clnyBalanceSelector);
  const showConnectionPopup = useSelector(isConnectionPopupSelector);
  const isTableMobile = useMediaQuery(`(min-width: 630px)`);
  const [contentSpace, setContentSpace] = useState<string>('space-between');
  const { address, isDisconnected, isConnecting, isReconnecting } =
    useAccount();
  const { disconnect } = useDisconnect();
  const { userBalance: balance } = useBalance();

  const { clnyBalance } = useCLNYBalance();
  const { ethBalance } = useEthBalance();

  useEffect(() => {
    const handleMouseClick = (event: any) => {
      let flagConnection = false;
      for (const value of event.composedPath()) {
        if ('headerInfo' === value.id || 'connectionInfo' === value.id) {
          flagConnection = !flagConnection;
        }
      }
      if (!flagConnection) {
        dispatch(toggleConnectionPopup(false));
      }
    };

    document.addEventListener('click', handleMouseClick);

    return () => {
      document.removeEventListener('click', handleMouseClick);
    };
  }, [showConnectionPopup]);

  if (isDisconnected) {
    return (
      <ConnectKitButton.Custom>
        {({ show }) => (
          <Button
            connectButton={true}
            text="Connect wallet"
            variant="common"
            onClick={() => show?.()}
          />
        )}
      </ConnectKitButton.Custom>
    );
  }

  if (isConnecting || isReconnecting) {
    return <div>Connecting...</div>;
  }

  return (
    <MainAppContainer>
      {isTableMobile ? (
        <NewHeaderInfoWrapper
          id={'headerInfo'}
          onClick={() => {
            dispatch(toggleConnectionPopup(!showConnectionPopup));
          }}
        >
          <NewHeaderStatWrapper>
            <ImageIconWrapper src={MarsIconImg} dimension="14px" />
            {clnyBalance} {NETWORK_DATA.TOKEN_NAME}
          </NewHeaderStatWrapper>
          <NewHeaderStatWrapper>
            <ImageIconWrapper
              src={
                CURRENT_CHAIN.ticker === 'MATIC' ? PolygonIconImg : EthIconImg
              }
              dimension="14px"
            />
            {ethBalance}
            {CURRENT_CHAIN.ticker}
          </NewHeaderStatWrapper>
          <NewHeaderStatWrapper>
            <NewHeaderStatInnerWrapper>
              <WalletIcon />
              <NewHeaderAddressText>
                {formatWallet(address)}
              </NewHeaderAddressText>
            </NewHeaderStatInnerWrapper>
          </NewHeaderStatWrapper>
        </NewHeaderInfoWrapper>
      ) : (
        <MobileTableWrapperWallet
          content={contentSpace}
          id={'headerInfo'}
          onClick={() => {
            dispatch(toggleConnectionPopup(!showConnectionPopup));
          }}
        >
          <MobileTableBlockBalance>
            <MobileTableBlock>
              <ImageIconWrapper src={MarsIconImg} dimension="14px" />
              <MobileTableText>{clnyBalance}</MobileTableText>
            </MobileTableBlock>
            <MobileTableBlock>
              <ImageIconWrapper
                src={
                  CURRENT_CHAIN.ticker === 'MATIC' ? PolygonIconImg : EthIconImg
                }
                dimension="14px"
              />
              <MobileTableText>{balance}</MobileTableText>
            </MobileTableBlock>
          </MobileTableBlockBalance>
          <MobileTableWalletBlock>
            <WalletIcon />
          </MobileTableWalletBlock>
        </MobileTableWrapperWallet>
      )}

      {showConnectionPopup && (
        <MarsNavConnectedModal ref={popupRef} id={'connectionInfo'}>
          <div>
            <MarsNavConnectedModalTitle>Account</MarsNavConnectedModalTitle>
            <div>
              <MarsNavConnectedWallet>
                <a
                  href="/"
                  onClick={(event) => {
                    event.preventDefault();
                    copyTextToClipboard(address)
                      .then(() => {
                        addToast('Address has been copied to clipboard', {
                          appearance: 'success',
                        });
                      })
                      .catch((error) => {
                        console.error(error);
                        addToast('Copying to clipboard has failed', {
                          appearance: 'error',
                        });
                      });
                  }}
                >
                  {address} <Copy />
                </a>
              </MarsNavConnectedWallet>
            </div>
          </div>
          <BlockButton>
            <MarsNavConnectedModalLink onClick={() => disconnect()}>
              Disconnect
            </MarsNavConnectedModalLink>
            <MarsNavPanelItemFlexed>
              <a
                href={`${CURRENT_CHAIN.explorer}/address/${address}`}
                target="_blank"
                rel="noreferrer"
              >
                Explorer
              </a>
            </MarsNavPanelItemFlexed>
          </BlockButton>
        </MarsNavConnectedModal>
      )}
    </MainAppContainer>
  );
};
