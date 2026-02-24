import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { InfoIcon } from '../../components/icons';
import { ChipGroup } from '../../components/ChipGroup';
import Badge from '../../components/Badge';
import Tabs from '../../components/Tabs';
import Tooltip from '../../components/Tooltip';
import { usePrototype } from '../../PrototypeContext';
import { accounts, fmtCompact } from '../../data/networkAccounts';

/**
 * Concept 4: "Header Metrics"
 *
 * A prominent header block with key metrics/insights on the right,
 * inspired by the Stripe Customer detail page pattern.
 * Title + description + actions on the left, metric cards on the right.
 * Tabs + search + zebra table below.
 */

const PAGE_SIZE = 15;

const TAB_ITEMS = [
  { key: 'all', label: 'All accounts' },
  { key: 'merchants', label: 'Merchants' },
  { key: 'customers', label: 'Customers' },
  { key: 'attention', label: 'Needs attention' },
  { key: 'new', label: 'Recently added' },
];

function tabFilter(tabKey, acct) {
  switch (tabKey) {
    case 'merchants': return acct.configuration.includes('Merchant');
    case 'customers': return acct.configuration.includes('Customer');
    case 'attention': return acct.needsAttention;
    case 'new': return acct.createdDays <= 7;
    default: return true;
  }
}

