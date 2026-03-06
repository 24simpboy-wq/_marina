import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import type { CalendarEvent, CountdownEvent, GameState, LoveLetter, MemoryCapsule, Message, Mood, Photo, Song, User } from '@/types/app';

interface AppContextValue {
  currentUser: User | null;
  partner: User | null;
  theme: string;
  gameState: GameState;
  events: CountdownEvent[];
  messages: Message[];
  photos: Photo[];
  memoryCapsules: MemoryCapsule[];
  loveLetters: LoveLetter[];
  calendarEvents: CalendarEvent[];
  playlist: Song[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTheme: (theme: string) => void;
  setMood: (mood: Mood) => void;
  addMessage: (message: Message) => void;
  addPhoto: (photo: Photo) => void;
  updateGameState: (state: Partial<GameState>) => void;
  addEvent: (event: CountdownEvent) => void;
  addMemoryCapsule: (capsule: MemoryCapsule) => void;
  addLoveLetter: (letter: LoveLetter) => void;
  addCalendarEvent: (event: CalendarEvent) => void;
  addSong: (song: Song) => void;
}

const defaultGameState: GameState = {
  carrots: 0,
  highScore: 0,
  accessories: [],
  evolution: 'baby',
  loveBank: 0,
};

const marinaUser: User = {
  id: 'marina',
  name: 'Marina',
  emoji: '🐰',
  avatar: 'marina-bunny',
  color: '#FF69B4',
  mood: 'happy',
  accessories: [],
  badges: [],
};

const ivanUser: User = {
  id: 'ivan',
  name: 'Ivan',
  emoji: '✨',
  avatar: 'ivan-star',
  color: '#FFD700',
  mood: 'loving',
  accessories: [],
  badges: [],
};

export const [AppProvider, useApp] = createContextHook<AppContextValue>(() => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [theme, setThemeState] = useState<string>('romantic-rose');
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [memoryCapsules, setMemoryCapsules] = useState<MemoryCapsule[]>([]);
  const [loveLetters, setLoveLetters] = useState<LoveLetter[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const reviveDates = (data: any): any => {
    if (data === null || data === undefined) return data;
    if (typeof data !== 'object') return data;
    
    if (Array.isArray(data)) {
      return data.map(item => reviveDates(item));
    }
    
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && 
          (key === 'timestamp' || key === 'date' || key === 'createdAt' || 
           key === 'unlockAt' || key === 'earnedAt' || key === 'unlockedAt' || 
           key === 'scheduledFor' || key === 'addedAt')) {
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
          result[key] = parsedDate;
        } else {
          result[key] = value;
        }
      } else if (typeof value === 'object') {
        result[key] = reviveDates(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  };

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('love-sanctuary-data');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.currentUser) setCurrentUser(reviveDates(data.currentUser));
        if (data.theme) setThemeState(data.theme);
        if (data.gameState) setGameState(reviveDates(data.gameState));
        if (data.events) setEvents(reviveDates(data.events));
        if (data.messages) setMessages(reviveDates(data.messages));
        if (data.photos) setPhotos(reviveDates(data.photos));
        if (data.memoryCapsules) setMemoryCapsules(reviveDates(data.memoryCapsules));
        if (data.loveLetters) setLoveLetters(reviveDates(data.loveLetters));
        if (data.calendarEvents) setCalendarEvents(reviveDates(data.calendarEvents));
        if (data.playlist) setPlaylist(reviveDates(data.playlist));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      const data = {
        currentUser,
        theme,
        gameState,
        events,
        messages,
        photos,
        memoryCapsules,
        loveLetters,
        calendarEvents,
        playlist,
      };
      await AsyncStorage.setItem('love-sanctuary-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [currentUser, theme, gameState, events, messages, photos, memoryCapsules, loveLetters, calendarEvents, playlist]);

  const setUser = (user: User | null) => {
    setCurrentUser(user);
    setPartner(user ? (user.id === 'marina' ? ivanUser : marinaUser) : null);
  };

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
  };

  const setMood = (mood: Mood) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, mood });
    }
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const addPhoto = (photo: Photo) => {
    setPhotos((prev) => [...prev, photo]);
  };

  const updateGameState = (state: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...state }));
  };

  const addEvent = (event: CountdownEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const addMemoryCapsule = (capsule: MemoryCapsule) => {
    setMemoryCapsules((prev) => [...prev, capsule]);
  };

  const addLoveLetter = (letter: LoveLetter) => {
    setLoveLetters((prev) => [...prev, letter]);
  };

  const addCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents((prev) => [...prev, event]);
  };

  const addSong = (song: Song) => {
    setPlaylist((prev) => [...prev, song]);
  };

  return {
    currentUser,
    partner,
    theme,
    gameState,
    events,
    messages,
    photos,
    memoryCapsules,
    loveLetters,
    calendarEvents,
    playlist,
    isLoading,
    setUser,
    setTheme,
    setMood,
    addMessage,
    addPhoto,
    updateGameState,
    addEvent,
    addMemoryCapsule,
    addLoveLetter,
    addCalendarEvent,
    addSong,
  };
});
