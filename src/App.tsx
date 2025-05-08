import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import FriendsPage from './pages/FriendsPage';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile/:username" element={<ProfilePage />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="edit-profile" element={<EditProfilePage />} />
          <Route path="friends" element={<FriendsPage />} />
        </Route>
        
        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;