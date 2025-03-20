import {
  CLNY_CONTRACT,
  GAME_MANAGER_CONTRACT,
  MC_CONTRACT,
} from '@root/contracts';
import { useMemo } from 'react';
import { formatEther } from 'viem';

import { readContract } from '@wagmi/core';

import { wagmiConfig } from '@root/settings/wagmi';
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from 'wagmi';

export const useCLNYBalance = () => {
  const { address } = useAccount();

  const { data: clnyBalanceWei, refetch: refetchCLNYBalance } = useReadContract(
    {
      ...CLNY_CONTRACT,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    }
  );

  const clnyBalance = useMemo(() => {
    if (!clnyBalanceWei) return undefined;
    return Number(formatEther(clnyBalanceWei)).toFixed(2);
  }, [clnyBalanceWei]);

  return { clnyBalanceWei, clnyBalance, refetchCLNYBalance };
};

export const useEthBalance = () => {
  const { address } = useAccount();
  const {
    data: ethBalanceWei,
    isLoading: isEthBalanceLoading,
    refetch: refetchEthBalance,
  } = useBalance({
    address,
  });

  const ethBalance = useMemo(() => {
    if (!ethBalanceWei) return undefined;
    return Number(formatEther(ethBalanceWei.value)).toFixed(3);
  }, [ethBalanceWei]);

  return {
    ethBalance,
    ethBalanceWei: ethBalanceWei?.value,
    refetchEthBalance,
    isEthBalanceLoading,
  };
};

export const useMyTokens = () => {
  const { address } = useAccount();

  const {
    data: myTokens,
    refetch: refetchMyTokens,
    isLoading: isLoadingMyTokens,
    error: errorMyTokens,
  } = useReadContract({
    ...MC_CONTRACT,
    functionName: 'allMyTokens',
    account: address as `0x${string}`,
    query: {
      select: (data) => {
        if (!data) return [];
        return data.map((token) => token.toString());
      },
    },
  });

  const hasNoTokens = useMemo(() => {
    return myTokens?.length === 0 || (!myTokens && !isLoadingMyTokens);
  }, [myTokens, isLoadingMyTokens]);

  return {
    myTokens,
    refetchMyTokens,
    isLoadingMyTokens,
    hasNoTokens,
    errorMyTokens,
  };
};

export const useClaimToken = () => {
  const { writeContractAsync } = useWriteContract();

  const claimToken = async (tokenNumbers: number[]) => {
    const feeValue = await readContract(wagmiConfig, {
      ...GAME_MANAGER_CONTRACT,
      functionName: 'getFee',
      args: [BigInt(tokenNumbers.length)],
    });

    const tx = await writeContractAsync({
      ...GAME_MANAGER_CONTRACT,
      functionName: 'claim',
      args: [tokenNumbers.map((token) => BigInt(token))],
    });

    console.log(tx);
  };

  return { claimToken };
};
// const claimToken = React.useCallback(
//   async (tokenNumbers: number[], address: string, web3Instance: Web3) => {
//     for (const tokenNumber of tokenNumbers) {
//       if (Number.isNaN(tokenNumber)) return;
//       const tokenId: string = tokenNumber.toString();
//       if (tokenId === null) return;
//     }

//     let txHash: string | null = null;

//     const feeValue = await makeRequest({
//       method: CONTRACT_METHODS.getFee,
//       params: [tokenNumbers.length],
//       address,
//       type: METAMASK_EVENTS.call,
//       contract: gameManager ?? getGameManager(),
//     });

//     makeRequest({
//       type: METAMASK_EVENTS.send,
//       method: CONTRACT_METHODS.claim,
//       contract: gameManager ?? getGameManager(),
//       params: [tokenNumbers],
//       onLoad: (hash: string) => {
//         txHash = hash;

//         window.view?.popup?.close?.();
//         window.ogPopup?.setVisibility?.(false);
//         fetchUserBalance(address, web3Instance);
//       },
//       onSuccess: () => {
//         fetchUserBalance(address, web3Instance);

//         if (tokens !== null) dispatch(setUserTokens([tokenNumbers.toString()]));
//         if (allMintedTokens !== null)
//           dispatch(setMintedTokens(tokenNumbers.toString()));

//         // @ts-ignore
//         window.openLinksPopup();
//       },
//       onError: () => {},
//       transactionOptions: {
//         value: feeValue,
//         type: CURRENT_CHAIN.x2,
//       },
//       address,
//       eventName: METHODS_LABELS.landClaim,
//     });
//   },
//   [gameManager, tokens, allMintedTokens, dispatch]
// );

export const useUpdateEarnedAll = () => {
  const { myTokens } = useMyTokens();

  const {
    data,
    isLoading: isLoadingEarnedAmount,
    refetch: refetchEarnedAmount,
    error: errorEarnedAmount,
  } = useReadContract({
    ...GAME_MANAGER_CONTRACT,
    functionName: 'getEarningData',
    args: [myTokens?.map((token) => BigInt(token)) ?? []],
    query: {
      enabled: !!myTokens,
    },
  });

  const earnedAmountWei = useMemo(() => {
    if (!data) return undefined;
    return data[0];
  }, [data]);

  const earnedAmount = useMemo(() => {
    if (!earnedAmountWei) return undefined;
    return Number(formatEther(earnedAmountWei)).toFixed(2);
  }, [earnedAmountWei]);

  const earnSpeed = useMemo(() => {
    if (!data) return undefined;
    return data[1];
  }, [data]);

  return {
    earnedAmountWei,
    earnedAmount,
    earnSpeed,
    isLoadingEarnedAmount,
    errorEarnedAmount,
    refetchEarnedAmount,
  };
};
/*
  const updateEarnedAll = React.useCallback(async () => {
    if (!gameManager) return;
    const allTokens = Array.from(plotTokens ?? []).flat();

    let bunch: string[] = [];
    let earnedAmount = 0;
    let earnSpeed = 0;
    for (let i = 0; i < allTokens.length; i++) {
      bunch.push(allTokens[i]);
      if (bunch.length >= 50 || i === allTokens.length - 1) {
        await makeRequest({
          type: METAMASK_EVENTS.call,
          address: userAddress,
          method: CONTRACT_METHODS.getEarningData,
          params: [bunch],
          contract: gameManager,
          // eslint-disable-next-line no-loop-func
          onSuccess: (earningData) => {
            if (earningData) {
              const { '0': earned, '1': speed } = earningData;
              earnedAmount = earnedAmount + parseInt(earned) * 1e-18;
              earnSpeed = earnSpeed + parseInt(speed);
            }
          },
        });
        bunch = [];
      }
    }
    dispatch(setEarnedAmount(earnedAmount));
    dispatch(setEarnSpeed(earnSpeed));
  }, [plotTokens, dispatch, gameManager]);
*/
