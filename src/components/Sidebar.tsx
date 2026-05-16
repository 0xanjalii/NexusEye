import { Hexagon, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTrendingTokens, searchTokens } from '../services/api';

interface SidebarProps {
  activeToken: { address: string, symbol: string, name: string };
  setActiveToken: (token: { address: string, symbol: string, name: string }) => void;
}

const Sidebar = ({ activeToken, setActiveToken }: SidebarProps) => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Use a debounce for search
  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      let data = [];
      if (query.trim() === '') {
        data = await getTrendingTokens();
      } else {
        data = await searchTokens(query);
      }
      
      if (data) {
        setTokens(data);
      }
      setLoading(false);
    };

    const debounceId = setTimeout(fetchTokens, 500);
    return () => clearTimeout(debounceId);
  }, [query]);

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', width: '320px' }}>
      <div className="flex-center" style={{ gap: '12px', marginBottom: '32px', justifyContent: 'flex-start', flexShrink: 0 }}>
        <Hexagon color="var(--neon-green)" size={32} />
        <h2 className="glow-text" style={{ margin: 0 }}>NEXUSEYE</h2>
      </div>

      <div style={{ position: 'relative', marginBottom: '24px', flexShrink: 0 }}>
        <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search Solana coins..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px 16px 12px 42px', 
            background: 'rgba(0, 0, 0, 0.4)', 
            border: '1px solid var(--glass-border)', 
            borderRadius: '8px',
            color: 'var(--text-main)',
            outline: 'none',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '8px', margin: '0 -8px 24px 0' }}>
        {loading ? (
          <div className="flex-center" style={{ height: '100px' }}>
            <div className="loading-spinner" style={{ width: '24px', height: '24px' }}></div>
          </div>
        ) : tokens.length > 0 ? (
          tokens.map((t: any, i: number) => (
            <div 
              key={t.address || i} 
              style={{ 
                padding: '12px', 
                cursor: 'pointer', 
                border: activeToken.address === t.address ? '1px solid var(--neon-green)' : '1px solid transparent',
                background: activeToken.address === t.address ? 'rgba(0, 255, 65, 0.1)' : 'rgba(255, 255, 255, 0.02)', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setActiveToken({ address: t.address, symbol: t.symbol, name: t.name })}
              onMouseEnter={(e) => { if (activeToken.address !== t.address) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)' }}
              onMouseLeave={(e) => { if (activeToken.address !== t.address) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)' }}
            >
              <div className="token-icon" style={{ width: '32px', height: '32px', flexShrink: 0, borderColor: activeToken.address === t.address ? 'var(--neon-green)' : 'var(--glass-border)' }}>
                {t.logoURI ? <img src={t.logoURI} alt={t.symbol} /> : <span style={{ fontSize: '10px' }}>{t.symbol.substring(0, 2)}</span>}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: activeToken.address === t.address ? 'var(--neon-green)' : 'var(--text-main)' }}>{t.symbol}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{t.name}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>${Number(t.price || 0).toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                <div className={t.v24hChangePercent >= 0 ? 'positive' : 'negative'} style={{ fontSize: '10px' }}>
                  {t.v24hChangePercent > 0 ? '+' : ''}{Number(t.v24hChangePercent || 0).toFixed(2)}%
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px', fontSize: '14px' }}>
            No coins found. Try a different search.
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '16px', background: 'rgba(0,255,65,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>NODE STATUS</p>
          <div className="flex-between">
            <span style={{ fontSize: '14px' }}>Solana Mainnet</span>
            <span className="live-indicator"></span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
