import { useSelector } from 'react-redux';
import {
  isGearModalSelector,
  isLeaderboardPopupSelector,
  isMyLandSelector,
  myLandPageSelector
} from '@selectors/appPartsSelectors';

const useAppParts = () => {
  const isLandsSidebarOpened = useSelector(isMyLandSelector);
  const isLeaderboardPopupOpened = useSelector(isLeaderboardPopupSelector);
  const currentLandsPage = useSelector(myLandPageSelector);
  const isGearModalOpened = useSelector(isGearModalSelector);

  return {
    isLandsSidebarOpened,
    currentLandsPage,
    isGearModalOpened,
    isLeaderboardPopupOpened
  };
};

export default useAppParts;
