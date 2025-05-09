import React from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import Loading from '../components/Loading';
import Auth from '../components/Auth';

// Lazy load pages for better performance
const Home = React.lazy(() => import('../pages/Home'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Messages = React.lazy(() => import('../pages/Messages'));
const Settings = React.lazy(() => import('../pages/Settings'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useApp();
  const { currentUser } = state;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route wrapper
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useApp();
  const { currentUser } = state;

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Router configuration
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<Loading fullScreen />}>
              <Home />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<Loading fullScreen />}>
              <Profile />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'messages',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<Loading fullScreen />}>
              <Messages />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<Loading fullScreen />}>
              <Settings />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes); 