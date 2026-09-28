import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#FFF9F2',
  white: '#FFFFFF',

  primary: '#5B5CE2',
  primaryLight: '#E8E7FF',

  text: '#25304A',
  secondaryText: '#718096',

  alphabet: '#E8E7FF',
  numbers: '#DDF7EA',
  tables: '#FFF0C7',
  puzzles: '#FFE3EB',

  border: '#E8E5DF',

  iconBackground: '#FFFFFF',
};

type LearningCardProps = {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  onPress: () => void;
};

function LearningCard({
  title,
  subtitle,
  icon,
  iconColor,
  backgroundColor,
  onPress,
}: LearningCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.learningCard,
        { backgroundColor },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardTopRow}>
        <View
          style={[
            styles.cardIconContainer,
            { backgroundColor: COLORS.iconBackground },
          ]}
        >
          <Text style={[styles.cardIcon, { color: iconColor }]}>
            {icon}
          </Text>
        </View>

        <View style={styles.cardArrow}>
          <Ionicons
            name="arrow-forward"
            size={17}
            color={COLORS.text}
          />
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>

        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

type MoreItemProps = {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  onPress: () => void;
};

function MoreItem({
  title,
  iconName,
  iconColor,
  onPress,
}: MoreItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.moreItem,
        pressed && styles.morePressed,
      ]}
    >
      <View style={styles.moreLeft}>
        <View style={styles.moreIconContainer}>
          <Ionicons
            name={iconName}
            size={22}
            color={iconColor}
          />
        </View>

        <Text style={styles.moreTitle}>{title}</Text>
      </View>

      <View style={styles.moreArrow}>
        <Ionicons
          name="chevron-forward"
          size={19}
          color={COLORS.secondaryText}
        />
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              Hi, Little Learner!
            </Text>

            <Text style={styles.description}>
              What shall we learn today?
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/parent')}
            style={({ pressed }) => [
              styles.settingsButton,
              pressed && styles.settingsPressed,
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={COLORS.text}
            />
          </Pressable>
        </View>

        {/* Learn */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Learn</Text>

          <Text style={styles.sectionSubtitle}>
            Choose a subject
          </Text>
        </View>

        {/* Learning Cards */}
        <View style={styles.learningGrid}>
          <LearningCard
            title="Alphabet"
            subtitle="Learn A - Z"
            icon="ABC"
            iconColor="#5B5CE2"
            backgroundColor={COLORS.alphabet}
            onPress={() => router.push('/alphabet')}
          />

          <LearningCard
            title="Numbers"
            subtitle="Learn 1 - 100"
            icon="123"
            iconColor="#15966A"
            backgroundColor={COLORS.numbers}
            onPress={() => router.push('/numbers')}
          />

          <LearningCard
            title="Tables"
            subtitle="Learn 1 - 20"
            icon="×"
            iconColor="#D58A00"
            backgroundColor={COLORS.tables}
            onPress={() => router.push('/tables')}
          />

          <LearningCard
            title="Puzzles"
            subtitle="Think & solve"
            icon="?"
            iconColor="#D94F76"
            backgroundColor={COLORS.puzzles}
            onPress={() => router.push('/puzzles')}
          />
        </View>

        {/* More */}
        <View style={styles.moreHeader}>
          <Text style={styles.sectionTitle}>More</Text>
        </View>

        <MoreItem
          title="Colors"
          iconName="color-palette-outline"
          iconColor="#F59E0B"
          onPress={() => router.push('/colors')}
        />

        <MoreItem
          title="Shapes"
          iconName="shapes-outline"
          iconColor="#6366F1"
          onPress={() => router.push('/shapes')}
        />

        <MoreItem
          title="Words"
          iconName="text-outline"
          iconColor="#10B981"
          onPress={() => router.push('/words')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 34,
  },

  headerText: {
    flex: 1,
    paddingRight: 16,
  },

  greeting: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  description: {
    marginTop: 7,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.secondaryText,
  },

  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 16,

    backgroundColor: COLORS.white,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  settingsPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.96 }],
  },

  /* Section */

  sectionHeader: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.text,
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.secondaryText,
  },

  /* Learning Grid */

  learningGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  learningCard: {
    width: '48%',
    height: 172,

    borderRadius: 24,

    padding: 17,
    marginBottom: 16,

    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardIconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },

  cardIcon: {
    fontSize: 19,
    fontWeight: '900',
  },

  cardArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,

    backgroundColor: 'rgba(255,255,255,0.65)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContent: {
    marginTop: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },

  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.secondaryText,
    marginTop: 5,
  },

  /* More */

  moreHeader: {
    marginTop: 16,
    marginBottom: 16,
  },

  moreItem: {
    minHeight: 68,

    backgroundColor: COLORS.white,

    borderRadius: 18,

    paddingHorizontal: 15,
    paddingVertical: 10,

    marginBottom: 12,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },

  morePressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },

  moreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  moreIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,

    backgroundColor: '#F8FAFC',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 14,
  },

  moreTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  moreArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,

    backgroundColor: '#F8FAFC',

    alignItems: 'center',
    justifyContent: 'center',
  },
});