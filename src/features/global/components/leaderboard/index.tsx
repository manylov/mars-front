import { useEffect, useState } from 'react';
import { CommonModal } from '@global/components/commonModal';
import Backend from '@root/api/backend';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { Loader } from '@global/components/loader/loader';
import { CloseIcon } from '@images/icons/CloseIcon';
import { ExternalLinkIcon } from '@images/icons/ExternalLinkIcon';
import { MOBILE_BREAKPOINT } from '@global/constants';
import {
  LeaderboardWrapper,
  LeaderboardTitle,
  LeaderboardPlace,
  LeaderboardList,
  LeaderboardItem,
  LeaderboardRank,
  LeaderboardAddress,
  LeaderboardAmount,
  LeaderboardCloseButton
} from './leaderboard.styles';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaderboardData {
  top100: Array<{ address: string; amount: number; updatedAt: string }>;
  place: number;
}

const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 7)}...${address.slice(-4)}`;
};

export const Leaderboard = ({ isOpen, onClose }: LeaderboardProps) => {
  const { address } = usePersonalInfo();
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (isOpen && address) {
        setLoading(true);
        try {
          const data = await Backend.getLeaderboard(address);
          setLeaderboardData(data as LeaderboardData);
        } catch (error) {
          console.error('Failed to fetch leaderboard:', error);
          setLeaderboardData(null);
        }
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [isOpen, address]);

  if (!isOpen) return null;

  return (
    <CommonModal
      onClose={onClose}
      width="auto"
      isCloseButton={false}
      mobileBreakpoint={MOBILE_BREAKPOINT}
    >
      <LeaderboardWrapper>
        <LeaderboardCloseButton onClick={onClose}>
          <CloseIcon />
        </LeaderboardCloseButton>
        <LeaderboardTitle>Leaderboard</LeaderboardTitle>
        {loading ? (
          <Loader />
        ) : (
          <>
            {leaderboardData?.place && (
              <LeaderboardPlace>
                Your place is #{leaderboardData.place}
              </LeaderboardPlace>
            )}
            <LeaderboardList>
              {leaderboardData?.top100.map((item, index) => (
                <LeaderboardItem
                  key={item.address}
                  isCurrentUser={item.address === address}
                >
                  <a
                    href={`https://app.zerion.io/${item.address}/overview`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <LeaderboardRank>#{index + 1}</LeaderboardRank>
                    <LeaderboardAddress>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {shortenAddress(item.address)}
                        </div>
                        <div
                          style={{
                            opacity: 0.7,
                            scale: 0.6,
                            width: '20px',
                            height: '20px'
                          }}
                        >
                          <ExternalLinkIcon />
                        </div>
                      </div>
                    </LeaderboardAddress>
                    <LeaderboardAmount>
                      {item.amount.toFixed(2)} CLNY
                    </LeaderboardAmount>
                  </a>
                </LeaderboardItem>
              ))}
            </LeaderboardList>
          </>
        )}
      </LeaderboardWrapper>
    </CommonModal>
  );
};
