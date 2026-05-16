import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { getTokenTradeData } from '../services/api';

interface TradeActivityProps {
  activeToken: { address: string, symbol: string, name: string };
}

const TradeActivity = ({ activeToken }: TradeActivityProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getTokenTradeData(activeToken.address);
      setData(res);
      setLoading(false);
    };
    if (activeToken.address) fetchData();
  }, [activeToken]);

  const formatCurrency = (val: number) => {
    if (!val) return '$0.00';
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
    return `$${val.toFixed(2)}`;
  };

  const buyRatio = data ? (data.volume_buy_24h_usd / data.volume_24h_usd) * 100 : 50;
  const sellRatio = data ? (data.volume_sell_24h_usd / data.volume_24h_usd) * 100 : 50;

  return (
    <div className="col-span-6 card glass-panel">
      <div className="flex-between mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BarChart size={24} color="var(--neon-blue)" className="glow-text-blue" />
          <h2 className="sci-fi-text" style={{ color: 'var(--neon-blue)' }}>24H Trade Activity</h2>
        </div>
        {loading && <div className="loading-spinner" style={{ width: '20px', height: '20px', borderColor: 'var(--glass-border)', borderTopColor: 'var(--neon-blue)' }}></div>}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div className="flex-between mb-2">
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Buy / Sell Ratio</span>
          <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            <span style={{ color: 'var(--neon-green)' }}>{buyRatio.toFixed(1)}%</span> / <span style={{ color: 'var(--neon-red)' }}>{sellRatio.toFixed(1)}%</span>
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
          <motion.div 
            initial={{ width: '50%' }} 
            animate={{ width: `${buyRatio}%` }} 
            transition={{ duration: 1 }} 
            style={{ background: 'var(--neon-green)', height: '100%' }} 
          />
          <motion.div 
            initial={{ width: '50%' }} 
            animate={{ width: `${sellRatio}%` }} 
            transition={{ duration: 1 }} 
            style={{ background: 'var(--neon-red)', height: '100%' }} 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', background: 'rgba(0, 255, 65, 0.05)', borderRadius: '8px', borderLeft: '2px solid var(--neon-green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--neon-green)', fontSize: '12px' }}>
            <ArrowUpCircle size={14} /> Buy Volume (24h)
          </div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
            {data ? formatCurrency(data.volume_buy_24h_usd) : '--'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {data ? data.buy_24h.toLocaleString() : '--'} transactions
          </div>
        </div>

        <div style={{ padding: '16px', background: 'rgba(255, 0, 60, 0.05)', borderRadius: '8px', borderLeft: '2px solid var(--neon-red)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--neon-red)', fontSize: '12px' }}>
            <ArrowDownCircle size={14} /> Sell Volume (24h)
          </div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
            {data ? formatCurrency(data.volume_sell_24h_usd) : '--'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {data ? data.sell_24h.toLocaleString() : '--'} transactions
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeActivity;
