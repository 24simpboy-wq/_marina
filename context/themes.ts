export type ThemeType = 'romantic-rose' | 'starry-night' | 'golden-hour' | 'bunny-wonderland' | 'cats-dream' | 'morning-sun' | 'moonlit-forest';

export type MoodType = 'happy' | 'calm' | 'tired' | 'excited' | 'loving' | 'melancholy';
export type Mood = MoodType;

export interface Theme {
  name: ThemeType;
  label: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundGradient: [string, string];
    surface: string;
    text: string;
    textSecondary: string;
    sentBubble: [string, string];
    receivedBubble: string;
    glass: string;
    gold: string;
  };
  ambient: {
    particleType: 'flowers' | 'hearts' | 'stars' | 'bunnies' | 'cats' | 'mixed';
    hasRain: boolean;
    hasClouds: boolean;
    hasAurora: boolean;
  };
  sounds: {
    chime: string;
    sparkle: string;
    notification: string;
  };
}

export const themes: Record<ThemeType, Theme> = {
  'romantic-rose': {
    name: 'romantic-rose',
    label: 'Romantic Rose',
    colors: {
      primary: '#FF6B9D',
      secondary: '#C44569',
      accent: '#FFC0CB',
      background: '#FFF0F5',
      backgroundGradient: ['#FFF0F5', '#FFE4E1'],
      surface: '#FFFFFF',
      text: '#2D1B2E',
      textSecondary: '#8B6F7B',
      sentBubble: ['#FF6B9D', '#FF8FA3'],
      receivedBubble: 'rgba(255, 255, 255, 0.85)',
      glass: 'rgba(255, 255, 255, 0.25)',
      gold: '#FFD700',
    },
    ambient: {
      particleType: 'hearts',
      hasRain: false,
      hasClouds: false,
      hasAurora: false,
    },
    sounds: {
      chime: 'chime-rose',
      sparkle: 'sparkle-soft',
      notification: 'notification-love',
    },
  },
  'starry-night': {
    name: 'starry-night',
    label: 'Starry Night',
    colors: {
      primary: '#9B59B6',
      secondary: '#5D4E6D',
      accent: '#B8A9C9',
      background: '#1A1A2E',
      backgroundGradient: ['#1A1A2E', '#16213E'],
      surface: '#252545',
      text: '#FFFFFF',
      textSecondary: '#A0A0B0',
      sentBubble: ['#9B59B6', '#8E44AD'],
      receivedBubble: 'rgba(255, 255, 255, 0.15)',
      glass: 'rgba(255, 255, 255, 0.1)',
      gold: '#FFE66D',
    },
    ambient: {
      particleType: 'stars',
      hasRain: false,
      hasClouds: false,
      hasAurora: true,
    },
    sounds: {
      chime: 'chime-cosmic',
      sparkle: 'sparkle-magic',
      notification: 'notification-dream',
    },
  },
  'golden-hour': {
    name: 'golden-hour',
    label: 'Golden Hour',
    colors: {
      primary: '#FF8C42',
      secondary: '#D4733D',
      accent: '#FFD93D',
      background: '#FFF8E7',
      backgroundGradient: ['#FFF8E7', '#FFE4B5'],
      surface: '#FFFFFF',
      text: '#3D2914',
      textSecondary: '#8B7355',
      sentBubble: ['#FF8C42', '#FFA54F'],
      receivedBubble: 'rgba(255, 255, 255, 0.9)',
      glass: 'rgba(255, 248, 231, 0.4)',
      gold: '#FFD700',
    },
    ambient: {
      particleType: 'flowers',
      hasRain: false,
      hasClouds: true,
      hasAurora: false,
    },
    sounds: {
      chime: 'chime-warm',
      sparkle: 'sparkle-sun',
      notification: 'notification-gentle',
    },
  },
  'bunny-wonderland': {
    name: 'bunny-wonderland',
    label: 'Bunny Wonderland',
    colors: {
      primary: '#FF69B4',
      secondary: '#DA70D6',
      accent: '#DDA0DD',
      background: '#FFF5F7',
      backgroundGradient: ['#FFF5F7', '#F8E0F0'],
      surface: '#FFFFFF',
      text: '#4A0E4E',
      textSecondary: '#9B6B9E',
      sentBubble: ['#FF69B4', '#FF8DC7'],
      receivedBubble: 'rgba(255, 255, 255, 0.9)',
      glass: 'rgba(255, 240, 245, 0.5)',
      gold: '#FFD700',
    },
    ambient: {
      particleType: 'bunnies',
      hasRain: false,
      hasClouds: true,
      hasAurora: false,
    },
    sounds: {
      chime: 'chime-hop',
      sparkle: 'sparkle-bunny',
      notification: 'notification-hop',
    },
  },
  'cats-dream': {
    name: 'cats-dream',
    label: "Cat's Dream",
    colors: {
      primary: '#7B68EE',
      secondary: '#6A5ACD',
      accent: '#B19CD9',
      background: '#F0F0FF',
      backgroundGradient: ['#F0F0FF', '#E6E6FA'],
      surface: '#FFFFFF',
      text: '#2D1B4E',
      textSecondary: '#7B6B8D',
      sentBubble: ['#7B68EE', '#9B89F0'],
      receivedBubble: 'rgba(255, 255, 255, 0.9)',
      glass: 'rgba(240, 240, 255, 0.5)',
      gold: '#FFE4B5',
    },
    ambient: {
      particleType: 'cats',
      hasRain: false,
      hasClouds: false,
      hasAurora: true,
    },
    sounds: {
      chime: 'chime-purr',
      sparkle: 'sparkle-cat',
      notification: 'notification-meow',
    },
  },
  'morning-sun': {
    name: 'morning-sun',
    label: 'Morning Sun',
    colors: {
      primary: '#FFA500',
      secondary: '#FF8C00',
      accent: '#FFD700',
      background: '#FFFEF0',
      backgroundGradient: ['#FFFEF0', '#FFF8DC'],
      surface: '#FFFFFF',
      text: '#4A3728',
      textSecondary: '#8B7355',
      sentBubble: ['#FFA500', '#FFB84D'],
      receivedBubble: 'rgba(255, 255, 255, 0.95)',
      glass: 'rgba(255, 254, 240, 0.5)',
      gold: '#FFD700',
    },
    ambient: {
      particleType: 'flowers',
      hasRain: false,
      hasClouds: true,
      hasAurora: false,
    },
    sounds: {
      chime: 'chime-bright',
      sparkle: 'sparkle-morning',
      notification: 'notification-bird',
    },
  },
  'moonlit-forest': {
    name: 'moonlit-forest',
    label: 'Moonlit Forest',
    colors: {
      primary: '#4ECDC4',
      secondary: '#2C5F5D',
      accent: '#7FDBDA',
      background: '#0F2027',
      backgroundGradient: ['#0F2027', '#203A43'],
      surface: '#1A3A3A',
      text: '#E0F7FA',
      textSecondary: '#80CBC4',
      sentBubble: ['#4ECDC4', '#7FDBDA'],
      receivedBubble: 'rgba(255, 255, 255, 0.12)',
      glass: 'rgba(255, 255, 255, 0.08)',
      gold: '#B8E6E6',
    },
    ambient: {
      particleType: 'mixed',
      hasRain: true,
      hasClouds: true,
      hasAurora: true,
    },
    sounds: {
      chime: 'chime-mystic',
      sparkle: 'sparkle-moon',
      notification: 'notification-owl',
    },
  },
};

