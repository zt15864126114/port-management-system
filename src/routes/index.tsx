import { RouteObject } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import DocumentProcess from '../pages/DocumentProcess';
import PortAccess from '../pages/PortAccess';
import GroundActivity from '../pages/GroundActivity';
import ShipManagement from '../pages/ShipManagement';
import MaritimeManagement from '../pages/MaritimeManagement';
import OperationManagement from '../pages/OperationManagement';
import Immigration from '../pages/Immigration';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/document-process',
        element: <DocumentProcess />,
      },
      {
        path: '/port-access',
        element: <PortAccess />,
      },
      {
        path: '/ground-activity',
        element: <GroundActivity />,
      },
      {
        path: '/ship-management',
        element: <ShipManagement />,
      },
      {
        path: '/maritime-management',
        element: <MaritimeManagement />,
      },
      {
        path: '/operation-management',
        element: <OperationManagement />,
      },
      {
        path: '/immigration',
        element: <Immigration />,
      },
    ],
  },
];

export default routes; 