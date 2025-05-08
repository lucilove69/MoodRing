import React, { useState } from 'react';

interface MusicPlayerProps {
  url: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!url) {
    return (
      <div className="border-2 border-gray-400 p-4 mb-6 bg-gray-100">
        <h2 className="text-lg font-bold mb-2">🎵 Music</h2>
        <p className="text-sm text-center italic">No song selected</p>
      </div>
    );
  }
  
  return (
    <div className="border-2 border-gray-400 p-4 mb-6 bg-gray-100">
      <h2 className="text-lg font-bold mb-2">🎵 Music</h2>
      <div className="bg-gray-200 border border-gray-400 p-2">
        <div className="iframe-container">
          <iframe 
            src={isPlaying ? url : 'about:blank'} 
            frameBorder="0" 
            width="100%" 
            height="100%"
            title="Music Player"
          />
        </div>
        
        <div className="flex justify-center mt-2">
          <button 
            className="myspace-button text-sm px-2 py-1"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;