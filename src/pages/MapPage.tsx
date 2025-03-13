import { LandsSidebar } from '@features/lands/components/landsSidebar';
import { useBalance } from '@global/hooks/useBalance';
import { CURRENT_CHAIN } from '@root/settings/chains';

function MapPage() {
  const { tokens, allMintedTokens, claimToken, userBalance } = useBalance();

  return (
    <div className="wrapper">
      <LandsSidebar />

      <PartedMars
        allTokens={allMintedTokens}
        myTokens={tokens}
        height="100vh"
        handleClaim={claimToken}
        balance={userBalance}
        currency={CURRENT_CHAIN.ticker}
      />
    </div>
  );
}

export default MapPage;
