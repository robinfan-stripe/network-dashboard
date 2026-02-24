import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { InfoIcon } from '../../components/icons';
import Tooltip from '../../components/Tooltip';
import Badge from '../../components/Badge';
import Tabs from '../../components/Tabs';
import { usePrototype } from '../../PrototypeContext';
import { accounts, fmt, fmtCompact } from '../../data/networkAccounts';

/**
 * Concept 3: "Segments + Stream"
 *
 * Visual account-group segment cards sit above a unified list.
 * Clicking a segment filters the list below.
 * Columns adapt to the selected segment for reduced density.
 * LTV column has a mode toggle between revenue views.
 */

const PAGE_SIZE = 15;

const SEGMENTS = [
  {
    id: 'all',
    label: 'All accounts',
    filter: () => true,
    metric: (data) => `${data.length} accounts`,
    sub: (data) => `${fmtCompact(data.reduce((s, a) => s + a.platformRevenue, 0))} platform revenue`,
  },
  {
    id: 'attention',
    label: 'Needs attention',
    filter: (a) => a.needsAttention,
    metric: (data) => `${data.length} accounts`,
    sub: (data) => {
      const prev = 3;
      const diff = data.length - prev;
      return diff > 0 ? `+${diff} from last week` : `${diff} from last week`;
    },
    accent: 'border-attention',
  },
  {
    id: 'paused',
    label: 'Payments paused',
    filter: (a) => a.paymentsPaused || a.payoutsPaused,
    metric: (data) => `${data.length} accounts`,
    sub: (data) => {
      const critical = data.filter(a => a.paymentsPaused && a.payoutsPaused).length;
      return critical > 0 ? `${critical} fully paused` : 'Payouts only';
    },
    accent: 'border-critical',
  },
  {
    id: 'top',
    label: 'Top earners',
    filter: (a) => a.lifetimeValue >= 50000,
    metric: (data) => fmtCompact(data.reduce((s, a) => s + a.platformRevenue, 0)),
    sub: (data) => `${data.length} accounts, top 10 avg`,
  },
  {
    id: 'new',
    label: 'New this month',
    filter: (a) => a.createdDays <= 30,
    metric: (data) => `${data.length}`,
    sub: () => 'Added in last 30 days',
  },
];

const SEGMENT_COLUMNS = {
  all: ['name', 'configuration', 'status', 'revenue', 'volume'],
  attention: ['name', 'reason', 'status', 'revenue'],
  paused: ['name', 'reason', 'status', 'revenue'],
  top: ['name', 'revenue', 'volume', 'products'],
  new: ['name', 'configuration', 'created', 'status'],
};

const LTV_MODES = [
  { id: 'platform', label: 'Revenue to you' },
  { id: 'platform30d', label: 'Revenue (30d)' },
  { id: 'volume', label: 'Account volume' },
];

