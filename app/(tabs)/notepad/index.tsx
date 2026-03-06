import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Dimensions, 
  Modal, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native';

import GlassCard from '@/components/GlassCard';
import ThemeBackground from '@/components/ThemeBackground';
import { useApp } from '@/context/AppContext';
import type { LoveLetter, MemoryCapsule } from '@/types/app';
import { formatDate, generateId, getLoveQuotes } from '@/utils/helpers';

const { width } = Dimensions.get('window');

export default function NotepadScreen() {
  const { currentUser, memoryCapsules, loveLetters, addMemoryCapsule, addLoveLetter } = useApp();
  
  const [activeTab, setActiveTab] = useState<'memories' | 'letters' | 'bottle'>('memories');
  const [showNewMemoryModal, setShowNewMemoryModal] = useState(false);
  const [showNewLetterModal, setShowNewLetterModal] = useState(false);
  const [newMemoryTitle, setNewMemoryTitle] = useState('');
  const [newMemoryDesc, setNewMemoryDesc] = useState('');
  const [newLetterContent, setNewLetterContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  
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
  }, [activeTab]);

  const saveMemory = () => {
    if (!newMemoryTitle.trim()) return;
    
    const capsule: MemoryCapsule = {
      id: generateId(),
      title: newMemoryTitle,
      description: newMemoryDesc,
      date: new Date(),
      type: 'moment',
    };
    
    addMemoryCapsule(capsule);
    setNewMemoryTitle('');
    setNewMemoryDesc('');
    setShowNewMemoryModal(false);
  };

  const saveLetter = () => {
    if (!newLetterContent.trim()) return;
    
    const letter: LoveLetter = {
      id: generateId(),
      authorId: currentUser?.id || '',
      content: newLetterContent,
      createdAt: new Date(),
      unlockAt: unlockDate ? new Date(unlockDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isOpened: false,
    };
    
    addLoveLetter(letter);
    setNewLetterContent('');
    setUnlockDate('');
    setShowNewLetterModal(false);
  };

  const dailyQuote = getLoveQuotes()[new Date().getDate() % getLoveQuotes().length];

  const renderMemoriesTab = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <GlassCard style={styles.quoteCard}>
        <Text style={styles.quoteIcon}>📜</Text>
        <Text style={styles.quoteText}>{dailyQuote}</Text>
      </GlassCard>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowNewMemoryModal(true)}
      >
        <LinearGradient
          colors={['#FF6B9D', '#FF8FA3']}
          style={styles.addGradient}
        >
          <Text style={styles.addText}>+ Capture New Memory</Text>
        </LinearGradient>
      </TouchableOpacity>

      {memoryCapsules.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyText}>No memories captured yet</Text>
          <Text style={styles.emptySubtext}>Start creating your love story</Text>
        </View>
      ) : (
        memoryCapsules.map((capsule, index) => (
          <GlassCard key={capsule.id} style={styles.memoryCard}>
            <View style={styles.memoryHeader}>
              <View style={styles.memoryIconContainer}>
                <Text style={styles.memoryIcon}>💝</Text>
              </View>
              <View style={styles.memoryMeta}>
                <Text style={styles.memoryTitle}>{capsule.title}</Text>
                <Text style={styles.memoryDate}>{formatDate(capsule.date)}</Text>
              </View>
            </View>
            <Text style={styles.memoryDesc}>{capsule.description}</Text>
          </GlassCard>
        ))
      )}
    </Animated.View>
  );

  const renderLettersTab = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowNewLetterModal(true)}
      >
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.addGradient}
        >
          <Text style={styles.addText}>✉️ Write Secret Letter</Text>
        </LinearGradient>
      </TouchableOpacity>

      {loveLetters.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💌</Text>
          <Text style={styles.emptyText}>No secret letters yet</Text>
          <Text style={styles.emptySubtext}>Write a letter for the future</Text>
        </View>
      ) : (
        loveLetters.map((letter) => {
          const unlockDate = letter.unlockAt ? new Date(letter.unlockAt) : new Date();
          const canOpen = !isNaN(unlockDate.getTime()) && new Date() >= unlockDate;
          const isAuthor = letter.authorId === currentUser?.id;
          
          return (
            <GlassCard 
              key={letter.id} 
              style={[
                styles.letterCard,
                !canOpen && styles.letterLocked,
              ]}
            >
              <View style={styles.letterHeader}>
                <Text style={styles.letterEmoji}>
                  {canOpen ? '💌' : '🔒'}
                </Text>
                <View>
                  <Text style={styles.letterFrom}>
                    From: {isAuthor ? 'You' : 'Your Love'}
                  </Text>
                  <Text style={styles.letterUnlock}>
                    {canOpen 
                      ? 'Opened and cherished' 
                      : `Unlocks ${formatDate(letter.unlockAt)}`
                    }
                  </Text>
                </View>
              </View>
              
              {canOpen ? (
                <Text style={styles.letterContent}>{letter.content}</Text>
              ) : (
                <View style={styles.letterSealed}>
                  <Text style={styles.letterSealedText}>🔒 Sealed with love</Text>
                  <Text style={styles.letterSealedSubtext}>
                    Time will reveal its secrets...
                  </Text>
                </View>
              )}
            </GlassCard>
          );
        })
      )}
    </Animated.View>
  );

  const renderBottleTab = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <GlassCard style={styles.bottleCard}>
        <View style={styles.bottleHeader}>
          <Text style={styles.bottleEmoji}>🍾</Text>
          <Text style={styles.bottleTitle}>Message in a Bottle</Text>
        </View>
        <Text style={styles.bottleDesc}>
          Cast your wishes, dreams, and hopes into the digital ocean. 
          Let them float until they find their way to your love.
        </Text>
        
        <View style={styles.bottleMessages}>
          <View style={styles.bottleMessage}>
            <Text style={styles.bottleMessageEmoji}>💫</Text>
            <Text style={styles.bottleMessageText}>
              &ldquo;I wish we could watch the stars together tonight...&rdquo;
            </Text>
          </View>
          <View style={styles.bottleMessage}>
            <Text style={styles.bottleMessageEmoji}>🌙</Text>
            <Text style={styles.bottleMessageText}>
              &ldquo;Dreaming of the day we&apos;ll wake up together...&rdquo;
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.castButton}>
          <LinearGradient
            colors={['#7B68EE', '#9B89F0']}
            style={styles.castGradient}
          >
            <Text style={styles.castText}>🌊 Cast a Message</Text>
          </LinearGradient>
        </TouchableOpacity>
      </GlassCard>

      <GlassCard style={styles.dreamsCard}>
        <Text style={styles.dreamsTitle}>🌟 Our Shared Dreams</Text>
        <View style={styles.dreamsList}>
          {['Travel to Paris together', 'Adopt a bunny', 'Stargazing date', 'Cook dinner together'].map((dream, i) => (
            <View key={i} style={styles.dreamItem}>
              <Text style={styles.dreamCheckbox}>☐</Text>
              <Text style={styles.dreamText}>{dream}</Text>
            </View>
          ))}
        </View>
      </GlassCard>
    </Animated.View>
  );

  return (
    <ThemeBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Our Sanctuary</Text>
        </View>

        <View style={styles.tabs}>
          {[
            { id: 'memories', label: 'Memories', emoji: '📖' },
            { id: 'letters', label: 'Letters', emoji: '💌' },
            { id: 'bottle', label: 'Bottle', emoji: '🍾' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text style={styles.tabEmoji}>{tab.emoji}</Text>
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'memories' && renderMemoriesTab()}
          {activeTab === 'letters' && renderLettersTab()}
          {activeTab === 'bottle' && renderBottleTab()}
          
          <View style={{ height: 100 }} />
        </ScrollView>

        <Modal
          visible={showNewMemoryModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowNewMemoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalContent}>
              <Text style={styles.modalTitle}>✨ New Memory</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Memory title..."
                value={newMemoryTitle}
                onChangeText={setNewMemoryTitle}
              />
              <TextInput
                style={[styles.modalInput, styles.modalInputMultiline]}
                placeholder="Describe this precious moment..."
                value={newMemoryDesc}
                onChangeText={setNewMemoryDesc}
                multiline
                numberOfLines={4}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalButtonSecondary}
                  onPress={() => setShowNewMemoryModal(false)}
                >
                  <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalButtonPrimary}
                  onPress={saveMemory}
                >
                  <LinearGradient
                    colors={['#FF6B9D', '#FF8FA3']}
                    style={styles.modalGradient}
                  >
                    <Text style={styles.modalButtonPrimaryText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
        </Modal>

        <Modal
          visible={showNewLetterModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowNewLetterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalContent}>
              <Text style={styles.modalTitle}>💌 Secret Letter</Text>
              <TextInput
                style={[styles.modalInput, styles.modalInputMultiline]}
                placeholder="Write your heart out..."
                value={newLetterContent}
                onChangeText={setNewLetterContent}
                multiline
                numberOfLines={6}
              />
              <Text style={styles.modalLabel}>Unlock Date (optional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="YYYY-MM-DD"
                value={unlockDate}
                onChangeText={setUnlockDate}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalButtonSecondary}
                  onPress={() => setShowNewLetterModal(false)}
                >
                  <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalButtonPrimary}
                  onPress={saveLetter}
                >
                  <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    style={styles.modalGradient}
                  >
                    <Text style={styles.modalButtonPrimaryText}>Seal Letter</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
        </Modal>
      </View>
    </ThemeBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D1B2E',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FF6B9D',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  quoteCard: {
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  quoteIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  addGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  memoryCard: {
    padding: 20,
    marginBottom: 12,
  },
  memoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,107,157,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memoryIcon: {
    fontSize: 24,
  },
  memoryMeta: {
    flex: 1,
  },
  memoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D1B2E',
  },
  memoryDate: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  memoryDesc: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  letterCard: {
    padding: 20,
    marginBottom: 12,
  },
  letterLocked: {
    opacity: 0.8,
  },
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  letterEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  letterFrom: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D1B2E',
  },
  letterUnlock: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  letterContent: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 22,
    fontStyle: 'italic',
    padding: 12,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderRadius: 12,
  },
  letterSealed: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
  },
  letterSealedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  letterSealedSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  bottleCard: {
    padding: 24,
    marginBottom: 16,
  },
  bottleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bottleEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  bottleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D1B2E',
  },
  bottleDesc: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  bottleMessages: {
    marginBottom: 20,
  },
  bottleMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: 'rgba(123,104,238,0.1)',
    padding: 12,
    borderRadius: 12,
  },
  bottleMessageEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  bottleMessageText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    fontStyle: 'italic',
  },
  castButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  castGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  castText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dreamsCard: {
    padding: 24,
  },
  dreamsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D1B2E',
    marginBottom: 16,
  },
  dreamsList: {
    gap: 12,
  },
  dreamItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dreamCheckbox: {
    fontSize: 20,
    marginRight: 12,
    color: '#FF6B9D',
  },
  dreamText: {
    fontSize: 15,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D1B2E',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    marginBottom: 12,
  },
  modalInputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  modalButtonSecondaryText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonPrimary: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
