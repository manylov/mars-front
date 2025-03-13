import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectionZone } from '@features/global/components/connectionZone/connectionZone';
import {
  ConnectionZoneWrapper,
  LayoutWrapper
} from '@global/components/layout/layout.styles';
import Sidebar from '@global/components/sidebar';
import { MOBILE_BREAKPOINT } from '@global/constants';
import usePersonalInfo from '@global/hooks/usePersonalInfo';

import useResizeObserver from 'use-resize-observer';

const Layout: FC = ({ children }) => {
  const { address, connect } = usePersonalInfo();
  const { ref: wrapperRef, width: containerWidth } = useResizeObserver();

  const isMobile = (containerWidth ?? 0) < MOBILE_BREAKPOINT;

  return (
    <LayoutWrapper ref={wrapperRef}>
      <ConnectionZoneWrapper>
        <ConnectionZone address={address} onConnect={connect} />
      </ConnectionZoneWrapper>
      <Sidebar isMobile={isMobile} />
      {children}
    </LayoutWrapper>
  );
};

export default Layout;