function PageHeader({ data }) {
  const totalAccounts = data.length;
  const attentionCount = data.filter(a => a.needsAttention).length;
  const platformRevenue = data.reduce((s, a) => s + a.platformRevenue, 0);
  const newAccounts = data.filter(a => a.createdDays <= 30).length;

  const cardStyle = {
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 1px 3px rgba(99, 91, 255, 0.04), 0 0 1px rgba(99, 91, 255, 0.06)',
  };

  return (
    <div className="relative overflow-hidden mb-5" style={{ borderRadius: '16px', padding: '8px' }}>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #F8F7FC 0%, #F6F4FB 10%, #F5F1FA 20%, #F4EDF9 32%, #F3E8F6 44%, #F2E3F3 56%, #F1DDF0 68%, #F0D7EC 80%, #EFD1E8 90%, #EDCBE4 100%)',
      }} />
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 55% 120% at 100% 50%, rgba(220, 140, 200, 0.12) 0%, transparent 55%),
          radial-gradient(ellipse 40% 90% at 95% 80%, rgba(200, 120, 180, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 50% 35% at 40% 0%, rgba(230, 220, 245, 0.06) 0%, transparent 45%),
          radial-gradient(ellipse 35% 70% at 5% 50%, rgba(255, 255, 255, 0.6) 0%, transparent 55%)
        `,
        pointerEvents: 'none',
      }} />

      <div className="relative flex items-start justify-between gap-6">
        <div className="flex flex-col justify-between self-stretch shrink-0" style={{ padding: '24px 0 24px 24px', minWidth: '240px' }}>
          <div>
            <h1 className="text-default" style={{
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '28px',
              fontWeight: 700,
              lineHeight: '36px',
              whiteSpace: 'nowrap',
            }}>Network</h1>
            <p className="text-subdued" style={{
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '24px',
              marginTop: '4px',
              whiteSpace: 'nowrap',
            }}>Your unified view of all accounts on this platform</p>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Button variant="primary" icon="add">New account</Button>
            <Button variant="secondary" icon="export">Export</Button>
            <Button variant="secondary" icon="barChart">Analyze</Button>
          </div>
        </div>

        <div className="grid gap-2.5 flex-1" style={{
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          minWidth: '280px',
          maxWidth: '420px',
        }}>
          <div className="row-span-2 flex flex-col justify-between px-3.5 py-3 metric-card-hover" style={cardStyle}>
            <Tooltip content="Total fees and subscription revenue your platform has earned across all connected accounts." placement="top" usePortal>
              <span className="text-subdued inline-flex items-center gap-1 cursor-help" style={{ fontSize: '14px', fontWeight: 400 }}>Platform revenue <InfoIcon size={12} /></span>
            </Tooltip>
            <div>
              <span className="text-default block" style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.4px' }}>{fmtCompact(platformRevenue)}</span>
              <span className="text-subdued" style={{ fontSize: '12px', marginTop: '3px', display: 'block' }}>All time</span>
            </div>
          </div>
          <div className="px-3.5 py-2.5 flex flex-col justify-between metric-card-hover" style={cardStyle}>
            <Tooltip content="All merchants and customers currently connected to your platform, including enabled, restricted, and in-review accounts." placement="top" usePortal>
              <span className="text-subdued inline-flex items-center gap-1 cursor-help" style={{ fontSize: '14px', fontWeight: 400 }}>Total accounts <InfoIcon size={12} /></span>
            </Tooltip>
            <span className="text-default" style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px' }}>{totalAccounts.toLocaleString()}</span>
          </div>
          <div className="px-3.5 py-2.5 flex flex-col justify-between metric-card-hover" style={cardStyle}>
            <Tooltip content="Accounts with issues that may need your action — such as restricted access, pending verification, or flagged activity." placement="top" usePortal>
              <span className="text-subdued inline-flex items-center gap-1 cursor-help" style={{ fontSize: '14px', fontWeight: 400 }}>Needs attention <InfoIcon size={12} /></span>
            </Tooltip>
            <span className={attentionCount > 0 ? 'text-attention' : 'text-default'} style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px' }}>{attentionCount.toString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const statusVariantMap = { enabled: 'success', restricted: 'danger', 'restricted-soon': 'warning', 'in-review': 'info', rejected: 'danger' };
const statusLabelMap = { enabled: 'Enabled', restricted: 'Restricted', 'restricted-soon': 'Restricted soon', 'in-review': 'In review', rejected: 'Rejected' };

export default function NetworkListConcept4() {
  const navigate = useNavigate();
  const { getVariable } = usePrototype();
  const [activeTab, setActiveTab] = useState('all');
  const [activeChip, setActiveChip] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [chipPopoverOpen, setChipPopoverOpen] = useState(false);
  const [filterCondition, setFilterCondition] = useState('is');
  const [filterValue, setFilterValue] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const chipPopoverRef = useRef(null);
  const filterRef = useRef(null);

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

  useEffect(() => {
    if (!chipPopoverOpen) return;
    const handleClick = (e) => {
      if (chipPopoverRef.current && !chipPopoverRef.current.contains(e.target)) {
        setChipPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [chipPopoverOpen]);

  const addFilter = (filterId) => {
    if (!activeFilters.includes(filterId)) {
      setActiveFilters([...activeFilters, filterId]);
    }
    setFilterMenuOpen(false);
  };

  const chipFilterMap = {
    'restricted': { category: 'Status', value: 'Restricted', options: ['Restricted', 'Restricted soon', 'In review', 'Rejected', 'Active', 'Pending'] },
    'restricted-soon': { category: 'Status', value: 'Restricted soon', options: ['Restricted', 'Restricted soon', 'In review', 'Rejected', 'Active', 'Pending'] },
    'in-review': { category: 'Status', value: 'In review', options: ['Restricted', 'Restricted soon', 'In review', 'Rejected', 'Active', 'Pending'] },
    'rejected': { category: 'Status', value: 'Rejected', options: ['Restricted', 'Restricted soon', 'In review', 'Rejected', 'Active', 'Pending'] },
    'enabled': { category: 'Status', value: 'Active', options: ['Restricted', 'Restricted soon', 'In review', 'Rejected', 'Active', 'Pending'] },
    'recently-added': { category: 'Created', value: 'Last 7 days', options: ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last year'] },
    'highest-lifetime': { category: 'Lifetime value', value: '$50K+', options: ['$1K+', '$10K+', '$50K+', '$100K+', '$500K+'] },
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
      { id: 'enabled', label: 'Active' },
      { id: 'restricted', label: 'Restricted' },
      { id: 'in-review', label: 'In review' },
      { id: 'highest-lifetime', label: 'Top volume' },
      { id: 'recently-added', label: 'Recently added' },
    ],
    customers: [
      { id: 'all', label: 'All' },
      { id: 'enabled', label: 'Active' },
      { id: 'restricted', label: 'Restricted' },
      { id: 'highest-lifetime', label: 'Highest lifetime value' },
      { id: 'recently-added', label: 'Recently added' },
    ],
    attention: [
      { id: 'all', label: 'All' },
      { id: 'restricted', label: 'Restricted' },
      { id: 'restricted-soon', label: 'Restricted soon' },
      { id: 'in-review', label: 'In review' },
      { id: 'rejected', label: 'Rejected' },
    ],
    new: [
      { id: 'all', label: 'All' },
      { id: 'enabled', label: 'Enabled' },
      { id: 'restricted', label: 'Restricted' },
      { id: 'in-review', label: 'In review' },
    ],
  };
  const chipItems = chipsByTab[activeTab] || chipsByTab.all;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveChip('all');
    setPage(0);
  };

  const tabFiltered = accounts.filter(a => tabFilter(activeTab, a));

  const chipFiltered = tabFiltered.filter((acct) => {
    if (activeChip === 'all') return true;
    if (activeChip === 'restricted') return acct.status === 'restricted';
    if (activeChip === 'restricted-soon') return acct.status === 'restricted-soon';
    if (activeChip === 'in-review') return acct.status === 'in-review';
    if (activeChip === 'rejected') return acct.status === 'rejected';
    if (activeChip === 'enabled') return acct.status === 'enabled';
    if (activeChip === 'recently-added') return acct.createdDays <= 7;
    if (activeChip === 'highest-lifetime') return acct.lifetimeValue >= 50000;
    return true;
  });

  const filtered = chipFiltered.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
  });

  useEffect(() => { setPage(0); }, [activeTab, activeChip, search]);

  useEffect(() => {
    if (activeChip !== 'all' && chipFilterMap[activeChip]) {
      setFilterCondition('is');
      setFilterValue(chipFilterMap[activeChip].value);
    }
  }, [activeChip]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, filtered.length);

  return (
    <div className="p-8">
      {/* Header with metrics */}
      <PageHeader data={accounts} />

      {/* Tabs */}
      <div className="mb-4">
        <Tabs
          tabs={TAB_ITEMS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Chips */}
      <ChipGroup items={chipItems} value={activeChip} onChange={(v) => { setActiveChip(v); setPage(0); }} className="mb-2" />

      {/* Search bar container */}
      <div className="border border-border focus-within:shadow-[inset_0_0_0_1px_var(--color-border)] px-3 mb-4" style={{ borderRadius: '12px' }} ref={filterRef}>
        <div className="flex items-center gap-3" style={{ height: '48px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, ID, or description"
            className="flex-1 bg-transparent text-default placeholder-subdued focus:outline-none"
            style={{ fontSize: '14px', lineHeight: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
          />
        </div>

        {activeChip !== 'all' && chipFilterMap[activeChip] && (
          <div className="flex items-center gap-2 pb-3">
            <div className="relative">
              <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="flex items-center justify-center shrink-0 border border-border bg-surface hover:bg-offset transition-colors cursor-pointer"
              style={{ width: '28px', height: '28px', borderRadius: '8px' }}
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
            <div className="relative" ref={chipPopoverRef}>
              <div
                onClick={() => setChipPopoverOpen(!chipPopoverOpen)}
                className="inline-flex items-center bg-white hover:bg-offset transition-colors cursor-pointer"
                style={{ borderRadius: '8px', padding: '3px 8px 3px 6px', fontSize: '12px', lineHeight: '20px', gap: '6px', border: '1px solid rgb(212, 222, 233)', height: '28px' }}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveChip('all'); setPage(0); setChipPopoverOpen(false); }}
                  className="flex items-center justify-center hover:text-brand text-icon-subdued transition-colors cursor-pointer shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M4 4l4 4M8 4l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>
                <span className="text-default" style={{ fontWeight: 600 }}>{chipFilterMap[activeChip].category}</span>
                <span style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />
                <span className="text-brand" style={{ fontWeight: 600 }}>{chipFilterMap[activeChip].value}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-icon-subdued shrink-0">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {chipPopoverOpen && (
                <div
                  className="absolute top-full left-0 mt-2 bg-surface border border-border shadow-lg z-50"
                  style={{ borderRadius: '12px', padding: '10px', width: '264px' }}
                >
                  <div className="text-default" style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                    Filter by: {chipFilterMap[activeChip].category.toLowerCase()}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <select
                        value={filterCondition}
                        onChange={(e) => setFilterCondition(e.target.value)}
                        className="w-full bg-surface border border-border text-default appearance-none cursor-pointer"
                        style={{ borderRadius: '8px', padding: '8px 32px 8px 12px', fontSize: '14px', fontWeight: 500, height: '40px' }}
                      >
                        <option value="is">is</option>
                        <option value="is not">is not</option>
                        <option value="contains">contains</option>
                        <option value="does not contain">does not contain</option>
                      </select>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-subdued pointer-events-none">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="relative">
                      <select
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="w-full bg-surface border border-border text-default appearance-none cursor-pointer"
                        style={{ borderRadius: '8px', padding: '8px 32px 8px 12px', fontSize: '14px', fontWeight: 500, height: '40px' }}
                      >
                        {chipFilterMap[activeChip].options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 text-icon-subdued pointer-events-none">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <Button variant="primary" size="md" className="w-full mt-3" onClick={() => setChipPopoverOpen(false)}>
                    Apply
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6">
        <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              <th className="text-left pr-6" style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap', paddingLeft: '24px', color: '#1A2C44' }}>Account</th>
              <th className="text-left px-6" style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap', color: '#1A2C44' }}>Configuration</th>
              <th className="text-left px-6" style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap', color: '#1A2C44' }}>Status</th>
              <th className="text-right px-6" style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap', color: '#1A2C44' }}>
                <Tooltip content="Fees and subscription revenue your platform earns from this account." variant="minimal" placement="top">
                  <span className="inline-flex items-center gap-1.5 cursor-help">Revenue to you <InfoIcon size={12} /></span>
                </Tooltip>
              </th>
              <th className="text-right pl-6" style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap', paddingRight: '24px', color: '#1A2C44' }}>
                <Tooltip content="Total payment volume processed by this account." variant="minimal" placement="top">
                  <span className="inline-flex items-center gap-1.5 cursor-help">Account volume <InfoIcon size={12} /></span>
                </Tooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((acct, index) => {
              const bg = index % 2 === 0 ? 'rgb(250, 251, 251)' : 'var(--color-surface)';
              return (
                <tr
                  key={acct.id}
                  className="cursor-pointer transition-colors group"
                  style={{ height: '44px' }}
                  onClick={() => navigate(`/prototypes/network/${acct.id}`)}
                >
                  <td className="pr-6 align-middle" style={{ fontSize: '14px', fontWeight: 600, paddingLeft: '24px', background: bg, borderRadius: '8px 0 0 8px', color: '#1A2C44' }}>
                    <div className="flex items-center gap-2">
                      {acct.needsAttention && (
                        <Tooltip content={acct.attentionReason} variant="minimal" placement="right">
                          <span className="w-2 h-2 rounded-full bg-attention shrink-0" />
                        </Tooltip>
                      )}
                      <span>{acct.name}</span>
                    </div>
                  </td>
                  <td className="px-6 align-middle" style={{ fontSize: '14px', background: bg, color: '#1A2C44' }}>
                    {acct.configuration}
                  </td>
                  <td className="px-6 align-middle" style={{ background: bg }}>
                    <Badge variant={statusVariantMap[acct.status] || 'default'}>{statusLabelMap[acct.status] || acct.status}</Badge>
                  </td>
                  <td className="px-6 align-middle text-right" style={{ fontSize: '14px', background: bg, color: '#1A2C44' }}>
                    {fmtCompact(acct.platformRevenue)}
                  </td>
                  <td className="pl-6 align-middle text-right" style={{ fontSize: '14px', paddingRight: '24px', background: bg, borderRadius: '0 8px 8px 0', color: '#1A2C44' }}>
                    {fmtCompact(acct.accountVolume)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-3 mt-3">
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className={`w-7 h-7 flex items-center justify-center rounded-md border border-border transition-colors ${page === 0 ? 'opacity-40 cursor-default' : 'hover:bg-offset cursor-pointer'}`}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-icon-subdued" /></svg>
        </button>
        <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className={`w-7 h-7 flex items-center justify-center rounded-md border border-border transition-colors ${page >= totalPages - 1 ? 'opacity-40 cursor-default' : 'hover:bg-offset cursor-pointer'}`}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-icon-subdued" /></svg>
        </button>
        <span className="text-subdued" style={{ fontSize: '13px' }}>
          {filtered.length === 0 ? '0 results' : `${rangeStart}\u2013${rangeEnd} of ${filtered.length} results`}
        </span>
      </div>
    </div>
  );
}
