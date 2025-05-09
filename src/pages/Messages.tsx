import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Messages: React.FC = () => {
  const { state } = useApp();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const user = state.currentUser;
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-white/70">Please log in to view messages.</p>
      </div>
    );
  }

  // Get unique conversations
  const conversations = Array.from(
    new Set(
      state.messages
        .filter(msg => msg.senderId === user.id || msg.receiverId === user.id)
        .map(msg => (msg.senderId === user.id ? msg.receiverId : msg.senderId))
    )
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    // TODO: Implement message sending
    setNewMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 h-[600px]">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-white/10">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Messages</h2>
              </div>
              <div className="overflow-y-auto h-[calc(600px-4rem)]">
                {conversations.map(userId => {
                  const lastMessage = state.messages
                    .filter(msg => (msg.senderId === user.id && msg.receiverId === userId) || (msg.senderId === userId && msg.receiverId === user.id))
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                  return (
                    <button
                      key={userId}
                      onClick={() => setSelectedUser(userId)}
                      className={`w-full p-4 flex items-center space-x-4 hover:bg-white/5 transition-colors duration-200 ${
                        selectedUser === userId ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-white text-xl">
                          {userId.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white font-semibold">User {userId}</p>
                        <p className="text-white/70 text-sm truncate">
                          {lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-8 flex flex-col">
              {selectedUser ? (
                <>
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">User {selectedUser}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {state.messages
                      .filter(msg => (msg.senderId === user.id && msg.receiverId === selectedUser) || (msg.senderId === selectedUser && msg.receiverId === user.id))
                      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      .map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.senderId === user.id
                                ? 'bg-[var(--primary-color)] text-white'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[var(--primary-color)]"
                      />
                      <button
                        type="submit"
                        className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white/70">Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 