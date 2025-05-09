export interface Emoticon {
  id: string;
  code: string;
  name: string;
  path: string;
  isAnimated: boolean;
  category: 'basic' | 'reaction' | 'custom';
}

export const DEFAULT_EMOTICONS: Emoticon[] = [
  {
    id: 'happy',
    code: ':)',
    name: 'Happy',
    path: '/assets/emoticons/static/happy.png',
    isAnimated: false,
    category: 'basic'
  },
  {
    id: 'sad',
    code: ':(',
    name: 'Sad',
    path: '/assets/emoticons/static/sad.png',
    isAnimated: false,
    category: 'basic'
  },
  {
    id: 'love',
    code: '<3',
    name: 'Love',
    path: '/assets/emoticons/static/love.png',
    isAnimated: false,
    category: 'basic'
  },
  {
    id: 'laugh',
    code: ':D',
    name: 'Laugh',
    path: '/assets/emoticons/static/laugh.png',
    isAnimated: false,
    category: 'basic'
  },
  {
    id: 'wink',
    code: ';)',
    name: 'Wink',
    path: '/assets/emoticons/static/wink.png',
    isAnimated: false,
    category: 'basic'
  },
  {
    id: 'surprised',
    code: ':O',
    name: 'Surprised',
    path: '/assets/emoticons/static/surprised.png',
    isAnimated: false,
    category: 'basic'
  }
];

export const ANIMATED_EMOTICONS: Emoticon[] = [
  {
    id: 'dancing',
    code: ':dance:',
    name: 'Dancing',
    path: '/assets/emoticons/animated/dancing.gif',
    isAnimated: true,
    category: 'reaction'
  },
  {
    id: 'heart',
    code: ':heart:',
    name: 'Heart',
    path: '/assets/emoticons/animated/heart.gif',
    isAnimated: true,
    category: 'reaction'
  }
];

export const EMOTICON_CATEGORIES = {
  basic: 'Basic Emotions',
  reaction: 'Reactions',
  custom: 'Custom Emoticons'
} as const; 