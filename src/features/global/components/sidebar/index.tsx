import React, {
  ElementType,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  SidebarBackOverlay,
  SidebarItemCounter,
  SidebarItemName,
  SidebarItemsList,
  SidebarItemsListInner,
  SidebarItemWrapper,
  SidebarMobileControl,
  SidebarTitle,
  SidebarWrapper
} from '@global/components/sidebar/sidebar.styles';
import { LINKS } from '@global/constants';
import useAppParts from '@global/hooks/useAppParts';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { LIGHT_GREY, TOXIC_GREEN, WHITE } from '@global/styles/variables';
import { SIDEBAR_ROUTES_NAMES } from '@global/types';
import { CloseIcon } from '@images/icons/CloseIcon';
import { DexIcon } from '@images/icons/sidebarIcons/DexIcon';
import { LandsIcon } from '@images/icons/sidebarIcons/LandsIcon';
import { SidebarOpenIcon } from '@images/icons/sidebarIcons/SidebarOpenIcon';
import { landsMissionsLimitsSelector } from '@selectors/userStatsSelectors';
import {
  toggleMyLandPopup,
  toggleLeaderboardPopup
} from '@slices/appPartsSlice';
import { LeaderboardIcon } from '@root/images/icons/sidebarIcons/LeaderboardIcon';
import { Leaderboard } from '@global/components/leaderboard';

type SideBarItemType = {
  route: string;
  isActive: boolean;
  icon: ElementType;
  withCounter: boolean;
  count: number;
  name: string;
  onClick?: () => void;
  address: string;
  trackEvent?: string;
};

const SideBarItem = ({
  route,
  isActive,
  icon: Icon,
  withCounter,
  count,
  name,
  onClick,
  trackEvent
}: SideBarItemType) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address } = usePersonalInfo();

  const isCurrentRoute = useMemo(() => {
    if (location.pathname === '/' && route === '/') return true;
    if (route !== '/' && location.pathname.includes(route)) return true;
  }, [route, location]);

  const fillColor = useMemo(() => {
    let fill = WHITE;
    if (isCurrentRoute) fill = TOXIC_GREEN;
    if (!isActive) fill = LIGHT_GREY;
    return fill;
  }, [isCurrentRoute, isActive]);

  const title = useMemo(() => {
    if (isActive) return name;
    return (
      <>
        {name}
        <br />
        (soon)
      </>
    );
  }, [isActive, name]);

  const onItemClick = () => {
    if (!isActive) return;
    if (typeof onClick === 'function') onClick();
    else navigate(route);
  };

  const isCounterShown = withCounter && isActive && address;

  return (
    <SidebarItemWrapper isCurrentRoute={isCurrentRoute} onClick={onItemClick}>
      <Icon fill={fillColor} />
      <SidebarItemName disabled={!isActive}>{title}</SidebarItemName>
      {isCounterShown && (
        <SidebarItemCounter disabled={count <= 0}>{count}</SidebarItemCounter>
      )}
    </SidebarItemWrapper>
  );
};

const Sidebar = ({ isMobile }: { isMobile: boolean }) => {
  const dispatch = useDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { address } = usePersonalInfo();
  const { isLandsSidebarOpened } = useAppParts();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const landsMissionsLimits = useSelector(landsMissionsLimitsSelector);

  const availableMissionsCount = useMemo(
    () =>
      landsMissionsLimits
        ? Object.values(landsMissionsLimits ?? {}).reduce((acc = 0, i: any) => {
            return acc + i.limits + i.limits2;
          }, 0)
        : '...',
    [landsMissionsLimits]
  );

  const availableRoutes = useMemo(() => {
    return [
      {
        route: '/',
        onClick: () => {
          dispatch(toggleMyLandPopup('lands'));
          return navigate('/lands');
        },
        icon: LandsIcon,
        isActive: true,
        withCounter: false,
        count: 0,
        name: SIDEBAR_ROUTES_NAMES.lands
      },
      {
        route: '/xchange',
        icon: DexIcon,
        isActive: true,
        withCounter: false,
        count: 0,
        name: SIDEBAR_ROUTES_NAMES.aiTrade,
        onClick: () => {
          window.open(LINKS.zero.dex, '_blank');
        }
      },
      {
        route: '/leaderboard',
        icon: LeaderboardIcon,
        isActive: true,
        withCounter: false,
        count: 0,
        name: SIDEBAR_ROUTES_NAMES.leaderboard,
        onClick: () => {
          dispatch(toggleMyLandPopup('lands'));
          dispatch(toggleLeaderboardPopup(true));
        }
      }
    ];
  }, [
    availableMissionsCount,
    address,
    isLandsSidebarOpened,
    location.pathname
  ]);

  const isHidden = !isOpen && isMobile;
  const isMobileOverlay = isOpen && isMobile;

  return (
    <>
      {isHidden && (
        <SidebarMobileControl>
          <SidebarTitle>ZeroColony</SidebarTitle>
          <SidebarOpenIcon onClick={() => setIsOpen(!isOpen)} />
        </SidebarMobileControl>
      )}
      {isMobileOverlay && <SidebarBackOverlay />}
      <SidebarWrapper isHidden={isHidden} ref={sidebarRef}>
        <SidebarTitle>
          ZeroColony
          {isMobile && <CloseIcon onClick={() => setIsOpen(false)} />}
        </SidebarTitle>

        <Leaderboard
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
        />
        <SidebarItemsList>
          <SidebarItemsListInner>
            {availableRoutes.map(
              (
                { route, isActive, icon, count, name, withCounter, onClick },
                idx
              ) => (
                <SideBarItem
                  key={`${route}-${idx}`}
                  icon={icon}
                  isActive={isActive}
                  route={route}
                  count={count}
                  name={name}
                  onClick={onClick}
                  withCounter={withCounter}
                  address={address}
                />
              )
            )}
          </SidebarItemsListInner>
        </SidebarItemsList>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
