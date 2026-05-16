import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Users, Banknote, ShieldCheck } from 'lucide-react';
import { getTokenMarketData } from '../services/api';

interface TokenMetricsProps {
  activeToken: { address: string, symbol: string, name: string };
}

const TokenMetrics = ({ activeToken }: TokenMetricsProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getTokenMarketData(activeToken.address);
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

  return (
    <div className="col-span-6 card glass-panel neon-border">
      <div className="flex-between mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Database size={24} className="glow-text" />
          <h2 className="sci-fi-text">Token Metrics</h2>
        </div>
        {loading && <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <Banknote size={14} /> Market Cap
          </div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--neon-green)' }}>
            {data ? formatCurrency(data.market_cap) : '--'}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <ShieldCheck size={14} /> FDV
          </div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
            {data ? formatCurrency(data.fdv) : '--'}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <Database size={14} /> Circulating Supply
          </div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
            {data ? (data.circulating_supply / 1e6).toFixed(2) + 'M' : '--'}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <Users size={14} /> Total Holders
          </div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--neon-blue)' }}>
            {data ? data.holder?.toLocaleString() : '--'}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TokenMetrics;
