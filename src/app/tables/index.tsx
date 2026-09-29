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

import { tablesData } from '../../../data/tables';
import { tableEquationAudio } from '../../../data/tablesAudio';

const COLORS = {
  background: '#FFF9F2',
  white: '#FFFFFF',

  primary: '#5B5CE2',
  primaryLight: '#E8E7FF',

  text: '#25304A',
  secondaryText: '#718096',

  border: '#E8E5DF',
};

export default function TablesLearnScreen() {
  const [tableIndex, setTableIndex] = useState(0);
  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [soundEnabled, setSoundEnabled] =
    useState(true);

  const currentTable =
    tablesData[tableIndex];

  const currentItem =
    currentTable.items[questionIndex];

  const equationAudio =
    tableEquationAudio[currentTable.table][currentItem.multiplier];
  const equationPlayer = useAudioPlayer(equationAudio);

  const stopEquationAudio = () => {
    try {
      equationPlayer.pause();
    } catch {
      // Ignore stale or released player instances during screen teardown.
    }
  };

  const isFirstQuestion =
    questionIndex === 0;

  const isLastQuestion =
    questionIndex ===
    currentTable.items.length - 1;

  const progress =
    ((questionIndex + 1) /
      currentTable.items.length) *
    100;

  /* -------------------------------------------------------
     Audio
  ------------------------------------------------------- */

  const speakEquation = () => {
    if (!soundEnabled) {
      return;
    }

    try {
      equationPlayer.seekTo(0);
      equationPlayer.play();
    } catch {
      // Ignore stale or released player instances during screen teardown.
    }
  };

  useEffect(() => {
    if (!soundEnabled) {
      stopEquationAudio();
      return;
    }

    const timer = setTimeout(() => {
      speakEquation();
    }, 250);

    return () => {
      clearTimeout(timer);
      stopEquationAudio();
    };
  }, [
    tableIndex,
    questionIndex,
    soundEnabled,
    equationPlayer,
  ]);

  /* -------------------------------------------------------
     Previous
  ------------------------------------------------------- */

  const handlePrevious = () => {
    if (isFirstQuestion) {
      return;
    }

    setQuestionIndex(
      previous => previous - 1,
    );
  };

  /* -------------------------------------------------------
     Next
  ------------------------------------------------------- */

  const handleNext = () => {
    if (isLastQuestion) {
      return;
    }

    setQuestionIndex(
      previous => previous + 1,
    );
  };

  /* -------------------------------------------------------
     Table Selection
  ------------------------------------------------------- */

  const handleTableChange = (
    index: number,
  ) => {
    setTableIndex(index);
    setQuestionIndex(0);
  };

  /* -------------------------------------------------------
     Sound
  ------------------------------------------------------- */

  const toggleSound = () => {
    setSoundEnabled(
      previous => !previous,
    );
  };

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
              stopEquationAudio();
              router.push('/');
            }}
            style={({ pressed }) => [
              styles.iconButton,
              pressed &&
                styles.pressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={COLORS.text}
            />
          </Pressable>

          <Text
            style={styles.headerTitle}
          >
            Tables
          </Text>

          <Pressable
            onPress={() => {
              if (soundEnabled) {
                stopEquationAudio();
              }
              toggleSound();
            }}
            style={({ pressed }) => [
              styles.iconButton,
              pressed &&
                styles.pressed,
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

        {/* Table Selector */}

        <View
          style={styles.tableSelector}
        >

          <Text
            style={styles.selectorLabel}
          >
            TABLE
          </Text>

          <View
            style={styles.tableButtons}
          >
            {tablesData
              .slice(0, 10)
              .map(
                (item, index) => {
                  const selected =
                    index ===
                    tableIndex;

                  return (
                    <Pressable
                      key={item.table}
                      onPress={() =>
                        handleTableChange(
                          index,
                        )
                      }
                      style={[
                        styles.tableButton,
                        selected &&
                          styles.selectedTableButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tableButtonText,
                          selected &&
                            styles.selectedTableButtonText,
                        ]}
                      >
                        {item.table}
                      </Text>
                    </Pressable>
                  );
                },
              )}
          </View>

          <View
            style={styles.tableButtons}
          >
            {tablesData
              .slice(10, 20)
              .map(
                (item, index) => {
                  const actualIndex =
                    index + 10;

                  const selected =
                    actualIndex ===
                    tableIndex;

                  return (
                    <Pressable
                      key={item.table}
                      onPress={() =>
                        handleTableChange(
                          actualIndex,
                        )
                      }
                      style={[
                        styles.tableButton,
                        selected &&
                          styles.selectedTableButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tableButtonText,
                          selected &&
                            styles.selectedTableButtonText,
                        ]}
                      >
                        {item.table}
                      </Text>
                    </Pressable>
                  );
                },
              )}
          </View>

        </View>

        {/* Progress */}

        <View
          style={styles.progressSection}
        >

          <View
            style={styles.progressHeader}
          >
            <Text
              style={styles.progressText}
            >
              Question{' '}
              {questionIndex + 1}{' '}
              of 10
            </Text>

            <Text
              style={
                styles.progressPercentage
              }
            >
              {Math.round(progress)}%
            </Text>
          </View>

          <View
            style={styles.progressTrack}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    `${progress}%`,
                },
              ]}
            />
          </View>

        </View>

        {/* Learning Card */}

        <View
          style={styles.learningCard}
        >

          <Text
            style={styles.learnLabel}
          >
            TABLE OF {currentTable.table}
          </Text>

          {/* Equation */}

          <View
            style={styles.equationContainer}
          >

            <Text
              style={styles.equationNumber}
            >
              {currentTable.table}
            </Text>

            <Text
              style={styles.operator}
            >
              ×
            </Text>

            <Text
              style={styles.equationNumber}
            >
              {currentItem.multiplier}
            </Text>

            <Text
              style={styles.operator}
            >
              =
            </Text>

            <View
              style={styles.answerCircle}
            >
              <Text
                style={styles.answerText}
              >
                {currentItem.answer}
              </Text>
            </View>

          </View>

          {/* Spoken sentence */}

          <Text
            style={styles.equationWord}
          >
            {currentTable.table}{' '}
            times{' '}
            {currentItem.multiplier}{' '}
            is{' '}
            {currentItem.answer}
          </Text>

          {/* Visual */}

          <View
            style={styles.visualContainer}
          >

            {Array.from({
              length:
                currentItem.multiplier,
            }).map(
              (_, index) => (
                <View
                  key={index}
                  style={
                    styles.visualGroup
                  }
                >
                  {Array.from({
                    length:
                      currentTable.table,
                  }).map(
                    (_, dotIndex) => (
                      <View
                        key={dotIndex}
                        style={
                          styles.visualDot
                        }
                      />
                    ),
                  )}
                </View>
              ),
            )}

          </View>

          {/* Hear Again */}

          <Pressable
            onPress={speakEquation}
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

        <View
          style={styles.navigation}
        >

          <Pressable
            disabled={isFirstQuestion}
            onPress={handlePrevious}
            style={({ pressed }) => [
              styles.navButton,
              styles.previousButton,
              isFirstQuestion &&
                styles.disabledButton,
              pressed &&
                !isFirstQuestion &&
                styles.navPressed,
            ]}
          >

            <Ionicons
              name="arrow-back"
              size={19}
              color={
                isFirstQuestion
                  ? COLORS.secondaryText
                  : COLORS.text
              }
            />

            <Text
              style={[
                styles.previousText,
                isFirstQuestion &&
                  styles.disabledText,
              ]}
            >
              Previous
            </Text>

          </Pressable>

          <Pressable
            disabled={isLastQuestion}
            onPress={handleNext}
            style={({ pressed }) => [
              styles.navButton,
              styles.nextButton,
              isLastQuestion &&
                styles.disabledNextButton,
              pressed &&
                !isLastQuestion &&
                styles.navPressed,
            ]}
          >

            <Text
              style={styles.nextText}
            >
              {isLastQuestion
                ? 'Completed'
                : 'Next'}
            </Text>

            {!isLastQuestion && (
              <Ionicons
                name="arrow-forward"
                size={19}
                color={COLORS.white}
              />
            )}

          </Pressable>

        </View>

        {/* Practice */}

        <Pressable
          onPress={() =>
            router.push(
              '/tables/practice',
            )
          }
          style={({ pressed }) => [
            styles.practiceButton,
            pressed &&
              styles.practiceButtonPressed,
          ]}
        >

          <View
            style={styles.practiceIcon}
          >
            <Ionicons
              name="school-outline"
              size={20}
              color={COLORS.primary}
            />
          </View>

          <View
            style={styles.practiceContent}
          >

            <Text
              style={styles.practiceTitle}
            >
              Practice Tables
            </Text>

            <Text
              style={
                styles.practiceSubtitle
              }
            >
              Test what you have learned
            </Text>

          </View>

          <Ionicons
            name="arrow-forward"
            size={20}
            color={COLORS.primary}
          />

        </Pressable>

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
    backgroundColor:
      COLORS.background,
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

    justifyContent:
      'space-between',

    marginBottom: 12,
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

    backgroundColor:
      COLORS.white,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor:
      COLORS.border,
  },

  pressed: {
    opacity: 0.65,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  /* Table Selector */

  tableSelector: {
    marginBottom: 14,
  },

  selectorLabel: {
    fontSize: 10,

    fontWeight: '800',

    letterSpacing: 1.3,

    color: COLORS.secondaryText,

    marginBottom: 7,
  },

  tableButtons: {
    flexDirection: 'row',

    gap: 6,

    marginBottom: 6,
  },

  tableButton: {
    flex: 1,

    height: 32,

    borderRadius: 10,

    backgroundColor:
      COLORS.white,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor:
      COLORS.border,
  },

  selectedTableButton: {
    backgroundColor:
      COLORS.primary,

    borderColor:
      COLORS.primary,
  },

  tableButtonText: {
    fontSize: 12,

    fontWeight: '700',

    color: COLORS.text,
  },

  selectedTableButtonText: {
    color: COLORS.white,
  },

  /* Progress */

  progressSection: {
    marginBottom: 14,
  },

  progressHeader: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    marginBottom: 7,
  },

  progressText: {
    fontSize: 13,

    fontWeight: '600',

    color:
      COLORS.secondaryText,
  },

  progressPercentage: {
    fontSize: 13,

    fontWeight: '700',

    color:
      COLORS.primary,
  },

  progressTrack: {
    height: 8,

    borderRadius: 4,

    backgroundColor:
      COLORS.primaryLight,

    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',

    borderRadius: 4,

    backgroundColor:
      COLORS.primary,
  },

  /* Learning */

  learningCard: {
    flex: 1,

    backgroundColor:
      COLORS.white,

    borderRadius: 28,

    padding: 22,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor:
      COLORS.border,

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

    color:
      COLORS.secondaryText,

    marginBottom: 18,
  },

  /* Equation */

  equationContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 10,
  },

  equationNumber: {
    fontSize: 52,

    fontWeight: '900',

    color: COLORS.text,
  },

  operator: {
    fontSize: 38,

    fontWeight: '800',

    color:
      COLORS.secondaryText,
  },

  answerCircle: {
    minWidth: 92,

    height: 92,

    paddingHorizontal: 14,

    borderRadius: 28,

    backgroundColor:
      COLORS.primaryLight,

    alignItems: 'center',

    justifyContent: 'center',
  },

  answerText: {
    fontSize: 42,

    fontWeight: '900',

    color:
      COLORS.primary,
  },

  equationWord: {
    marginTop: 16,

    fontSize: 18,

    fontWeight: '800',

    color: COLORS.text,

    textAlign: 'center',
  },

  /* Visual */

  visualContainer: {
    maxWidth: 280,

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent:
      'center',

    alignItems: 'center',

    marginTop: 18,

    gap: 8,
  },

  visualGroup: {
    padding: 6,

    borderRadius: 10,

    backgroundColor:
      COLORS.primaryLight,

    flexDirection: 'row',

    flexWrap: 'wrap',

    maxWidth: 70,

    justifyContent:
      'center',

    gap: 3,
  },

  visualDot: {
    width: 8,

    height: 8,

    borderRadius: 4,

    backgroundColor:
      COLORS.primary,
  },

  /* Sound */

  soundButton: {
    marginTop: 18,

    minWidth: 145,

    height: 42,

    paddingHorizontal: 15,

    borderRadius: 14,

    backgroundColor:
      COLORS.primaryLight,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'center',
  },

  soundButtonDisabled: {
    backgroundColor:
      '#F1F1F1',
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

    color:
      COLORS.primary,
  },

  soundButtonTextDisabled: {
    color:
      COLORS.secondaryText,
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

    justifyContent:
      'center',
  },

  previousButton: {
    flex: 1,

    backgroundColor:
      COLORS.white,

    borderWidth: 1,

    borderColor:
      COLORS.border,
  },

  nextButton: {
    flex: 1.2,

    backgroundColor:
      COLORS.primary,
  },

  disabledButton: {
    backgroundColor:
      '#F2F1EE',

    borderColor:
      '#F2F1EE',
  },

  disabledNextButton: {
    backgroundColor:
      '#D8D8E2',
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
    color:
      COLORS.secondaryText,
  },

  /* Practice */

  practiceButton: {
    marginTop: 14,

    minHeight: 68,

    paddingHorizontal: 14,

    borderRadius: 18,

    backgroundColor:
      COLORS.white,

    borderWidth: 1,

    borderColor:
      COLORS.border,

    flexDirection: 'row',

    alignItems: 'center',
  },

  practiceButtonPressed: {
    opacity: 0.8,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  practiceIcon: {
    width: 42,
    height: 42,

    borderRadius: 14,

    backgroundColor:
      COLORS.primaryLight,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 12,
  },

  practiceContent: {
    flex: 1,
  },

  practiceTitle: {
    fontSize: 15,

    fontWeight: '800',

    color: COLORS.text,
  },

  practiceSubtitle: {
    marginTop: 3,

    fontSize: 12,

    fontWeight: '600',

    color:
      COLORS.secondaryText,
  },
});