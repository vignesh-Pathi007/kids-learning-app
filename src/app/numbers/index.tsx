import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { numbersData } from '../../../data/numbers';

const numberAudio = {
  1: require('../../../assets/audio/numbers/1.wav'),
  2: require('../../../assets/audio/numbers/2.wav'),
  3: require('../../../assets/audio/numbers/3.wav'),
  4: require('../../../assets/audio/numbers/4.wav'),
  5: require('../../../assets/audio/numbers/5.wav'),
  6: require('../../../assets/audio/numbers/6.wav'),
  7: require('../../../assets/audio/numbers/7.wav'),
  8: require('../../../assets/audio/numbers/8.wav'),
  9: require('../../../assets/audio/numbers/9.wav'),
  10: require('../../../assets/audio/numbers/10.wav'),
  11: require('../../../assets/audio/numbers/11.wav'),
  12: require('../../../assets/audio/numbers/12.wav'),
  13: require('../../../assets/audio/numbers/13.wav'),
  14: require('../../../assets/audio/numbers/14.wav'),
  15: require('../../../assets/audio/numbers/15.wav'),
  16: require('../../../assets/audio/numbers/16.wav'),
  17: require('../../../assets/audio/numbers/17.wav'),
  18: require('../../../assets/audio/numbers/18.wav'),
  19: require('../../../assets/audio/numbers/19.wav'),
  20: require('../../../assets/audio/numbers/20.wav'),
  21: require('../../../assets/audio/numbers/21.wav'),
  22: require('../../../assets/audio/numbers/22.wav'),
  23: require('../../../assets/audio/numbers/23.wav'),
  24: require('../../../assets/audio/numbers/24.wav'),
  25: require('../../../assets/audio/numbers/25.wav'),
  26: require('../../../assets/audio/numbers/26.wav'),
  27: require('../../../assets/audio/numbers/27.wav'),
  28: require('../../../assets/audio/numbers/28.wav'),
  29: require('../../../assets/audio/numbers/29.wav'),
  30: require('../../../assets/audio/numbers/30.wav'),
  31: require('../../../assets/audio/numbers/31.wav'),
  32: require('../../../assets/audio/numbers/32.wav'),
  33: require('../../../assets/audio/numbers/33.wav'),
  34: require('../../../assets/audio/numbers/34.wav'),
  35: require('../../../assets/audio/numbers/35.wav'),
  36: require('../../../assets/audio/numbers/36.wav'),
  37: require('../../../assets/audio/numbers/37.wav'),
  38: require('../../../assets/audio/numbers/38.wav'),
  39: require('../../../assets/audio/numbers/39.wav'),
  40: require('../../../assets/audio/numbers/40.wav'),
  41: require('../../../assets/audio/numbers/41.wav'),
  42: require('../../../assets/audio/numbers/42.wav'),
  43: require('../../../assets/audio/numbers/43.wav'),
  44: require('../../../assets/audio/numbers/44.wav'),
  45: require('../../../assets/audio/numbers/45.wav'),
  46: require('../../../assets/audio/numbers/46.wav'),
  47: require('../../../assets/audio/numbers/47.wav'),
  48: require('../../../assets/audio/numbers/48.wav'),
  49: require('../../../assets/audio/numbers/49.wav'),
  50: require('../../../assets/audio/numbers/50.wav'),
  51: require('../../../assets/audio/numbers/51.wav'),
  52: require('../../../assets/audio/numbers/52.wav'),
  53: require('../../../assets/audio/numbers/53.wav'),
  54: require('../../../assets/audio/numbers/54.wav'),
  55: require('../../../assets/audio/numbers/55.wav'),
  56: require('../../../assets/audio/numbers/56.wav'),
  57: require('../../../assets/audio/numbers/57.wav'),
  58: require('../../../assets/audio/numbers/58.wav'),
  59: require('../../../assets/audio/numbers/59.wav'),
  60: require('../../../assets/audio/numbers/60.wav'),
  61: require('../../../assets/audio/numbers/61.wav'),
  62: require('../../../assets/audio/numbers/62.wav'),
  63: require('../../../assets/audio/numbers/63.wav'),
  64: require('../../../assets/audio/numbers/64.wav'),
  65: require('../../../assets/audio/numbers/65.wav'),
  66: require('../../../assets/audio/numbers/66.wav'),
  67: require('../../../assets/audio/numbers/67.wav'),
  68: require('../../../assets/audio/numbers/68.wav'),
  69: require('../../../assets/audio/numbers/69.wav'),
  70: require('../../../assets/audio/numbers/70.wav'),
  71: require('../../../assets/audio/numbers/71.wav'),
  72: require('../../../assets/audio/numbers/72.wav'),
  73: require('../../../assets/audio/numbers/73.wav'),
  74: require('../../../assets/audio/numbers/74.wav'),
  75: require('../../../assets/audio/numbers/75.wav'),
  76: require('../../../assets/audio/numbers/76.wav'),
  77: require('../../../assets/audio/numbers/77.wav'),
  78: require('../../../assets/audio/numbers/78.wav'),
  79: require('../../../assets/audio/numbers/79.wav'),
  80: require('../../../assets/audio/numbers/80.wav'),
  81: require('../../../assets/audio/numbers/81.wav'),
  82: require('../../../assets/audio/numbers/82.wav'),
  83: require('../../../assets/audio/numbers/83.wav'),
  84: require('../../../assets/audio/numbers/84.wav'),
  85: require('../../../assets/audio/numbers/85.wav'),
  86: require('../../../assets/audio/numbers/86.wav'),
  87: require('../../../assets/audio/numbers/87.wav'),
  88: require('../../../assets/audio/numbers/88.wav'),
  89: require('../../../assets/audio/numbers/89.wav'),
  90: require('../../../assets/audio/numbers/90.wav'),
  91: require('../../../assets/audio/numbers/91.wav'),
  92: require('../../../assets/audio/numbers/92.wav'),
  93: require('../../../assets/audio/numbers/93.wav'),
  94: require('../../../assets/audio/numbers/94.wav'),
  95: require('../../../assets/audio/numbers/95.wav'),
  96: require('../../../assets/audio/numbers/96.wav'),
  97: require('../../../assets/audio/numbers/97.wav'),
  98: require('../../../assets/audio/numbers/98.wav'),
  99: require('../../../assets/audio/numbers/99.wav'),
  100: require('../../../assets/audio/numbers/100.wav'),
} as const;

