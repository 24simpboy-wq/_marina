import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Custom component for the "Sent Reaction" cards shown in your image
const ReactionCard = ({ type, time, isMine }: { type: string, time: string, isMine: boolean }) => {
  const config: any = {
    hug: { icon: "🤗", label: "Sent a hug!", color: "#FFF5E6" },
    kiss: { icon: "💋", label: "Blowing kisses!", color: "#FFF0F5" },
    dream: { icon: "💭✨", label: "Sent sweet dreams!", color: "#F0F8FF" },
  };

  const data = config[type] || config.dream;

  return (
    <View style={[styles.cardWrapper, isMine ? styles.myCard : styles.theirCard]}>
      <View style={[styles.card, { backgroundColor: data.color }]}>
        <Text style={styles.cardIcon}>{data.icon}</Text>
        <Text style={styles.cardLabel}>{data.label}</Text>
      </View>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

export default function ReactionChat() {
  const [history, setHistory] = useState([
    { id: 1, type: 'dream', time: '09:25 PM', isMine: false },
    { id: 2, type: 'kiss', time: '10:22 PM', isMine: true },
    { id: 3, type: 'dream', time: '10:22 PM', isMine: false },
  ]);

  const sendReaction = (type: string) => {
    const newAction = {
      id: Date.now(),
      type: type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };
    setHistory([...history, newAction]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {history.map((item) => (
          <ReactionCard key={item.id} type={item.type} time={item.time} isMine={item.isMine} />
        ))}
      </ScrollView>

      {/* Action Bar from your screenshot */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => sendReaction('hug')}>
          <View style={styles.iconCircle}><Text>🤗</Text></View>
          <Text style={styles.btnLabel}>Hug</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={() => sendReaction('kiss')}>
          <View style={[styles.iconCircle, {backgroundColor: '#FFF0F5'}]}><Text>💋</Text></View>
          <Text style={styles.btnLabel}>Kiss</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => sendReaction('dream')}>
          <View style={[styles.iconCircle, {backgroundColor: '#F0F8FF'}]}><Text>💭</Text></View>
          <Text style={styles.btnLabel}>Dream</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <View style={[styles.iconCircle, {backgroundColor: '#FFF9E6'}]}><Text>🎨</Text></View>
          <Text style={styles.btnLabel}>Stickers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF6' }, // Light cream background like your image
  scrollContent: { padding: 20, paddingTop: 60 },
  cardWrapper: { marginBottom: 20, maxWidth: '70%' },
  myCard: { alignSelf: 'flex-end' },
  theirCard: { alignSelf: 'flex-start' },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD1DC', // Pink border from your image
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: { fontSize: 40, marginBottom: 10 },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#FF69B4', textAlign: 'center' },
  timeText: { fontSize: 10, color: '#999', marginTop: 5, textAlign: 'center' },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  actionBtn: { alignItems: 'center' },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#DDD'
  },
  btnLabel: { fontSize: 12, color: '#666' }
});