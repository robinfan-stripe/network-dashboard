import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar, Header } from './components/PlatformLayout';
import PrototypeControlPanel from './components/PrototypeControlPanel';
import { PrototypeProvider, usePrototype } from './PrototypeContext';

// Pages
import Home from './pages/Home';
import Balances from './pages/Balances';
import Transactions from './pages/Transactions';
import Directory from './pages/Directory';
import ProductCatalog from './pages/ProductCatalog';
import ConnectOverviewStarter from './pages/ConnectOverview';
import ConnectOverviewPrototype from './pages/prototypes/ConnectOverview';
import ConnectedAccounts from './pages/ConnectedAccounts';
import EmbeddedFinance from './pages/EmbeddedFinance';

// Prototypes
import NetworkListWrapper from './pages/prototypes/NetworkListWrapper';
import NetworkDetail from './pages/prototypes/NetworkDetail';
import TbdPlaceholder from './pages/prototypes/TbdPlaceholder';
import { CONCEPTS } from './data/networkAccounts';

/* ── Control panel primitives (from growth-studio Prototype3) ── */

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: '11px',
    fontWeight: 600,
    color: '#A3ACB9',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '2px 0 4px',
  }}>{children}</div>
);

const ToggleRow = ({ label, value, onChange }) => (
  <label style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 0',
    cursor: 'pointer',
  }}>
    <span style={{ fontSize: '13px', color: '#353A44' }}>{label}</span>
    <button
      onClick={onChange}
      style={{
        position: 'relative',
        width: '28px',
        height: '16px',
        borderRadius: '8px',
        border: 'none',
        background: value ? '#635BFF' : '#D8DEE4',
        cursor: 'pointer',
        transition: 'background 150ms',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: '2px',
        left: value ? '14px' : '2px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 150ms',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
      }} />
    </button>
  </label>
);

const Divider = () => (
  <div style={{ height: '1px', background: '#E5E7EB', margin: '6px 0' }} />
);

const SelectRow = ({ label, value, onChange, options }) => (
  <div style={{ padding: '4px 0' }}>
    <span style={{ fontSize: '13px', color: '#353A44', display: 'block', marginBottom: '4px' }}>{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        fontSize: '12px',
        padding: '4px 6px',
        borderRadius: '6px',
        border: '1px solid #D8DEE4',
        background: '#fff',
        color: '#353A44',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>{opt.label}</option>
      ))}
    </select>
  </div>
);

/* ── App ── */

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const { getVariable, setVariable } = usePrototype();
  const networkConcept = getVariable('networkConcept', 'current');
  const zebraRows = getVariable('zebraRows', true);
  const showTabs = getVariable('showTabs', true);
  const showMetrics = getVariable('showMetrics', true);
  const showDescription = getVariable('showDescription', true);

  return (
    <div className={`min-h-screen bg-surface ${darkMode ? 'dark' : ''}`}>
      <PrototypeControlPanel>
        <SectionLabel>Display</SectionLabel>
        <ToggleRow label="Dark mode" value={darkMode} onChange={() => setDarkMode(!darkMode)} />
        <Divider />
        <SectionLabel>Prototype</SectionLabel>
        <SelectRow
          label="Network list concept"
          value={networkConcept}
          onChange={(v) => setVariable('networkConcept', v)}
          options={CONCEPTS}
        />
        <Divider />
        {networkConcept === 'current' && (
          <>
            <SectionLabel>Current version</SectionLabel>
            <ToggleRow label="Zebra rows" value={zebraRows} onChange={() => setVariable('zebraRows', !zebraRows)} />
            <ToggleRow label="Tabs" value={showTabs} onChange={() => setVariable('showTabs', !showTabs)} />
            <ToggleRow label="Metric cards" value={showMetrics} onChange={() => setVariable('showMetrics', !showMetrics)} />
            <ToggleRow label="Description" value={showDescription} onChange={() => setVariable('showDescription', !showDescription)} />
          </>
        )}
      </PrototypeControlPanel>

      <div className="flex flex-col min-h-screen">
        <div className="flex flex-row flex-1 bg-surface">
          {/* Sidebar */}
          <Sidebar />

          {/* Header - fixed */}
          <Header />

          {/* Main Content Area - offset for fixed sidebar and header */}
          <div className="ml-sidebar-width pt-[60px] flex flex-col min-w-0 flex-1 relative scrollbar-auto">
            <div className="max-w-[1280px] w-full mx-auto">

              {/* Content */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/balances" element={<Balances />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/product-catalog" element={<ProductCatalog />} />
                <Route path="/connect" element={<ConnectOverviewStarter />} />
                <Route path="/connect/accounts" element={<ConnectedAccounts />} />
                <Route path="/embedded-finance" element={<EmbeddedFinance />} />

                {/* Prototypes */}
                <Route path="/prototypes/network" element={<NetworkListWrapper />} />
                <Route path="/prototypes/network/:accountId" element={<NetworkDetail />} />
                <Route path="/prototypes/network/overview" element={<ConnectOverviewPrototype />} />
                <Route path="/prototypes/tbd" element={<TbdPlaceholder />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PrototypeProvider initialVariables={{ zebraRows: true, networkConcept: 'current' }}>
      <AppContent />
    </PrototypeProvider>
  );
}
