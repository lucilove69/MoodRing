import React from 'react';
import EmoticonUploader from '../../components/EmoticonUploader';

const EmoticonAdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] mb-8">
          Emoticon Manager
        </h1>
        
        <EmoticonUploader />
        
        <div className="mt-8 p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.2)]">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] mb-4">
            Current Emoticons
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {['smile', 'sad', 'happy', 'wink', 'tongue', 'heart', 'kiss'].map((emoticon) => (
              <div
                key={emoticon}
                className="flex items-center space-x-4 p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg"
              >
                <img
                  src={`/images/emoticons/${emoticon}.gif`}
                  alt={emoticon}
                  className="w-8 h-8"
                  style={{
                    imageRendering: 'pixelated',
                    filter: 'contrast(1.2) brightness(1.1)'
                  }}
                />
                <div>
                  <p className="text-white font-bold">{emoticon}.gif</p>
                  <p className="text-white/50 text-sm">
                    {emoticon === 'smile' && ':) :-)'}
                    {emoticon === 'sad' && ':( :-('}
                    {emoticon === 'happy' && ':D :-D'}
                    {emoticon === 'wink' && ';)'}
                    {emoticon === 'tongue' && ':P :-P'}
                    {emoticon === 'heart' && '<3'}
                    {emoticon === 'kiss' && ':* :-*'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmoticonAdminPage; 