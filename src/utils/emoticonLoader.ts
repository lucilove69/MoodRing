import { Emoticon } from '../constants/emoticons';

const EMOTICON_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];

export const loadEmoticonsFromDirectory = async (): Promise<Emoticon[]> => {
  try {
    // In a real implementation, this would be handled by the backend
    // For now, we'll use a predefined list of emoticons
    const emoticons: Emoticon[] = [
      {
        id: 'happy',
        code: ':happy:',
        name: 'Happy',
        path: '/assets/emoticons/happy.png',
        isAnimated: false,
        category: 'basic'
      },
      {
        id: 'sad',
        code: ':sad:',
        name: 'Sad',
        path: '/assets/emoticons/sad.png',
        isAnimated: false,
        category: 'basic'
      },
      {
        id: 'love',
        code: ':love:',
        name: 'Love',
        path: '/assets/emoticons/love.png',
        isAnimated: false,
        category: 'basic'
      },
      {
        id: 'laugh',
        code: ':laugh:',
        name: 'Laugh',
        path: '/assets/emoticons/laugh.png',
        isAnimated: false,
        category: 'basic'
      },
      {
        id: 'wink',
        code: ':wink:',
        name: 'Wink',
        path: '/assets/emoticons/wink.png',
        isAnimated: false,
        category: 'basic'
      },
      {
        id: 'surprised',
        code: ':surprised:',
        name: 'Surprised',
        path: '/assets/emoticons/surprised.png',
        isAnimated: false,
        category: 'basic'
      },
      {
        id: 'dancing',
        code: ':dancing:',
        name: 'Dancing',
        path: '/assets/emoticons/dancing.gif',
        isAnimated: true,
        category: 'reaction'
      },
      {
        id: 'heart',
        code: ':heart:',
        name: 'Heart',
        path: '/assets/emoticons/heart.gif',
        isAnimated: true,
        category: 'reaction'
      }
    ];

    return emoticons;
  } catch (error) {
    console.error('Failed to load emoticons:', error);
    return [];
  }
};

export const getEmoticonSize = (size: 'small' | 'medium' | 'large' = 'medium'): string => {
  switch (size) {
    case 'small':
      return 'w-4 h-4';
    case 'large':
      return 'w-8 h-8';
    default:
      return 'w-6 h-6';
  }
}; 