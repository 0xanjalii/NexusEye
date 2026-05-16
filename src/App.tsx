import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import './index.css';

// Default to SOL if no token selected
const DEFAULT_TOKEN = {
  address: 'So11111111111111111111111111111111111111112',
  symbol: 'SOL',
  name: 'Wrapped SOL'
};

function App() {
  const [activeToken, setActiveToken] = useState(DEFAULT_TOKEN);

  return (
    <div className="app-container">
      <div className="scanline"></div>
      <Sidebar activeToken={activeToken} setActiveToken={setActiveToken} />
      
      <main className="main-content">
        <Topbar activeToken={activeToken} />
        <Dashboard activeToken={activeToken} setActiveToken={setActiveToken} />
      </main>
    </div>
  );
}

export default App;
