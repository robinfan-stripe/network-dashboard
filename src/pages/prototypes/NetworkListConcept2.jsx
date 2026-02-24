import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { InfoIcon } from '../../components/icons';
import Badge from '../../components/Badge';
import Tabs from '../../components/Tabs';
import { usePrototype } from '../../PrototypeContext';
import { accounts, fmt, fmtCompact } from '../../data/networkAccounts';

/**
 * Concept 2: "Saved Views"
 *
 * User-configurable list views with per-view aggregate dashboards.
 * Ships with starter views; users can create custom views.
 * Column configuration lets users choose which data to display.
 * Optional row grouping by status, configuration, or country.
 */

const PAGE_SIZE = 15;

const STARTER_VIEWS = [
  { id: 'all', label: 'All', filter: () => true },
  { id: 'remediation', label: 'Needs remediation', filter: (a) => a.needsAttention || a.status === 'restricted' || a.status === 'restricted-soon' || a.status === 'in-review' },
  { id: 'high-ltv', label: 'High LTV', filter: (a) => a.lifetimeValue >= 50000 },
  { id: 'new', label: 'New this month', filter: (a) => a.createdDays <= 30 },
];

const AVAILABLE_COLUMNS = [
  { id: 'name', label: 'Account', defaultOn: true },
  { id: 'status', label: 'Status', defaultOn: true },
  { id: 'platformRevenue', label: 'Fees to platform', defaultOn: true },
  { id: 'accountVolume', label: 'Acct volume', defaultOn: true },
  { id: 'email', label: 'Email', defaultOn: false },
  { id: 'created', label: 'Created', defaultOn: false },
  { id: 'configuration', label: 'Configuration', defaultOn: false },
  { id: 'platformRevenue30d', label: 'Fees (30d)', defaultOn: false },
  { id: 'products', label: 'Products', defaultOn: false },
];

function ViewDashboard({ viewId, data }) {
  if (viewId === 'remediation') {
    const restricted = data.filter(a => a.status === 'restricted').length;
    const restrictedSoon = data.filter(a => a.status === 'restricted-soon').length;
    const inReview = data.filter(a => a.status === 'in-review').length;
    return (
      <div className="flex gap-3 mb-4">
        <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
          <div className="text-xs font-medium text-subdued mb-1">Restricted</div>
          <div className="text-xl font-bold text-critical">{restricted}</div>
        </div>
        <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
          <div className="text-xs font-medium text-subdued mb-1">Restricted soon</div>
          <div className="text-xl font-bold text-attention">{restrictedSoon}</div>
        </div>
        <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
          <div className="text-xs font-medium text-subdued mb-1">In review</div>
          <div className="text-xl font-bold text-info">{inReview}</div>
        </div>
        <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
          <div className="text-xs font-medium text-subdued mb-1">Total accounts</div>
          <div className="text-xl font-bold text-default">{data.length}</div>
        </div>
      </div>
    );
  }
  if (viewId === 'high-ltv') {
    const totalRev = data.reduce((s, a) => s + a.platformRevenue, 0);
    const totalVol = data.reduce((s, a) => s + a.accountVolume, 0);
    const avgLtv = data.length ? data.reduce((s, a) => s + a.lifetimeValue, 0) / data.length : 0;
    return (
      <div className="flex gap-3 mb-4">
        <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
          <div className="text-xs font-medium text-subdued mb-1">Accounts</div>
          <div className="text-xl font-bold text-default">{data.length}</div>
        </div>
        <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
          <div className="text-xs font-medium text-subdued mb-1">Platform revenue</div>
          <div className="text-xl font-bold text-default">{fmtCompact(totalRev)}</div>
        </div>
        <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
          <div className="text-xs font-medium text-subdued mb-1">Total volume</div>
          <div className="text-xl font-bold text-default">{fmtCompact(totalVol)}</div>
        </div>
        <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
          <div className="text-xs font-medium text-subdued mb-1">Avg LTV</div>
          <div className="text-xl font-bold text-default">{fmtCompact(avgLtv)}</div>
        </div>
      </div>
    );
  }
  if (viewId === 'new') {
    return (
      <div className="flex gap-3 mb-4">
        <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
          <div className="text-xs font-medium text-subdued mb-1">New accounts</div>
          <div className="text-xl font-bold text-default">{data.length}</div>
        </div>
        <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
          <div className="text-xs font-medium text-subdued mb-1">Needing attention</div>
          <div className="text-xl font-bold text-attention">{data.filter(a => a.needsAttention).length}</div>
        </div>
      </div>
    );
  }
  const totalRev = data.reduce((s, a) => s + a.platformRevenue, 0);
  const attentionCount = data.filter(a => a.needsAttention).length;
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
        <div className="text-xs font-medium text-subdued mb-1">Total accounts</div>
        <div className="text-xl font-bold text-default">{data.length}</div>
      </div>
      <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
        <div className="text-xs font-medium text-subdued mb-1">Platform revenue</div>
        <div className="text-xl font-bold text-default">{fmtCompact(totalRev)}</div>
      </div>
      <div className="flex-1 border border-border rounded-xl px-4 py-3 bg-surface">
        <div className="text-xs font-medium text-subdued mb-1">Need attention</div>
        <div className="text-xl font-bold text-attention">{attentionCount}</div>
      </div>
    </div>
  );
}