const COLORS = {
  background: '#FFF9F2',
  white: '#FFFFFF',
  primary: '#5B5CE2',
  primaryLight: '#E8E7FF',
  text: '#25304A',
  secondaryText: '#718096',
  border: '#E8E5DF',
};

export default function NumbersLearnScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentNumber = numbersData[currentIndex];
  const audioSource = numberAudio[currentNumber.number as keyof typeof numberAudio];
  const player = useAudioPlayer(audioSource);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === numbersData.length - 1;

  const speakNumber = () => {
    if (!soundEnabled || !currentNumber) {
      return;
    }

    player.seekTo(0);
    player.play();
  };

  useEffect(() => {
    if (!currentNumber || !soundEnabled) {
      player.pause();
      return;
    }

    const timer = setTimeout(() => {
      player.seekTo(0);
      player.play();
    }, 250);

    return () => {
      clearTimeout(timer);
      player.pause();
    };
  }, [currentIndex, soundEnabled, currentNumber, player]);

  /* -------------------------------------------------------
     Previous
  ------------------------------------------------------- */

  const handlePrevious = () => {
    if (isFirst) {
      return;
    }

    player.pause();

    setCurrentIndex(
      previous => previous - 1,
    );
  };

  /* -------------------------------------------------------
     Next
  ------------------------------------------------------- */

  const handleNext = () => {
    if (isLast) {
      return;
    }

    player.pause();

    setCurrentIndex(
      previous => previous + 1,
    );
  };

  /* -------------------------------------------------------
     Sound Toggle
  ------------------------------------------------------- */

  const toggleSound = () => {
    if (soundEnabled) {
      player.pause();
    }

    setSoundEnabled(
      previous => !previous,
    );
  };

  /* -------------------------------------------------------
     Progress
  ------------------------------------------------------- */

  const progress =
    ((currentIndex + 1) / numbersData.length) * 100;

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={[
        'top',
        'left',
        'right',
      ]}
    >
      <View style={styles.container}>

        {/* Header */}

        <View style={styles.header}>
          <Pressable
            onPress={() => {
              player.pause();
              router.push('/');
            }}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={COLORS.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Numbers
          </Text>

          <Pressable
            onPress={toggleSound}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={
                soundEnabled
                  ? 'volume-high'
                  : 'volume-mute'
              }
              size={22}
              color={
                soundEnabled
                  ? COLORS.primary
                  : COLORS.secondaryText
              }
            />
          </Pressable>
        </View>

        {/* Progress */}

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {currentIndex + 1} of{' '}
              {numbersData.length}
            </Text>

            <Text style={styles.progressPercentage}>
              {Math.round(progress)}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Main Learning Card */}

        <View style={styles.learningCard}>

          <Text style={styles.learnLabel}>
            LEARN NUMBER
          </Text>

          {/* Number */}

          <View style={styles.numberCircle}>
            <Text
              style={styles.numberText}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {currentNumber.number}
            </Text>
          </View>

          {/* Word */}

          <Text style={styles.numberWord}>
            {currentNumber.word}
          </Text>

          {/* Count Visual */}

          <View style={styles.objectsContainer}>
            {currentNumber.number <= 20 ? (
              <View style={styles.objectsGrid}>
                {Array.from({
                  length: currentNumber.number,
                }).map((_, index) => (
                  <View
                    key={index}
                    style={styles.countDot}
                  >
                    <Text style={styles.countDotText}>
                      •
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.groupedCount}>

                <View style={styles.countGroup}>
                  <Text style={styles.groupNumber}>
                    {Math.floor(
                      currentNumber.number / 10,
                    )}
                  </Text>

                  <Text style={styles.groupLabel}>
                    groups of 10
                  </Text>
                </View>

                <Text style={styles.plusText}>
                  +
                </Text>

                <View style={styles.countGroup}>
                  <Text style={styles.groupNumber}>
                    {currentNumber.number % 10}
                  </Text>

                  <Text style={styles.groupLabel}>
                    more
                  </Text>
                </View>

              </View>
            )}
          </View>

          {/* Listen Button */}

          <Pressable
            onPress={speakNumber}
            disabled={!soundEnabled}
            style={({ pressed }) => [
              styles.soundButton,
              !soundEnabled &&
                styles.soundButtonDisabled,
              pressed &&
                soundEnabled &&
                styles.soundButtonPressed,
            ]}
          >
            <Ionicons
              name={
                soundEnabled
                  ? 'volume-high'
                  : 'volume-mute'
              }
              size={20}
              color={
                soundEnabled
                  ? COLORS.primary
                  : COLORS.secondaryText
              }
            />

            <Text
              style={[
                styles.soundButtonText,
                !soundEnabled &&
                  styles.soundButtonTextDisabled,
              ]}
            >
              {soundEnabled
                ? 'Hear it again'
                : 'Sound off'}
            </Text>
          </Pressable>
        </View>

        {/* Navigation */}

        <View style={styles.navigation}>

          <Pressable
            disabled={isFirst}
            onPress={handlePrevious}
            style={({ pressed }) => [
              styles.navButton,
              styles.previousButton,
              isFirst &&
                styles.disabledButton,
              pressed &&
                !isFirst &&
                styles.navPressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={19}
              color={
                isFirst
                  ? COLORS.secondaryText
                  : COLORS.text
              }
            />

            <Text
              style={[
                styles.previousText,
                isFirst &&
                  styles.disabledText,
              ]}
            >
              Previous
            </Text>
          </Pressable>

          <Pressable
            disabled={isLast}
            onPress={handleNext}
            style={({ pressed }) => [
              styles.navButton,
              styles.nextButton,
              isLast &&
                styles.disabledNextButton,
              pressed &&
                !isLast &&
                styles.navPressed,
            ]}
          >
            <Text style={styles.nextText}>
              {isLast
                ? 'Completed'
                : 'Next'}
            </Text>

            {!isLast && (
              <Ionicons
                name="arrow-forward"
                size={19}
                color={COLORS.white}
              />
            )}
          </Pressable>

        </View>

      </View>
    </SafeAreaView>
  );
}

/* ---------------------------------------------------------
   Styles
--------------------------------------------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  /* Header */

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  pressed: {
    opacity: 0.65,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  /* Progress */

  progressSection: {
    marginBottom: 18,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },

  progressPercentage: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  /* Learning Card */

  learningCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  learnLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.secondaryText,
    marginBottom: 12,
  },

  /* Number */

  numberCircle: {
    width: 150,
    height: 150,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  numberText: {
    fontSize: 76,
    fontWeight: '900',
    color: COLORS.primary,
    includeFontPadding: false,
  },

  /* Word */

  numberWord: {
    marginTop: 15,
    fontSize: 27,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },

  /* Objects */

  objectsContainer: {
    marginTop: 16,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  objectsGrid: {
    maxWidth: 250,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },

  countDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  countDotText: {
    fontSize: 17,
    lineHeight: 17,
    fontWeight: '900',
    color: COLORS.primary,
  },

  groupedCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  countGroup: {
    minWidth: 62,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
  },

  groupNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
  },

  groupLabel: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },

  plusText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondaryText,
  },

  /* Sound */

  soundButton: {
    marginTop: 18,
    minWidth: 145,
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  soundButtonDisabled: {
    backgroundColor: '#F1F1F1',
  },

  soundButtonPressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  soundButtonText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  soundButtonTextDisabled: {
    color: COLORS.secondaryText,
  },

  /* Navigation */

  navigation: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },

  navButton: {
    height: 54,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  previousButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  nextButton: {
    flex: 1.2,
    backgroundColor: COLORS.primary,
  },

  disabledButton: {
    backgroundColor: '#F2F1EE',
    borderColor: '#F2F1EE',
  },

  disabledNextButton: {
    backgroundColor: '#D8D8E2',
  },

  navPressed: {
    opacity: 0.8,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  previousText: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  nextText: {
    marginRight: 7,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },

  disabledText: {
    color: COLORS.secondaryText,
  },
});

