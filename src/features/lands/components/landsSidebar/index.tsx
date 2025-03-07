import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import PolygonBackend from '@api/polygonBackend';
import { freeReserve } from '@features/globus/utils/reserveHelper';
import { LandPlot } from '@features/lands/components/land/LandPlot';
import { CartContent } from '@features/lands/components/landsSidebar/cartContent/cartContent';
import SocialIconsBar from './SocialIconsBar';
import useLands from '@features/lands/hooks/useLands';
import { FlexedPlotDivider } from '@features/lands/styles/landPlot.styles';
import {
  LandPlotEnhancementsBlock,
  LandPlotNewIconWrapper,
  LandPlotNewImageWrapper,
  LandPlotNewName,
  LandPlotNewRemove,
  LandPlotOuterWrapper,
  LandPlotTitleLine
} from '@features/lands/styles/landPlotNew.styles';
import { getClnySpeedLabel } from '@features/lands/utils/formating';
import { navigateToGlobeLand } from '@features/lands/utils/globusNavigation';
import Button from '@global/components/button';
import { Loader } from '@global/components/loader/loader';
import { GAP_TEXT, LINKS, MOBILE_BREAKPOINT } from '@global/constants';
import useAppParts from '@global/hooks/useAppParts';
import { useBalance } from '@global/hooks/useBalance';
import useFlags from '@global/hooks/useFlags';
import useMediaQuery from '@global/hooks/useMediaQuery';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { MarsNavMyLandClose, TokensWrapper } from '@global/styles/app.styles';
import { generateBlockie } from '@global/utils/blockie.canvas';
import { fromWeiValue } from '@global/utils/fromWei';
import { ArrowLeft, ArrowRight } from '@images/icons/ArrowDown';
import { CloseIcon } from '@images/icons/CloseIcon';
import { LandPinIcon } from '@images/icons/LandPinIcon';
import { CartCloseIconWrapper } from '@root/legacy/navbar.styles';
import { NETWORK_DATA } from '@root/settings';
import { setLandPageNumber, toggleMyLandPopup } from '@slices/appPartsSlice';
import { deleteItemFromChart, toggleCartSidebar } from '@slices/cartSlice';
import { StatsBar } from '@features/global/components/statsBar';

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
  ButtonNoLandsSubText
} from './landsSidebar.styles';

export const LandsSidebar = () => {
  const dispatch = useDispatch();
  const { isLandsSidebarOpened: sidebarType } = useAppParts();
  const { tokens } = useBalance();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  const getContent = () => {
    if (sidebarType === 'cart') {
      return <CartList />;
    }
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
            dispatch(toggleMyLandPopup(null));
            // Timeout as duration of animation frames
            setTimeout(() => dispatch(toggleCartSidebar(false)), 300);
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
  const { isHarmonyChains } = useFlags();
  const { isInitialized } = usePersonalInfo();
  const [maxClnyIncome, setMaxClnyIncome] = useState<string | null>(null);

  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const onBuyLandClick = () => {
    if (isHarmonyChains) {
      return window.open(LINKS.harmony.nftKey, '_blank');
    } else {
      addToast('You can buy new lands on the globe', { appearance: 'info' });
    }
  };

  useEffect(() => {
    if (isHarmonyChains) return;
    try {
      (async () => {
        const data = await PolygonBackend.getHeaderStats();
        const stat = data.max ?? 0;
        setMaxClnyIncome(stat);
      })();
    } catch (e) {}
  }, []);

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
        const stats = await PolygonBackend.getLandStats();
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
            <PrizeSpan>
              <LearnMoreLink
                href="https://zerocolony.notion.site/SPACE-RACE-A-Social-Experiment-1acd49cbead98046b271ea87fc98bea2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </LearnMoreLink>
            </PrizeSpan>
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
  const [prizeStats, setPrizeStats] = useState({ prizeEth: 0, prizeUsd: 0 });

  useEffect(() => {
    const fetchPrizeStats = async () => {
      try {
        const stats = await PolygonBackend.getLandStats();
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

  const { address, web3Instance } = usePersonalInfo();
  const { isRevShareAvailable, isFixedEconomy } = useFlags();
  const { currentLandsPage } = useAppParts();
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
        return isFixedEconomy
          ? getClnySpeedLabel(dailySpeed)
          : `${dailySpeed} ${dailySpeed === 1 ? 'share' : 'shares'}`;
      } else return GAP_TEXT;
    };

    return `${earned} | ${speed()}`;
  }, [earnedAmount, dailySpeed]);

  return (
    <div>
      <LandsSidebarHeaderWrapper isMobile={isMobile}>
        <SocialIconsBar />
        <StatsBar />
        <LandsContentWrapper>
          <LandsSection>
            <SpanWrapper>
              <LandsSpan>
                <ActiveLandsFirstLine withRevshare={isRevShareAvailable}>
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
                <ButtonSubText withRevshare={isRevShareAvailable}>
                  {allTimeStats}
                </ButtonSubText>
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
              <PrizeSpan>
                <LearnMoreLink
                  href="https://zerocolony.notion.site/SPACE-RACE-A-Social-Experiment-1acd49cbead98046b271ea87fc98bea2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </LearnMoreLink>
              </PrizeSpan>
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

const CartList = () => {
  const dispatch = useDispatch();
  const { cartItems } = useAppParts();

  const onMapSearch = (event: any, id: number) => {
    navigateToGlobeLand(event, id);
  };

  const onCartItemRemove = (id: string) => {
    freeReserve(+id).catch(() => {});
    dispatch(deleteItemFromChart(id));
  };

  return (
    <div>
      <CartContent itemsCount={cartItems.length ?? 0} />
      <div>
        {cartItems.map((id, idx) => (
          <LandPlotOuterWrapper key={`${id}-${idx}`}>
            <LandPlotNewImageWrapper>
              <img
                src={generateBlockie(parseInt(id)).toDataURL()}
                alt={'Land Plot #' + id.toString()}
              />
            </LandPlotNewImageWrapper>
            <LandPlotEnhancementsBlock>
              <LandPlotTitleLine>
                <LandPlotNewName>Land #{id}&nbsp;</LandPlotNewName>
              </LandPlotTitleLine>
            </LandPlotEnhancementsBlock>
            <LandPlotNewIconWrapper>
              <div onClick={(e) => onMapSearch(e, parseInt(id))}>
                <LandPinIcon className="with-fill" />
              </div>
            </LandPlotNewIconWrapper>
            <LandPlotNewRemove onClick={() => onCartItemRemove(id)}>
              REMOVE
            </LandPlotNewRemove>
          </LandPlotOuterWrapper>
        ))}
      </div>
    </div>
  );
};
