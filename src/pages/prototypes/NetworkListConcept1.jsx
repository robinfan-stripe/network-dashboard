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
 * Concept 1: "Task-Oriented Views"
 *
 * System-curated preset views replace Merchant/Customer tabs.
 * Each view carries a contextual insight bar.
 * LTV is split into "Revenue to you" and "Account volume".
 * Attention indicators highlight accounts needing action.
 */

const PAGE_SIZE = 15;

const PRESET_VIEWS = [
  { id: 'all', label: 'All accounts' },
  { id: 'attention', label: 'Needs attention' },
  { id: 'top', label: 'Top accounts' },
  { id: 'new', label: 'Recently added' },
];

function viewFilter(viewId, acct) {
  switch (viewId) {
    case 'attention': return acct.needsAttention;
    case 'top': return acct.lifetimeValue >= 50000;
    case 'new': return acct.createdDays <= 7;
    default: return true;
  }
}

function ViewInsightBar({ viewId, data }) {
  if (viewId === 'attention') {
    const restricted = data.filter(a => a.status === 'restricted').length;
    const restrictedSoon = data.filter(a => a.status === 'restricted-soon').length;
    const inReview = data.filter(a => a.status === 'in-review').length;
    const paused = data.filter(a => a.paymentsPaused || a.payoutsPaused).length;
    return (
      <div className="flex items-center gap-4 px-4 py-3 bg-offset rounded-xl text-sm">
        <span className="font-semibold text-default">{data.length} accounts need attention</span>
        <span className="text-subdued">·</span>
        <span className="text-critical font-medium">{restricted} restricted</span>
        <span className="text-attention font-medium">{restrictedSoon} restricted soon</span>
        <span className="text-info font-medium">{inReview} in review</span>
        <span className="text-subdued">{paused} with paused payments/payouts</span>
      </div>
    );
  }
  if (viewId === 'top') {
    const totalRev = data.reduce((s, a) => s + a.platformRevenue, 0);
    const avgLtv = data.length ? data.reduce((s, a) => s + a.lifetimeValue, 0) / data.length : 0;
    return (
      <div className="flex items-center gap-4 px-4 py-3 bg-offset rounded-xl text-sm">
        <span className="font-semibold text-default">{data.length} top accounts</span>
        <span className="text-subdued">·</span>
        <span className="text-subdued">Total platform revenue <span className="text-default font-semibold">{fmtCompact(totalRev)}</span></span>
        <span className="text-subdued">Avg lifetime value <span className="text-default font-semibold">{fmtCompact(avgLtv)}</span></span>
      </div>
    );
  }
  if (viewId === 'new') {
    return (
      <div className="flex items-center gap-4 px-4 py-3 bg-offset rounded-xl text-sm">
        <span className="font-semibold text-default">{data.length} accounts added this week</span>
      </div>
    );
  }
  const totalAccounts = data.length;
  const totalRev = data.reduce((s, a) => s + a.platformRevenue, 0);
  const attentionCount = data.filter(a => a.needsAttention).length;
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-offset rounded-xl text-sm">
      <span className="text-subdued">{totalAccounts} accounts</span>
      <span className="text-subdued">·</span>
      <span className="text-subdued">Platform revenue <span className="text-default font-semibold">{fmtCompact(totalRev)}</span></span>
      {attentionCount > 0 && (
        <>
          <span className="text-subdued">·</span>
          <span className="text-attention font-medium">{attentionCount} need attention</span>
        </>
      )}
    </div>
  );
}


export default function NetworkListConcept1() {
  const navigate = useNavigate();
  const { getVariable } = usePrototype();
  const [activeView, setActiveView] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);


  const viewFiltered = accounts.filter(a => viewFilter(activeView, a));
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

  const attentionCount = accounts.filter(a => a.needsAttention).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-default" style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}>Network</h1>
          <p className="text-subdued mt-1" style={{ fontSize: '16px', lineHeight: '24px' }}>Your unified view of all accounts on this platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon="export">Export</Button>
          <Button variant="primary" icon="add">New account</Button>
        </div>
      </div>

      {/* Preset view tabs */}
      <div className="mt-5 mb-4">
        <Tabs
          tabs={PRESET_VIEWS.map(v => ({
            key: v.id,
            label: v.id === 'attention' && attentionCount > 0
              ? <>{v.label}<span className="ml-1.5 text-xs bg-critical/10 text-critical px-1.5 py-0.5 rounded-full font-semibold">{attentionCount}</span></>
              : v.label,
          }))}
          activeTab={activeView}
          onTabChange={setActiveView}
        />
      </div>

      {/* Contextual insight bar */}
      <div className="mb-4">
        <ViewInsightBar viewId={activeView} data={viewFiltered} />
      </div>

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
              <th className="text-left pr-6 text-default" style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap', paddingLeft: '24px' }}>Account</th>
              <th className="text-left px-6 text-default" style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap' }}>Configuration</th>
              <th className="text-left px-6 text-default" style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap' }}>Status</th>
              <th className="text-right px-6 text-default" style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap' }}>
                <Tooltip content="Fees and subscription revenue your platform earns from this account." variant="minimal" placement="top">
                  <span className="inline-flex items-center gap-1.5 cursor-help">Revenue to you <InfoIcon size={12} /></span>
                </Tooltip>
              </th>
              <th className="text-right pl-6 text-default" style={{ fontSize: '14px', fontWeight: 600, height: '44px', whiteSpace: 'nowrap', paddingRight: '24px' }}>
                <Tooltip content="Total payment volume processed by this account." variant="minimal" placement="top">
                  <span className="inline-flex items-center gap-1.5 cursor-help">Account volume <InfoIcon size={12} /></span>
                </Tooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((acct, index) => {
              const bg = index % 2 === 0 ? 'rgb(250, 251, 251)' : 'var(--color-surface)';
              const statusVariant = { enabled: 'success', restricted: 'danger', 'restricted-soon': 'warning', 'in-review': 'info', rejected: 'danger' }[acct.status] || 'default';
              const statusLabel = { enabled: 'Enabled', restricted: 'Restricted', 'restricted-soon': 'Restricted soon', 'in-review': 'In review', rejected: 'Rejected' }[acct.status] || acct.status;
              return (
                <tr
                  key={acct.id}
                  className="cursor-pointer transition-colors group"
                  style={{ height: '44px' }}
                  onClick={() => navigate(`/prototypes/network/${acct.id}`)}
                >
                  <td className="pr-6 align-middle" style={{ fontSize: '14px', fontWeight: 600, paddingLeft: '24px', background: bg, borderRadius: '8px 0 0 8px' }}>
                    <div className="flex items-center gap-2">
                      {acct.needsAttention && (
                        <Tooltip content={acct.attentionReason} variant="minimal" placement="right">
                          <span className="w-2 h-2 rounded-full bg-attention shrink-0" />
                        </Tooltip>
                      )}
                      <span className="text-default">{acct.name}</span>
                    </div>
                  </td>
                  <td className="px-6 align-middle text-subdued" style={{ fontSize: '14px', background: bg }}>
                    {acct.configuration}
                  </td>
                  <td className="px-6 align-middle" style={{ background: bg }}>
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </td>
                  <td className="px-6 align-middle text-right text-default" style={{ fontSize: '14px', background: bg }}>
                    {fmtCompact(acct.platformRevenue)}
                  </td>
                  <td className="pl-6 align-middle text-right text-subdued" style={{ fontSize: '14px', paddingRight: '24px', background: bg, borderRadius: '0 8px 8px 0' }}>
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
