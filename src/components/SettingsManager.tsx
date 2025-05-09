import React, { useState } from 'react';
import { UserSettings, DEFAULT_EMOTICON_PREFERENCES, DEFAULT_NOTIFICATION_PREFERENCES, DEFAULT_PRIVACY_SETTINGS, DEFAULT_THEME_SETTINGS } from '../types/userSettings';
import { USER_STATUSES } from '../constants/status';
import { getEmoticonSize } from '../utils/emoticonLoader';

interface SettingsManagerProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'emoticons' | 'notifications' | 'privacy' | 'theme'>('general');

  const handleStatusChange = (status: string) => {
    onUpdate({ status: status as UserSettings['status'] });
  };

  const handleStatusMessageChange = (message: string) => {
    onUpdate({ statusMessage: message });
  };

  const handleEmoticonPreferenceChange = (preferences: Partial<UserSettings['emoticons']>) => {
    onUpdate({
      emoticons: { ...settings.emoticons, ...preferences }
    });
  };

  const handleNotificationPreferenceChange = (preferences: Partial<UserSettings['notifications']>) => {
    onUpdate({
      notifications: { ...settings.notifications, ...preferences }
    });
  };

  const handlePrivacySettingChange = (privacy: Partial<UserSettings['privacy']>) => {
    onUpdate({
      privacy: { ...settings.privacy, ...privacy }
    });
  };

  const handleThemeSettingChange = (theme: Partial<UserSettings['theme']>) => {
    onUpdate({
      theme: { ...settings.theme, ...theme }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex space-x-4 mb-6">
        {(['general', 'emoticons', 'notifications', 'privacy', 'theme'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-light transition-colors duration-200 ${
              activeTab === tab
                ? 'bg-[#7FB3D5] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Status
              </label>
              <select
                value={settings.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full p-2 border border-[#7FB3D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
              >
                {USER_STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.icon} {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Status Message
              </label>
              <input
                type="text"
                value={settings.statusMessage || ''}
                onChange={(e) => handleStatusMessageChange(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-2 border border-[#7FB3D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
              />
            </div>
          </div>
        )}

        {activeTab === 'emoticons' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Emoticon Size
              </label>
              <select
                value={settings.emoticons.size}
                onChange={(e) => handleEmoticonPreferenceChange({ size: e.target.value as UserSettings['emoticons']['size'] })}
                className="w-full p-2 border border-[#7FB3D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showPreview"
                checked={settings.emoticons.showPreview}
                onChange={(e) => handleEmoticonPreferenceChange({ showPreview: e.target.checked })}
                className="rounded border-[#7FB3D5] text-[#7FB3D5] focus:ring-[#7FB3D5]"
              />
              <label htmlFor="showPreview" className="text-sm font-light text-gray-600">
                Show emoticon preview
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoConvert"
                checked={settings.emoticons.autoConvert}
                onChange={(e) => handleEmoticonPreferenceChange({ autoConvert: e.target.checked })}
                className="rounded border-[#7FB3D5] text-[#7FB3D5] focus:ring-[#7FB3D5]"
              />
              <label htmlFor="autoConvert" className="text-sm font-light text-gray-600">
                Auto-convert text emoticons
              </label>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={(e) => handleNotificationPreferenceChange({ [key]: e.target.checked })}
                  className="rounded border-[#7FB3D5] text-[#7FB3D5] focus:ring-[#7FB3D5]"
                />
                <label htmlFor={key} className="text-sm font-light text-gray-600">
                  {key.split(/(?=[A-Z])/).join(' ')}
                </label>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Profile Visibility
              </label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handlePrivacySettingChange({ profileVisibility: e.target.value as UserSettings['privacy']['profileVisibility'] })}
                className="w-full p-2 border border-[#7FB3D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => {
                if (key === 'profileVisibility') return null;
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={value}
                      onChange={(e) => handlePrivacySettingChange({ [key]: e.target.checked })}
                      className="rounded border-[#7FB3D5] text-[#7FB3D5] focus:ring-[#7FB3D5]"
                    />
                    <label htmlFor={key} className="text-sm font-light text-gray-600">
                      {key.split(/(?=[A-Z])/).join(' ')}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Theme Mode
              </label>
              <select
                value={settings.theme.mode}
                onChange={(e) => handleThemeSettingChange({ mode: e.target.value as UserSettings['theme']['mode'] })}
                className="w-full p-2 border border-[#7FB3D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={settings.theme.primaryColor}
                onChange={(e) => handleThemeSettingChange({ primaryColor: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-600 mb-2">
                Font Size
              </label>
              <select
                value={settings.theme.fontSize}
                onChange={(e) => handleThemeSettingChange({ fontSize: e.target.value as UserSettings['theme']['fontSize'] })}
                className="w-full p-2 border border-[#7FB3D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="compactMode"
                checked={settings.theme.compactMode}
                onChange={(e) => handleThemeSettingChange({ compactMode: e.target.checked })}
                className="rounded border-[#7FB3D5] text-[#7FB3D5] focus:ring-[#7FB3D5]"
              />
              <label htmlFor="compactMode" className="text-sm font-light text-gray-600">
                Compact Mode
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsManager; 