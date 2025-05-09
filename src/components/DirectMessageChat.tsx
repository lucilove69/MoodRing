import React, { useState, useRef, useEffect } from 'react';
import { useDirectMessages } from '../hooks/useDirectMessages';
import { useEmoticons } from '../hooks/useEmoticons';
import { Emoticon } from '../constants/emoticons';
import CustomEmoticonManager from './CustomEmoticonManager';
import { parseEmoticons, renderEmoticon } from '../utils/emoticonParser';
import { soundManager } from '../utils/soundManager';

interface DirectMessageChatProps {
  userId: string;
  friendId: string;
  friendName: string;
}

const DirectMessageChat: React.FC<DirectMessageChatProps> = ({
  userId,
  friendId,
  friendName,
}) => {
  const [message, setMessage] = useState('');
  const [showEmoticons, setShowEmoticons] = useState(false);
  const [showCustomEmoticons, setShowCustomEmoticons] = useState(false);
  const [selectedEmoticons, setSelectedEmoticons] = useState<Emoticon[]>([]);
  const [selectedCustomEmoticons, setSelectedCustomEmoticons] = useState<Emoticon[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    messages,
    isLoading,
    error,
    typingUsers,
    sendMessage,
    sendTypingStatus,
  } = useDirectMessages(userId);

  const {
    emoticons,
    getEmoticonsByCategory,
  } = useEmoticons();

  useEffect(() => {
    soundManager.play('open_chat');
    scrollToBottom();
    return () => {
      soundManager.play('close_chat');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Send typing status
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendTypingStatus(friendId, true);

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(friendId, false);
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!message.trim() && selectedEmoticons.length === 0 && selectedCustomEmoticons.length === 0) return;

    try {
      soundManager.play('message_sent');
      await sendMessage(friendId, message, selectedEmoticons, selectedCustomEmoticons);
      setMessage('');
      setSelectedEmoticons([]);
      setSelectedCustomEmoticons([]);
      sendTypingStatus(friendId, false);
    } catch (err) {
      soundManager.play('error');
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmoticonSelect = (emoticon: Emoticon) => {
    soundManager.play('button_click');
    setSelectedEmoticons(prev => [...prev, emoticon]);
    setShowEmoticons(false);
  };

  const handleCustomEmoticonSelect = (emoticon: Emoticon) => {
    soundManager.play('button_click');
    setSelectedCustomEmoticons(prev => [...prev, emoticon]);
    setShowCustomEmoticons(false);
  };

  const renderMessage = (content: string, emoticons: Emoticon[] = [], customEmoticons: Emoticon[] = []) => {
    const allEmoticons = [...emoticons, ...customEmoticons];
    const parts = parseEmoticons(content, allEmoticons);
    
    return parts.map((part, index) => {
      if (typeof part === 'string') {
        return <span key={index}>{part}</span>;
      }
      return renderEmoticon(part);
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">{friendName}</h2>
        {typingUsers.has(friendId) && (
          <span className="text-sm text-gray-500">typing...</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-600">Loading messages...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.senderId === userId
                    ? 'bg-[#7FB3D5] text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {renderMessage(msg.content, msg.emoticons, msg.customEmoticons)}
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Emoticons */}
      {(selectedEmoticons.length > 0 || selectedCustomEmoticons.length > 0) && (
        <div className="p-2 border-t border-gray-200 flex flex-wrap gap-2">
          {selectedEmoticons.map((emoticon) => (
            <div key={emoticon.id} className="relative">
              {renderEmoticon(emoticon)}
              <button
                onClick={() => {
                  soundManager.play('button_click');
                  setSelectedEmoticons(prev => prev.filter(e => e.id !== emoticon.id));
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full text-xs"
              >
                ×
              </button>
            </div>
          ))}
          {selectedCustomEmoticons.map((emoticon) => (
            <div key={emoticon.id} className="relative">
              {renderEmoticon(emoticon)}
              <button
                onClick={() => {
                  soundManager.play('button_click');
                  setSelectedCustomEmoticons(prev => prev.filter(e => e.id !== emoticon.id));
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              soundManager.play('button_click');
              setShowEmoticons(!showEmoticons);
            }}
            className="p-2 text-gray-600 hover:text-[#7FB3D5] transition-colors"
          >
            😊
          </button>
          <button
            onClick={() => {
              soundManager.play('button_click');
              setShowCustomEmoticons(!showCustomEmoticons);
            }}
            className="p-2 text-gray-600 hover:text-[#7FB3D5] transition-colors"
          >
            🎨
          </button>
          <textarea
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5] resize-none"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() && selectedEmoticons.length === 0 && selectedCustomEmoticons.length === 0}
            className="px-4 py-2 bg-[#7FB3D5] text-white rounded-lg hover:bg-[#6A9FC0] transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>

        {/* Emoticon Picker */}
        {showEmoticons && (
          <div className="mt-2 p-2 border border-gray-200 rounded-lg bg-white">
            <div className="grid grid-cols-8 gap-2">
              {getEmoticonsByCategory('basic').map((emoticon) => (
                <div
                  key={emoticon.id}
                  className="cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => handleEmoticonSelect(emoticon)}
                >
                  {renderEmoticon(emoticon)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Emoticon Manager */}
        {showCustomEmoticons && (
          <div className="mt-2">
            <CustomEmoticonManager
              userId={userId}
              onSelect={handleCustomEmoticonSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessageChat; 