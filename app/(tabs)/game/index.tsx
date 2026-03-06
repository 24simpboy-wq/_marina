import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Dimensions, 
  PanResponder, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';

import ThemeBackground from '@/components/ThemeBackground';
import { useApp } from '@/context/AppContext';

const { width, height } = Dimensions.get('window');
const GAME_WIDTH = width - 40;
const GAME_HEIGHT = 400;
const BUNNY_SIZE = 50;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const GROUND_Y = GAME_HEIGHT - 80;

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'hole' | 'carrot';
}

const EVOLUTION_STAGES = [
  { stage: 'baby', emoji: '🐰', name: 'Baby Bunny', carrots: 0 },
  { stage: 'teen', emoji: '🐇', name: 'Teen Bunny', carrots: 50 },
  { stage: 'adult', emoji: '👑', name: 'Bunny Royal', carrots: 100 },
  { stage: 'king', emoji: '🦄', name: 'Bunny Unicorn', carrots: 200 },
  { stage: 'legend', emoji: '✨', name: 'Legend', carrots: 500 },
];

const ACCESSORIES = [
  { id: 'crown', emoji: '👑', name: 'Royal Crown', carrots: 50 },
  { id: 'cape', emoji: '🦸', name: 'Super Cape', carrots: 100 },
  { id: 'wand', emoji: '🪄', name: 'Magic Wand', carrots: 150 },
  { id: 'glasses', emoji: '👓', name: 'Cool Glasses', carrots: 200 },
  { id: 'bow', emoji: '🎀', name: 'Pretty Bow', carrots: 250 },
];

