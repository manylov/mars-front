import React, { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Layout from '@global/components/layout/layout';
import { BALANCE_CHECKER_INTERVAL } from '@global/constants';
import { useBalance } from '@global/hooks/useBalance';
import useFlags from '@global/hooks/useFlags';
import useGameManagement from '@global/hooks/useGameManagement';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { extractURLParam } from '@global/utils/urlParams';
import { AppDispatch } from '@redux/store';
import * as Sentry from '@sentry/react';
import { dropGameInfo } from '@slices/gameManagementSlice';

function DataProvider({ children }: { children: ReactElement }) {
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();

  const { collectAllLandInfo } = useGameManagement();
  const { web3Instance, address } = usePersonalInfo(true);

  const { tokens, updateEarnedAll } = useBalance();
  const { isBalanceCheckerTick } = useFlags();

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
