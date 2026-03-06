import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

import { useApp } from '@/context/AppContext';
import { themes, type ThemeType } from '@/constants/themes';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
  emoji: string;
}

const PARTICLE_EMOJIS: Record<string, string[]> = {
  flowers: ['🌸', '🌺', '🌷', '🌹', '🌻', '🌼'],
  hearts: ['❤️', '💖', '💗', '💓', '💕', '💝'],
  stars: ['⭐', '✨', '🌟', '💫', '✦', '✧'],
  bunnies: ['🐰', '🐇', '🥕', '🌸'],
  cats: ['🐱', '🐈', '🐾', '✨'],
  mixed: ['🐰', '🐱', '🌸', '💖', '✨', '🌙'],
};

export default function ParticleBackground() {
  const { theme: themeName } = useApp();
  const theme = themes[themeName as ThemeType] || themes['romantic-rose'];
  const particlesRef = useRef<Particle[]>([]);
  const [, forceUpdate] = React.useState({});

  useEffect(() => {
    const particleCount = 15;
    const emojis = PARTICLE_EMOJIS[theme.ambient.particleType] || PARTICLE_EMOJIS.hearts;
    
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(height + 50),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
      opacity: new Animated.Value(0.3 + Math.random() * 0.4),
      rotation: new Animated.Value(0),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    
    forceUpdate({});

    particlesRef.current.forEach((particle, index) => {
      const duration = 15000 + Math.random() * 10000;
      const delay = index * 800;
      
      const animateY = Animated.loop(
        Animated.sequence([
          Animated.timing(particle.y, {
            toValue: -50,
            duration,
            delay,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: height + 50,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      const animateX = Animated.loop(
        Animated.sequence([
          Animated.timing(particle.x, {
            toValue: Math.random() * width,
            duration: duration / 2,
            delay,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(particle.x, {
            toValue: Math.random() * width,
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );

      const animateRotation = Animated.loop(
        Animated.timing(particle.rotation, {
          toValue: 360,
          duration: 5000 + Math.random() * 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      animateY.start();
      animateX.start();
      animateRotation.start();
    });

    return () => {
      particlesRef.current.forEach((particle) => {
        particle.x.stopAnimation();
        particle.y.stopAnimation();
        particle.rotation.stopAnimation();
      });
    };
  }, [themeName]);

  if (particlesRef.current.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particlesRef.current.map((particle) => {
        const spin = particle.rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.Text
            key={particle.id}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { scale: particle.scale },
                  { rotate: spin },
                ],
                opacity: particle.opacity,
              },
            ]}
          >
            {particle.emoji}
          </Animated.Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    fontSize: 24,
  },
});
