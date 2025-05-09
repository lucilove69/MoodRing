import { useState, useEffect } from 'react';
import { UserSettings, DEFAULT_EMOTICON_PREFERENCES, DEFAULT_NOTIFICATION_PREFERENCES, DEFAULT_PRIVACY_SETTINGS, DEFAULT_THEME_SETTINGS } from '../types/userSettings';
import { DEFAULT_STATUS } from '../constants/status';
import { userSettingsApi, ApiError } from '../services/api';

export const useUserSettings = (userId: string) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userSettingsApi.getSettings(userId);
      setSettings(data);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to load user settings');
      console.error('Error loading settings:', error);
      
      // Fallback to default settings if API fails
      const defaultSettings: UserSettings = {
        id: `settings_${userId}`,
        userId,
        status: DEFAULT_STATUS,
        emoticons: DEFAULT_EMOTICON_PREFERENCES,
        notifications: DEFAULT_NOTIFICATION_PREFERENCES,
        privacy: DEFAULT_PRIVACY_SETTINGS,
        theme: DEFAULT_THEME_SETTINGS,
        lastUpdated: new Date()
      };
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!settings) return;

    try {
      setError(null);
      const updatedSettings = await userSettingsApi.updateSettings(userId, updates);
      setSettings(updatedSettings);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to update settings');
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const resetSettings = async () => {
    try {
      setError(null);
      const defaultSettings = await userSettingsApi.resetSettings(userId);
      setSettings(defaultSettings);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to reset settings');
      console.error('Error resetting settings:', error);
      throw error;
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    resetSettings,
    refreshSettings: loadSettings
  };
}; 