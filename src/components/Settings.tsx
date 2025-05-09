import React, { useState, useEffect } from 'react';
import { Moon, Sun, Eye, EyeOff, Lock, Unlock, Palette, Smile } from 'lucide-react';
import EmoticonUploader from './EmoticonUploader';

interface UserSettings {
  theme: {
    mode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    font: string;
    customCSS: string;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
    showLastSeen: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    friendRequests: boolean;
    messages: boolean;
    mentions: boolean;
  };
  emoticons: {
    size: 'small' | 'medium' | 'large';
    allowCustomUploads: boolean;
    allowedTypes: ('gif' | 'png' | 'jpg' | 'jpeg')[];
  };
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theme' | 'privacy' | 'notifications' | 'emoticons'>('theme');
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('moodring_settings');
    return saved ? JSON.parse(saved) : {
      theme: {
        mode: 'dark',
        primaryColor: '#00FFFF',
        secondaryColor: '#FF00FF',
        font: 'Comic Sans MS',
        customCSS: ''
      },
      privacy: {
        profileVisibility: 'public',
        showOnlineStatus: true,
        allowFriendRequests: true,
        showLastSeen: true
      },
      notifications: {
        email: true,
        push: true,
        friendRequests: true,
        messages: true,
        mentions: true
      },
      emoticons: {
        size: 'medium',
        allowCustomUploads: true,
        allowedTypes: ['gif', 'png', 'jpg', 'jpeg']
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('moodring_settings', JSON.stringify(settings));
    // Apply theme settings
    document.documentElement.classList.toggle('dark', settings.theme.mode === 'dark');
    document.documentElement.style.setProperty('--primary-color', settings.theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.theme.secondaryColor);
    document.documentElement.style.setProperty('--font-family', settings.theme.font);
  }, [settings]);

