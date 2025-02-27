import { polygonGas } from '@root/settings/gas';

export const contracts: Record<
  string,
  {
    CHAIN: string;
    TOKEN_NAME: string;
    ID: number;
    RPC: string;
    MC: string;
    CLNY: string;
    GM: string;
    AM: string;
    MM: string;
    LB: string;
    CH: string;
    ORACLE: string;
    REPLACE: string;
    MINING_POOLS: Array<{
      contract: string;
      statsContract: string;
      lpTokenContract: string;
      lpTicker: string;
      dex: string;
      pair: string;
      imgKey: string;
      multiplier?: number;
    }>;
    BACKEND: string;
    LAND_META: string;
    LAND_META_SERVER: string;
    AVATAR_META: string;
    AVATAR_MINTING: boolean;
    SOLDOUT: boolean;
    LIQUIDITY_MINING: boolean;
    GLOBE: 'arcgis' | 'openglobus';
    ECONOMY: 'fixed' | 'shares';
    DEFAULT_ACCOUNT_STATE: 'lands' | 'cart' | null;
    AVATARS: boolean;
    MISSIONS: boolean;
    DEX: boolean;
    TWITTER: boolean;
    PROFILE: boolean;
    LOOTBOXES: boolean;
    LOOTBOXES_AVAILABLE: boolean;
    MISSIONS_POPUP: boolean;
    CRYOCHAMBERS: boolean;
    REF_PAGE: boolean;
    IS_SIDEBAR_UPDATE: boolean;
    REVSHARE: boolean;
    UI_DESIGN_VARIANT: 'Polygon' | 'Harmony';
    IS_HARMONY_TEST_METRICS: boolean;
    IS_CART_FUNC: boolean;
    SALE_BANNER: boolean;
    MAP_TYPE: 'Polygon' | 'Harmony';
    STATS_HEADER: boolean;
    IN_GAME_LAND: boolean;
    MINT_PRICE: number;
    GAS_FUNC?: () => void;
    CRYO_GAS_PRICE?: number;
    LOOTBOXES_META_LINK: string;
    GEARS: string;
    LOOTBOX_OPEN_PRICE: Record<string, number>;
    GEAR_META_LINK: string;
    CHAMBER_PRICE: number;
    TRANSPORT_REPAIR_PRICE: {
      25: number;
      50: number;
      100: number;
    };
  }
