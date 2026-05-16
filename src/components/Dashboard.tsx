import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMarketData } from '../services/api';
import WhaleTracker from './WhaleTracker';
import SmartWallet from './SmartWallet';
import TokenMetrics from './TokenMetrics';
import TradeActivity from './TradeActivity';

interface DashboardProps {
  activeToken: { address: string, symbol: string, name: string };
  setActiveToken: (token: { address: string, symbol: string, name: string }) => void;
}

const Dashboard = ({ activeToken }: DashboardProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);

  // Load chart data when activeToken changes
  useEffect(() => {
    const fetchChart = async () => {
      if (!activeToken.address) return;
      setLoadingChart(true);
      const data = await getMarketData(activeToken.address);
      if (data && data.length > 0) {
        // Format data for Recharts
        const formattedData = data.map((item: any) => ({
          time: new Date(item.unixTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: item.value
        }));
        setChartData(formattedData);
      } else {
        // Fallback mock chart data if API fails or no data
        setChartData([
          { time: '00:00', price: 120 },
          { time: '04:00', price: 132 },
          { time: '08:00', price: 125 },
          { time: '12:00', price: 145 },
          { time: '16:00', price: 160 },
          { time: '20:00', price: 155 },
          { time: '24:00', price: 170 },
        ]);
      }
      setLoadingChart(false);
    };
    fetchChart();
  }, [activeToken]);

  return (
    <div className="dashboard-grid">
      {/* Main Chart */}
      <div className="col-span-12 card glass-panel">
        <div className="flex-between mb-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 className="sci-fi-text">{activeToken.symbol} Price Action</h3>
            {loadingChart && <div className="live-indicator"></div>}
          </div>
          <div className="flex" style={{ gap: '8px' }}>
            <span className="badge badge-green">7D</span>
          </div>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          {loadingChart ? (
            <div className="flex-center" style={{ height: '100%' }}><div className="loading-spinner"></div></div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-green)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--neon-green)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(val) => `$${Number(val).toLocaleString(undefined, { maximumFractionDigits: 4 })}`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--panel-bg)', borderColor: 'var(--neon-green)', borderRadius: '8px', color: 'var(--text-main)' }}
                  itemStyle={{ color: 'var(--neon-green)' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 6 })}`, 'Price']}
                />
                <Area type="monotone" dataKey="price" stroke="var(--neon-green)" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      {/* Premium API Integrations */}
      <TokenMetrics activeToken={activeToken} />
      <TradeActivity activeToken={activeToken} />

      {/* Nested details below */}
      <WhaleTracker activeToken={activeToken} />
      <SmartWallet activeToken={activeToken} />
    </div>
  );
};

export default Dashboard;
