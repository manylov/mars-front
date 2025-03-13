import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import Backend from '@root/api/backend';
import { LandPlot } from '@features/lands/components/land/LandPlot';
import SocialIconsBar from './SocialIconsBar';
import useLands from '@features/lands/hooks/useLands';
import { FlexedPlotDivider } from '@features/lands/styles/landPlot.styles';
import { getClnySpeedLabel } from '@features/lands/utils/formating';
import Button from '@global/components/button';
import { Loader } from '@global/components/loader/loader';
import { GAP_TEXT, MOBILE_BREAKPOINT } from '@global/constants';
import useAppParts from '@global/hooks/useAppParts';
import { useBalance } from '@global/hooks/useBalance';
import useMediaQuery from '@global/hooks/useMediaQuery';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { MarsNavMyLandClose, TokensWrapper } from '@global/styles/app.styles';
import { fromWeiValue } from '@global/utils/fromWei';
import { ArrowLeft, ArrowRight } from '@images/icons/ArrowDown';
import { CloseIcon } from '@images/icons/CloseIcon';
import { CartCloseIconWrapper } from '@root/legacy/navbar.styles';
import { NETWORK_DATA } from '@root/settings';
import {
  setLandPageNumber,
  toggleLeaderboardPopup,
  toggleMyLandsPopup
} from '@slices/appPartsSlice';
import { StatsBar } from '@features/global/components/statsBar';
import { Leaderboard } from '@global/components/leaderboard';

import {
  ActiveLandsControlWrapper,
  ActiveLandsFirstLine,
  ActiveLandsTitle,
  BorderedDiv,
  ButtonSubText,
  LandsBlock,
  LandsSidebarHeaderWrapper,
  LandsSidebarWrapper,
  NoLandsTitle,
  LandsContentWrapper,
  LandsSection,
  SpanWrapper,
  LandsSpan,
  CollectSpan,
  PrizeSpanWrapper,
  PrizeSpan,
  PrizePoolText,
  PrizeAmountText,
  LearnMoreLink,
  ButtonNoLandsSubText,
  PrizeLinksSpan
} from './landsSidebar.styles';

export const LandsSidebar = () => {
  const dispatch = useDispatch();
  const { isLandsSidebarOpened: sidebarType } = useAppParts();
  const { tokens } = useBalance();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  const getContent = () => {
    if (sidebarType === 'lands') {
      return !tokens?.length ? (
        <NoLandsSidebarView />
      ) : (
        <ActiveLandsSidebarView />
      );
    }

    return null;
  };

  const hasLands = Boolean(tokens?.length);

  return (
    <LandsSidebarWrapper
      withLands={hasLands}
      isVisible={sidebarType === 'lands' || sidebarType === 'cart'}
      isMobile={isMobile}
    >
      <CartCloseIconWrapper>
        <MarsNavMyLandClose
          onClick={() => {
            dispatch(toggleMyLandsPopup(null));
          }}
        >
          <CloseIcon />
        </MarsNavMyLandClose>
      </CartCloseIconWrapper>
      {getContent()}
    </LandsSidebarWrapper>
  );
};

