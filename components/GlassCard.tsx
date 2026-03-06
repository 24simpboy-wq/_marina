import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { useApp } from '@/context/AppContext';
import { themes, type ThemeType } from '@/constants/themes';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export default function GlassCard({ children, style, intensity = 25 }: GlassCardProps) {
  const { theme: themeName } = useApp();
  const theme = themes[themeName as ThemeType] || themes['romantic-rose'];

  if (Platform.OS === 'web') {
    return (
      <View 
        style={[
          styles.card, 
          { 
            backgroundColor: theme.colors.glass,
            borderColor: 'rgba(255,255,255,0.3)',
          }, 
          style
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView intensity={intensity} style={[styles.card, style]} tint="light">
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
});
