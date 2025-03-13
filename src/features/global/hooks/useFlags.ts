import { LOCAL_STORAGE_KEYS } from '@global/constants';
import { NETWORK_DATA } from '@root/settings';

const useFlags = () => {
  const isBalanceCheckerTick = process.env.REACT_APP_BALANCE_CHECK_AVAILABLE;

  return {
    isBalanceCheckerTick
  };
};

export default useFlags;
