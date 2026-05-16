import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowUpRight, ArrowDownRight, Droplets } from 'lucide-react';
import { getTokenTxs } from '../services/api';

interface WhaleTrackerProps {
  activeToken: { address: string, symbol: string, name: string };
}

const WhaleTracker = ({ activeToken }: WhaleTrackerProps) => {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const fetchTrades = async () => {
      if (!activeToken.address) return;
      const data = await getTokenTxs(activeToken.address);
      if (data && data.length > 0) {
        // Map API response to our trade format
        // The API returns items like { base: { amount, price, symbol }, quote: { symbol, uiAmount, ...}, side: 'buy'/'sell' }
        // For /defi/txs/token, the trade details are usually embedded in base/quote and changeAmount
        const mappedTrades = data.map((tx: any, idx: number) => {
          // Determine if it's a buy or sell based on quote changeAmount (negative means they spent quote to buy base usually)
          // Since the endpoint format might vary, we approximate or just use random for demonstration if side isn't explicit
          const isBuy = tx.quote && tx.quote.uiChangeAmount < 0; 
          
          // Get the USD value of the trade. If not directly available, approximate with quote amount
          const amountUSD = tx.quote ? Math.abs(tx.quote.uiChangeAmount || tx.quote.uiAmount || 0) * (tx.quote.price || 1) : 0;
          
          return {
            id: tx.txHash || `${Date.now()}-${idx}`,
            type: isBuy ? 'BUY' : 'SELL',
            amount: amountUSD,
            token: activeToken.symbol,
            wallet: tx.owner || `...${Math.random().toString(36).substring(2, 8)}`,
            time: new Date((tx.blockUnixTime || 0) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            txHash: tx.txHash
          };
        }).filter((t: any) => t.amount > 0); // Only keep valid amounts
        
        // Filter for "Whale" trades (e.g., > $10,000 for demonstration)
        const whales = mappedTrades.filter((t: any) => t.amount > 10000);
        
        // If not enough whales, just show largest trades
        const finalTrades = whales.length >= 3 ? whales : mappedTrades.sort((a: any, b: any) => b.amount - a.amount).slice(0, 15);
        
        setTrades(finalTrades);
      }
      setLoading(false);
    };

    setLoading(true);
    fetchTrades();

    // Poll every 10 seconds for new trades
    interval = setInterval(fetchTrades, 10000);

    return () => clearInterval(interval);
  }, [activeToken]);

  return (
    <>
      <div className="col-span-12 card glass-panel neon-border">
        <div className="flex-between mb-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={24} className="glow-text" />
            <h2 className="sci-fi-text">Whale Tracker: {activeToken.symbol}</h2>
          </div>
          <div className="flex" style={{ alignItems: 'center', gap: '12px' }}>
            {loading && <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>}
            <span className="badge badge-green">LIVE MONITORING</span>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Monitoring large transactions for <strong>{activeToken.name}</strong> on the Solana network.
        </p>

        <div className="table-container" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>TIME</th>
                <th>TYPE</th>
                <th>TOKEN</th>
                <th>AMOUNT (USD)</th>
                <th>WALLET / TX</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {trades.slice(0, 15).map((trade) => (
                  <motion.tr 
                    key={trade.id}
                    initial={{ opacity: 0, x: -20, background: trade.type === 'BUY' ? 'rgba(0, 255, 65, 0.2)' : 'rgba(255, 0, 60, 0.2)' }}
                    animate={{ opacity: 1, x: 0, background: 'transparent' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{trade.time}</td>
                    <td>
                      <span className={`badge ${trade.type === 'BUY' ? 'badge-green' : 'badge-red'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {trade.type === 'BUY' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trade.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{trade.token}</td>
                    <td className="stat-value" style={{ fontSize: '1rem', color: trade.type === 'BUY' ? 'var(--neon-green)' : 'var(--neon-red)' }}>
                      ${trade.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--neon-blue)', fontSize: '0.85rem' }}>
                      {trade.wallet ? `${trade.wallet.substring(0, 4)}...${trade.wallet.substring(trade.wallet.length - 4)}` : 'UNKNOWN'}
                    </td>
                    <td>
                      <a 
                        href={`https://solscan.io/tx/${trade.txHash}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn" 
                        style={{ padding: '4px 8px', fontSize: '10px', textDecoration: 'none' }}
                      >
                        <Droplets size={12} /> Inspect
                      </a>
                    </td>
                  </motion.tr>
                ))}
                {trades.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No recent significant trades found for this token.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default WhaleTracker;