export const moodThemes: Record<string, Partial<Theme['colors']>> = {
  happy: {
    backgroundGradient: ['#FFF9C4', '#FFF59D'],
    accent: '#FFD54F',
  },
  calm: {
    backgroundGradient: ['#E3F2FD', '#BBDEFB'],
    accent: '#90CAF9',
  },
  tired: {
    backgroundGradient: ['#FFCCBC', '#FFAB91'],
    accent: '#FF8A65',
  },
  excited: {
    backgroundGradient: ['#F3E5F5', '#E1BEE7'],
    accent: '#CE93D8',
  },
  loving: {
    backgroundGradient: ['#FCE4EC', '#F8BBD9'],
    accent: '#F48FB1',
  },
  melancholy: {
    backgroundGradient: ['#E0E0E0', '#BDBDBD'],
    accent: '#9E9E9E',
  },
};

export const avatars = [
  { id: 'marina-bunny', name: 'Marina Bunny', emoji: '🐰', color: '#FF69B4' },
  { id: 'marina-cat', name: 'Marina Cat', emoji: '🐱', color: '#FF6B9D' },
  { id: 'marina-princess', name: 'Marina Princess', emoji: '👸', color: '#DA70D6' },
  { id: 'ivan-star', name: 'Ivan Star', emoji: '✨', color: '#FFD700' },
  { id: 'ivan-cat', name: 'Ivan Cat', emoji: '🐱', color: '#7B68EE' },
  { id: 'ivan-prince', name: 'Ivan Prince', emoji: '🤴', color: '#FFA500' },
];

export const stickers = [
  { id: 'bunny-hug', name: 'Bunny Hug', emoji: '🐰', animation: 'hug' },
  { id: 'cat-purr', name: 'Cat Purr', emoji: '🐱', animation: 'purr' },
  { id: 'bunny-kiss', name: 'Bunny Kisses', emoji: '😘', animation: 'kiss' },
  { id: 'heart', name: 'Love Heart', emoji: '❤️', animation: 'pulse' },
  { id: 'sparkle', name: 'Sparkle', emoji: '✨', animation: 'sparkle' },
  { id: 'crown', name: 'Crown', emoji: '👑', animation: 'shine' },
];
