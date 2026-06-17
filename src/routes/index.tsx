import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Dashboard from '../pages/Dashboard/Dashboard';
import AppDetails from '../pages/AppDetails/AppDetails';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  // Guest/Auth layouts
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
    ],
  },
  // Protected layouts
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/app/:appId', element: <AppDetails /> },
          { path: '*', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
  // Root path landing redirection
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
]);
export default router;