> = {
  'zero-testnet': {
    CHAIN: 'Zero Testnet',
    TOKEN_NAME: 'CLNY',
    ID: 4457845,
    RPC: 'https://rpc.zerion.io/v1/zero-sepolia',
    MC: '0x1DFdfF98e9A46AF0a9F99c32655023bA679473B4',
    CLNY: '0xbEC8B717e5C20A68B1Db0BcEdC99e7423995dd1E',
    GM: '0xCDA72A6770E58FE26Fb26577Aee101749b22F0F1',
    AM: '0x1C525A371dBe6De99FB52D1ec57431Ad6630d870', // collection manager
    MM: '0x09c73e79d088E995845C2f48ab9eFc47795f4092', // martian colonists
    LB: '0x249FDFf95790af025710BA27088B6081966e6b67',
    CH: '0x3c5CC652Ab145bb1D14f32AD8556111EaAB87C7a', // cryo chamber
    REPLACE: '0x3a98C9764d5097a99597088713bb45Cb935d9345',
    MINING_POOLS: [],
    BACKEND: 'https://backend-harmony.marscolony.io',
    LAND_META: 'https://meta.zerocolony.fun/tokens',
    LAND_META_SERVER: 'https://meta.zerocolony.fun/',
    AVATAR_META: 'https://meta.zerocolony.fun/',
    AVATAR_MINTING: false,
    SOLDOUT: false,
    LIQUIDITY_MINING: false,
    GLOBE: 'arcgis',
    ECONOMY: 'fixed',
    DEFAULT_ACCOUNT_STATE: 'lands',
    AVATARS: false,
    MISSIONS: false,
    DEX: true,
    TWITTER: false,
    PROFILE: false,
    LOOTBOXES: false,
    LOOTBOXES_AVAILABLE: false,
    MISSIONS_POPUP: false,
    CRYOCHAMBERS: false,
    REF_PAGE: false,
    REVSHARE: false,
    IS_SIDEBAR_UPDATE: false,
    UI_DESIGN_VARIANT: 'Harmony',
    IS_HARMONY_TEST_METRICS: false,
    IS_CART_FUNC: false,
    SALE_BANNER: true,
    MAP_TYPE: 'Harmony',
    STATS_HEADER: true,
    IN_GAME_LAND: true,
    MINT_PRICE: 30,
    CRYO_GAS_PRICE: 10,
    LOOTBOXES_META_LINK: 'https://lootboxes-harmony.marscolony.io',
    GEARS: '0xc909dbAFf39b0DfD35F398459335aD98B7A0f3AE',
    LOOTBOX_OPEN_PRICE: { '0': 2, '1': 4, '2': 8 },
    GEAR_META_LINK: 'https://gears-harmony.marscolony.io',
    ORACLE: '',
    CHAMBER_PRICE: 120,
    TRANSPORT_REPAIR_PRICE: {
      '25': 1.5,
      '50': 2,
      '100': 4
    }
  },
  zero: {
    CHAIN: 'Zero',
    TOKEN_NAME: 'CLNY',
    ID: 543210,
    RPC: 'https://zero-network.calderachain.xyz/http',
    MC: '0x13a42408eaa5526c5e7796828C7ea244009e2439',
    CLNY: '0x1A90DD3Dd89E2D2095ED1B40eCC1fe2BbB7614a1',
    GM: '0x00b1cA2C150920F4cA57701452c63B1bA2b4b758',
    AM: '0xA3d09B55649215707121200c1f6f2bdb9163D7A5',
    MM: '0xe1985Cd355B0aa74aFCBD28394F790e486219D3d',
    LB: '0x9F8C13b096ba448B6Fd0294252353E4f86Ae5570',
    CH: '0xb61147D2c21Da8f1a4Be658157eF5545268D3497',
    REPLACE: '0x93edc8c562365cD72401FfF3b9DC996c249649F9',
    MINING_POOLS: [],
    BACKEND: 'https://backend-harmony.marscolony.io',
    LAND_META: 'https://meta.zerocolony.fun/tokens',
    LAND_META_SERVER: 'https://meta.zerocolony.fun/',
    AVATAR_META: 'https://meta.zerocolony.fun/',
    AVATAR_MINTING: false,
    SOLDOUT: false,
    LIQUIDITY_MINING: false,
    GLOBE: 'arcgis',
    ECONOMY: 'fixed',
    DEFAULT_ACCOUNT_STATE: 'lands',
    AVATARS: false,
    MISSIONS: false,
    DEX: true,
    TWITTER: false,
    PROFILE: false,
    LOOTBOXES: false,
    LOOTBOXES_AVAILABLE: false,
    MISSIONS_POPUP: false,
    CRYOCHAMBERS: false,
    REF_PAGE: false,
    REVSHARE: false,
    IS_SIDEBAR_UPDATE: false,
    UI_DESIGN_VARIANT: 'Harmony',
    IS_HARMONY_TEST_METRICS: false,
    IS_CART_FUNC: false,
    SALE_BANNER: true,
    MAP_TYPE: 'Harmony',
    STATS_HEADER: true,
    IN_GAME_LAND: true,
    MINT_PRICE: 30,
    CRYO_GAS_PRICE: 10,
    LOOTBOXES_META_LINK: 'https://lootboxes-harmony.marscolony.io',
    GEARS: '0x11c84f5Dd5D55b6680409f217Dca6c6D41Bd66C6',
    LOOTBOX_OPEN_PRICE: { '0': 2, '1': 4, '2': 8 },
    GEAR_META_LINK: 'https://gears-harmony.marscolony.io',
    ORACLE: '',
    CHAMBER_PRICE: 120,
    TRANSPORT_REPAIR_PRICE: {
      '25': 1.5,
      '50': 2,
      '100': 4
    }
  }
};

const current_network = process.env.REACT_APP_NETWORK;

export const NETWORK_DATA = contracts[current_network ?? ''];
