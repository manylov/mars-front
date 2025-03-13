import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@global/components/button';
import { LINKS } from '@global/constants';
import useFlags from '@global/hooks/useFlags';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { LinkIcon } from '@images/icons/LinkIcon';

import {
  WelcomeModalButtonsBlock,
  WelcomeModalTitleBlock,
  WelcomeModalWrapper,
  WelcomeScreenMainWrapper
} from './mainScreen.styles';

export const MainScreen = () => {
  const navigate = useNavigate();
  const { address } = usePersonalInfo();
  const openLink = (link: string) => window.open(link, '_blank');
  const { isHarmonyChains, isMissionsAvailable } = useFlags();

  const chainKey = useMemo(() => {
    if (isHarmonyChains) return 'harmony';
    return 'polygon';
  }, [isHarmonyChains]);

  const onBuyPlotLClick = () => {
    if (isHarmonyChains) openLink(LINKS.harmony.lands);
    else navigate('/lands');
  };

  return (
    <WelcomeScreenMainWrapper id="mainScreen">
      <WelcomeModalWrapper>
        <WelcomeModalTitleBlock>
          <p>Welcome to Zero Colony</p>
          <p>
            What is Zero Colony{' '}
            <LinkIcon
              onClick={() => {
                openLink(LINKS[chainKey].colonyGuide);
              }}
            />
          </p>
        </WelcomeModalTitleBlock>
        <WelcomeModalButtonsBlock>
          <Button onClick={onBuyPlotLClick} text="BUY A PLOT" variant="ghost" />
          <Button
            disabled={!isMissionsAvailable}
            onClick={() => {
              navigate('/play/0');
            }}
            text={
              isMissionsAvailable ? 'CREATE AI AGENT' : 'CREATE AI AGENT (Soon)'
            }
            variant="common"
            disabledText="CREATE AI AGENT (Soon)"
          />
        </WelcomeModalButtonsBlock>
      </WelcomeModalWrapper>
    </WelcomeScreenMainWrapper>
  );
};
