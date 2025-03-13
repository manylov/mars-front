import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '@redux/selectors/commonAppSelectors';
import {
  setCLNYManager,
  setGameManager,
  setMCManager,
  setReplaceManager
} from '@redux/slices/commonAppStateSlice';
import Ethereum from '@root/api/etheriumWeb3';

const {
  clnyManagerSelector,
  replaceManagerSelector,
  mcManagerSelector,
  userGameManagerSelector
} = selectors;

const useContracts = () => {
  const dispatch = useDispatch();

  const gameManager = useSelector(userGameManagerSelector) ?? window.GM;
  const replaceManager = useSelector(replaceManagerSelector) ?? window.RM;
  const mcManager = useSelector(mcManagerSelector) ?? window.MCM;
  const clnyManager = useSelector(clnyManagerSelector) ?? window.CLNYM;

  const initializeContracts = () => {
    getGameManager();
    getReplaceManager();
  };

  const getMCManager = React.useCallback(() => {
    const mc = Ethereum.getMC();
    dispatch(setMCManager(mc));
    return mc;
  }, []);

  const getCLNYManager = React.useCallback(() => {
    const clny = Ethereum.getCLNYManager();
    dispatch(setCLNYManager(clny));
    return clny;
  }, []);

  const getGameManager = React.useCallback(() => {
    const gm = Ethereum.getGameManager();
    dispatch(setGameManager(gm));
    return gm;
  }, [dispatch]);

  const getReplaceManager = React.useCallback(() => {
    const rm = Ethereum.getReplaceManager();
    dispatch(setReplaceManager(rm));
    return rm;
  }, [dispatch]);

  return {
    initializeContracts,
    gameManager,
    clnyManager,
    mcManager,
    replaceManager,
    getCLNYManager,
    getGameManager,
    getMCManager
  };
};

export default useContracts;
