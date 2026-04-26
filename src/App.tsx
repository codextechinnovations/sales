import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PGOwnerForm } from './pages/PGOwnerForm';
import { RolesAndResponsibilities } from './pages/RolesAndResponsibilities';
import { UnverifiedPGs } from './pages/UnverifiedPGs';
import { DailyActivity } from './pages/DailyActivity';
import { MyPGs } from './pages/MyPGs';
import { AddRooms } from './pages/AddRooms';
import { FieldManual } from './pages/FieldManual';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const currentPath = window.location.pathname;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  
  return <>{children}</>;
}

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'add-owner', element: <PGOwnerForm /> },
      { path: 'unverified', element: <UnverifiedPGs /> },
      { path: 'my-pgs', element: <MyPGs /> },
      { path: 'add-rooms/:pgId', element: <AddRooms /> },
      { path: 'activity', element: <DailyActivity /> },
      { path: 'manual', element: <FieldManual /> },
      { path: 'roles', element: <RolesAndResponsibilities /> },
    ]
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}