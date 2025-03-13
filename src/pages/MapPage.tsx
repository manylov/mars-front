import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PartedMars } from '@features/globus/components/partedMars/PartedMars';
import { LandsSidebar } from '@features/lands/components/landsSidebar';
import { useBalance } from '@global/hooks/useBalance';
import { CURRENT_CHAIN } from '@root/settings/chains';
import mixpanel from 'mixpanel-browser';

function MapPage() {
  const [search] = useSearchParams();
  const { tokens, allMintedTokens, claimToken, userBalance } = useBalance();

  useEffect(() => {
    mixpanel.track('Page visited', { pageName: 'Globe Page' });
    const pixel = search.get('pixel');
    const utmSource = search.get('utm_source');
    if (pixel) {
      localStorage.setItem('fb-pixel', pixel);
    }
    if (utmSource) {
      localStorage.setItem('utm_source', utmSource);
    }
  }, []);

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
