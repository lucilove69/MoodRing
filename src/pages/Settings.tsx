import React from 'react';
import { useApp } from '../context/AppContext';

const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
  const user = state.currentUser;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-white/70">Please log in to view settings.</p>
      </div>
    );
  }

  const handleThemeChange = (mode: 'light' | 'dark') => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        theme: {
          ...user.settings.theme,
          mode,
        },
      },
    });
  };

  const handleColorChange = (type: 'primary' | 'secondary', color: string) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        theme: {
          ...user.settings.theme,
          [type === 'primary' ? 'primaryColor' : 'secondaryColor']: color,
        },
      },
    });
  };

  const handlePrivacyChange = (setting: keyof typeof user.settings.privacy, value: boolean) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        privacy: {
          ...user.settings.privacy,
          [setting]: value,
        },
      },
    });
  };

  const handleNotificationChange = (setting: keyof typeof user.settings.notifications, value: boolean) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        notifications: {
          ...user.settings.notifications,
          [setting]: value,
        },
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        {/* Theme Settings */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Theme</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 mb-2">Mode</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`px-4 py-2 rounded-lg ${
                    user.settings.theme.mode === 'light'
                      ? 'bg-[var(--primary-color)] text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`px-4 py-2 rounded-lg ${
                    user.settings.theme.mode === 'dark'
                      ? 'bg-[var(--primary-color)] text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white/70 mb-2">Primary Color</label>
              <input
                type="color"
                value={user.settings.theme.primaryColor}
                onChange={e => handleColorChange('primary', e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2">Secondary Color</label>
              <input
                type="color"
                value={user.settings.theme.secondaryColor}
                onChange={e => handleColorChange('secondary', e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white">Show Online Status</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.settings.privacy.showOnlineStatus}
                  onChange={e => handlePrivacyChange('showOnlineStatus', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white">Email Notifications</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.settings.notifications.email}
                  onChange={e => handleNotificationChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white">Push Notifications</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.settings.notifications.push}
                  onChange={e => handleNotificationChange('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white">Friend Requests</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.settings.notifications.friendRequests}
                  onChange={e => handleNotificationChange('friendRequests', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white">Messages</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.settings.notifications.messages}
                  onChange={e => handleNotificationChange('messages', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white">Mentions</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.settings.notifications.mentions}
                  onChange={e => handleNotificationChange('mentions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 