  const handleSettingChange = (category: keyof UserSettings, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const renderThemeSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
        <div>
          <h3 className="text-white font-bold">Theme Mode</h3>
          <p className="text-white/70 text-sm">Choose between light and dark mode</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleSettingChange('theme', 'mode', 'light')}
            className={`p-2 rounded-lg ${settings.theme.mode === 'light' ? 'bg-white/20' : 'bg-white/5'}`}
          >
            <Sun className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => handleSettingChange('theme', 'mode', 'dark')}
            className={`p-2 rounded-lg ${settings.theme.mode === 'dark' ? 'bg-white/20' : 'bg-white/5'}`}
          >
            <Moon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-white font-bold mb-4">Custom Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/70 text-sm">Primary Color</label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="color"
                value={settings.theme.primaryColor}
                onChange={(e) => handleSettingChange('theme', 'primaryColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.primaryColor}
                onChange={(e) => handleSettingChange('theme', 'primaryColor', e.target.value)}
                className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-white/70 text-sm">Secondary Color</label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="color"
                value={settings.theme.secondaryColor}
                onChange={(e) => handleSettingChange('theme', 'secondaryColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.secondaryColor}
                onChange={(e) => handleSettingChange('theme', 'secondaryColor', e.target.value)}
                className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-white font-bold mb-4">Custom Font</h3>
        <select
          value={settings.theme.font}
          onChange={(e) => handleSettingChange('theme', 'font', e.target.value)}
          className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
        >
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>

      <div className="p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-white font-bold mb-4">Custom CSS</h3>
        <textarea
          value={settings.theme.customCSS}
          onChange={(e) => handleSettingChange('theme', 'customCSS', e.target.value)}
          className="w-full h-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm font-mono"
          placeholder="Add your custom CSS here..."
        />
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-white font-bold mb-4">Profile Visibility</h3>
        <select
          value={settings.privacy.profileVisibility}
          onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
          className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
          <div>
            <h3 className="text-white font-bold">Online Status</h3>
            <p className="text-white/70 text-sm">Show when you're online</p>
          </div>
          <button
            onClick={() => handleSettingChange('privacy', 'showOnlineStatus', !settings.privacy.showOnlineStatus)}
            className={`p-2 rounded-lg ${settings.privacy.showOnlineStatus ? 'bg-white/20' : 'bg-white/5'}`}
          >
            {settings.privacy.showOnlineStatus ? <Eye className="w-5 h-5 text-white" /> : <EyeOff className="w-5 h-5 text-white" />}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
          <div>
            <h3 className="text-white font-bold">Friend Requests</h3>
            <p className="text-white/70 text-sm">Allow others to send you friend requests</p>
          </div>
          <button
            onClick={() => handleSettingChange('privacy', 'allowFriendRequests', !settings.privacy.allowFriendRequests)}
            className={`p-2 rounded-lg ${settings.privacy.allowFriendRequests ? 'bg-white/20' : 'bg-white/5'}`}
          >
            {settings.privacy.allowFriendRequests ? <Unlock className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
          <div>
            <h3 className="text-white font-bold">Last Seen</h3>
            <p className="text-white/70 text-sm">Show when you were last active</p>
          </div>
          <button
            onClick={() => handleSettingChange('privacy', 'showLastSeen', !settings.privacy.showLastSeen)}
            className={`p-2 rounded-lg ${settings.privacy.showLastSeen ? 'bg-white/20' : 'bg-white/5'}`}
          >
            {settings.privacy.showLastSeen ? <Eye className="w-5 h-5 text-white" /> : <EyeOff className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
          <div>
            <h3 className="text-white font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <p className="text-white/70 text-sm">Receive notifications for {key}</p>
          </div>
          <button
            onClick={() => handleSettingChange('notifications', key, !value)}
            className={`p-2 rounded-lg ${value ? 'bg-white/20' : 'bg-white/5'}`}
          >
            {value ? <Eye className="w-5 h-5 text-white" /> : <EyeOff className="w-5 h-5 text-white" />}
          </button>
        </div>
      ))}
    </div>
  );

  const renderEmoticonSettings = () => (
    <div className="space-y-6">
      <div className="p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-white font-bold mb-4">Emoticon Size</h3>
        <select
          value={settings.emoticons.size}
          onChange={(e) => handleSettingChange('emoticons', 'size', e.target.value)}
          className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-white font-bold mb-4">Allowed File Types</h3>
        <div className="space-y-2">
          {['gif', 'png', 'jpg', 'jpeg'].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.emoticons.allowedTypes.includes(type as any)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...settings.emoticons.allowedTypes, type as any]
                    : settings.emoticons.allowedTypes.filter(t => t !== type);
                  handleSettingChange('emoticons', 'allowedTypes', newTypes);
                }}
                className="rounded border-white/10"
              />
              <span className="text-white capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <EmoticonUploader
        allowedTypes={settings.emoticons.allowedTypes}
        emoticonSize={settings.emoticons.size}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] mb-8">
          Settings
        </h1>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'theme' ? 'bg-white/20' : 'bg-white/5'
            } text-white hover:bg-white/10 transition-all duration-200`}
          >
            <Palette className="w-5 h-5 inline-block mr-2" />
            Theme
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'privacy' ? 'bg-white/20' : 'bg-white/5'
            } text-white hover:bg-white/10 transition-all duration-200`}
          >
            <Lock className="w-5 h-5 inline-block mr-2" />
            Privacy
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'notifications' ? 'bg-white/20' : 'bg-white/5'
            } text-white hover:bg-white/10 transition-all duration-200`}
          >
            <Eye className="w-5 h-5 inline-block mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('emoticons')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'emoticons' ? 'bg-white/20' : 'bg-white/5'
            } text-white hover:bg-white/10 transition-all duration-200`}
          >
            <Smile className="w-5 h-5 inline-block mr-2" />
            Emoticons
          </button>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-6">
          {activeTab === 'theme' && renderThemeSettings()}
          {activeTab === 'privacy' && renderPrivacySettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'emoticons' && renderEmoticonSettings()}
        </div>
      </div>
    </div>
  );
};

export default Settings; 