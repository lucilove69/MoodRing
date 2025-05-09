import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';
import Button from './Button';
import { User, Settings, Users, Palette, Shield, BarChart2, Smile } from 'lucide-react';

interface AdminDashboardProps {
  className?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ className = '' }) => {
  const { state, createAdmin, updateAdmin, deleteAdmin, updateTheme } = useApp();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'users' | 'themes' | 'admins' | 'analytics'>('users');
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    email: '',
    displayName: '',
    password: '',
  });
  const [adminSettings, setAdminSettings] = useState({
    canManageUsers: true,
    canManageContent: true,
    canManageSettings: true,
    canManageAdmins: false,
    canViewAnalytics: true,
    canManageRoles: false,
    canManageThemes: true,
    canManageEmoticons: true,
  });

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      createAdmin(newAdminData, adminSettings);
      showToast('Admin account created successfully', 'success');
      setNewAdminData({
        username: '',
        email: '',
        displayName: '',
        password: '',
      });
    } catch (error) {
      showToast('Failed to create admin account', 'error');
    }
  };

  const handleThemeUpdate = (themeName: string, settings: any) => {
    try {
      updateTheme(themeName, settings);
      showToast('Theme updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update theme', 'error');
    }
  };

  return (
    <div className={`max-w-[1000px] mx-auto p-4 ${className}`}>
      {/* Admin Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h1 className="text-2xl font-bold text-[#3B5998]">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, themes, and system settings</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-4">
        <Button
          variant={activeTab === 'users' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('users')}
          icon={<Users className="w-5 h-5" />}
        >
          Users
        </Button>
        <Button
          variant={activeTab === 'themes' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('themes')}
          icon={<Palette className="w-5 h-5" />}
        >
          Themes
        </Button>
        <Button
          variant={activeTab === 'admins' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('admins')}
          icon={<Shield className="w-5 h-5" />}
        >
          Admins
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('analytics')}
          icon={<BarChart2 className="w-5 h-5" />}
        >
          Analytics
        </Button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow p-4">
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <div className="space-y-4">
              {/* User list and management tools */}
            </div>
          </div>
        )}

        {activeTab === 'themes' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Theme Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(state.themes).map(([themeName, settings]) => (
                <div key={themeName} className="border rounded-lg p-4">
                  <h3 className="font-bold mb-2 capitalize">{themeName}</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Glass Effect</label>
                      <input
                        type="checkbox"
                        checked={settings.glassEffect}
                        onChange={(e) => handleThemeUpdate(themeName, { glassEffect: e.target.checked })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Blur Amount</label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={settings.blurAmount}
                        onChange={(e) => handleThemeUpdate(themeName, { blurAmount: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transparency</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.transparency}
                        onChange={(e) => handleThemeUpdate(themeName, { transparency: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Admin Management</h2>
            <div className="space-y-6">
              {/* Create New Admin Form */}
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <h3 className="font-bold">Create New Admin</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      value={newAdminData.username}
                      onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3B5998] focus:ring-[#3B5998]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={newAdminData.email}
                      onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3B5998] focus:ring-[#3B5998]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Display Name</label>
                    <input
                      type="text"
                      value={newAdminData.displayName}
                      onChange={(e) => setNewAdminData({ ...newAdminData, displayName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3B5998] focus:ring-[#3B5998]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={newAdminData.password}
                      onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3B5998] focus:ring-[#3B5998]"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold mb-2">Permissions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(adminSettings).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setAdminSettings({ ...adminSettings, [key]: e.target.checked })}
                          className="rounded border-gray-300 text-[#3B5998] focus:ring-[#3B5998]"
                        />
                        <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Create Admin
                  </Button>
                </div>
              </form>

              {/* Admin List */}
              <div>
                <h3 className="font-bold mb-2">Existing Admins</h3>
                <div className="space-y-2">
                  {state.admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{admin.displayName}</p>
                        <p className="text-sm text-gray-600">{admin.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          onClick={() => updateAdmin(admin.id, { canManageAdmins: !admin.settings.admin?.canManageAdmins })}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-500"
                          onClick={() => deleteAdmin(admin.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Total Users</h3>
                <p className="text-2xl font-bold text-[#3B5998]">1,234</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Active Users</h3>
                <p className="text-2xl font-bold text-[#3B5998]">567</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Total Posts</h3>
                <p className="text-2xl font-bold text-[#3B5998]">8,901</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 