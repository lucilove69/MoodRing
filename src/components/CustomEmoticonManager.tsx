import React, { useState, useCallback } from 'react';
import { useEmoticons } from '../hooks/useEmoticons';
import { Emoticon } from '../constants/emoticons';

interface CustomEmoticonManagerProps {
  onSelect: (emoticon: Emoticon) => void;
  userId: string;
}

const CustomEmoticonManager: React.FC<CustomEmoticonManagerProps> = ({ onSelect, userId }) => {
  const {
    emoticons,
    isLoading,
    error,
    uploadProgress,
    uploadEmoticon,
    deleteEmoticon,
    getEmoticonsByCategory,
  } = useEmoticons();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [emoticonName, setEmoticonName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Set default name from filename
      setEmoticonName(file.name.split('.')[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !emoticonName) return;

    try {
      setIsUploading(true);
      const newEmoticon = await uploadEmoticon(selectedFile, emoticonName);
      onSelect(newEmoticon);
      setSelectedFile(null);
      setEmoticonName('');
    } catch (err) {
      console.error('Failed to upload emoticon:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (emoticonId: string) => {
    try {
      await deleteEmoticon(emoticonId);
    } catch (err) {
      console.error('Failed to delete emoticon:', err);
    }
  };

  const customEmoticons = getEmoticonsByCategory('custom');

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Custom Emoticons</h3>

      {/* Upload Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={handleFileSelect}
            className="hidden"
            id="emoticon-upload"
          />
          <label
            htmlFor="emoticon-upload"
            className="px-4 py-2 bg-[#7FB3D5] text-white rounded-lg cursor-pointer hover:bg-[#6A9FC0] transition-colors"
          >
            Choose File
          </label>
          {selectedFile && (
            <span className="text-sm text-gray-600">{selectedFile.name}</span>
          )}
        </div>

        {selectedFile && (
          <div className="space-y-4">
            <input
              type="text"
              value={emoticonName}
              onChange={(e) => setEmoticonName(e.target.value)}
              placeholder="Emoticon name"
              className="w-full p-2 border border-[#7FB3D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
            />
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full px-4 py-2 bg-[#7FB3D5] text-white rounded-lg hover:bg-[#6A9FC0] transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Emoticon'}
            </button>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#7FB3D5] h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Emoticon Grid */}
      {isLoading ? (
        <div className="text-center text-gray-600">Loading emoticons...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {customEmoticons.map((emoticon) => (
            <div
              key={emoticon.id}
              className="relative group"
            >
              <img
                src={emoticon.path}
                alt={emoticon.name}
                className="w-12 h-12 object-contain cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => onSelect(emoticon)}
              />
              <button
                onClick={() => handleDelete(emoticon.id)}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <span className="text-xs text-gray-600 mt-1 block text-center">
                {emoticon.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomEmoticonManager; 