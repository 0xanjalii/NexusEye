import axios from 'axios';

const API_KEY = import.meta.env.VITE_BIRDEYE_API_KEY;
const BASE_URL = 'https://public-api.birdeye.so';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-KEY': API_KEY,
    'x-chain': 'solana',
  },
});

const MOCK_TOKENS = [
  { address: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', price: 145.2, v24hChangePercent: 5.4, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png' },
  { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', symbol: 'BONK', name: 'Bonk', price: 0.000015, v24hChangePercent: -2.1, logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I' },
  { address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbAbdMdghWb6', symbol: 'JUP', name: 'Jupiter', price: 1.12, v24hChangePercent: 12.5, logoURI: 'https://static.jup.ag/jup/icon.png' },
  { address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', symbol: 'WIF', name: 'dogwifhat', price: 2.45, v24hChangePercent: 8.2, logoURI: 'https://bafkreibky2fszhm4oawgpeapofmclg7cshofbclgny25mwwq5q7y5f6jri.ipfs.nftstorage.link/' },
  { address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3Pe82hVcKjmEhm', symbol: 'PYTH', name: 'Pyth Network', price: 0.42, v24hChangePercent: 1.5, logoURI: 'https://pyth.network/token.svg' }
];

export const getTrendingTokens = async () => {
  try {
    const response = await api.get('/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=20');
    if (response.data.success && response.data.data && response.data.data.tokens) {
      return response.data.data.tokens;
    }
    return MOCK_TOKENS;
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return MOCK_TOKENS;
  }
};

export const searchTokens = async (keyword: string) => {
  try {
    const response = await api.get(`/defi/v3/search?keyword=${keyword}&target=token&sort_by=volume_24h_usd&sort_type=desc&offset=0&limit=20`);
    if (response.data.success && response.data.data && response.data.data.items) {
      const tokenResult = response.data.data.items.find((item: any) => item.type === 'token');
      if (tokenResult && tokenResult.result) {
        return tokenResult.result.map((t: any) => ({
          address: t.address,
          symbol: t.symbol,
          name: t.name,
          price: t.price,
          v24hChangePercent: t.price_change_24h_percent,
          logoURI: t.logo_uri || t.logoURI,
        }));
      }
    }
    // Fallback to local filter on mock tokens if rate limited
    return MOCK_TOKENS.filter(t => t.symbol.toLowerCase().includes(keyword.toLowerCase()) || t.name.toLowerCase().includes(keyword.toLowerCase()));
  } catch (error) {
    console.error('Error searching tokens:', error);
    return MOCK_TOKENS.filter(t => t.symbol.toLowerCase().includes(keyword.toLowerCase()) || t.name.toLowerCase().includes(keyword.toLowerCase()));
  }
};

export const getMarketData = async (address: string) => {
  try {
    const timeTo = Math.floor(Date.now() / 1000);
    const timeFrom = timeTo - 86400 * 7; // Last 7 days
    const response = await api.get(`/defi/history_price?address=${address}&address_type=token&type=1H&time_from=${timeFrom}&time_to=${timeTo}`);
    return response.data.data.items;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
};

export const getTokenTxs = async (address: string) => {
  try {
    const response = await api.get(`/defi/txs/token?address=${address}&limit=50`);
    return response.data.data.items;
  } catch (error) {
    console.error('Error fetching token txs:', error);
    return [];
  }
};

export const getWallets = async (address: string) => {
  try {
    const response = await api.get(`/defi/v2/tokens/top_traders?address=${address}&time_frame=24h&sort_type=desc&sort_by=volume&offset=0&limit=10`);
    return response.data.data.items;
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return [];
  }
};

export const getTokenMarketData = async (address: string) => {
  try {
    const response = await api.get(`/defi/v3/token/market-data?address=${address}`);
    if (response.data.success) return response.data.data;
    return null;
  } catch (error) {
    console.error('Error fetching market data details:', error);
    return null;
  }
};

export const getTokenTradeData = async (address: string) => {
  try {
    const response = await api.get(`/defi/v3/token/trade-data/single?address=${address}`);
    if (response.data.success) return response.data.data;
    return null;
  } catch (error) {
    console.error('Error fetching trade data:', error);
    return null;
  }
};
