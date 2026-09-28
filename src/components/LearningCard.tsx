import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';

type LearningCardProps = {
  emoji: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  onPress: () => void;
};

export default function LearningCard({
  emoji,
  title,
  subtitle,
  backgroundColor,
  onPress,
}: LearningCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    minHeight: 155,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pressed: {
    transform: [{ scale: 0.96 }],
  },

  emojiContainer: {
    marginBottom: 8,
  },

  emoji: {
    fontSize: 42,
  },

  title: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
});