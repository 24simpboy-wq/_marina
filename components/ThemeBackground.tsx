import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '@/context/AppContext';
import { themes, type ThemeType, moodThemes, type MoodType } from '@/constants/themes';

import ParticleBackground from './ParticleBackground';

const { height, width } = Dimensions.get('window');

interface ThemeBackgroundProps {
  children: React.ReactNode;
  showParticles?: boolean;
  customMood?: MoodType;
}

export default function ThemeBackground({ children, showParticles = true, customMood }: ThemeBackgroundProps) {
  const { theme: themeName, partner } = useApp();
  const theme = themes[themeName as ThemeType] || themes['romantic-rose'];
  
  const moodToUse = customMood || partner?.mood;
  const moodColors = moodToUse ? moodThemes[moodToUse as MoodType] : null;
  
  const gradientColors = moodColors?.backgroundGradient || theme.colors.backgroundGradient;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      {theme.ambient.hasAurora && (
        <View style={styles.auroraContainer}>
          <View style={[styles.aurora, { backgroundColor: theme.colors.primary, opacity: 0.15 }]} />
          <View style={[styles.aurora2, { backgroundColor: theme.colors.secondary, opacity: 0.1 }]} />
        </View>
      )}
      
      {showParticles && <ParticleBackground />}
      
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  auroraContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  aurora: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.6,
    borderRadius: width,
    top: -height * 0.2,
    left: -width * 0.25,
    transform: [{ rotate: '-15deg' }],
  },
  aurora2: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.5,
    borderRadius: width,
    top: -height * 0.1,
    right: -width * 0.25,
    transform: [{ rotate: '15deg' }],
  },
});