export default function GameScreen() {
  const { currentUser, gameState, updateGameState } = useApp();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [bunnyY, setBunnyY] = useState(GROUND_Y - BUNNY_SIZE);
  const [bunnyVelocity, setBunnyVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);
  
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bunnyYRef = useRef(GROUND_Y - BUNNY_SIZE);
  const bunnyVelocityRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const frameCount = useRef(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const bunnyBounceAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      frameCount.current += 1;
      
      bunnyVelocityRef.current += GRAVITY;
      bunnyYRef.current += bunnyVelocityRef.current;
      
      if (bunnyYRef.current >= GROUND_Y - BUNNY_SIZE) {
        bunnyYRef.current = GROUND_Y - BUNNY_SIZE;
        bunnyVelocityRef.current = 0;
      }
      
      setBunnyY(bunnyYRef.current);
      setBunnyVelocity(bunnyVelocityRef.current);

      if (frameCount.current % 120 === 0) {
        const isCarrot = Math.random() > 0.6;
        const newObstacle: Obstacle = {
          id: Date.now(),
          x: GAME_WIDTH,
          y: isCarrot ? GROUND_Y - 100 : GROUND_Y - 30,
          width: isCarrot ? 30 : 40,
          height: isCarrot ? 30 : 40,
          type: isCarrot ? 'carrot' : 'hole',
        };
        obstaclesRef.current = [...obstaclesRef.current, newObstacle];
      }

      obstaclesRef.current = obstaclesRef.current
        .map(obs => ({ ...obs, x: obs.x - 3 }))
        .filter(obs => obs.x > -50);

      obstaclesRef.current.forEach(obs => {
        const bunnyLeft = 80;
        const bunnyRight = bunnyLeft + BUNNY_SIZE;
        const bunnyTop = bunnyYRef.current;
        const bunnyBottom = bunnyTop + BUNNY_SIZE;
        
        const obsLeft = obs.x;
        const obsRight = obs.x + obs.width;
        const obsTop = obs.y;
        const obsBottom = obs.y + obs.height;
        
        if (
          bunnyLeft < obsRight &&
          bunnyRight > obsLeft &&
          bunnyTop < obsBottom &&
          bunnyBottom > obsTop
        ) {
          if (obs.type === 'carrot') {
            scoreRef.current += 10;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            obstaclesRef.current = obstaclesRef.current.filter(o => o.id !== obs.id);
          } else {
            setGameOver(true);
            setIsPlaying(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
        }
      });

      setObstacles([...obstaclesRef.current]);
      setScore(scoreRef.current);
    }, 16);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver]);

  const jump = useCallback(() => {
    if (bunnyYRef.current >= GROUND_Y - BUNNY_SIZE - 10) {
      bunnyVelocityRef.current = JUMP_FORCE;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      Animated.sequence([
        Animated.timing(bunnyBounceAnim, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bunnyBounceAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: jump,
    })
  ).current;

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    scoreRef.current = 0;
    bunnyYRef.current = GROUND_Y - BUNNY_SIZE;
    bunnyVelocityRef.current = 0;
    obstaclesRef.current = [];
    setObstacles([]);
    setBunnyY(GROUND_Y - BUNNY_SIZE);
    frameCount.current = 0;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const endGame = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    const newTotal = gameState.carrots + Math.floor(score / 10);
    const newLoveBank = gameState.loveBank + score;
    
    updateGameState({
      carrots: newTotal,
      loveBank: newLoveBank,
      highScore: Math.max(gameState.highScore, score),
    });

    const currentEvolution = EVOLUTION_STAGES.findIndex(
      (stage, i) => 
        newTotal >= stage.carrots && 
        (i === EVOLUTION_STAGES.length - 1 || newTotal < EVOLUTION_STAGES[i + 1].carrots)
    );
    
    const prevEvolution = EVOLUTION_STAGES.findIndex(
      (stage, i) => 
        gameState.carrots >= stage.carrots && 
        (i === EVOLUTION_STAGES.length - 1 || gameState.carrots < EVOLUTION_STAGES[i + 1].carrots)
    );

    if (currentEvolution > prevEvolution) {
      setShowEvolution(true);
    }
  };

  useEffect(() => {
    if (gameOver) {
      endGame();
    }
  }, [gameOver]);

  const getCurrentEvolution = () => {
    for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
      if (gameState.carrots >= EVOLUTION_STAGES[i].carrots) {
        return EVOLUTION_STAGES[i];
      }
    }
    return EVOLUTION_STAGES[0];
  };

  const evolution = getCurrentEvolution();
  const nextEvolution = EVOLUTION_STAGES.find(e => e.carrots > gameState.carrots);
  const progress = nextEvolution 
    ? ((gameState.carrots - evolution.carrots) / (nextEvolution.carrots - evolution.carrots)) * 100
    : 100;

  return (
    <ThemeBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bunny Odyssey</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>🥕</Text>
              <Text style={styles.statValue}>{gameState.carrots}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statValue}>{gameState.highScore}</Text>
            </View>
          </View>
        </View>

        <Animated.View 
          style={[
            styles.evolutionCard,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.evolutionInfo}>
            <Text style={styles.evolutionEmoji}>{evolution.emoji}</Text>
            <View>
              <Text style={styles.evolutionName}>{evolution.name}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              {nextEvolution && (
                <Text style={styles.nextEvolution}>
                  {nextEvolution.carrots - gameState.carrots} carrots to {nextEvolution.name}
                </Text>
              )}
            </View>
          </View>
        </Animated.View>

        <View style={styles.gameContainer}>
          <LinearGradient
            colors={['#87CEEB', '#E0F6FF']}
            style={styles.gameBackground}
          >
            <View style={styles.clouds}>
              <Text style={styles.cloud}>☁️</Text>
              <Text style={styles.cloud2}>☁️</Text>
            </View>

            {!isPlaying && !gameOver && (
              <View style={styles.startScreen}>
                <Text style={styles.bunnyEmoji}>🐰</Text>
                <Text style={styles.startText}>Tap to Jump!</Text>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                  <LinearGradient
                    colors={['#FF6B9D', '#FF8FA3']}
                    style={styles.startGradient}
                  >
                    <Text style={styles.startButtonText}>Start Game</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {isPlaying && (
              <View style={styles.gameArea} {...panResponder.panHandlers}>
                <Animated.View
                  style={[
                    styles.bunny,
                    { 
                      transform: [
                        { translateY: bunnyY },
                        { translateY: bunnyBounceAnim },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.bunnySprite}>{evolution.emoji}</Text>
                </Animated.View>

                {obstacles.map(obs => (
                  <View
                    key={obs.id}
                    style={[
                      styles.obstacle,
                      {
                        left: obs.x,
                        top: obs.y,
                        width: obs.width,
                        height: obs.height,
                      },
                    ]}
                  >
                    <Text style={styles.obstacleEmoji}>
                      {obs.type === 'carrot' ? '🥕' : '🕳️'}
                    </Text>
                  </View>
                ))}

                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>{score}</Text>
                </View>
              </View>
            )}

            {gameOver && (
              <View style={styles.gameOverScreen}>
                <Text style={styles.gameOverEmoji}>💔</Text>
                <Text style={styles.gameOverText}>Game Over!</Text>
                <Text style={styles.finalScore}>Score: {score}</Text>
                <TouchableOpacity style={styles.restartButton} onPress={startGame}>
                  <LinearGradient
                    colors={['#4CAF50', '#45A049']}
                    style={styles.restartGradient}
                  >
                    <Text style={styles.restartText}>Play Again</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.ground}>
              <Text style={styles.groundEmoji}>🌱🌿🌱🌸🌱🌿🌱</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.accessoriesSection}>
          <Text style={styles.accessoriesTitle}>Your Collection</Text>
          <View style={styles.accessoriesGrid}>
            {ACCESSORIES.map(acc => {
              const unlocked = gameState.carrots >= acc.carrots;
              return (
                <View 
                  key={acc.id} 
                  style={[
                    styles.accessoryItem,
                    !unlocked && styles.accessoryLocked,
                  ]}
                >
                  <Text style={styles.accessoryEmoji}>{acc.emoji}</Text>
                  <Text style={styles.accessoryName}>{acc.name}</Text>
                  {!unlocked && (
                    <Text style={styles.accessoryReq}>{acc.carrots}🥕</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {showEvolution && (
          <View style={styles.evolutionModal}>
            <View style={styles.evolutionContent}>
              <Text style={styles.evolutionTitle}>✨ Evolution! ✨</Text>
              <Text style={styles.evolvedEmoji}>{evolution.emoji}</Text>
              <Text style={styles.evolvedName}>You evolved into {evolution.name}!</Text>
              <TouchableOpacity 
                style={styles.evolutionButton}
                onPress={() => setShowEvolution(false)}
              >
                <Text style={styles.evolutionButtonText}>Amazing!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statEmoji: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D1B2E',
  },
  evolutionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
  },
  evolutionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  evolutionEmoji: {
    fontSize: 48,
  },
  evolutionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D1B2E',
    marginBottom: 8,
  },
  progressBar: {
    width: 200,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 4,
  },
  nextEvolution: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
  gameContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  gameBackground: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  clouds: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cloud: {
    position: 'absolute',
    fontSize: 40,
    top: 30,
    left: 30,
    opacity: 0.8,
  },
  cloud2: {
    position: 'absolute',
    fontSize: 50,
    top: 60,
    right: 50,
    opacity: 0.6,
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bunnyEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  startText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  startButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  startGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  gameArea: {
    flex: 1,
  },
  bunny: {
    position: 'absolute',
    left: 80,
    width: BUNNY_SIZE,
    height: BUNNY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bunnySprite: {
    fontSize: 40,
  },
  obstacle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  obstacleEmoji: {
    fontSize: 30,
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D1B2E',
  },
  gameOverScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  gameOverEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  finalScore: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  restartButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  restartGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  restartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#7CB342',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groundEmoji: {
    fontSize: 24,
  },
  accessoriesSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  accessoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D1B2E',
    marginBottom: 12,
  },
  accessoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  accessoryItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  accessoryLocked: {
    opacity: 0.5,
  },
  accessoryEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  accessoryName: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  accessoryReq: {
    fontSize: 10,
    color: '#FF6B9D',
    marginTop: 2,
  },
  evolutionModal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  evolutionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  evolutionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B9D',
    marginBottom: 20,
  },
  evolvedEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  evolvedName: {
    fontSize: 18,
    color: '#4A4A4A',
    marginBottom: 24,
    textAlign: 'center',
  },
  evolutionButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  evolutionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
