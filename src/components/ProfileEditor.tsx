import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-monokai';
import { Save, Music, Palette, Code } from 'lucide-react';

interface ProfileEditorProps {
  initialHTML: string;
  initialCSS: string;
  initialSong?: string;
  onSave: (html: string, css: string, song: string) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  initialHTML,
  initialCSS,
  initialSong = '',
  onSave
}) => {
  const [html, setHTML] = useState(initialHTML);
  const [css, setCSS] = useState(initialCSS);
  const [song, setSong] = useState(initialSong);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'music'>('html');

  const handleSave = () => {
    onSave(html, css, song);
  };

  return (
    <div className="bg-gradient-to-b from-[#000000] to-[#1a1a1a] text-white p-6 rounded-lg shadow-[0_0_20px_rgba(255,0,255,0.3)]">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('html')}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            activeTab === 'html'
              ? 'bg-[#FF00FF] text-white'
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          <Code size={18} className="mr-2" />
          <span className="font-bold">HTML</span>
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            activeTab === 'css'
              ? 'bg-[#00FFFF] text-black'
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          <Palette size={18} className="mr-2" />
          <span className="font-bold">CSS</span>
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            activeTab === 'music'
              ? 'bg-[#FF00FF] text-white'
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          <Music size={18} className="mr-2" />
          <span className="font-bold">Music</span>
        </button>
      </div>

      <div className="mb-6">
        {activeTab === 'html' && (
          <AceEditor
            mode="html"
            theme="monokai"
            value={html}
            onChange={setHTML}
            name="html-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            width="100%"
            height="400px"
            className="rounded-lg"
          />
        )}

        {activeTab === 'css' && (
          <AceEditor
            mode="css"
            theme="monokai"
            value={css}
            onChange={setCSS}
            name="css-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            width="100%"
            height="400px"
            className="rounded-lg"
          />
        )}

        {activeTab === 'music' && (
          <div className="space-y-4">
            <input
              type="text"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              placeholder="Enter YouTube video ID or URL"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FF00FF]"
            />
            <div className="text-sm text-white/70">
              <p>Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Enter a YouTube video ID (e.g., dQw4w9WgXcQ)</li>
                <li>Or paste a full YouTube URL</li>
                <li>The video will autoplay when someone visits your profile</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF00FF] to-[#00FFFF] text-white font-bold hover:scale-105 transition-all duration-200"
        >
          <Save size={18} className="mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileEditor; 