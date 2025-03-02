import React, { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Layout from '@global/components/layout/layout';
import {
  BALANCE_CHECKER_INTERVAL,
  CLNY_PRICE_CHECK_TICK
} from '@global/constants';
import { useBalance } from '@global/hooks/useBalance';
import useFlags from '@global/hooks/useFlags';
import useGameManagement from '@global/hooks/useGameManagement';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import useRoutes from '@global/hooks/useRoutes';
import { extractURLParam } from '@global/utils/urlParams';
import { AppDispatch } from '@redux/store';
import { NETWORK_DATA } from '@root/settings';
import { isRevShareModalSelector } from '@selectors/appPartsSelectors';
import * as Sentry from '@sentry/react';
import { dropGameInfo } from '@slices/gameManagementSlice';

function DataProvider({ children }: { children: ReactElement }) {
  const location = useLocation();
  const { isFarmingPage, isQuestPage, isRefPage, isMiningPage } = useRoutes();

  const dispatch = useDispatch<AppDispatch>();

  const { collectAllLandInfo } = useGameManagement();
  const { web3Instance, address, isInitialized } = usePersonalInfo(true);

  const { tokens, updateEarnedAll, updateCLNYBalance } = useBalance();
  const { isAvatarsAvailable, isBalanceCheckerTick, isLootboxesAvailable } =
    useFlags();

  const isRevshareModal = useSelector(isRevShareModalSelector);

  useEffect(() => {
    const id = extractURLParam(location, 'id');
    const isInitializedUser = Boolean(
      id && web3Instance && address && tokens && window.GM?.methods
    );

    if (isInitializedUser && id) {
      collectAllLandInfo(id).then(() => {});
    }

    if (location.pathname === '/') {
      dispatch(dropGameInfo());
    }
  }, [location.pathname, location.search, web3Instance, address, tokens]);

  React.useEffect(() => {
    if (!address) return;
    updateEarnedAll().then(() => {});

    if (isBalanceCheckerTick) {
      const balanceChecker = setInterval(async () => {
        await updateEarnedAll();
      }, BALANCE_CHECKER_INTERVAL);

      return () => {
        clearInterval(balanceChecker);
      };
    }
  }, [isBalanceCheckerTick, updateEarnedAll, address]);

  return <Layout>{children}</Layout>;
}

export default Sentry.withProfiler(DataProvider);
