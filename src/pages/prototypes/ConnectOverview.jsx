import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, InfoIcon, MoreIcon } from '../../components/icons';
import { Icon } from '../../icons/SailIcons';

// -- Shared font style objects (growth-studio patterns) --

const sectionHeadingStyle = {
  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: '20px', fontWeight: 600, lineHeight: '28px',
  letterSpacing: '0.3px', fontVariantNumeric: 'lining-nums proportional-nums',
  color: '#353A44',
};

const metricLabelStyle = {
  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: '14px', fontWeight: 600, lineHeight: '20px',
  letterSpacing: '-0.15px', color: '#353A44',
};

const tabStyle = (active) => ({
  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: '14px', fontWeight: 600, lineHeight: '20px',
  letterSpacing: '-0.15px', color: active ? '#533AFD' : '#6A7383',
});

const tableHeaderStyle = {
  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: '12px', fontWeight: 600, lineHeight: '16px', color: '#353A44',
};

const tableNameStyle = {
  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: '14px', fontWeight: 600, lineHeight: '20px',
  letterSpacing: '-0.15px', color: '#353A44',
};

const tableValueStyle = (isPositive) => ({
  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: '14px', fontWeight: 400, lineHeight: '20px',
  letterSpacing: '-0.15px',
  color: isPositive === true ? '#217005' : isPositive === false ? '#C0123C' : '#353A44',
});

const footerStyle = {
  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#6A7383',
};

// -- Filter pill --

function FilterPill({ label, value, showChevron = true }) {
  return (
    <button
      className="h-8 px-2 bg-white flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors focus:outline-none"
      style={{ borderRadius: '999px', border: '1px solid #D8DEE4' }}
    >
      {label && (
        <>
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{label}</span>
          {value && <span className="w-px h-4 bg-[#D8DEE4]" />}
        </>
      )}
      {value && (
        <span className="text-sm font-medium text-[#533AFD] whitespace-nowrap">{value}</span>
      )}
      {showChevron && <ChevronDownIcon size={14} />}
    </button>
  );
}

// -- Simple SVG time series chart --

function TimeSeriesChart({
  height = 180,
  currentPoints,
  previousPoints,
  xStart,
  xEnd,
  yTop,
  yBottom,
}) {
  const vw = 400;
  const vh = 100;
  return (
    <div style={{ height }}>
      <svg viewBox={`0 0 ${vw} ${vh + 30}`} width="100%" height="100%" preserveAspectRatio="none">
        {/* fill under current line */}
        <polygon
          points={`${currentPoints} ${vw},${vh} 0,${vh}`}
          fill="rgba(99,91,255,0.08)"
        />
        {/* previous period line */}
        <polyline
          points={previousPoints}
          fill="none"
          stroke="#D8DEE4"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        {/* current period line */}
        <polyline
          points={currentPoints}
          fill="none"
          stroke="#675DFF"
          strokeWidth="2"
        />
        {/* x-axis labels */}
        <text x="0" y={vh + 18} fontSize="10" fill="#6A7383">{xStart}</text>
        <text x={vw} y={vh + 18} fontSize="10" fill="#6A7383" textAnchor="end">{xEnd}</text>
        {/* y-axis labels */}
        <text x="0" y="8" fontSize="10" fill="#6A7383">{yTop}</text>
        <text x="0" y={vh - 2} fontSize="10" fill="#6A7383">{yBottom}</text>
      </svg>
    </div>
  );
}

// -- Metric display --

