import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Smile, X } from 'lucide-react';
import Button from './Button';
import Textarea from './Textarea';
import { useToast } from './Toast';

interface CreatePostProps {
  onSubmit: (data: { content: string; images: File[] }) => void;
  className?: string;
  placeholder?: string;
  buttonText?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({
  onSubmit,
  className = '',
  placeholder = "What's on your mind?",
  buttonText = 'Post',
}) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) {
      showToast('You can only upload up to 4 images', 'error');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) {
      showToast('Please add some content or images', 'error');
      return;
    }

    onSubmit({ content, images });
    setContent('');
    setImages([]);
    setPreviews([]);
  };

  return (
    <div className={`bg-white/5 rounded-lg p-4 ${className}`}>
      <Textarea
        value={content}
        onChange={setContent}
        placeholder={placeholder}
        minRows={3}
        maxRows={6}
        className="mb-4"
      />

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <Button
            variant="ghost"
            icon={<ImageIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            Add Images
          </Button>
          <Button
            variant="ghost"
            icon={<Smile />}
            onClick={() => {
              // TODO: Implement emoticon picker
              showToast('Emoticon picker coming soon!', 'info');
            }}
          >
            Add Emoticon
          </Button>
        </div>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!content.trim() && images.length === 0}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost; 