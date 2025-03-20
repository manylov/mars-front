import { useAllTokens } from '@features/global/hooks/useApi';
import {
  useClaimToken,
  useEthBalance,
  useMyTokens,
} from '@features/global/hooks/useCallContracts';
import { PartedMars } from '@features/globus/components/partedMars/PartedMars';
import { LandsSidebar } from '@features/lands/components/landsSidebar';
import { CURRENT_CHAIN } from '@root/settings/chains';

function MapPage() {
  const { claimToken } = useClaimToken();
  const { allTokens, isAllTokensLoading } = useAllTokens();

  const { ethBalanceWei, isEthBalanceLoading } = useEthBalance();
  const { myTokens } = useMyTokens();

  console.log(myTokens);

  if (isAllTokensLoading || isEthBalanceLoading) return <div>Loading...</div>;

  return (
    <div className="wrapper">
      <LandsSidebar />

      <PartedMars
        allTokens={allTokens || []}
        myTokens={myTokens || []}
        height="100vh"
        handleClaim={() => {}}
        balance={ethBalanceWei || 0}
        currency={CURRENT_CHAIN.ticker}
      />
    </div>
  );
}

export default MapPage;
