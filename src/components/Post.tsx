import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import Avatar from './Avatar';
import Button from './Button';
import Dropdown from './Dropdown';
import { useToast } from './Toast';

interface PostProps {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  images?: string[];
  createdAt: Date;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  className?: string;
}

const Post: React.FC<PostProps> = ({
  id,
  author,
  content,
  images = [],
  createdAt,
  likes,
  comments,
  shares,
  isLiked = false,
  onLike,
  onComment,
  onShare,
  onDelete,
  onEdit,
  className = '',
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const { showToast } = useToast();
  const contentLength = content.length;
  const maxLength = 300;

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

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    showToast('Link copied to clipboard!', 'success');
    onShare?.();
  };

  return (
    <div className={`bg-white/5 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={author.avatar}
            alt={author.name}
            size="medium"
            fallback={author.name}
          />
          <div>
            <h3 className="font-medium text-white">{author.name}</h3>
            <p className="text-sm text-white/50">{formatDate(createdAt)}</p>
          </div>
        </div>
        <Dropdown
          trigger={<Button variant="ghost" icon={<MoreHorizontal />}>More</Button>}
          items={dropdownItems}
        />
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-white whitespace-pre-wrap">
          {showFullContent ? content : content.slice(0, maxLength)}
          {contentLength > maxLength && !showFullContent && '...'}
        </p>
        {contentLength > maxLength && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-blue-500 hover:text-blue-400 text-sm mt-1"
          >
            {showFullContent ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div className={`grid gap-2 mb-4 ${
          images.length === 1 ? 'grid-cols-1' :
          images.length === 2 ? 'grid-cols-2' :
          images.length === 3 ? 'grid-cols-2' :
          'grid-cols-2'
        }`}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square ${
                images.length === 3 && index === 0 ? 'col-span-2' : ''
              }`}
            >
              <img
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-white/50 mb-4">
        <div className="flex items-center space-x-4">
          <span>{likes} likes</span>
          <span>{comments} comments</span>
          <span>{shares} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <Button
          variant="ghost"
          icon={<Heart className={isLiked ? 'text-red-500 fill-red-500' : ''} />}
          onClick={onLike}
        >
          Like
        </Button>
        <Button
          variant="ghost"
          icon={<MessageCircle />}
          onClick={onComment}
        >
          Comment
        </Button>
        <Button
          variant="ghost"
          icon={<Share2 />}
          onClick={handleShare}
        >
          Share
        </Button>
      </div>
    </div>
  );
};

export default Post; 