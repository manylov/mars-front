import { useQuery } from '@tanstack/react-query';
import Ethereum from '@root/api/etheriumWeb3';
import Backend from '@root/backend';
import { useAccount } from 'wagmi';

export const useAllTokens = () => {
  const {
    data: allTokens,
    isLoading: isAllTokensLoading,
    refetch: refetchAllTokens,
  } = useQuery({
    queryKey: ['allTokens'],
    queryFn: () => Ethereum.getTokens(),
  });

  return { allTokens, isAllTokensLoading, refetchAllTokens };
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
