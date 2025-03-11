import { useEffect, useState } from 'react';
import { CommonModal } from '@global/components/commonModal';
import PolygonBackend from '@api/polygonBackend';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { Loader } from '@global/components/loader/loader';
import { CloseIcon } from '@images/icons/CloseIcon';
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
          const data = await PolygonBackend.getLeaderboard(address);
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
                  <LeaderboardRank>#{index + 1}</LeaderboardRank>
                  <LeaderboardAddress>
                    {shortenAddress(item.address)}
                  </LeaderboardAddress>
                  <LeaderboardAmount>
                    {item.amount.toFixed(2)} CLNY
                  </LeaderboardAmount>
                </LeaderboardItem>
              ))}
            </LeaderboardList>
          </>
        )}
      </LeaderboardWrapper>
    </CommonModal>
  );
};
