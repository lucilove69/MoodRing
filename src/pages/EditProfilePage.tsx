import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import FriendsList from '../components/FriendsList';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-github";

const EditProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    status: '',
    mood: '',
    about: '',
    interests: '',
    profileSong: '',
  });
  
  const [customHTML, setCustomHTML] = useState('');
  const [customCSS, setCustomCSS] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [topFriends, setTopFriends] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        status: user.status || '',
        mood: user.mood || '',
        about: user.about || '',
        interests: user.interests || '',
        profileSong: user.profileSong || '',
      });
      setCustomHTML(user.customHTML || '');
      setCustomCSS(user.customCSS || '');
      setTopFriends(user.topFriends || []);
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        ...formData,
        customHTML,
        customCSS,
        topFriends,
      });
      navigate(`/profile/${user?.username}`);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };
  
  const handleTopFriendsReorder = (newOrder: string[]) => {
    setTopFriends(newOrder);
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Your Profile</h1>
        <button 
          className="myspace-button"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-300">
          <button 
            className={`px-4 py-2 ${activeTab === 'basic' ? 'bg-blue-100 font-bold border-t border-l border-r border-gray-300' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'design' ? 'bg-blue-100 font-bold border-t border-l border-r border-gray-300' : ''}`}
            onClick={() => setActiveTab('design')}
          >
            Design Editor
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'friends' ? 'bg-blue-100 font-bold border-t border-l border-r border-gray-300' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Top 8 Friends
          </button>
        </div>
      </div>
      
      {activeTab === 'basic' && (
        <form className="bg-white border-2 border-gray-400 rounded p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2">
                Status:
              </label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="myspace-input w-full"
                placeholder="What's your status?"
              />
            </div>
            
            <div>
              <label className="block font-bold mb-2">
                Mood:
              </label>
              <input
                type="text"
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                className="myspace-input w-full"
                placeholder="How are you feeling?"
              />
            </div>
            
            <div>
              <label className="block font-bold mb-2">
                Profile Song URL:
              </label>
              <input
                type="text"
                name="profileSong"
                value={formData.profileSong}
                onChange={handleChange}
                className="myspace-input w-full"
                placeholder="Enter music embed URL"
              />
              <p className="text-xs mt-1">
                Add the URL for an embedded music player (YouTube, SoundCloud, etc.)
              </p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block font-bold mb-2">
                About Me:
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="myspace-input w-full h-32"
                placeholder="Tell people about yourself..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block font-bold mb-2">
                Interests:
              </label>
              <textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                className="myspace-input w-full h-32"
                placeholder="Share your interests..."
              />
            </div>
          </div>
        </form>
      )}
      
      {activeTab === 'design' && (
        <div className="border-2 border-gray-400 rounded p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Profile Design Editor</h2>
            <div>
              <button 
                className="myspace-button mr-2 text-sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2">
                HTML Content:
              </label>
              <AceEditor
                mode="html"
                theme="github"
                name="html-editor"
                value={customHTML}
                onChange={setCustomHTML}
                width="100%"
                height="300px"
                setOptions={{
                  useWorker: false,
                  showPrintMargin: false,
                }}
              />
            </div>
            
            <div>
              <label className="block font-bold mb-2">
                CSS Styles:
              </label>
              <AceEditor
                mode="css"
                theme="github"
                name="css-editor"
                value={customCSS}
                onChange={setCustomCSS}
                width="100%"
                height="300px"
                setOptions={{
                  useWorker: false,
                  showPrintMargin: false,
                }}
              />
            </div>
          </div>
          
          {previewMode && (
            <div className="mt-6 border-2 border-dashed border-gray-400 p-4">
              <h3 className="text-center font-bold mb-2">Preview</h3>
              <style dangerouslySetInnerHTML={{ __html: customCSS }} />
              <div dangerouslySetInnerHTML={{ __html: customHTML }} />
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="font-bold mb-2">Popular Profile Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                className="border border-gray-300 p-2 text-center hover:bg-gray-100"
                onClick={() => {
                  setCustomHTML('<div class="glitter-border"><h1 class="glitter-text">Welcome to my profile!</h1><p>Thanks for stopping by!</p></div>');
                  setCustomCSS('.glitter-border { border: 5px solid pink; padding: 10px; background: url(/images/glitter.gif); } .glitter-text { font-size: 24px; text-align: center; color: pink; }');
                }}
              >
                <img src="/images/templates/glitter.jpg" alt="Glitter Template" className="w-full h-24 object-cover mb-2" />
                <span className="text-sm">Glitter Theme</span>
              </button>
              
              <button 
                className="border border-gray-300 p-2 text-center hover:bg-gray-100"
                onClick={() => {
                  setCustomHTML('<div class="dark-theme"><h1>Dark Theme Profile</h1><p>Welcome to the dark side...</p></div>');
                  setCustomCSS('.dark-theme { background-color: #000; color: #fff; padding: 20px; } .dark-theme h1 { color: #ff0000; }');
                }}
              >
                <img src="/images/templates/dark.jpg" alt="Dark Template" className="w-full h-24 object-cover mb-2" />
                <span className="text-sm">Dark Theme</span>
              </button>
              
              <button 
                className="border border-gray-300 p-2 text-center hover:bg-gray-100"
                onClick={() => {
                  setCustomHTML('<div class="retro-profile"><h1>Retro Computing</h1><p>Welcome to my digital space</p><div class="under-construction"></div></div>');
                  setCustomCSS('.retro-profile { font-family: "Courier New", monospace; background-color: #00aaff; color: yellow; padding: 15px; } .under-construction { height: 80px; background: url(/images/under-construction.gif) no-repeat center; margin-top: 20px; }');
                }}
              >
                <img src="/images/templates/retro.jpg" alt="Retro Template" className="w-full h-24 object-cover mb-2" />
                <span className="text-sm">Retro Computing</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'friends' && (
        <div className="border-2 border-gray-400 rounded p-6">
          <h2 className="text-xl font-bold mb-4">Arrange Your Top 8 Friends</h2>
          
          <div className="mb-4">
            <p className="text-sm mb-2">
              Drag and drop to rearrange your Top 8 friends. These will appear on your profile.
            </p>
          </div>
          
          <FriendsList
            friends={topFriends}
            title="Your Top 8"
            isEditMode={true}
            onFriendsReorder={handleTopFriendsReorder}
          />
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;