import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { InfoIcon } from '../../components/icons';
import { ChipGroup } from '../../components/ChipGroup';
import Tabs from '../../components/Tabs';
import { usePrototype } from '../../PrototypeContext';

// -- Data (expanded to 30 rows for pagination) --

const accounts = [
  { id: 'acct_1OaVWE2eZvKYlp4K', name: 'Toybox Labs', email: 'toyboxlabs@gmail.com', created: 'Jun 26, 1:00 AM', configuration: 'Merchant, customer', lifetimeValue: 98750.00, status: 'enabled', isInternational: false, createdDays: 5 },
  { id: 'acct_1OfBSO2eZvKYlu1X', name: 'Michael Lee', email: 'michael.lee@gmail.com', created: 'Jun 26, 2:30 AM', configuration: 'Merchant', lifetimeValue: 85300.00, status: 'enabled', isInternational: false, createdDays: 5 },
  { id: 'acct_1NqBMA2eZvKYlo2C', name: 'Sarah Wang', email: 'sarah.wang@yahoo.com', created: 'Jun 26, 3:15 AM', configuration: 'Merchant', lifetimeValue: 72150.00, status: 'restricted', isInternational: true, createdDays: 5 },
  { id: 'acct_1NxRTG2eZvKYlo9F', name: 'David Smith', email: 'david.smith@outlook.com', created: 'Jun 26, 4:00 AM', configuration: 'Merchant, customer', lifetimeValue: 68900.00, status: 'enabled', isInternational: false, createdDays: 5 },
  { id: 'acct_1OeARM2eZvKYlt8W', name: 'Laura Martinez', email: 'laura.martinez@gmail.com', created: 'Jun 26, 5:45 AM', configuration: 'Customer', lifetimeValue: 54600.00, status: 'enabled', isInternational: true, createdDays: 5 },
  { id: 'acct_1ObXHJ2eZvKYlq7R', name: 'Robert Brown', email: 'robert.brown@hotmail.com', created: 'Jun 26, 6:30 AM', configuration: 'Merchant, customer', lifetimeValue: 49250.00, status: 'in-review', isInternational: false, createdDays: 5 },
  { id: 'acct_1OdZQN2eZvKYls5V', name: 'Jessica Davis', email: 'jessica.davis@aol.com', created: 'Jun 26, 7:15 AM', configuration: 'Customer', lifetimeValue: 42800.00, status: 'enabled', isInternational: false, createdDays: 5 },
  { id: 'acct_1OcYPL2eZvKYlr2T', name: 'Daniel Wilson', email: 'daniel.wilson@icloud.com', created: 'Jun 26, 8:00 AM', configuration: 'Customer', lifetimeValue: 39500.00, status: 'restricted-soon', isInternational: true, createdDays: 5 },
  { id: 'acct_1OgCSP2eZvKYlv3Y', name: 'Sophia Johnson', email: 'sophia.johnson@live.com', created: 'Jun 26, 9:00 AM', configuration: 'Merchant, customer', lifetimeValue: 32700.00, status: 'enabled', isInternational: false, createdDays: 10 },
  { id: 'acct_1OhDTQ2eZvKYlw4Z', name: 'James Garcia', email: 'james.garcia@verizon.net', created: 'Jun 26, 10:15 AM', configuration: 'Merchant, customer', lifetimeValue: 28400.00, status: 'enabled', isInternational: false, createdDays: 10 },
  { id: 'acct_1OiEUR2eZvKYlx5A', name: 'Amy Rodriguez', email: 'amy.rodriguez@comcast.com', created: 'Jun 26, 11:00 AM', configuration: 'Merchant, customer', lifetimeValue: 22600.00, status: 'rejected', isInternational: false, createdDays: 15 },
  { id: 'acct_1OjFVS2eZvKYly6B', name: 'Kevin Chen', email: 'kevin.chen@proton.me', created: 'Jun 26, 11:45 AM', configuration: 'Merchant', lifetimeValue: 18200.00, status: 'enabled', isInternational: true, createdDays: 15 },
  { id: 'acct_1OkGWT2eZvKYlz7C', name: 'Emily Thompson', email: 'emily.thompson@gmail.com', created: 'Jun 26, 12:30 PM', configuration: 'Customer', lifetimeValue: 14950.00, status: 'enabled', isInternational: false, createdDays: 20 },
  { id: 'acct_1OlHXU2eZvKYma8D', name: 'Marcus Reed', email: 'marcus.reed@outlook.com', created: 'Jun 26, 1:15 PM', configuration: 'Merchant, customer', lifetimeValue: 11300.00, status: 'restricted', isInternational: false, createdDays: 20 },
  { id: 'acct_1OmIYV2eZvKYmb9E', name: 'Priya Patel', email: 'priya.patel@yahoo.com', created: 'Jun 26, 2:00 PM', configuration: 'Merchant', lifetimeValue: 8750.00, status: 'enabled', isInternational: true, createdDays: 25 },
  { id: 'acct_1OnJZW2eZvKYmc0F', name: 'Olivia Harris', email: 'olivia.harris@gmail.com', created: 'Jun 25, 9:00 AM', configuration: 'Merchant, customer', lifetimeValue: 15800.00, status: 'enabled', isInternational: false, createdDays: 28 },
  { id: 'acct_1OoKAX2eZvKYmd1G', name: 'Nathan Park', email: 'nathan.park@yahoo.com', created: 'Jun 24, 3:30 PM', configuration: 'Merchant', lifetimeValue: 63200.00, status: 'in-review', isInternational: true, createdDays: 35 },
  { id: 'acct_1OpLBY2eZvKYme2H', name: 'Rachel Kim', email: 'rachel.kim@outlook.com', created: 'Jun 23, 11:00 AM', configuration: 'Customer', lifetimeValue: 27400.00, status: 'enabled', isInternational: false, createdDays: 40 },
  { id: 'acct_1OqMCZ2eZvKYmf3I', name: 'Tyler Scott', email: 'tyler.scott@hotmail.com', created: 'Jun 22, 8:45 AM', configuration: 'Merchant, customer', lifetimeValue: 91500.00, status: 'enabled', isInternational: false, createdDays: 45 },
  { id: 'acct_1OrNDA2eZvKYmg4J', name: 'Mia Anderson', email: 'mia.anderson@icloud.com', created: 'Jun 21, 2:15 PM', configuration: 'Customer', lifetimeValue: 5200.00, status: 'restricted-soon', isInternational: true, createdDays: 50 },
  { id: 'acct_1OsOEB2eZvKYmh5K', name: 'Liam Foster', email: 'liam.foster@gmail.com', created: 'Jun 20, 10:30 AM', configuration: 'Merchant', lifetimeValue: 44100.00, status: 'enabled', isInternational: false, createdDays: 55 },
  { id: 'acct_1OtPFC2eZvKYmi6L', name: 'Chloe Nguyen', email: 'chloe.nguyen@live.com', created: 'Jun 19, 4:00 PM', configuration: 'Merchant, customer', lifetimeValue: 36800.00, status: 'rejected', isInternational: true, createdDays: 60 },
  { id: 'acct_1OuQGD2eZvKYmj7M', name: 'Ethan Brooks', email: 'ethan.brooks@proton.me', created: 'Jun 18, 7:30 AM', configuration: 'Customer', lifetimeValue: 19700.00, status: 'enabled', isInternational: false, createdDays: 65 },
  { id: 'acct_1OvRHE2eZvKYmk8N', name: 'Ava Mitchell', email: 'ava.mitchell@comcast.com', created: 'Jun 17, 1:00 PM', configuration: 'Merchant', lifetimeValue: 57300.00, status: 'enabled', isInternational: false, createdDays: 70 },
  { id: 'acct_1OwSIF2eZvKYml9O', name: 'Jack Turner', email: 'jack.turner@verizon.net', created: 'Jun 16, 9:45 AM', configuration: 'Merchant, customer', lifetimeValue: 3900.00, status: 'restricted', isInternational: true, createdDays: 80 },
];

