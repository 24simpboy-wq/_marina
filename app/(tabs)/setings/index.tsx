import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Alert, 
  Animated, 
  ScrollView, 
  StyleSheet, 
  Switch, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';

import GlassCard from '@/components/GlassCard';
import ThemeBackground from '@/components/ThemeBackground';
import { avatars, themes, type ThemeType } from '@/constants/themes';
import { useApp } from '@/context/AppContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { currentUser, setUser, theme, setTheme, updateGameState } = useApp();
  
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [haptics, setHaptics] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Leave Sanctuary?',
      'Are you sure you want to exit?',
      [
        { text: 'Stay', style: 'cancel' },
        { 
          text: 'Exit', 
          style: 'destructive',
          onPress: () => {
            setUser(null as any);
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleResetGame = () => {
    Alert.alert(
      'Reset Game?',
      'This will reset your carrots and progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            updateGameState({
              carrots: 0,
              highScore: 0,
              accessories: [],
              evolution: 'baby',
            });
          },
        },
      ]
    );
  };

  const currentTheme = themes[theme as ThemeType] || themes['romantic-rose'];
  const userAvatars = currentUser?.name === 'Marina' 
    ? avatars.filter(a => a.id.startsWith('marina'))
    : avatars.filter(a => a.id.startsWith('ivan'));

  const changeAvatar = (avatarId: string) => {
    const avatar = avatars.find(a => a.id === avatarId);
    if (avatar && currentUser) {
      setUser({
        ...currentUser,
        avatar: avatarId,
        emoji: avatar.emoji,
        color: avatar.color,
      });
    }
  };

  return (
    <ThemeBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Settings</Text>
          
          <GlassCard style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={[styles.avatar, { backgroundColor: currentUser?.color }]}>
                <Text style={styles.avatarEmoji}>{currentUser?.emoji}</Text>
              </View>
              <View>
                <Text style={styles.profileName}>{currentUser?.name}</Text>
                <Text style={styles.profileRole}>
                  {currentUser?.name === 'Marina' ? 'The Bunny Queen' : 'The Star Prince'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.sectionLabel}>Choose Avatar</Text>
            <View style={styles.avatarGrid}>
              {userAvatars.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarOption,
                    currentUser?.avatar === avatar.id && styles.avatarOptionActive,
                  ]}
                  onPress={() => changeAvatar(avatar.id)}
                >
                  <Text style={styles.avatarOptionEmoji}>{avatar.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>Themes</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.themesContainer}
          >
            {Object.values(themes).map((t) => (
              <TouchableOpacity
                key={t.name}
                style={[
                  styles.themeCard,
                  theme === t.name && styles.themeCardActive,
                ]}
                onPress={() => setTheme(t.name)}
              >
                <LinearGradient
                  colors={t.colors.backgroundGradient}
                  style={styles.themePreview}
                >
                  <Text style={styles.themeEmoji}>
                    {t.ambient.particleType === 'hearts' && '💖'}
                    {t.ambient.particleType === 'stars' && '⭐'}
                    {t.ambient.particleType === 'flowers' && '🌸'}
                    {t.ambient.particleType === 'bunnies' && '🐰'}
                    {t.ambient.particleType === 'cats' && '🐱'}
                    {t.ambient.particleType === 'mixed' && '✨'}
                  </Text>
                </LinearGradient>
                <Text style={styles.themeName}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <GlassCard style={styles.preferencesCard}>
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceEmoji}>🔔</Text>
                <Text style={styles.preferenceLabel}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#D1D1D6', true: '#FF6B9D' }}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceEmoji}>🔊</Text>
                <Text style={styles.preferenceLabel}>Sounds</Text>
              </View>
              <Switch
                value={sounds}
                onValueChange={setSounds}
                trackColor={{ false: '#D1D1D6', true: '#FF6B9D' }}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceEmoji}>📳</Text>
                <Text style={styles.preferenceLabel}>Haptics</Text>
              </View>
              <Switch
                value={haptics}
                onValueChange={setHaptics}
                trackColor={{ false: '#D1D1D6', true: '#FF6B9D' }}
              />
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>Game</Text>
          <GlassCard style={styles.gameCard}>
            <TouchableOpacity style={styles.gameOption} onPress={handleResetGame}>
              <View style={styles.gameOptionInfo}>
                <Text style={styles.gameOptionEmoji}>🎮</Text>
                <View>
                  <Text style={styles.gameOptionLabel}>Reset Progress</Text>
                  <Text style={styles.gameOptionSubtext}>Start fresh with 0 carrots</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>About</Text>
          <GlassCard style={styles.aboutCard}>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Made with</Text>
              <Text style={styles.aboutValue}>💝 for Marina & Ivan</Text>
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={['#FF6B6B', '#EE5A5A']}
              style={styles.logoutGradient}
            >
              <Text style={styles.logoutText}>👋 Exit Sanctuary</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemeBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D1B2E',
    marginBottom: 20,
  },
  profileCard: {
    padding: 20,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D1B2E',
  },
  profileRole: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  avatarGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionActive: {
    borderColor: '#FF6B9D',
    backgroundColor: 'rgba(255,107,157,0.1)',
  },
  avatarOptionEmoji: {
    fontSize: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D1B2E',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  themesContainer: {
    paddingHorizontal: 20,
    paddingRight: 30,
    gap: 12,
  },
  themeCard: {
    alignItems: 'center',
  },
  themeCardActive: {
    transform: [{ scale: 1.05 }],
  },
  themePreview: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeEmoji: {
    fontSize: 32,
  },
  themeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  preferencesCard: {
    marginHorizontal: 20,
    padding: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceEmoji: {
    fontSize: 20,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#2D1B2E',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 12,
  },
  gameCard: {
    marginHorizontal: 20,
    padding: 8,
  },
  gameOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  gameOptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gameOptionEmoji: {
    fontSize: 24,
  },
  gameOptionLabel: {
    fontSize: 16,
    color: '#2D1B2E',
    fontWeight: '600',
  },
  gameOptionSubtext: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#CCC',
  },
  aboutCard: {
    marginHorizontal: 20,
    padding: 8,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  aboutLabel: {
    fontSize: 16,
    color: '#666',
  },
  aboutValue: {
    fontSize: 16,
    color: '#2D1B2E',
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
