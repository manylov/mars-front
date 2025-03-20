import React, { useMemo } from 'react';
import { KEY_OBJECTS } from '@features/game/constants/gameObjects';
import { GameLandPlot } from '@features/lands/components/gameLand/GameLandPlot';
import { OLD_NEW, PRICES } from '@features/lands/constants';
import { EnhancementsListWrapper } from '@features/lands/styles/landPlot.styles';
import useGameManagement from '@global/hooks/useGameManagement';
import useLandStats from '@global/hooks/useLandStats';
import useMediaQuery from '@global/hooks/useMediaQuery';
import { BaseStationIcon } from '@images/icons/BaseStationIcon';
import { Power } from '@images/icons/Power';
import { RobotAssembly } from '@images/icons/RobotAssembly';
import { Transport } from '@images/icons/Transport';
import { Enhancement } from '@root/legacy/enhancement/Enhancement';

type Props = {
  id: number;
  CLNYBalanceWei: number | bigint;
  trigger: boolean;
  isDefaultOpen?: boolean;
  missionsLimit?: number | string;
};

export const LandPlot: React.FC<Props> = ({ id, CLNYBalanceWei, trigger }) => {
  const isMobile = useMediaQuery('(max-width: 1200px)');

  const {
    earned,
    earningSpeed,
    hasBaseStation,
    isInitialLoad,
    isBuyProcess,
    build,
    powerProductionLevel,
    robotAssemblyLevel,
    transportLevel,
    updateEarned,
  } = useLandStats(id);

  const {
    isBaseAvailable,
    isBasePlaced,
    isTransportAvailable,
    isRobotAvailable,
    isTransportPlaced,
    isPowerplantPlaced,
    isPowerplantAvailable,
    isRobotPlaced,
    isBuildPending,
  } = useGameManagement();

  React.useEffect(() => {
    if (trigger) return;
    updateEarned().then(() => {});
  }, [trigger]);

  const enhancementsItemsList = useMemo(
    () => (
      <EnhancementsListWrapper isMobileView={isMobile}>
        <Enhancement
          isInitialLoad={isInitialLoad}
          Image={BaseStationIcon}
          title="Electricity"
          speed={hasBaseStation ? 1 : undefined}
          finalText={hasBaseStation ? 'Claimed' : undefined}
          getWhat=""
          price={30}
          oldNew={
            !hasBaseStation
              ? [0, 1]
              : [1, 1] /* if has BS -> no level upping then */
          }
          handler={() => build.base()}
          CLNYBalanceWei={CLNYBalanceWei}
          isAvailable={isBaseAvailable}
          isPlaced={isBasePlaced}
          isActive={hasBaseStation}
          level={hasBaseStation ? 1 : 0}
          levelsCount={1}
          isMobileView={isMobile}
          isPending={
            isBuildPending === KEY_OBJECTS.base ||
            isBuyProcess === KEY_OBJECTS.base
          }
        />
        <Enhancement
          isInitialLoad={isInitialLoad}
          Image={RobotAssembly}
          title="Data Centre"
          aux={`lvl${robotAssemblyLevel}/3`}
          speed={robotAssemblyLevel ? robotAssemblyLevel + 1 : undefined}
          finalText={robotAssemblyLevel === 3 ? 'Max LVL' : undefined}
          getWhat={`LVL ${robotAssemblyLevel + 1}`}
          price={PRICES[robotAssemblyLevel + 1]}
          oldNew={OLD_NEW[robotAssemblyLevel] as [number, number] | undefined}
          handler={() => build.robots(robotAssemblyLevel + 1)}
          CLNYBalanceWei={CLNYBalanceWei}
          isAvailable={isRobotAvailable}
          isPlaced={isRobotPlaced}
          isActive={Boolean(robotAssemblyLevel && robotAssemblyLevel > 0)}
          level={robotAssemblyLevel}
          levelsCount={3}
          isMobileView={isMobile}
          isPending={
            isBuildPending === KEY_OBJECTS.robot ||
            isBuyProcess === KEY_OBJECTS.robot
          }
        />
        <Enhancement
          isInitialLoad={isInitialLoad}
          Image={Transport}
          title="Blockchain Node"
          aux={`lvl${transportLevel}/3`}
          speed={transportLevel ? transportLevel + 1 : undefined}
          finalText={transportLevel === 3 ? 'Max LVL' : undefined}
          getWhat={`LVL ${transportLevel + 1}`}
          price={PRICES[transportLevel + 1]}
          oldNew={OLD_NEW[transportLevel] as [number, number] | undefined}
          handler={() => build.transport(transportLevel + 1)}
          CLNYBalanceWei={CLNYBalanceWei}
          isAvailable={isTransportAvailable}
          isPlaced={isTransportPlaced}
          isActive={Boolean(transportLevel && transportLevel > 0)}
          level={transportLevel}
          levelsCount={3}
          isMobileView={isMobile}
          isPending={
            isBuildPending === KEY_OBJECTS.transport ||
            isBuyProcess === KEY_OBJECTS.transport
          }
        />
        <Enhancement
          isInitialLoad={isInitialLoad}
          Image={Power}
          title="AI Lab"
          aux={`lvl${powerProductionLevel}/3`}
          speed={powerProductionLevel ? powerProductionLevel + 1 : undefined}
          finalText={powerProductionLevel === 3 ? 'Max LVL' : undefined}
          getWhat={`LVL ${powerProductionLevel + 1}`}
          price={PRICES[powerProductionLevel + 1]}
          oldNew={OLD_NEW[powerProductionLevel] as [number, number] | undefined}
          handler={() => build.power(powerProductionLevel + 1)}
          CLNYBalanceWei={CLNYBalanceWei}
          isAvailable={isPowerplantAvailable}
          isPlaced={isPowerplantPlaced}
          isActive={Boolean(powerProductionLevel && powerProductionLevel > 0)}
          levelsCount={3}
          level={powerProductionLevel}
          isMobileView={isMobile}
          isPending={
            isBuildPending === KEY_OBJECTS.power ||
            isBuyProcess === KEY_OBJECTS.power
          }
        />
      </EnhancementsListWrapper>
    ),
    [
      isInitialLoad,
      isBuyProcess,
      hasBaseStation,
      robotAssemblyLevel,
      transportLevel,
      powerProductionLevel,
      isBaseAvailable,
      isBasePlaced,
      isTransportAvailable,
      isRobotAvailable,
      isTransportPlaced,
      isPowerplantPlaced,
      isPowerplantAvailable,
      isRobotPlaced,
      CLNYBalanceWei,
      isMobile,
      isBuildPending,
    ]
  );

  return (
    <GameLandPlot
      id={id}
      earningSpeed={earningSpeed}
      earned={earned}
      enhancements={enhancementsItemsList}
    />
  );
};