const fmt = (n) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtCompact = (n) => {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
};

const PAGE_SIZE = 15;

// ==============================
// Summary stat card
// ==============================

function StatCard({ label, value, change, changeColor }) {
  return (
    <div className="flex-1 border border-border px-3 py-2 bg-surface flex items-center justify-between" style={{ borderRadius: '12px' }}>
      <div className="flex items-center gap-3">
        <span className="text-subdued" style={{ fontSize: '13px', fontWeight: 500 }}>{label}</span>
        <span className="text-default" style={{ fontSize: '16px', fontWeight: 700 }}>{value}</span>
        {change && (
          <span style={{ fontSize: '12px', fontWeight: 600, color: changeColor || '#217005' }}>{change}</span>
        )}
      </div>
      <span className="text-icon-subdued"><InfoIcon size={12} /></span>
    </div>
  );
}

// ==============================
// Main component
// ==============================

export default function NetworkList() {
  const navigate = useNavigate();
  const { getVariable } = usePrototype();
  const zebraRows = getVariable('zebraRows', true);
  const showTabs = getVariable('showTabs', true);
  const showMetrics = getVariable('showMetrics', true);
  const showDescription = getVariable('showDescription', true);
  const [activeTab, setActiveTab] = useState('all');
  const [activeChip, setActiveChip] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Column reordering
  const defaultColumns = [
    { id: 'name', label: 'Account', align: 'left', isPrimary: true },
    { id: 'email', label: 'Email', align: 'left' },
    { id: 'created', label: 'Created', align: 'left' },
    { id: 'configuration', label: 'Configuration', align: 'left' },
    { id: 'lifetimeValue', label: 'Lifetime value', align: 'right', hasInfo: true },
  ];
  const [columns, setColumns] = useState(defaultColumns);
  const [dragCol, setDragCol] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (colId) => {
    setDragCol(colId);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (colId !== dragCol) {
      setDragOverCol(colId);
    }
  };

  const handleDrop = (colId) => {
    if (!dragCol || dragCol === colId) {
      setDragCol(null);
      setDragOverCol(null);
      return;
    }
    setColumns((prev) => {
      const fromIdx = prev.findIndex((c) => c.id === dragCol);
      const toIdx = prev.findIndex((c) => c.id === colId);
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setDragCol(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDragCol(null);
    setDragOverCol(null);
  };

  const renderCellValue = (acct, colId) => {
    switch (colId) {
      case 'email': return acct.email;
      case 'created': return acct.created;
      case 'configuration': return acct.configuration;
      case 'lifetimeValue': return fmt(acct.lifetimeValue);
      default: return '';
    }
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const filterRef = useRef(null);

  const tabItems = [
    { key: 'all', label: 'All' },
    { key: 'merchants', label: 'Merchants' },
    { key: 'customers', label: 'Customers' },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveChip('all');
    setPage(0);
  };

  const filterOptions = [
    { id: 'email', label: 'Email' },
    { id: 'name', label: 'Name' },
    { id: 'created-date', label: 'Created date' },
    { id: 'type', label: 'Type' },
    { id: 'country', label: 'Country' },
    { id: 'payment-method', label: 'Payment method' },
    { id: 'last-4', label: 'Last 4 digits' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'delinquent', label: 'Delinquent' },
    { id: 'metadata-1', label: ':metadata:account_tier', tag: 'Metadata' },
    { id: 'metadata-2', label: ':metadata:region', tag: 'Metadata' },
  ];

  useEffect(() => {
    if (!filterMenuOpen) return;
    const handleClick = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterMenuOpen]);

  const addFilter = (filterId) => {
    if (!activeFilters.includes(filterId)) {
      setActiveFilters([...activeFilters, filterId]);
    }
    setFilterMenuOpen(false);
  };

  const chipsByTab = {
    all: [
      { id: 'all', label: 'All' },
      { id: 'restricted', label: 'Restricted' },
      { id: 'restricted-soon', label: 'Restricted soon' },
      { id: 'in-review', label: 'In review' },
      { id: 'rejected', label: 'Rejected' },
      { id: 'enabled', label: 'Enabled' },
      { id: 'recently-added', label: 'Recently added' },
      { id: 'highest-lifetime', label: 'Highest lifetime value' },
    ],
    merchants: [
      { id: 'all', label: 'All' },
      { id: 'active', label: 'Active' },
      { id: 'restricted', label: 'Restricted' },
      { id: 'payouts-enabled', label: 'Payouts enabled' },
      { id: 'top-volume', label: 'Top volume' },
      { id: 'recently-added', label: 'Recently added' },
    ],
    customers: [
      { id: 'all', label: 'All' },
      { id: 'subscribers', label: 'Subscribers' },
      { id: 'international', label: 'International' },
      { id: 'last-30-days', label: 'Last 30 days' },
      { id: 'highest-lifetime', label: 'Highest lifetime value' },
    ],
  };

  const chipItems = chipsByTab[activeTab] || chipsByTab.all;

  // -- Filtering pipeline --

  // 1. Tab filter
  const tabFiltered = accounts.filter((acct) => {
    if (activeTab === 'merchants') return acct.configuration.includes('Merchant');
    if (activeTab === 'customers') return acct.configuration.includes('Customer');
    return true;
  });

  // 2. Chip filter
  const chipFiltered = tabFiltered.filter((acct) => {
    if (activeChip === 'all') return true;
    if (activeChip === 'restricted') return acct.status === 'restricted';
    if (activeChip === 'restricted-soon') return acct.status === 'restricted-soon';
    if (activeChip === 'in-review') return acct.status === 'in-review';
    if (activeChip === 'rejected') return acct.status === 'rejected';
    if (activeChip === 'enabled') return acct.status === 'enabled';
    if (activeChip === 'recently-added') return acct.createdDays <= 7;
    if (activeChip === 'highest-lifetime') return acct.lifetimeValue >= 50000;
    if (activeChip === 'active') return acct.status === 'enabled';
    if (activeChip === 'payouts-enabled') return acct.status === 'enabled';
    if (activeChip === 'top-volume') return acct.lifetimeValue >= 50000;
    if (activeChip === 'subscribers') return acct.lifetimeValue >= 20000;
    if (activeChip === 'international') return acct.isInternational;
    if (activeChip === 'last-30-days') return acct.createdDays <= 30;
    return true;
  });

  // 3. Search filter
  const filtered = chipFiltered.filter((acct) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      acct.name.toLowerCase().includes(q) ||
      acct.email.toLowerCase().includes(q) ||
      acct.id.toLowerCase().includes(q) ||
      acct.configuration.toLowerCase().includes(q)
    );
  });

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [activeChip, search]);

  // -- Pagination --
  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rangeStart = totalFiltered === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, totalFiltered);

  // -- Summary stats --
  const totalLifetime = tabFiltered.reduce((sum, a) => sum + a.lifetimeValue, 0);
  const totalAccounts = tabFiltered.length;
  const newAccounts = tabFiltered.filter((a) => a.createdDays <= 30).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-default" style={{
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: '36px',
          }}>Network</h1>
          {showDescription && <p className="text-subdued" style={{
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            marginTop: '4px',
          }}>Unified view of accounts on this platform</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon="export">Export</Button>
          <Button variant="secondary" icon="barChart">Analyze</Button>
          <Button variant="primary" icon="add">New account</Button>
        </div>
      </div>

      {/* Tabs */}
      {showTabs && (
        <div className="mb-5">
          <Tabs tabs={tabItems} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}

      {/* Account group chips */}
      <ChipGroup items={chipItems} value={activeChip} onChange={(v) => { setActiveChip(v); setPage(0); }} className="mb-4" />

      {/* Search bar */}
      <div className="flex items-center border border-border px-3 gap-3 mb-4" style={{ borderRadius: '16px', height: '48px' }} ref={filterRef}>
        <div className="relative">
          <button
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className="flex items-center justify-center shrink-0 bg-offset hover:bg-[#E8EAEE] transition-colors cursor-pointer"
            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-icon-subdued">
              <path d="M2 4.5h12M4 8h8M6 11.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {filterMenuOpen && (
            <div
              className="absolute top-full left-0 mt-2 bg-surface border border-border shadow-lg z-50"
              style={{ borderRadius: '12px', width: '280px', maxHeight: '400px', overflowY: 'auto', padding: '12px' }}
            >
              <div style={{ padding: '4px 4px 8px' }}>
                <span className="text-default" style={{ fontSize: '15px', fontWeight: 600 }}>Filter</span>
              </div>
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => addFilter(opt.id)}
                  className="w-full text-left text-default hover:bg-offset transition-colors flex items-center justify-between cursor-pointer"
                  style={{ fontSize: '14px', fontWeight: 400, padding: '8px 4px', borderRadius: '6px' }}
                >
                  <span>{opt.label}</span>
                  {opt.tag && (
                    <span className="text-subdued bg-offset px-2 py-0.5 text-xs rounded" style={{ fontSize: '12px' }}>{opt.tag}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, ID, or description"
          className="flex-1 bg-transparent text-default placeholder-placeholder focus:outline-none"
          style={{ fontSize: '14px', lineHeight: '20px' }}
        />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-icon-subdued shrink-0 cursor-pointer hover:text-icon-default transition-colors">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Summary stat cards */}
      {showMetrics && <div className="flex gap-3 mb-4">
        <StatCard label="Lifetime value" value={fmtCompact(totalLifetime)} change="+8.40%" />
        <StatCard label="Total accounts" value={totalAccounts.toLocaleString()} change="-3.50%" changeColor="#C0123C" />
        <StatCard label="New accounts" value={newAccounts.toString()} change="+10.65%" />
      </div>}

      {/* Table */}
      <div className="overflow-x-auto -mx-6">
        <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
          <thead>
            <tr>
              {columns.map((col, i) => {
                const isFirst = i === 0;
                const isLast = i === columns.length - 1;
                const px = isFirst ? 'pr-6' : isLast ? 'pl-6' : 'px-6';
                return (
                  <th
                    key={col.id}
                    draggable
                    onDragStart={() => handleDragStart(col.id)}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDrop={() => handleDrop(col.id)}
                    onDragEnd={handleDragEnd}
                    className={`${isLast ? 'text-right' : `text-${col.align}`} ${px} align-middle text-default group/th relative select-none`}
                    style={{
                      fontSize: '14px', fontWeight: 600, lineHeight: '20px', whiteSpace: 'nowrap', height: '44px',
                      ...(isFirst ? { width: '220px', paddingLeft: col.isPrimary ? '34px' : '24px' } : {}),
                      ...(isLast ? { paddingRight: '24px' } : {}),
                      opacity: dragCol === col.id ? 0.4 : 1,
                      borderLeft: dragOverCol === col.id && dragCol !== col.id ? '2px solid var(--color-brand)' : '2px solid transparent',
                      transition: 'opacity 150ms',
                    }}
                  >
                    <span className={`inline-flex items-center gap-1.5 ${isLast || col.align === 'right' ? 'justify-end' : ''}`}>
                      {col.hasInfo && <span className="text-icon-subdued"><InfoIcon size={12} /></span>}
                      {col.label}
                      <svg
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                        className="opacity-0 group-hover/th:opacity-100 transition-opacity cursor-grab text-icon-subdued shrink-0"
                      >
                        <circle cx="4" cy="2.5" r="1" fill="currentColor" />
                        <circle cx="8" cy="2.5" r="1" fill="currentColor" />
                        <circle cx="4" cy="6" r="1" fill="currentColor" />
                        <circle cx="8" cy="6" r="1" fill="currentColor" />
                        <circle cx="4" cy="9.5" r="1" fill="currentColor" />
                        <circle cx="8" cy="9.5" r="1" fill="currentColor" />
                      </svg>
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginated.map((acct, index) => {
              const isSelected = selectedRows.has(acct.id);
              const bg = isSelected ? '#F4F7FA' : zebraRows && index % 2 === 0 ? 'rgb(250, 251, 251)' : 'var(--color-surface)';
              return (
              <tr
                key={acct.id}
                className="cursor-pointer transition-colors group"
                style={{ height: '44px' }}
                onClick={() => navigate(`/prototypes/network/${acct.id}`)}
              >
                {columns.map((col, colIdx) => {
                  const isFirst = colIdx === 0;
                  const isLast = colIdx === columns.length - 1;
                  const px = isFirst ? 'pr-6' : isLast ? 'pl-6' : 'px-6';
                  const radius = isFirst ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : '0';

                  if (col.isPrimary) {
                    return (
                      <td key={col.id} className={`${px} align-middle text-default`} style={{ width: '220px', paddingLeft: '8px', background: bg, borderRadius: radius, fontWeight: 600, fontSize: '14px', letterSpacing: '-0.15px' }}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex items-center justify-center shrink-0 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            onClick={(e) => { e.stopPropagation(); toggleRow(acct.id); }}
                          >
                            <span
                              className="flex items-center justify-center rounded transition-colors"
                              style={{
                                width: '16px', height: '16px',
                                border: isSelected ? '1px solid #635BFF' : '1px solid #D4D9E1',
                                borderRadius: '4px',
                                background: isSelected ? '#635BFF' : '#FFFFFF',
                              }}
                            >
                              {isSelected && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                          </div>
                          {acct.name}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={col.id} className={`${px} align-middle text-default ${isLast || col.align === 'right' ? 'text-right' : ''}`} style={{ fontSize: '14px', whiteSpace: 'nowrap', background: bg, borderRadius: radius, ...(isLast ? { paddingRight: '24px' } : {}) }}>
                      {renderCellValue(acct, col.id)}
                    </td>
                  );
                })}
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className={`w-7 h-7 flex items-center justify-center rounded-md border border-border transition-colors ${page === 0 ? 'opacity-40 cursor-default' : 'hover:bg-offset cursor-pointer'}`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-icon-subdued" />
          </svg>
        </button>
        <button
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className={`w-7 h-7 flex items-center justify-center rounded-md border border-border transition-colors ${page >= totalPages - 1 ? 'opacity-40 cursor-default' : 'hover:bg-offset cursor-pointer'}`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-icon-subdued" />
          </svg>
        </button>
        <span className="text-subdued" style={{ fontSize: '13px' }}>
          {totalFiltered === 0 ? '0 results' : `${rangeStart}\u2013${rangeEnd} of ${totalFiltered.toLocaleString()} results`}
        </span>
      </div>
    </div>
  );
}
