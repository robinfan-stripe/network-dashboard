import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import Badge from '../../components/Badge';
import { Icon } from '../../icons/SailIcons';

const accountsMap = {
  'acct_1NqBMA2eZvKYlo2C': {
    id: 'acct_1NqBMA2eZvKYlo2C',
    name: 'Rocket Rides',
    email: 'admin@rocketrides.io',
    status: 'Active',
    volume: '$1,240,500.00',
    payouts: '$1,102,340.00',
    created: 'Jan 12, 2024',
    country: 'United States',
    type: 'Express',
    payoutSchedule: 'Daily (2-day rolling)',
    businessType: 'Ride-hailing platform',
  },
  'acct_1NxRTG2eZvKYlo9F': {
    id: 'acct_1NxRTG2eZvKYlo9F',
    name: 'Typographic',
    email: 'billing@typographic.com',
    status: 'Active',
    volume: '$842,100.00',
    payouts: '$780,920.00',
    created: 'Feb 3, 2024',
    country: 'United Kingdom',
    type: 'Standard',
    payoutSchedule: 'Weekly (Monday)',
    businessType: 'Design marketplace',
  },
  'acct_1OaVWE2eZvKYlp4K': {
    id: 'acct_1OaVWE2eZvKYlp4K',
    name: 'Kavak Motors',
    email: 'payments@kavak.com',
    status: 'Restricted',
    volume: '$2,510,000.00',
    payouts: '$0.00',
    created: 'Mar 18, 2024',
    country: 'Mexico',
    type: 'Custom',
    payoutSchedule: 'Paused',
    businessType: 'Automotive marketplace',
  },
  'acct_1ObXHJ2eZvKYlq7R': {
    id: 'acct_1ObXHJ2eZvKYlq7R',
    name: 'Launchpad SaaS',
    email: 'finance@launchpad.dev',
    status: 'Active',
    volume: '$385,200.00',
    payouts: '$364,100.00',
    created: 'Apr 7, 2024',
    country: 'United States',
    type: 'Express',
    payoutSchedule: 'Daily (2-day rolling)',
    businessType: 'SaaS platform',
  },
  'acct_1OcYPL2eZvKYlr2T': {
    id: 'acct_1OcYPL2eZvKYlr2T',
    name: 'Greenline Delivery',
    email: 'ops@greenline.co',
    status: 'Pending',
    volume: '$0.00',
    payouts: '$0.00',
    created: 'Jun 22, 2024',
    country: 'Canada',
    type: 'Express',
    payoutSchedule: 'Not yet configured',
    businessType: 'Logistics and delivery',
  },
  'acct_1OdZQN2eZvKYls5V': {
    id: 'acct_1OdZQN2eZvKYls5V',
    name: 'Freshly Pressed',
    email: 'hello@freshlypressed.com',
    status: 'Active',
    volume: '$92,800.00',
    payouts: '$88,450.00',
    created: 'Jul 1, 2024',
    country: 'United States',
    type: 'Standard',
    payoutSchedule: 'Monthly (1st)',
    businessType: 'Food and beverage',
  },
  'acct_1OeARM2eZvKYlt8W': {
    id: 'acct_1OeARM2eZvKYlt8W',
    name: 'Bolt Fitness',
    email: 'pay@boltfitness.io',
    status: 'Restricted',
    volume: '$620,000.00',
    payouts: '$0.00',
    created: 'Aug 15, 2024',
    country: 'Australia',
    type: 'Custom',
    payoutSchedule: 'Paused',
    businessType: 'Fitness marketplace',
  },
  'acct_1OfBSO2eZvKYlu1X': {
    id: 'acct_1OfBSO2eZvKYlu1X',
    name: 'Nebula Analytics',
    email: 'accounts@nebula.ai',
    status: 'Active',
    volume: '$1,780,300.00',
    payouts: '$1,690,100.00',
    created: 'Sep 4, 2024',
    country: 'Germany',
    type: 'Express',
    payoutSchedule: 'Daily (2-day rolling)',
    businessType: 'Data analytics platform',
  },
};

const statusVariant = (status) => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Restricted':
      return 'danger';
    case 'Pending':
      return 'warning';
    default:
      return 'default';
  }
};

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start py-3 border-b border-border">
      <div className="w-48 text-sm text-subdued shrink-0">{label}</div>
      <div className="text-sm text-default">{value}</div>
    </div>
  );
}

export default function NetworkDetail() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const account = accountsMap[accountId];

  if (!account) {
    return (
      <div className="p-8">
        <p className="text-subdued">Account not found.</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate('/prototypes/network')}
        >
          Back to Network
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb / back nav */}
      <button
        onClick={() => navigate('/prototypes/network')}
        className="flex items-center gap-1 text-sm text-subdued hover:text-default cursor-pointer mb-6 transition-colors"
      >
        <Icon name="arrowLeft" size="xsmall" fill="currentColor" />
        Network
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-default">
              {account.name}
            </h1>
            <Badge variant={statusVariant(account.status)}>
              {account.status}
            </Badge>
          </div>
          <p className="text-subdued text-sm">{account.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Edit</Button>
          <Button variant="secondary" icon="more" />
        </div>
      </div>

      {/* Details */}
      <div className="max-w-2xl">
        <h2 className="text-sm font-semibold text-default uppercase tracking-wide mb-2">
          Account details
        </h2>
        <DetailRow label="Email" value={account.email} />
        <DetailRow label="Country" value={account.country} />
        <DetailRow label="Account type" value={account.type} />
        <DetailRow label="Business type" value={account.businessType} />
        <DetailRow label="Created" value={account.created} />

        <h2 className="text-sm font-semibold text-default uppercase tracking-wide mb-2 mt-10">
          Financials
        </h2>
        <DetailRow label="Payments volume" value={account.volume} />
        <DetailRow label="Total payouts" value={account.payouts} />
        <DetailRow label="Payout schedule" value={account.payoutSchedule} />
      </div>
    </div>
  );
}