export const NoLandsSidebarView = () => {
  const { addToast } = useToasts();
  const { isLoadingTokens, tokens } = useBalance();
  const { isInitialized } = usePersonalInfo();
  const [maxClnyIncome, setMaxClnyIncome] = useState<string | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const { isLeaderboardPopupOpened } = useAppParts();
  const dispatch = useDispatch();

  const onBuyLandClick = () => {
    addToast('You can buy new lands on the globe', { appearance: 'info' });
  };

  useEffect(() => {
    try {
      (async () => {
        const data = await Backend.getHeaderStats();
        const stat = data.max ?? 0;
        setMaxClnyIncome(stat);
      })();
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (isLeaderboardPopupOpened) {
      setIsLeaderboardOpen(true);
    }
  }, [isLeaderboardPopupOpened]);

  useEffect(() => {
    if (!isInitialized) {
      setIsLocalLoading(false);
    }

    if (Array.isArray(tokens)) {
      setIsLocalLoading(false);
    }
  }, [tokens, isInitialized]);

  const [prizeStats, setPrizeStats] = useState({ prizeEth: 0, prizeUsd: 0 });

  useEffect(() => {
    const fetchPrizeStats = async () => {
      try {
        const stats = await Backend.getLandStats();
        setPrizeStats({
          prizeEth: stats.prizeEth || 0,
          prizeUsd: stats.prizeUsd || 0
        });
      } catch (error) {
        console.error('Failed to fetch prize stats:', error);
      }
    };
    fetchPrizeStats();
  }, []);

  return (
    <LandsSidebarHeaderWrapper>
      <SocialIconsBar />
      <StatsBar />
      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={() => {
          setIsLeaderboardOpen(false);
          dispatch(toggleLeaderboardPopup(false));
        }}
      />

      <LandsContentWrapper>
        <LandsSection>
          <SpanWrapper>
            <LandsSpan>
              <NoLandsTitle>
                {isLoadingTokens || isLocalLoading ? (
                  'Loading...'
                ) : (
                  <>
                    You do not <br /> have lands
                  </>
                )}
              </NoLandsTitle>
              {(isLoadingTokens || isLocalLoading) && <Loader />}
              {!isLoadingTokens && !isLocalLoading && (
                <>
                  <Button
                    onClick={onBuyLandClick}
                    text="Claim land"
                    variant="common"
                  />
                  <ButtonNoLandsSubText>
                    {NETWORK_DATA.ECONOMY === 'fixed'
                      ? 'Earn up to 14 CLNY/day from a land'
                      : `Earn up to ${fromWeiValue(
                          maxClnyIncome ?? '...'
                        )} CLNY/day from a land`}
                  </ButtonNoLandsSubText>
                </>
              )}
            </LandsSpan>
          </SpanWrapper>
        </LandsSection>

        <BorderedDiv>
          <PrizeSpanWrapper>
            <PrizeSpan>
              <PrizePoolText>Prize pool</PrizePoolText>
              <PrizeAmountText>
                {prizeStats.prizeEth.toFixed(2)} ETH ($
                {prizeStats.prizeUsd.toLocaleString()})
              </PrizeAmountText>
            </PrizeSpan>
            <PrizeLinksSpan>
              <LearnMoreLink
                href="https://zerocolony.notion.site/SPACE-RACE-A-Social-Experiment-1acd49cbead98046b271ea87fc98bea2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </LearnMoreLink>
              {/* <LearnMoreLink
                onClick={() => setIsLeaderboardOpen(true)}
                style={{ cursor: 'pointer' }}
              >
                Leaderboard
              </LearnMoreLink> */}
            </PrizeLinksSpan>
          </PrizeSpanWrapper>
        </BorderedDiv>
      </LandsContentWrapper>
    </LandsSidebarHeaderWrapper>
  );
};

export const ActiveLandsSidebarView = () => {
  const {
    tokens,
    earnedAmount,
    dailySpeed,
    collectAllStats,
    isCollectInProgress,
    clnyBalance,
    isLoadingTokens
  } = useBalance();
  const dispatch = useDispatch();
  const [prizeStats, setPrizeStats] = useState({ prizeEth: 0, prizeUsd: 0 });
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const { address, web3Instance } = usePersonalInfo();
  const { currentLandsPage } = useAppParts();
  const { isLeaderboardPopupOpened } = useAppParts();
  const { landsMissionsLimits } = useLands(tokens, web3Instance);

  const title = useMemo(
    () =>
      isLoadingTokens ? 'Loading...' : `Lands: ${tokens?.length ?? '...'}`,
    [tokens, isLoadingTokens]
  );
  const isCollectAvailable = Boolean(tokens?.length) && Boolean(earnedAmount);
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  const isLandPaginated = (index: number) =>
    index >= (currentLandsPage - 1) * 10 && index < currentLandsPage * 10;

  const getMissionsLimit = (token: string) =>
    landsMissionsLimits?.[`${token}`] ?? '...';

  const allTimeStats = useMemo(() => {
    const earned = Boolean(earnedAmount)
      ? `${earnedAmount.toFixed(2)} ${NETWORK_DATA.TOKEN_NAME} earned`
      : GAP_TEXT;

    const speed = () => {
      if (Boolean(dailySpeed)) {
        return getClnySpeedLabel(dailySpeed);
      } else return GAP_TEXT;
    };

    return `${earned} | ${speed()}`;
  }, [earnedAmount, dailySpeed]);

  useEffect(() => {
    const fetchPrizeStats = async () => {
      try {
        const stats = await Backend.getLandStats();
        setPrizeStats({
          prizeEth: stats.prizeEth || 0,
          prizeUsd: stats.prizeUsd || 0
        });
      } catch (error) {
        console.error('Failed to fetch prize stats:', error);
      }
    };
    fetchPrizeStats();
  }, []);

  useEffect(() => {
    if (isLeaderboardPopupOpened) {
      setIsLeaderboardOpen(true);
    }
  }, [isLeaderboardPopupOpened]);

  return (
    <div>
      <LandsSidebarHeaderWrapper isMobile={isMobile}>
        <SocialIconsBar />
        <StatsBar />
        <Leaderboard
          isOpen={isLeaderboardOpen}
          onClose={() => {
            setIsLeaderboardOpen(false);
            dispatch(toggleLeaderboardPopup(false));
          }}
        />
        <LandsContentWrapper>
          <LandsSection>
            <SpanWrapper>
              <LandsSpan>
                <ActiveLandsFirstLine>
                  <ActiveLandsControlWrapper>
                    <ActiveLandsTitle>{title}</ActiveLandsTitle>
                  </ActiveLandsControlWrapper>
                </ActiveLandsFirstLine>
              </LandsSpan>
              <CollectSpan>
                {isCollectAvailable && (
                  <Button
                    disabled={isCollectInProgress}
                    onClick={() => collectAllStats(address, web3Instance)}
                    text="COLLECT ALL"
                    variant="common"
                    disabledText="Collecting..."
                  />
                )}
                <ButtonSubText>{allTimeStats}</ButtonSubText>
              </CollectSpan>
            </SpanWrapper>
          </LandsSection>
          <BorderedDiv>
            <PrizeSpanWrapper>
              <PrizeSpan>
                <PrizePoolText>Prize pool</PrizePoolText>
                <PrizeAmountText>
                  {prizeStats.prizeEth.toFixed(2)} ETH ($
                  {prizeStats.prizeUsd.toLocaleString()})
                </PrizeAmountText>
              </PrizeSpan>
              <PrizeLinksSpan>
                <LearnMoreLink
                  href="https://zerocolony.notion.site/SPACE-RACE-A-Social-Experiment-1acd49cbead98046b271ea87fc98bea2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </LearnMoreLink>
                <LearnMoreLink
                  onClick={() => setIsLeaderboardOpen(true)}
                  style={{ cursor: 'pointer' }}
                >
                  Leaderboard
                </LearnMoreLink>
              </PrizeLinksSpan>
            </PrizeSpanWrapper>
          </BorderedDiv>
        </LandsContentWrapper>
      </LandsSidebarHeaderWrapper>
      <LandsBlock>
        {isLoadingTokens && <Loader />}
        {!isLoadingTokens &&
          Array.from(tokens ?? []).map((token, index) => {
            return (
              <div key={`${token}-${index}`}>
                {isLandPaginated(index) && (
                  <LandPlot
                    missionsLimit={getMissionsLimit(token ?? '')}
                    key={`${token}-${index}`}
                    id={parseInt(token ?? '')}
                    CLNYBalance={clnyBalance}
                    trigger={isCollectInProgress}
                  />
                )}
              </div>
            );
          })}
      </LandsBlock>
      {tokens && (
        <LandsPagination currentPage={currentLandsPage} tokens={tokens} />
      )}
    </div>
  );
};

const LandsPagination = ({
  currentPage,
  tokens = []
}: {
  currentPage: number;
  tokens: string[];
}) => {
  const dispatch = useDispatch();
  return (
    <TokensWrapper>
      <FlexedPlotDivider />
      <div className="flex-30">
        {currentPage > 1 && (
          <div
            onClick={() => dispatch(setLandPageNumber(currentPage - 1))}
            className="pointer"
          >
            <ArrowLeft />
          </div>
        )}
      </div>
      <div className="flex-160">
        {(currentPage - 1) * 10 + 1}-
        {Math.min(currentPage * 10, tokens?.length ?? 0)} of{' '}
        {tokens?.length ?? 0}
      </div>
      <div className="flex-30">
        {tokens?.length && currentPage < tokens.length / 10 && (
          <div
            onClick={() => dispatch(setLandPageNumber(currentPage + 1))}
            className="pointer"
          >
            <ArrowRight />
          </div>
        )}
      </div>
      <FlexedPlotDivider />
    </TokensWrapper>
  );
};
