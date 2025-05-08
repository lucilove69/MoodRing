import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface FriendData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  status: string;
}

const FriendsPage: React.FC = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [pendingFriends, setPendingFriends] = useState<FriendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FriendData[]>([]);
  
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const friendsRes = await api.get(`/users/friends/${user.id}`);
          setFriends(friendsRes.data);
          
          const pendingRes = await api.get(`/users/friends/pending/${user.id}`);
          setPendingFriends(pendingRes.data);
        }
      } catch (err) {
        console.error('Error fetching friends:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFriends();
  }, [user?.id]);
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const res = await api.get(`/users/search?q=${searchTerm}`);
      // Filter out current user and existing friends
      const filteredResults = res.data.filter(
        (result: FriendData) => 
          result.id !== user?.id && 
          !friends.some(friend => friend.id === result.id) &&
          !pendingFriends.some(friend => friend.id === result.id)
      );
      setSearchResults(filteredResults);
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };
  
  const handleAddFriend = async (friendId: string) => {
    try {
      if (user?.id) {
        await api.post('/users/friends/request', {
          userId: user.id,
          friendId
        });
        
        // Update search results to remove the added user
        setSearchResults(searchResults.filter(result => result.id !== friendId));
        
        // Get the friend data and add to pending
        const friend = searchResults.find(result => result.id === friendId);
        if (friend) {
          setPendingFriends([...pendingFriends, friend]);
        }
      }
    } catch (err) {
      console.error('Error adding friend:', err);
    }
  };
  
  const handleAcceptFriend = async (friendId: string) => {
    try {
      if (user?.id) {
        await api.post('/users/friends/accept', {
          userId: user.id,
          friendId
        });
        
        // Move from pending to friends
        const friend = pendingFriends.find(f => f.id === friendId);
        if (friend) {
          setFriends([...friends, friend]);
          setPendingFriends(pendingFriends.filter(f => f.id !== friendId));
        }
      }
    } catch (err) {
      console.error('Error accepting friend:', err);
    }
  };
  
  const handleRejectFriend = async (friendId: string) => {
    try {
      if (user?.id) {
        await api.post('/users/friends/reject', {
          userId: user.id,
          friendId
        });
        
        // Remove from pending
        setPendingFriends(pendingFriends.filter(f => f.id !== friendId));
      }
    } catch (err) {
      console.error('Error rejecting friend:', err);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Friends Manager</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-[var(--myspace-blue)]">Find New Friends</h2>
        <div className="bg-gray-100 border-2 border-gray-400 p-4">
          <div className="flex mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="myspace-input flex-grow mr-2"
              placeholder="Search by name or username..."
            />
            <button 
              onClick={handleSearch}
              className="myspace-button"
            >
              Search
            </button>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map(result => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between bg-white p-3 border border-gray-300"
                >
                  <div className="flex items-center">
                    <img 
                      src={`/images/user-avatars/${result.id}.jpg`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default-avatars/avatar1.jpg';
                      }}
                      alt={result.username} 
                      className="w-12 h-12 mr-3 border border-gray-500" 
                    />
                    <div>
                      <Link 
                        to={`/profile/${result.username}`}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        {result.firstName} {result.lastName}
                      </Link>
                      <p className="text-xs">{result.status}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAddFriend(result.id)}
                    className="myspace-button text-sm"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <p className="text-center py-2">No results found</p>
          ) : null}
        </div>
      </div>
      
      {pendingFriends.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-[var(--myspace-blue)]">
            Friend Requests <span className="text-sm font-normal">({pendingFriends.length})</span>
          </h2>
          <div className="bg-yellow-50 border-2 border-yellow-300 p-4">
            <div className="space-y-3">
              {pendingFriends.map(friend => (
                <div 
                  key={friend.id} 
                  className="flex items-center justify-between bg-white p-3 border border-gray-300"
                >
                  <div className="flex items-center">
                    <img 
                      src={`/images/user-avatars/${friend.id}.jpg`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default-avatars/avatar1.jpg';
                      }}
                      alt={friend.username} 
                      className="w-12 h-12 mr-3 border border-gray-500" 
                    />
                    <div>
                      <Link 
                        to={`/profile/${friend.username}`}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        {friend.firstName} {friend.lastName}
                      </Link>
                      <p className="text-xs">{friend.status}</p>
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleAcceptFriend(friend.id)}
                      className="myspace-button text-sm bg-green-100 mr-2"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleRejectFriend(friend.id)}
                      className="myspace-button text-sm bg-red-100"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-bold mb-4 text-[var(--myspace-blue)]">
          My Friends <span className="text-sm font-normal">({friends.length})</span>
        </h2>
        
        {friends.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 border-2 border-gray-300">
            <p>You don't have any friends yet. Search for users to add them as friends.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map(friend => (
              <div 
                key={friend.id} 
                className="flex bg-white p-3 border-2 border-gray-300"
              >
                <img 
                  src={`/images/user-avatars/${friend.id}.jpg`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/default-avatars/avatar1.jpg';
                  }}
                  alt={friend.username} 
                  className="w-16 h-16 mr-3 border border-gray-500" 
                />
                <div>
                  <Link 
                    to={`/profile/${friend.username}`}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    {friend.firstName} {friend.lastName}
                  </Link>
                  <p className="text-xs mb-1">{friend.status}</p>
                  <p className="text-xs">
                    <Link 
                      to={`/profile/${friend.username}`} 
                      className="text-blue-600 hover:underline"
                    >
                      View Profile
                    </Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;