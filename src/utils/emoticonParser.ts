import { Emoticon, DEFAULT_EMOTICONS, ANIMATED_EMOTICONS } from '../constants/emoticons';

const ALL_EMOTICONS = [...DEFAULT_EMOTICONS, ...ANIMATED_EMOTICONS];

export const parseEmoticons = (text: string): (string | Emoticon)[] => {
  const parts: (string | Emoticon)[] = [];
  let currentText = text;
  
  while (currentText.length > 0) {
    let foundEmoticon = false;
    
    for (const emoticon of ALL_EMOTICONS) {
      if (currentText.startsWith(emoticon.code)) {
        if (parts.length > 0 && typeof parts[parts.length - 1] === 'string') {
          parts.push(emoticon);
        } else {
          parts.push('', emoticon);
        }
        currentText = currentText.slice(emoticon.code.length);
        foundEmoticon = true;
        break;
      }
    }
    
    if (!foundEmoticon) {
      if (parts.length === 0 || typeof parts[parts.length - 1] !== 'string') {
        parts.push(currentText[0]);
      } else {
        parts[parts.length - 1] += currentText[0];
      }
      currentText = currentText.slice(1);
    }
  }
  
  return parts;
};

export const renderEmoticon = (emoticon: Emoticon): JSX.Element => {
  return (
    <img
      src={emoticon.path}
      alt={emoticon.name}
      className={`inline-block align-middle ${emoticon.isAnimated ? 'w-6 h-6' : 'w-5 h-5'}`}
      title={emoticon.name}
    />
  );
}; 