import { useState, useEffect } from 'react';
import { Emoticon } from '../constants/emoticons';

interface CustomEmoticon extends Emoticon {
  userId: string;
  createdAt: Date;
}

export const useCustomEmoticons = (userId: string) => {
  const [customEmoticons, setCustomEmoticons] = useState<CustomEmoticon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomEmoticons();
  }, [userId]);

  const loadCustomEmoticons = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call to fetch custom emoticons
      // For now, we'll use localStorage as a mock
      const stored = localStorage.getItem(`custom_emoticons_${userId}`);
      if (stored) {
        setCustomEmoticons(JSON.parse(stored));
      }
    } catch (err) {
      setError('Failed to load custom emoticons');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomEmoticon = async (file: File, code: string, name: string) => {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Create a unique ID for the emoticon
      const id = `custom_${Date.now()}`;
      
      // Create the emoticon object
      const newEmoticon: CustomEmoticon = {
        id,
        code,
        name,
        path: URL.createObjectURL(file),
        isAnimated: file.type === 'image/gif',
        category: 'custom',
        userId,
        createdAt: new Date()
      };

      // Update state
      setCustomEmoticons(prev => [...prev, newEmoticon]);

      // Store in localStorage (mock)
      localStorage.setItem(
        `custom_emoticons_${userId}`,
        JSON.stringify([...customEmoticons, newEmoticon])
      );

      return newEmoticon;
    } catch (err) {
      setError('Failed to add custom emoticon');
      console.error(err);
      throw err;
    }
  };

  const removeCustomEmoticon = async (emoticonId: string) => {
    try {
      // Update state
      setCustomEmoticons(prev => prev.filter(e => e.id !== emoticonId));

      // Update localStorage (mock)
      localStorage.setItem(
        `custom_emoticons_${userId}`,
        JSON.stringify(customEmoticons.filter(e => e.id !== emoticonId))
      );
    } catch (err) {
      setError('Failed to remove custom emoticon');
      console.error(err);
      throw err;
    }
  };

  return {
    customEmoticons,
    isLoading,
    error,
    addCustomEmoticon,
    removeCustomEmoticon
  };
}; 