function renderCellValue(acct, colId) {
  switch (colId) {
    case 'name': return <span className="font-semibold text-default">{acct.name}</span>;
    case 'email': return acct.email;
    case 'created': return acct.created;
    case 'configuration': return acct.configuration;
    case 'status': {
      const v = { enabled: 'success', restricted: 'danger', 'restricted-soon': 'warning', 'in-review': 'info', rejected: 'danger' }[acct.status] || 'default';
      const l = { enabled: 'Enabled', restricted: 'Restricted', 'restricted-soon': 'Restricted soon', 'in-review': 'In review', rejected: 'Rejected' }[acct.status] || acct.status;
      return <Badge variant={v}>{l}</Badge>;
    }
    case 'platformRevenue': return fmtCompact(acct.platformRevenue);
    case 'platformRevenue30d': return fmtCompact(acct.platformRevenue30d);
    case 'accountVolume': return fmtCompact(acct.accountVolume);
    case 'products': return acct.products.join(', ');
    default: return '';
  }
}

export default function NetworkListConcept2() {
  const navigate = useNavigate();
  const { getVariable } = usePrototype();
  const [activeView, setActiveView] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [visibleCols, setVisibleCols] = useState(
    AVAILABLE_COLUMNS.filter(c => c.defaultOn).map(c => c.id)
  );

  const activeViewDef = STARTER_VIEWS.find(v => v.id === activeView) || STARTER_VIEWS[0];
  const viewFiltered = accounts.filter(activeViewDef.filter);
  const filtered = viewFiltered.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
  });

  useEffect(() => { setPage(0); }, [activeView, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, filtered.length);

  const toggleColumn = (colId) => {
    if (colId === 'name') return;
    setVisibleCols(prev =>
      prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
    );
  };

  const columns = AVAILABLE_COLUMNS.filter(c => visibleCols.includes(c.id));
  const isNumeric = (id) => ['platformRevenue', 'platformRevenue30d', 'accountVolume'].includes(id);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-default" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}>Network</h1>
          <p className="text-subdued mt-1" style={{ fontSize: '16px', lineHeight: '24px' }}>Your unified view of all accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon="export">Export</Button>
          <Button variant="primary" icon="add">New account</Button>
        </div>
      </div>

      {/* Saved view tabs */}
      <div className="mb-4">
        <Tabs
          tabs={[
            ...STARTER_VIEWS.map(v => ({ key: v.id, label: v.label })),
            { key: '__new', label: '+ New view' },
          ]}
          activeTab={activeView}
          onTabChange={(key) => { if (key !== '__new') setActiveView(key); }}
        />
      </div>

      {/* Per-view dashboard */}
      <ViewDashboard viewId={activeView} data={viewFiltered} />

      {/* Search bar */}
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
                    className={`${isNumeric(col.id) ? 'text-right' : 'text-left'} ${isFirst ? 'pr-6' : isLast ? 'pl-6' : 'px-6'} text-default`}
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
                        className={`${isNumeric(col.id) ? 'text-right' : 'text-left'} ${isFirst ? 'pr-6' : isLast ? 'pl-6' : 'px-6'} align-middle text-subdued`}
                        style={{ fontSize: '14px', whiteSpace: 'nowrap', background: bg, borderRadius: radius, ...(isFirst ? { paddingLeft: '24px' } : {}), ...(isLast ? { paddingRight: '24px' } : {}) }}
                      >
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
