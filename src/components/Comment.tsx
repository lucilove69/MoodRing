import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import Avatar from './Avatar';
import Button from './Button';
import Dropdown from './Dropdown';
import Textarea from './Textarea';
import { useToast } from './Toast';

interface CommentProps {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  replies: number;
  isLiked?: boolean;
  onLike?: () => void;
  onReply?: (content: string) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  className?: string;
}

const Comment: React.FC<CommentProps> = ({
  id,
  author,
  content,
  createdAt,
  likes,
  replies,
  isLiked = false,
  onLike,
  onReply,
  onDelete,
  onEdit,
  className = '',
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { showToast } = useToast();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString();
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const dropdownItems = [
    {
      label: 'Edit',
      onClick: onEdit || (() => {}),
      icon: <span className="text-blue-500">✏️</span>,
    },
    {
      label: 'Delete',
      onClick: onDelete || (() => {}),
      icon: <span className="text-red-500">🗑️</span>,
      danger: true,
    },
  ];

  const handleReply = () => {
    if (!replyContent.trim()) {
      showToast('Please enter a reply', 'error');
      return;
    }
    onReply?.(replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Comment */}
      <div className="flex space-x-3">
        <Avatar
          src={author.avatar}
          alt={author.name}
          size="small"
          fallback={author.name}
        />
        <div className="flex-1">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-white">{author.name}</h4>
                <p className="text-sm text-white/50">{formatDate(createdAt)}</p>
              </div>
              <Dropdown
                trigger={<Button variant="ghost" icon={<MoreHorizontal />}>More</Button>}
                items={dropdownItems}
              />
            </div>
            <p className="text-white whitespace-pre-wrap">{content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 mt-2">
            <Button
              variant="ghost"
              size="small"
              icon={<Heart className={isLiked ? 'text-red-500 fill-red-500' : ''} />}
              onClick={onLike}
            >
              {likes > 0 && <span className="ml-1">{likes}</span>}
            </Button>
            <Button
              variant="ghost"
              size="small"
              icon={<MessageCircle />}
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </Button>
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-3">
              <Textarea
                value={replyContent}
                onChange={setReplyContent}
                placeholder="Write a reply..."
                minRows={2}
                maxRows={4}
                className="mb-2"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleReply}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment; 