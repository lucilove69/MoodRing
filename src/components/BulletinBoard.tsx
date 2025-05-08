import React, { useState } from 'react';
import { Bulletin } from '../types';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface BulletinBoardProps {
  bulletins: Bulletin[];
  isOwnProfile: boolean;
}

const BulletinBoard: React.FC<BulletinBoardProps> = ({ bulletins, isOwnProfile }) => {
  const [localBulletins, setLocalBulletins] = useState<Bulletin[]>(bulletins);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const { user } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !user) {
      return;
    }
    
    try {
      const response = await api.post('/bulletins/create', {
        ...formData,
        userId: user.id
      });
      
      setLocalBulletins([response.data, ...localBulletins]);
      setFormData({ title: '', content: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error posting bulletin:', err);
    }
  };
  
  return (
    <div className="border-2 border-gray-400 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[var(--myspace-blue)]">
          Bulletin Board
        </h2>
        
        {isOwnProfile && (
          <button 
            className="myspace-button text-sm" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Post Bulletin'}
          </button>
        )}
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 border-2 border-gray-300 p-4 bg-gray-50">
          <div className="mb-3">
            <label className="block font-bold mb-1">Subject:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="myspace-input w-full"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block font-bold mb-1">Body:</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="myspace-input w-full h-24"
              required
            />
          </div>
          
          <div className="text-right">
            <button type="submit" className="myspace-button">
              Post
            </button>
          </div>
        </form>
      )}
      
      {localBulletins.length === 0 ? (
        <p className="text-center italic text-gray-500">No bulletins posted yet.</p>
      ) : (
        <div className="space-y-4">
          {localBulletins.map((bulletin) => (
            <div 
              key={bulletin.id} 
              className="border border-gray-300 p-3 bg-[#FFFED5]"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{bulletin.title}</h3>
                <p className="text-xs text-gray-600">
                  {new Date(bulletin.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm whitespace-pre-line">{bulletin.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BulletinBoard;