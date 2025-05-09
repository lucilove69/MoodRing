import React, { useState, useEffect } from 'react';

interface EmoticonUploaderProps {
  onUploadComplete?: () => void;
  allowedTypes?: ('gif' | 'png' | 'jpg' | 'jpeg')[];
  emoticonSize?: 'small' | 'medium' | 'large';
}

interface EmoticonData {
  name: string;
  data: string;
  mappings: string[];
  type: string;
}

const EmoticonUploader: React.FC<EmoticonUploaderProps> = ({
  onUploadComplete,
  allowedTypes = ['gif', 'png', 'jpg', 'jpeg'],
  emoticonSize = 'medium'
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emoticons, setEmoticons] = useState<EmoticonData[]>([]);
  const [previewText, setPreviewText] = useState('Hello :) How are you? :D <3');

  useEffect(() => {
    // Load saved emoticons from localStorage
    const savedEmoticons = localStorage.getItem('moodring_emoticons');
    if (savedEmoticons) {
      setEmoticons(JSON.parse(savedEmoticons));
    }
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    setError(null);

    try {
      const newEmoticons: EmoticonData[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        const fileType = file.type.split('/')[1];
        if (!allowedTypes.includes(fileType as any)) {
          throw new Error(`Only ${allowedTypes.join(', ')} files are allowed`);
        }

        // Convert file to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Get filename without extension
        const name = file.name.replace(/\.[^/.]+$/, '');

        // Create emoticon data
        newEmoticons.push({
          name,
          data: base64,
          mappings: getDefaultMappings(name),
          type: fileType
        });
      }

      // Update localStorage and state
      const updatedEmoticons = [...emoticons, ...newEmoticons];
      localStorage.setItem('moodring_emoticons', JSON.stringify(updatedEmoticons));
      setEmoticons(updatedEmoticons);

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (name: string) => {
    const updatedEmoticons = emoticons.filter(e => e.name !== name);
    localStorage.setItem('moodring_emoticons', JSON.stringify(updatedEmoticons));
    setEmoticons(updatedEmoticons);
  };

  const handleMappingChange = (name: string, newMappings: string[]) => {
    const updatedEmoticons = emoticons.map(e => 
      e.name === name ? { ...e, mappings: newMappings } : e
    );
    localStorage.setItem('moodring_emoticons', JSON.stringify(updatedEmoticons));
    setEmoticons(updatedEmoticons);
  };

  const getDefaultMappings = (name: string): string[] => {
    const mappingMap: { [key: string]: string[] } = {
      smile: [':)', ':-)'],
      sad: [':(', ':-('],
      happy: [':D', ':-D'],
      wink: [';)'],
      tongue: [':P', ':-P'],
      heart: ['<3'],
      kiss: [':*', ':-*']
    };
    return mappingMap[name] || [];
  };

  const getSizeClass = () => {
    switch (emoticonSize) {
      case 'small': return 'w-4 h-4';
      case 'large': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  const renderPreview = () => {
    const parts = previewText.split(/(\s+)/);
    return (
      <div className="p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-white font-bold mb-4">Preview</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
              placeholder="Type to preview emoticons..."
            />
          </div>
          <div className="flex-1 p-4 bg-white/5 rounded">
            {parts.map((part, index) => {
              if (part.trim() === '') {
                return <span key={index}>{part}</span>;
              }
              
              const emoticon = emoticons.find(e => e.mappings.includes(part));
              if (emoticon) {
                return (
                  <img
                    key={index}
                    src={emoticon.data}
                    alt={part}
                    className={`inline-block ${getSizeClass()} align-middle`}
                    style={{
                      imageRendering: 'pixelated',
                      filter: 'contrast(1.2) brightness(1.1)'
                    }}
                  />
                );
              }
              
              return <span key={index}>{part}</span>;
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.2)]">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] mb-4">
          Upload Emoticons
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <input
                type="file"
                accept={allowedTypes.map(type => `.${type}`).join(',')}
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="emoticon-upload"
              />
              <div className="cursor-pointer px-4 py-2 text-center backdrop-blur-md bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                {uploading ? 'Uploading...' : 'Choose Files'}
              </div>
            </label>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {renderPreview()}

          <div className="text-white/70 text-sm">
            <p>Current emoticons:</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {emoticons.map((emoticon) => (
                <div
                  key={emoticon.name}
                  className="flex items-center space-x-4 p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg"
                >
                  <img
                    src={emoticon.data}
                    alt={emoticon.name}
                    className={getSizeClass()}
                    style={{
                      imageRendering: 'pixelated',
                      filter: 'contrast(1.2) brightness(1.1)'
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-bold">{emoticon.name}.{emoticon.type}</p>
                      <button
                        onClick={() => handleDelete(emoticon.name)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                    <input
                      type="text"
                      value={emoticon.mappings.join(' ')}
                      onChange={(e) => handleMappingChange(emoticon.name, e.target.value.split(' '))}
                      placeholder="Enter mappings (space-separated)"
                      className="mt-1 w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmoticonUploader; 