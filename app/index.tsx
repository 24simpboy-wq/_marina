import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import GlassCard from '@/components/GlassCard';
import { useApp } from '@/context/AppContext';
import { avatars } from '@/constants/themes';
import type { User } from '@/types/app';

const { width, height } = Dimensions.get('window');

const particleEmojis = ['🌸', '💖', '✨', '🐰', '🌺', '💫', '🌹', '🌟'];

export default function WelcomeScreen() {
  const router = useRouter();
  const { setUser, isLoading, currentUser } = useApp();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const particlesAnim = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.replace('/(tabs)/home');
      return;
    }

    for (let i = 0; i < 20; i++) {
      particlesAnim.push(new Animated.Value(0));
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    particlesAnim.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, currentUser]);

  const handleSelectUser = (userData: typeof avatars[0]) => {
    const user: User = {
      id: userData.id.startsWith('marina') ? 'marina' : 'ivan',
      name: userData.id.startsWith('marina') ? 'Marina' : 'Ivan',
      emoji: userData.emoji,
      avatar: userData.id,
      color: userData.color,
      mood: 'happy',
      accessories: [],
      badges: [],
    };
    
    setUser(user);
    router.replace('/(tabs)/home');
  };

  const marinaAvatars = avatars.filter(a => a.id.startsWith('marina'));
  const ivanAvatars = avatars.filter(a => a.id.startsWith('ivan'));

  return (
    <LinearGradient
      colors={['#FFF0F5', '#FFE4E1', '#F8E8F8']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.particlesContainer}>
        {particlesAnim.map((anim, i) => {
          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [height + 50, -50],
          });
          const translateX = anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
              Math.random() * width,
              Math.random() * width,
              Math.random() * width,
            ],
          });
          const rotate = anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          });
          
          return (
            <Animated.Text
              key={i}
              style={[
                styles.particle,
                {
                  transform: [
                    { translateX },
                    { translateY },
                    { rotate },
                  ],
                  opacity: anim.interpolate({
                    inputRange: [0, 0.2, 0.8, 1],
                    outputRange: [0, 0.6, 0.6, 0],
                  }),
                  fontSize: 20 + Math.random() * 16,
                  left: Math.random() * (width - 40),
                },
              ]}
            >
              {particleEmojis[i % particleEmojis.length]}
            </Animated.Text>
          );
        })}
      </View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.iconEmoji}>💕</Text>
          <View style={styles.iconGlow} />
        </View>
        
        <Text style={styles.title}>Love Sanctuary</Text>
        <Text style={styles.subtitle}>A magical space for Marina & Ivan</Text>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>✨</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.chooseText}>Who&apos;s entering today?</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => handleSelectUser(marinaAvatars[0])}
            activeOpacity={0.8}
          >
            <GlassCard style={styles.userButton}>
              <LinearGradient
                colors={['#FF6B9D', '#FF8FA3']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonEmoji}>🐰</Text>
                <Text style={styles.buttonText}>I am Marina</Text>
                <Text style={styles.buttonSubtext}>The Bunny Queen</Text>
              </LinearGradient>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSelectUser(ivanAvatars[0])}
            activeOpacity={0.8}
          >
            <GlassCard style={styles.userButton}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonEmoji}>✨</Text>
                <Text style={styles.buttonText}>I am Ivan</Text>
                <Text style={styles.buttonSubtext}>The Star Prince</Text>
              </LinearGradient>
            </GlassCard>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with 💝 for eternity</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    width: width * 0.9,
  },
  iconContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  iconEmoji: {
    fontSize: 80,
    zIndex: 2,
  },
  iconGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
    top: -10,
    left: -10,
    zIndex: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2D1B2E',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 107, 157, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B6F7B',
    marginTop: 8,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    width: '80%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(139, 111, 123, 0.3)',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 18,
  },
  chooseText: {
    fontSize: 18,
    color: '#4A4A4A',
    fontWeight: '600',
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  userButton: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  buttonGradient: {
    paddingVertical: 24,
    paddingHorizontal: 40,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  buttonSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#8B6F7B',
    fontWeight: '500',
  },
});
