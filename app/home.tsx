import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Easing, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';

import GlassCard from '@/components/GlassCard';
import ThemeBackground from '@/components/ThemeBackground';
import { useApp } from '@/context/AppContext';
import { getAffirmations, getCountdown, getGreeting, getMoodColor, getMoodEmoji, getRandomItem } from '@/utils/helpers';
import { themes, type ThemeType, type MoodType } from '@/constants/themes';



const moods: { value: MoodType; label: string; emoji: string }[] = [
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'calm', label: 'Calm', emoji: '😌' },
  { value: 'tired', label: 'Tired', emoji: '😴' },
  { value: 'excited', label: 'Excited', emoji: '🤩' },
  { value: 'loving', label: 'Loving', emoji: '🥰' },
  { value: 'melancholy', label: 'Melancholy', emoji: '😢' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser, partner, setMood, theme: themeName, gameState } = useApp();
  const theme = themes[themeName as ThemeType] || themes['romantic-rose'];
  
  const [dailyAffirmation, setDailyAffirmation] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setDailyAffirmation(getRandomItem(getAffirmations()));
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);
    
    const interval = setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 1000);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(interval);
  }, [fadeAnim, pulseAnim, slideAnim]);

  const handleMoodChange = (mood: MoodType) => {
    setMood(mood);
  };

  if (!currentUser) return null;

  return (
    <ThemeBackground>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.header,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting(currentUser.name)}</Text>
            <View style={[styles.avatarRing, { borderColor: currentUser.color }]}>
              <Text style={styles.avatarEmoji}>{currentUser.emoji}</Text>
            </View>
          </View>
          
          {partner && (
            <View style={styles.partnerStatus}>
              <Text style={styles.partnerText}>
                {partner.name} is feeling {partner.mood} {getMoodEmoji(partner.mood)}
              </Text>
              <View 
                style={[
                  styles.moodIndicator, 
                  { backgroundColor: getMoodColor(partner.mood) },
                ]} 
              />
            </View>
          )}
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <GlassCard style={styles.countdownCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.countdownGradient}
            >
              <Text style={styles.countdownLabel}>Until We Meet</Text>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View style={styles.countdownRow}>
                  <View style={styles.countdownItem}>
                    <Text style={styles.countdownNumber}>{String(countdown.days).padStart(2, '0')}</Text>
                    <Text style={styles.countdownUnit}>Days</Text>
                  </View>
                  <Text style={styles.countdownSeparator}>:</Text>
                  <View style={styles.countdownItem}>
                    <Text style={styles.countdownNumber}>{String(countdown.hours).padStart(2, '0')}</Text>
                    <Text style={styles.countdownUnit}>Hours</Text>
                  </View>
                  <Text style={styles.countdownSeparator}>:</Text>
                  <View style={styles.countdownItem}>
                    <Text style={styles.countdownNumber}>{String(countdown.minutes).padStart(2, '0')}</Text>
                    <Text style={styles.countdownUnit}>Mins</Text>
                  </View>
                  <Text style={styles.countdownSeparator}>:</Text>
                  <View style={styles.countdownItem}>
                    <Text style={styles.countdownNumber}>{String(countdown.seconds).padStart(2, '0')}</Text>
                    <Text style={styles.countdownUnit}>Secs</Text>
                  </View>
                </View>
              </Animated.View>
            </LinearGradient>
          </GlassCard>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>How are you feeling? 💭</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodContainer}
          >
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                onPress={() => handleMoodChange(mood.value)}
                style={[
                  styles.moodButton,
                  currentUser.mood === mood.value && styles.moodButtonActive,
                ]}
              >
                <LinearGradient
                  colors={
                    currentUser.mood === mood.value 
                      ? [theme.colors.primary, theme.colors.secondary]
                      : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']
                  }
                  style={styles.moodGradient}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text 
                    style={[
                      styles.moodLabel,
                      currentUser.mood === mood.value && styles.moodLabelActive,
                    ]}
                  >
                    {mood.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <GlassCard style={styles.loveBankCard}>
            <View style={styles.loveBankHeader}>
              <Text style={styles.loveBankEmoji}>🏦</Text>
              <Text style={styles.loveBankTitle}>Love Bank</Text>
            </View>
            <Text style={styles.loveBankAmount}>{gameState.loveBank.toLocaleString()} pts</Text>
            <Text style={styles.loveBankSubtitle}>Shared moments & memories</Text>
            
            <View style={styles.loveBankProgress}>
              <View 
                style={[
                  styles.loveBankProgressBar, 
                  { 
                    width: `${Math.min((gameState.loveBank / 1000) * 100, 100)}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]} 
              />
            </View>
            <Text style={styles.loveBankNext}>Next milestone: {1000 - (gameState.loveBank % 1000)} pts</Text>
          </GlassCard>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <GlassCard style={styles.affirmationCard}>
            <Text style={styles.affirmationIcon}>💌</Text>
            <Text style={styles.affirmationText}>{dailyAffirmation}</Text>
            <TouchableOpacity 
              onPress={() => setDailyAffirmation(getRandomItem(getAffirmations()))}
              style={styles.refreshButton}
            >
              <Text style={styles.refreshText}>✨ New Message</Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/chat' as any)}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.actionGradient}
              >
                <Text style={styles.actionEmoji}>💬</Text>
                <Text style={styles.actionText}>Send Love</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/game' as any)}
            >
              <LinearGradient
                colors={['#FF69B4', '#DA70D6']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionEmoji}>🐰</Text>
                <Text style={styles.actionText}>Play Game</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/gallery' as any)}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionEmoji}>📸</Text>
                <Text style={styles.actionText}>Memories</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemeBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D1B2E',
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  partnerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  partnerText: {
    fontSize: 14,
    color: '#666',
  },
  moodIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  countdownCard: {
    marginBottom: 24,
    overflow: 'hidden',
  },
  countdownGradient: {
    padding: 24,
    borderRadius: 20,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownItem: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2D1B2E',
    fontVariant: ['tabular-nums'],
  },
  countdownUnit: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  countdownSeparator: {
    fontSize: 28,
    fontWeight: '300',
    color: '#CCC',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D1B2E',
    marginBottom: 16,
    marginTop: 8,
  },
  moodContainer: {
    paddingRight: 20,
    gap: 12,
  },
  moodButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodButtonActive: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  moodGradient: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    minWidth: 80,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  moodLabelActive: {
    color: '#FFFFFF',
  },
  loveBankCard: {
    marginTop: 24,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  loveBankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  loveBankEmoji: {
    fontSize: 24,
  },
  loveBankTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D1B2E',
  },
  loveBankAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2D1B2E',
    marginBottom: 4,
  },
  loveBankSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  loveBankProgress: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  loveBankProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
  loveBankNext: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  affirmationCard: {
    marginTop: 24,
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  affirmationIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  affirmationText: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  refreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
  },
  refreshText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
