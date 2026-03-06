export const generateId = () => Math.random().toString(36).substring(2, 15);

export const formatDate = (date: Date | string | number | undefined) => {
  if (!date) return 'Unknown date';
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'Unknown date';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return 'Unknown date';
  }
};

export const formatTime = (date: Date | string | number | undefined) => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return '';
  }
};

export const getCountdown = (targetDate: Date | string | number | undefined) => {
  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  const target = typeof targetDate === 'string' || typeof targetDate === 'number' ? new Date(targetDate) : targetDate;
  if (isNaN(target.getTime())) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

export const getMoodEmoji = (mood: string) => {
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    calm: '😌',
    tired: '😴',
    excited: '🤩',
    loving: '🥰',
    melancholy: '😢',
  };
  return moodEmojis[mood] || '😊';
};

export const getMoodColor = (mood: string) => {
  const moodColors: Record<string, string> = {
    happy: '#FFD700',
    calm: '#87CEEB',
    tired: '#FFA07A',
    excited: '#FF69B4',
    loving: '#FF1493',
    melancholy: '#708090',
  };
  return moodColors[mood] || '#FFD700';
};

export const getGreeting = (name: string) => {
  const hour = new Date().getHours();
  let timeGreeting = 'Hello';
  
  if (hour >= 5 && hour < 12) timeGreeting = 'Good morning';
  else if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
  else if (hour >= 17 && hour < 22) timeGreeting = 'Good evening';
  else timeGreeting = 'Good night';
  
  return `${timeGreeting}, ${name}!`;
};

export const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getLoveQuotes = () => [
  "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
  "I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.",
  "You are my sun, my moon, and all my stars.",
  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  "I swear I couldn't love you more than I do right now, and yet I know I will tomorrow.",
  "If I know what love is, it is because of you.",
  "You are the finest, loveliest, tenderest, and most beautiful person I have ever known—and even that is an understatement.",
  "I love you not because of who you are, but because of who I am when I am with you.",
];

export const getAffirmations = () => [
  "You are loved more than you know. 💕",
  "Your smile brightens my day. ✨",
  "You make my heart skip a beat. 💓",
  "Thinking of you makes me smile. 😊",
  "You are my favorite notification. 🔔",
  "Distance means so little when someone means so much. 💝",
  "Every love story is beautiful, but ours is my favorite. 💖",
  "You are worth every mile between us. 🌟",
];