function Metric({ label, tooltip, value, change, changeColor }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <span style={metricLabelStyle}>{label}</span>
        {tooltip && (
          <span title={tooltip}>
            <InfoIcon size={12} />
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold" style={{ color: '#353A44' }}>{value}</span>
        <span className="text-sm font-medium" style={{ color: changeColor || '#217005' }}>{change}</span>
      </div>
    </div>
  );
}

// -- Account Growth Table --

const growthTabs = [
  { id: 'payments', label: 'Payments' },
  { id: 'transfers', label: 'Transfers' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'margin', label: 'Margin' },
];

function AccountGrowthTable({ title, valueLabel, dataByTab, updatedAt }) {
  const [activeTab, setActiveTab] = useState('payments');
  const data = dataByTab[activeTab] || dataByTab.payments;

  return (
    <div>
      <div className="mb-3">
        <span style={{ ...sectionHeadingStyle, fontSize: '16px', lineHeight: '24px' }}>{title}</span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-3">
        <div className="flex gap-4">
          {growthTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-[40px] flex items-center border-b-2 transition-colors group ${
                activeTab === tab.id ? 'border-[#533AFD]' : 'border-transparent'
              }`}
              style={tabStyle(activeTab === tab.id)}
            >
              <span className={`px-1 py-0.5 rounded transition-colors ${activeTab !== tab.id ? 'group-hover:bg-[#F5F6F8]' : ''}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-gray-200">
        <span style={tableHeaderStyle}>Account</span>
        <span style={tableHeaderStyle}>{valueLabel}</span>
      </div>

      {/* Rows */}
      {data.map((row, i) => (
        <div key={i} className="relative flex items-center justify-between py-2.5 px-2 -mx-2 border-b border-gray-200 last:border-b-0 cursor-pointer group">
          <div className="absolute left-0 right-0 bg-gray-50 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ top: '-1px', bottom: '-1px', zIndex: 0 }} />
          <span className="relative z-10" style={tableNameStyle}>{row.name}</span>
          <span className="relative z-10" style={tableValueStyle(row.isPositive)}>{row.value}</span>
        </div>
      ))}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View more</button>
        <span style={footerStyle}>{updatedAt}</span>
      </div>
    </div>
  );
}

// -- Main tabs data --

const mainTabs = [
  { id: 'performance', label: 'Performance' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'campaigns', label: 'Campaigns' },
];

// -- Top movers / top accounts data --

const topMoversData = {
  payments: [
    { name: 'Acme Coffee Roasters', value: '+$285.50', isPositive: true },
    { name: 'Bloom Flower Shop', value: '+$15.00', isPositive: true },
    { name: 'Coastal Surf Co', value: '+$12.25', isPositive: true },
    { name: 'Urban Fitness Studio', value: '-$2.00', isPositive: false },
    { name: 'Pixel Design Agency', value: '-$0.50', isPositive: false },
    { name: 'Summit Outdoor Gear', value: '-$0.50', isPositive: false },
  ],
  transfers: [
    { name: 'Metro Logistics Inc', value: '+$1,240.00', isPositive: true },
    { name: 'Evergreen Supplies', value: '+$890.50', isPositive: true },
    { name: 'Blue Ocean Trading', value: '+$445.25', isPositive: true },
    { name: 'Swift Delivery Co', value: '-$125.00', isPositive: false },
    { name: 'Harbor Freight Ltd', value: '-$78.50', isPositive: false },
    { name: 'Pacific Imports', value: '-$45.00', isPositive: false },
  ],
  revenue: [
    { name: 'TechStart Labs', value: '+$3,450.00', isPositive: true },
    { name: 'CloudNine Software', value: '+$2,100.75', isPositive: true },
    { name: 'DataFlow Systems', value: '+$1,875.50', isPositive: true },
    { name: 'Quantum Analytics', value: '-$520.00', isPositive: false },
    { name: 'ByteSize Apps', value: '-$340.25', isPositive: false },
    { name: 'CodeCraft Studio', value: '-$180.00', isPositive: false },
  ],
  margin: [
    { name: 'Premier Consulting', value: '+$890.00', isPositive: true },
    { name: 'Elite Services Group', value: '+$675.50', isPositive: true },
    { name: 'Apex Solutions', value: '+$445.00', isPositive: true },
    { name: 'Bright Ideas Co', value: '-$210.75', isPositive: false },
    { name: 'Fusion Creative', value: '-$145.50', isPositive: false },
    { name: 'Nexus Partners', value: '-$95.00', isPositive: false },
  ],
};

const topAccountsData = {
  payments: [
    { name: 'Nova Tech Solutions', value: '$285.50', isPositive: null },
    { name: 'Green Valley Market', value: '$15.00', isPositive: null },
    { name: 'Craft Brewing Co', value: '$12.25', isPositive: null },
    { name: 'Stellar Photography', value: '$0.71', isPositive: null },
    { name: 'Horizon Travel Agency', value: '$0.35', isPositive: null },
    { name: 'Alpine Bakery', value: '$0.22', isPositive: null },
  ],
  transfers: [
    { name: 'Global Freight Co', value: '$4,520.00', isPositive: null },
    { name: 'Continental Shipping', value: '$3,890.50', isPositive: null },
    { name: 'Express Movers LLC', value: '$2,450.75', isPositive: null },
    { name: 'Atlas Logistics', value: '$1,890.00', isPositive: null },
    { name: 'Prime Transport', value: '$1,245.50', isPositive: null },
    { name: 'United Carriers', value: '$980.25', isPositive: null },
  ],
  revenue: [
    { name: 'Enterprise Cloud Inc', value: '$12,450.00', isPositive: null },
    { name: 'Digital Dynamics', value: '$9,875.50', isPositive: null },
    { name: 'Innovate Tech Corp', value: '$7,650.25', isPositive: null },
    { name: 'Smart Systems Ltd', value: '$5,420.00', isPositive: null },
    { name: 'Future Labs', value: '$4,180.75', isPositive: null },
    { name: 'NextGen Software', value: '$3,250.50', isPositive: null },
  ],
  margin: [
    { name: 'Capital Ventures', value: '$2,890.00', isPositive: null },
    { name: 'Strategic Growth LLC', value: '$2,145.50', isPositive: null },
    { name: 'Pinnacle Partners', value: '$1,780.25', isPositive: null },
    { name: 'Summit Advisory', value: '$1,450.00', isPositive: null },
    { name: 'Keystone Consulting', value: '$1,120.75', isPositive: null },
    { name: 'Bridge Investments', value: '$890.50', isPositive: null },
  ],
};

// ==============================
// Main component
// ==============================

export default function ConnectOverview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('performance');

  return (
    <div className="p-8">
      {/* Back */}
      <button
        onClick={() => navigate('/prototypes/network')}
        className="flex items-center gap-1 text-sm text-subdued hover:text-default cursor-pointer mb-6 transition-colors"
      >
        <Icon name="arrowLeft" size="xsmall" fill="currentColor" />
        Network
      </button>

      {/* Page header */}
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-2xl font-bold" style={{ color: '#353A44' }}>Connect overview</h1>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
          style={{ border: '1px solid #D8DEE4', background: '#FFF' }}
        >
          <MoreIcon />
        </button>
      </div>

      {/* Main tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-6">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-[46px] flex items-center border-b-2 transition-colors group ${
                activeTab === tab.id ? 'border-[#533AFD]' : 'border-transparent'
              }`}
              style={tabStyle(activeTab === tab.id)}
            >
              <span className={`px-1 py-1 rounded transition-colors ${activeTab !== tab.id ? 'group-hover:bg-[#F5F6F8]' : ''}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Performance tab */}
      {activeTab === 'performance' && (
        <div>
          {/* ---- Volume ---- */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 style={sectionHeadingStyle}>Volume</h2>
              <div className="flex items-center gap-2">
                <FilterPill label="Date range" value="Last 7 days" />
                <FilterPill value="Daily" />
                <FilterPill label="Compare" value="Previous period" />
              </div>
            </div>
            <Metric
              label="Gross payment volume"
              tooltip="Total payment volume processed by connected accounts on your platform."
              value="$9.394M"
              change="+20%"
            />
            <TimeSeriesChart
              height={200}
              currentPoints="0,80 29,75 57,70 86,65 114,55 143,50 171,45 200,40 229,35 257,30 286,28 314,25 343,22 400,20"
              previousPoints="0,90 29,88 57,85 86,80 114,75 143,70 171,65 200,60 229,55 257,50 286,45 314,42 343,40 400,38"
              xStart="Feb 11" xEnd="Feb 18"
              yTop="$10M" yBottom="$5M"
            />
          </div>

          {/* ---- Earnings ---- */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 style={sectionHeadingStyle}>Earnings</h2>
              <div className="flex items-center gap-2">
                <FilterPill label="Date range" value="Last 12 months" />
                <FilterPill label="Compare" value="Previous period" />
              </div>
            </div>

            {/* Revenue - full width */}
            <Metric
              label="Revenue"
              tooltip="Total fees collected from connected accounts minus refunded fees and reversed account debits and transfers."
              value="$673.4K"
              change="+10.7%"
            />
            <TimeSeriesChart
              height={180}
              currentPoints="0,95 29,90 57,85 86,80 114,75 143,60 171,55 200,45 229,40 257,35 286,25 314,30 343,25 400,35"
              previousPoints="0,90 29,85 57,80 86,75 114,70 143,65 171,60 200,40 229,35 257,20 286,15 314,25 343,20 400,30"
              xStart="Feb 2025" xEnd="Feb 2026"
              yTop="$800K" yBottom="$500K"
            />

            {/* Margin + Take rate side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <Metric
                  label="Margin"
                  tooltip="Total fees collected minus Stripe and network fees."
                  value="$43.59K"
                  change="-6.5%"
                  changeColor="#C0123C"
                />
                <TimeSeriesChart
                  height={120}
                  currentPoints="0,75 20,70 40,60 60,65 80,55 100,50 120,45 140,40 160,35 180,30 200,25"
                  previousPoints="0,70 20,60 40,50 60,55 80,45 100,40 120,35 140,30 160,25 180,20 200,15"
                  xStart="Feb 2025" xEnd="Feb 2026"
                  yTop="$50K" yBottom="$10K"
                />
              </div>
              <div>
                <Metric
                  label="Payment take rate"
                  tooltip="Margin from gross payment volume expressed in basis points."
                  value="40bps"
                  change="-4.7%"
                  changeColor="#C0123C"
                />
                <TimeSeriesChart
                  height={120}
                  currentPoints="0,70 20,65 40,60 60,65 80,55 100,60 120,50 140,45 160,40 180,35 200,25"
                  previousPoints="0,60 20,55 40,50 60,55 80,45 100,50 120,40 140,35 160,30 180,25 200,15"
                  xStart="Feb 2025" xEnd="Feb 2026"
                  yTop="45bps" yBottom="35bps"
                />
              </div>
            </div>
          </div>

          {/* ---- Account Growth ---- */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 style={sectionHeadingStyle}>Account growth</h2>
              <div className="flex items-center gap-2">
                <FilterPill label="Date range" value="Last 12 months" />
                <FilterPill label="Compare" value="Previous period" />
              </div>
            </div>

            <Metric
              label="New accounts"
              tooltip="New connected accounts created on your platform during the selected time period."
              value="302"
              change="-56.23%"
              changeColor="#C0123C"
            />
            <TimeSeriesChart
              height={180}
              currentPoints="0,95 29,94 57,93 86,92 114,91 143,90 171,89 200,88 229,90 257,92 286,91 314,89 343,90 400,91"
              previousPoints="0,10 29,12 57,15 86,80 114,88 143,90 171,92 200,91 229,90 257,92 286,93 314,92 343,91 400,92"
              xStart="Jan 2025" xEnd="Sep 2025"
              yTop="550" yBottom="0"
            />
            <div className="flex items-center justify-between mt-4 mb-8">
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View new accounts</button>
              <span style={footerStyle}>Updated Jan 30, 2:00 AM</span>
            </div>

            {/* Top movers + top accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AccountGrowthTable
                title="Top movers"
                valueLabel="Volume change"
                dataByTab={topMoversData}
                updatedAt="Updated Jan 27, 4:00 PM"
              />
              <AccountGrowthTable
                title="Top accounts"
                valueLabel="Total"
                dataByTab={topAccountsData}
                updatedAt="Updated Jan 27, 4:00 PM"
              />
            </div>
          </div>
        </div>
      )}

      {/* Opportunities tab (placeholder) */}
      {activeTab === 'opportunities' && (
        <div className="border border-dashed border-border rounded-lg py-16 px-8 flex flex-col items-center justify-center">
          <div className="text-base font-semibold text-default mb-1">Opportunities</div>
          <p className="text-sm text-subdued">This tab is not yet built. Opportunity cards will go here.</p>
        </div>
      )}

      {/* Campaigns tab (placeholder) */}
      {activeTab === 'campaigns' && (
        <div className="border border-dashed border-border rounded-lg py-16 px-8 flex flex-col items-center justify-center">
          <div className="text-base font-semibold text-default mb-1">Campaigns</div>
          <p className="text-sm text-subdued">This tab is not yet built. Campaign management will go here.</p>
        </div>
      )}
    </div>
  );
}
