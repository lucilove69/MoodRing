interface Emoticon {
  pattern: RegExp;
  image: string;
  alt: string;
}

export const emoticons: Emoticon[] = [
  { pattern: /:\)|:-\)/g, image: '/emoticons/smile.gif', alt: 'smile' },
  { pattern: /:\(|:-\(/g, image: '/emoticons/sad.gif', alt: 'sad' },
  { pattern: /;\)|;-\)/g, image: '/emoticons/wink.gif', alt: 'wink' },
  { pattern: /:D|:-D/g, image: '/emoticons/grin.gif', alt: 'grin' },
  { pattern: /:P|:-P/g, image: '/emoticons/tongue.gif', alt: 'tongue' },
  { pattern: /:O|:-O/g, image: '/emoticons/shocked.gif', alt: 'shocked' },
  { pattern: /\^_\^/g, image: '/emoticons/happy.gif', alt: 'happy' },
  { pattern: /<3/g, image: '/emoticons/heart.gif', alt: 'heart' },
  { pattern: /\(y\)/g, image: '/emoticons/thumbsup.gif', alt: 'thumbs up' },
  { pattern: /\(n\)/g, image: '/emoticons/thumbsdown.gif', alt: 'thumbs down' },
  { pattern: /\(coffee\)/g, image: '/emoticons/coffee.gif', alt: 'coffee' },
  { pattern: /\(pizza\)/g, image: '/emoticons/pizza.gif', alt: 'pizza' },
  { pattern: /\(music\)/g, image: '/emoticons/music.gif', alt: 'music' },
  { pattern: /\(star\)/g, image: '/emoticons/star.gif', alt: 'star' },
];

export function convertTextToEmoticons(text: string): string {
  let result = text;
  emoticons.forEach(({ pattern, image, alt }) => {
    result = result.replace(pattern, `<img src="${image}" alt="${alt}" class="emoticon" />`);
  });
  return result;
}