import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import Badge from '../components/Badge';

const prototypes = [
  {
    id: 'network',
    name: 'Network',
    description: 'List view for managing all connected accounts on your platform.',
    status: 'In progress',
    screens: 3,
    path: '/prototypes/network',
  },
  {
    id: 'tbd',
    name: 'TBD',
    description: 'Placeholder for an upcoming prototype.',
    status: 'Not started',
    screens: 2,
    path: '/prototypes/tbd',
  },
];

const columns = [
  {
    key: 'name',
    header: 'Prototype',
    width: 'hug',
    render: (item) => (
      <span className="text-default font-medium">{item.name}</span>
    ),
  },
  {
    key: 'description',
    header: 'Description',
    width: 'grow',
  },
  {
    key: 'screens',
    header: 'Screens',
    align: 'right',
  },
  {
    key: 'status',
    header: 'Status',
    render: (item) => (
      <Badge variant={item.status === 'In progress' ? 'info' : 'default'}>
        {item.status}
      </Badge>
    ),
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-default mb-2">Prototypes</h1>
      <p className="text-subdued mb-8">
        Dashboard UX explorations. Click a row to open a prototype.
      </p>

      <Table
        columns={columns}
        data={prototypes}
        onRowClick={(item) => navigate(item.path)}
        rowKey="id"
      />
    </div>
  );
}
