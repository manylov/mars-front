import { useQuery } from '@tanstack/react-query';
import Ethereum from '@root/api/etheriumWeb3';
import Backend from '@root/backend';
import { useAccount } from 'wagmi';

export const useAllLands = () => {
  const {
    data: allLands,
    isLoading: isAllLandsLoading,
    refetch: refetchAllLands,
  } = useQuery({
    queryKey: ['allTokens'],
    queryFn: () => Ethereum.getTokens(),
  });

  return {
    allTokens: allLands,
    isAllTokensLoading: isAllLandsLoading,
    refetchAllTokens: refetchAllLands,
  };
};

export const useLeaderboard = () => {
  const { address } = useAccount();

  const { data: leaderboard, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => {
      return Backend.getLeaderboard(address as string);
    },
    enabled: !!address,
  });

  return { leaderboard, isLeaderboardLoading };
};
