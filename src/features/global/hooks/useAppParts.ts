import { useSelector } from 'react-redux';
import {
  isLeaderboardPopupSelector,
  isMyLandSelector,
  myLandPageSelector
} from '@selectors/appPartsSelectors';

const useAppParts = () => {
  const isLandsSidebarOpened = useSelector(isMyLandSelector);
  const isLeaderboardPopupOpened = useSelector(isLeaderboardPopupSelector);
  const currentLandsPage = useSelector(myLandPageSelector);

  return {
    isLandsSidebarOpened,
    currentLandsPage,
    isLeaderboardPopupOpened
  };
};

export default useAppParts;