function SegmentCard({ segment, data, active, onClick }) {
  const segData = data.filter(segment.filter);
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-0 border rounded-xl px-4 py-3 bg-surface transition-all cursor-pointer text-left ${
        active
          ? `border-brand ring-1 ring-brand/20 ${segment.accent || ''}`
          : 'border-border hover:border-neutral-300'
      }`}
    >
      <div className="text-xs font-medium text-subdued mb-1 truncate">{segment.label}</div>
      <div className="text-lg font-bold text-default">{segment.metric(segData)}</div>
      <div className="text-xs text-subdued mt-0.5 truncate">{segment.sub(segData)}</div>
    </button>
  );
}

function SegmentDetailBanner({ segment, data }) {
  const segData = data.filter(segment.filter);
  if (segment.id === 'all') return null;

  const descriptions = {
    attention: `${segData.length} accounts require your review. Resolve outstanding issues to keep payments and payouts flowing.`,
    paused: `${segData.length} accounts have payments or payouts currently paused. Action is needed to resume processing.`,
    top: `Your highest-value accounts by lifetime value. These ${segData.length} accounts generate ${fmtCompact(segData.reduce((s, a) => s + a.platformRevenue, 0))} in platform revenue.`,
    new: `${segData.length} accounts were added in the last 30 days. Monitor onboarding progress and early activity.`,
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-offset rounded-xl mb-4 text-sm">
      <span className="text-subdued">{descriptions[segment.id]}</span>
    </div>
  );
}

function getColumnDef(colId, ltvMode) {
  const defs = {
    name: { label: 'Account', align: 'left', render: (a) => <span className="font-semibold text-default">{a.name}</span> },
    configuration: { label: 'Configuration', align: 'left', render: (a) => a.configuration },
    status: { label: 'Status', align: 'left', render: (a) => {
      const v = { enabled: 'success', restricted: 'danger', 'restricted-soon': 'warning', 'in-review': 'info', rejected: 'danger' }[a.status] || 'default';
      const l = { enabled: 'Enabled', restricted: 'Restricted', 'restricted-soon': 'Restricted soon', 'in-review': 'In review', rejected: 'Rejected' }[a.status] || a.status;
      return <Badge variant={v}>{l}</Badge>;
    }},
    reason: { label: 'Reason', align: 'left', render: (a) => <span className="text-subdued">{a.attentionReason || '—'}</span> },
    revenue: { label: LTV_MODES.find(m => m.id === ltvMode)?.label || 'Revenue to you', align: 'right', render: (a) => {
      if (ltvMode === 'platform30d') return fmtCompact(a.platformRevenue30d);
      if (ltvMode === 'volume') return fmtCompact(a.accountVolume);
      return fmtCompact(a.platformRevenue);
    }},
    volume: { label: 'Account volume', align: 'right', render: (a) => fmtCompact(a.accountVolume) },
    created: { label: 'Created', align: 'left', render: (a) => a.created },
    products: { label: 'Products', align: 'left', render: (a) => a.products.join(', ') },
  };
  return defs[colId] || { label: colId, align: 'left', render: () => '' };
}

export default function NetworkListConcept3() {
  const navigate = useNavigate();
  const { getVariable } = usePrototype();
  const [activeSegment, setActiveSegment] = useState('all');
  const [ltvMode, setLtvMode] = useState('platform');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const segment = SEGMENTS.find(s => s.id === activeSegment) || SEGMENTS[0];
  const segFiltered = accounts.filter(segment.filter);
  const filtered = segFiltered.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
  });

  useEffect(() => { setPage(0); }, [activeSegment, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, filtered.length);

  const colIds = SEGMENT_COLUMNS[activeSegment] || SEGMENT_COLUMNS.all;
  const columns = colIds.map(id => ({ id, ...getColumnDef(id, ltvMode) }));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-default" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}>Network</h1>
          <p className="text-subdued mt-1" style={{ fontSize: '16px', lineHeight: '24px' }}>Your unified view of all accounts on this platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon="export">Export</Button>
          <Button variant="primary" icon="add">New account</Button>
        </div>
      </div>

      {/* Segment tabs */}
      <div className="mb-4">
        <Tabs
          tabs={SEGMENTS.map(s => ({ key: s.id, label: s.label }))}
          activeTab={activeSegment}
          onTabChange={setActiveSegment}
        />
      </div>

      {/* Segment insight cards */}
      <div className="flex gap-3 mb-4">
        {SEGMENTS.filter(s => s.id !== 'all').map(seg => {
          const segData = accounts.filter(seg.filter);
          return (
            <div
              key={seg.id}
              className={`flex-1 min-w-0 border rounded-xl px-4 py-3 bg-surface transition-all cursor-pointer text-left ${
                activeSegment === seg.id
                  ? `border-brand ring-1 ring-brand/20`
                  : 'border-border hover:border-neutral-300'
              }`}
              onClick={() => setActiveSegment(seg.id)}
            >
              <div className="text-xs font-medium text-subdued mb-1 truncate">{seg.label}</div>
              <div className="text-lg font-bold text-default">{seg.metric(segData)}</div>
              <div className="text-xs text-subdued mt-0.5 truncate">{seg.sub(segData)}</div>
            </div>
          );
        })}
      </div>

      {/* Segment detail banner */}
      <SegmentDetailBanner segment={segment} data={accounts} />

      {/* Search */}
      <div className="flex items-center border border-border px-3 gap-3 mb-4" style={{ borderRadius: '16px', height: '48px' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-icon-subdued shrink-0">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or ID"
          className="flex-1 bg-transparent text-default placeholder-placeholder focus:outline-none"
          style={{ fontSize: '14px', lineHeight: '20px' }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6">
        <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              {columns.map((col, i) => {
                const isFirst = i === 0;
                const isLast = i === columns.length - 1;
                return (
                  <th
                    key={col.id}
                    className={`${col.align === 'right' ? 'text-right' : 'text-left'} ${isFirst ? 'pr-6' : isLast ? 'pl-6' : 'px-6'} text-default`}
                    style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap', ...(isFirst ? { paddingLeft: '24px' } : {}), ...(isLast ? { paddingRight: '24px' } : {}) }}
                  >
                    {col.label}
                  </th>
                );
              })}
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
                  {columns.map((col, i) => {
                    const isFirst = i === 0;
                    const isLast = i === columns.length - 1;
                    const radius = isFirst ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : '0';
                    return (
                      <td
                        key={col.id}
                        className={`${col.align === 'right' ? 'text-right' : 'text-left'} ${isFirst ? 'pr-6' : isLast ? 'pl-6' : 'px-6'} align-middle text-subdued`}
                        style={{ fontSize: '14px', whiteSpace: 'nowrap', background: bg, borderRadius: radius, ...(isFirst ? { paddingLeft: '24px' } : {}), ...(isLast ? { paddingRight: '24px' } : {}) }}
                      >
                        {col.render(acct)}
                      </td>
                    );
                  })}
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
