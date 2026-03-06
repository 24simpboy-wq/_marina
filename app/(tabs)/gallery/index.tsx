import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Dimensions, 
  FlatList, 
  Image, 
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
import type { Photo } from '@/types/app';
import { formatDate, generateId } from '@/utils/helpers';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 12;
const ITEM_SIZE = (width - 40 - (COLUMN_COUNT - 1) * SPACING) / COLUMN_COUNT;

export default function GalleryScreen() {
  const { currentUser, photos, addPhoto } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [caption, setCaption] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newPhoto: Photo = {
        id: generateId(),
        uri: result.assets[0].uri,
        caption: '',
        authorId: currentUser?.id || '',
        timestamp: new Date(),
        likes: [],
        notes: [],
      };
      addPhoto(newPhoto);
    }
  };

  const handleLike = (photoId: string) => {
  };

  const renderPhoto = ({ item, index }: { item: Photo; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity 
        onPress={() => setSelectedPhoto(item)}
        activeOpacity={0.9}
      >
        <GlassCard style={styles.photoCard}>
          <View style={styles.polaroidFrame}>
            <Image source={{ uri: item.uri }} style={styles.photoImage} />
            <View style={styles.photoFooter}>
              <Text style={styles.photoDate}>
                {formatDate(item.timestamp)}
              </Text>
              {item.caption ? (
                <Text style={styles.photoCaption} numberOfLines={1}>
                  {item.caption}
                </Text>
              ) : null}
              <View style={styles.photoStats}>
                <Text style={styles.statText}>
                  ❤️ {item.likes.length}
                </Text>
                <Text style={styles.statText}>
                  📝 {item.notes.length}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemeBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Our Memories</Text>
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <LinearGradient
              colors={['#FF6B9D', '#FF8FA3']}
              style={styles.addGradient}
            >
              <Text style={styles.addText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {photos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📸</Text>
            <Text style={styles.emptyTitle}>No memories yet</Text>
            <Text style={styles.emptyText}>Start capturing your special moments together</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={pickImage}>
              <Text style={styles.emptyButtonText}>Add First Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={photos}
            renderItem={renderPhoto}
            keyExtractor={(item) => item.id}
            numColumns={COLUMN_COUNT}
            contentContainerStyle={styles.photoGrid}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Modal
          visible={!!selectedPhoto}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedPhoto(null)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setSelectedPhoto(null)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            
            {selectedPhoto && (
              <ScrollView style={styles.modalContent}>
                <Image source={{ uri: selectedPhoto.uri }} style={styles.modalImage} />
                
                <GlassCard style={styles.modalInfo}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalDate}>
                      {formatDate(selectedPhoto.timestamp)}
                    </Text>
                    <TouchableOpacity 
                      style={styles.likeButton}
                      onPress={() => handleLike(selectedPhoto.id)}
                    >
                      <Text style={styles.likeEmoji}>
                        {selectedPhoto.likes.includes(currentUser?.id || '') ? '❤️' : '🤍'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <TextInput
                    style={styles.captionInput}
                    placeholder="Add a caption..."
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                  />
                  
                  {selectedPhoto.notes.length > 0 && (
                    <View style={styles.notesSection}>
                      <Text style={styles.notesTitle}>Notes</Text>
                      {selectedPhoto.notes.map((note) => (
                        <View key={note.id} style={styles.noteItem}>
                          <Text style={styles.noteText}>{note.text}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </GlassCard>
              </ScrollView>
            )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D1B2E',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  addGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  photoGrid: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SPACING,
  },
  photoCard: {
    width: ITEM_SIZE,
    overflow: 'hidden',
  },
  polaroidFrame: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    paddingBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  photoImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  photoFooter: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  photoDate: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  photoCaption: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  photoStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  statText: {
    fontSize: 12,
    color: '#888',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D1B2E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: width,
    height: width * 1.2,
    resizeMode: 'cover',
  },
  modalInfo: {
    margin: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 14,
    color: '#888',
  },
  likeButton: {
    padding: 8,
  },
  likeEmoji: {
    fontSize: 24,
  },
  captionInput: {
    fontSize: 16,
    color: '#2D1B2E',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 20,
  },
  notesSection: {
    marginTop: 12,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 12,
  },
  noteItem: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  noteText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
});
