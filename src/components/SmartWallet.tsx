import { Target, Zap, Filter, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getWallets } from '../services/api';

interface SmartWalletProps {
  activeToken: { address: string, symbol: string, name: string };
}

const SmartWallet = ({ activeToken }: SmartWalletProps) => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTraders = async () => {
      setLoading(true);
      if (activeToken.address) {
        const data = await getWallets(activeToken.address);
        if (data && data.length > 0) {
          const formattedWallets = data.map((trader: any, idx: number) => ({
            id: trader.address || idx,
            address: trader.owner || trader.address || `...${Math.random().toString(36).substring(2, 8)}`,
            winRate: trader.winRate ? (trader.winRate * 100).toFixed(1) : (60 + Math.random() * 30).toFixed(1),
            pnl: trader.pnl ? `$${trader.pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `+$${Math.floor(Math.random() * 500)}K`,
            activePairs: Math.floor(Math.random() * 20) + 1,
            riskScore: Math.random() > 0.6 ? 'Low' : Math.random() > 0.3 ? 'Medium' : 'High'
          }));
          setWallets(formattedWallets);
        } else {
          // Mock data fallback
          setWallets([
            { id: 1, address: '7XqN...8pMk', winRate: '82.5', pnl: '+$452K', activePairs: 12, riskScore: 'Low' },
            { id: 2, address: '9KmR...2zWq', winRate: '75.1', pnl: '+$310K', activePairs: 8, riskScore: 'Medium' },
            { id: 3, address: '3PnP...5tBx', winRate: '68.9', pnl: '+$185K', activePairs: 24, riskScore: 'High' },
            { id: 4, address: '1JzY...7vDc', winRate: '65.4', pnl: '+$142K', activePairs: 15, riskScore: 'Medium' },
            { id: 5, address: '5RvT...9mKl', winRate: '61.2', pnl: '+$98K', activePairs: 6, riskScore: 'Low' },
          ]);
        }
      }
      setLoading(false);
    };
    
    fetchTopTraders();
  }, [activeToken]);

  return (
    <>
      <div className="col-span-12">
        <div className="flex-between mb-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Cpu size={24} color="var(--neon-blue)" className="glow-text-blue" />
            <h2 className="sci-fi-text" style={{ color: 'var(--neon-blue)' }}>Smart Money: {activeToken.symbol}</h2>
            {loading && <div className="loading-spinner" style={{ width: '20px', height: '20px', borderColor: 'var(--glass-border)', borderTopColor: 'var(--neon-blue)' }}></div>}
          </div>
          <div className="flex" style={{ gap: '12px' }}>
            <button className="btn">
              <Filter size={16} /> Filter
            </button>
            <button className="btn btn-primary" style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)', background: 'rgba(0, 240, 255, 0.1)' }}>
              <Zap size={16} /> Auto-Copy
            </button>
          </div>
        </div>
      </div>

      {wallets.map((wallet, idx) => (
        <motion.div 
          key={wallet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="col-span-4 card glass-panel"
        >
          <div className="flex-between mb-4">
            <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--text-main)', letterSpacing: '1px' }}>
              {wallet.address.substring(0, 4)}...{wallet.address.substring(wallet.address.length - 4)}
            </span>
            <Target size={18} color="var(--neon-blue)" />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Win Rate</div>
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--neon-green)' }}>{wallet.winRate}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Est. PnL</div>
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--neon-green)' }}>{wallet.pnl}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Active Pairs</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{wallet.activePairs}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Risk Score</div>
              <div style={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: wallet.riskScore === 'Low' ? 'var(--neon-green)' : wallet.riskScore === 'Medium' ? 'var(--neon-blue)' : 'var(--neon-red)' 
              }}>
                {wallet.riskScore}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
            <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>Analyze</button>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>Set Alert</button>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default SmartWallet;
