import { Bell, Zap } from 'lucide-react';

interface TopbarProps {
  activeToken: { address: string, symbol: string, name: string };
}

const Topbar = ({ activeToken }: TopbarProps) => {
  return (
    <header className="header" style={{ position: 'relative', zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', width: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0, 240, 255, 0.05)', padding: '6px 16px', borderRadius: '24px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
          <Zap size={14} color="var(--neon-blue)" />
          <span style={{ fontSize: '12px', color: 'var(--neon-blue)', fontFamily: 'monospace' }}>
            TARGETING: {activeToken.symbol}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="var(--text-muted)" />
          <span style={{ 
            position: 'absolute', 
            top: '-4px', 
            right: '-4px', 
            width: '8px', 
            height: '8px', 
            background: 'var(--neon-red)', 
            borderRadius: '50%' 
          }}></span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
