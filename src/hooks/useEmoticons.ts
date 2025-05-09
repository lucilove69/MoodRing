import { useState, useEffect } from 'react';
import { Emoticon } from '../constants/emoticons';
import { emoticonApi, ApiError } from '../services/api';

export const useEmoticons = () => {
  const [emoticons, setEmoticons] = useState<Emoticon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    loadEmoticons();
  }, []);

  const loadEmoticons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await emoticonApi.getEmoticons();
      setEmoticons(data);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to load emoticons');
      console.error('Error loading emoticons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadEmoticon = async (file: File, name: string) => {
    try {
      setError(null);
      setUploadProgress(0);

      // Create a progress handler
      const progressHandler = (progressEvent: ProgressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      };

      // Upload the file
      const newEmoticon = await emoticonApi.uploadEmoticon(file, name);
      setEmoticons(prev => [...prev, newEmoticon]);
      setUploadProgress(100);
      return newEmoticon;
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to upload emoticon');
      console.error('Error uploading emoticon:', error);
      throw error;
    } finally {
      setUploadProgress(0);
    }
  };

  const deleteEmoticon = async (emoticonId: string) => {
    try {
      setError(null);
      await emoticonApi.deleteEmoticon(emoticonId);
      setEmoticons(prev => prev.filter(e => e.id !== emoticonId));
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to delete emoticon');
      console.error('Error deleting emoticon:', error);
      throw error;
    }
  };

  const getEmoticonByCode = (code: string) => {
    return emoticons.find(e => e.code === code);
  };

  const getEmoticonsByCategory = (category: string) => {
    return emoticons.filter(e => e.category === category);
  };

  return {
    emoticons,
    isLoading,
    error,
    uploadProgress,
    uploadEmoticon,
    deleteEmoticon,
    getEmoticonByCode,
    getEmoticonsByCategory,
    refreshEmoticons: loadEmoticons
  };
}; 