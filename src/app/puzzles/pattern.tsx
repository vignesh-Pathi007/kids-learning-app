import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#FFF9F2',
  white: '#FFFFFF',

  primary: '#5B5CE2',
  primaryLight: '#E8E7FF',

  success: '#15966A',
  successLight: '#DDF7EA',

  error: '#D94F76',
  errorLight: '#FFE3EB',

  text: '#25304A',
  secondaryText: '#718096',
  border: '#E8E5DF',
};

const TOTAL_QUESTIONS = 10;

type PatternQuestion = {
  id: string;
  sequence: string[];
  options: string[];
  correctAnswer: string;
};

const PATTERNS = [
  {
    sequence: ['🔴', '🔵', '🔴', '🔵'],
    answers: ['🔴', '🟢', '⭐'],
    correct: '🔴',
  },
  {
    sequence: ['⭐', '🌙', '⭐', '🌙'],
    answers: ['☀️', '⭐', '🌈'],
    correct: '⭐',
  },
  {
    sequence: ['🍎', '🍌', '🍎', '🍌'],
    answers: ['🍎', '🍇', '🍊'],
    correct: '🍎',
  },
  {
    sequence: ['🐶', '🐱', '🐶', '🐱'],
    answers: ['🐰', '🐶', '🐼'],
    correct: '🐶',
  },
  {
    sequence: ['🔺', '🔵', '🔺', '🔵'],
    answers: ['🟢', '🔺', '⭐'],
    correct: '🔺',
  },
  {
    sequence: ['🌸', '🌻', '🌸', '🌻'],
    answers: ['🌹', '🌻', '🌸'],
    correct: '🌸',
  },
  {
    sequence: ['🟢', '🟡', '🟢', '🟡'],
    answers: ['🔵', '🟢', '🔴'],
    correct: '🟢',
  },
  {
    sequence: ['🚗', '🚌', '🚗', '🚌'],
    answers: ['🚕', '🚗', '🚲'],
    correct: '🚗',
  },
  {
    sequence: ['🍕', '🍔', '🍕', '🍔'],
    answers: ['🍟', '🍕', '🌭'],
    correct: '🍕',
  },
  {
    sequence: ['🐟', '🐠', '🐟', '🐠'],
    answers: ['🦀', '🐙', '🐟'],
    correct: '🐟',
  },
  {
    sequence: ['☀️', '🌙', '☀️', '🌙'],
    answers: ['⭐', '☀️', '🌈'],
    correct: '☀️',
  },
  {
    sequence: ['❤️', '💙', '❤️', '💙'],
    answers: ['💚', '❤️', '💛'],
    correct: '❤️',
  },
];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function createQuestion(): PatternQuestion {
  const pattern =
    PATTERNS[
      Math.floor(Math.random() * PATTERNS.length)
    ];

  return {
    id: `${Date.now()}-${Math.random()}`,

    sequence: pattern.sequence,

    options: shuffle(pattern.answers),

    correctAnswer: pattern.correct,
  };
}

function createPracticeSession(): PatternQuestion[] {
  return Array.from(
    { length: TOTAL_QUESTIONS },
    () => createQuestion(),
  );
}

export default function PatternScreen() {
  const [questions, setQuestions] =
    useState<PatternQuestion[]>(() =>
      createPracticeSession(),
    );

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [wrongAttempts, setWrongAttempts] =
    useState(0);

  const [showResult, setShowResult] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const question = questions[questionIndex];

  const questionNumber =
    questionIndex + 1;

  const progress =
    (questionNumber / TOTAL_QUESTIONS) * 100;

  /* -------------------------------------------------------
     Answer
  ------------------------------------------------------- */

  const handleAnswer = (
    answer: string,
  ) => {
    if (!question) {
      return;
    }

    if (
      selectedAnswer ===
      question.correctAnswer
    ) {
      return;
    }

    if (wrongAttempts >= 2) {
      return;
    }

    const isCorrect =
      answer === question.correctAnswer;

    setSelectedAnswer(answer);

    if (isCorrect) {
      setShowResult(true);
      return;
    }

    const newWrongAttempts =
      wrongAttempts + 1;

    setWrongAttempts(newWrongAttempts);

    if (newWrongAttempts >= 2) {
      setShowResult(true);
    }
  };

  /* -------------------------------------------------------
     Next
  ------------------------------------------------------- */

  const handleNext = () => {
    if (
      questionIndex >=
      questions.length - 1
    ) {
      setFinished(true);
      return;
    }

    setQuestionIndex(
      previous => previous + 1,
    );

    setSelectedAnswer(null);
    setWrongAttempts(0);
    setShowResult(false);
  };

  /* -------------------------------------------------------
     Play Again
  ------------------------------------------------------- */

  const handlePlayAgain = () => {
    setQuestions(
      createPracticeSession(),
    );

    setQuestionIndex(0);
    setSelectedAnswer(null);
    setWrongAttempts(0);
    setShowResult(false);
    setFinished(false);
  };

  /* -------------------------------------------------------
     Finished
  ------------------------------------------------------- */

  if (finished) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'left', 'right']}
      >
        <View style={styles.finishedContainer}>
          <View style={styles.finishedIcon}>
            <Text style={styles.finishedEmoji}>
              🎉
            </Text>
          </View>

          <Text style={styles.finishedTitle}>
            Amazing!
          </Text>

          <Text style={styles.finishedDescription}>
            You completed the pattern puzzle.
          </Text>

          <Pressable
            onPress={handlePlayAgain}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed &&
                styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              Play Again
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push('/puzzles')
            }
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed &&
                styles.secondaryButtonPressed,
            ]}
          >
            <Text
              style={styles.secondaryButtonText}
            >
              Back to Puzzles
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!question) {
    return null;
  }

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
          <Pressable
            onPress={() =>
              router.push('/puzzles')
            }
            style={({ pressed }) => [
              styles.headerButton,
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
            Complete the Pattern
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Progress */}

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Question {questionNumber} of{' '}
              {TOTAL_QUESTIONS}
            </Text>

            <Text
              style={styles.progressPercentage}
            >
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

        {/* Question Card */}

        <View style={styles.questionCard}>
          <View style={styles.questionIcon}>
            <Ionicons
              name="grid-outline"
              size={25}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.questionLabel}>
            COMPLETE THE PATTERN
          </Text>

          <Text style={styles.questionText}>
            What comes next?
          </Text>

          <Text style={styles.questionHint}>
            Look carefully at the pattern.
          </Text>
        </View>

        {/* Pattern */}

        <View style={styles.patternCard}>
          <View style={styles.patternRow}>
            {question.sequence.map(
              (item, index) => (
                <View
                  key={`${item}-${index}`}
                  style={styles.patternItem}
                >
                  <Text
                    style={styles.patternEmoji}
                  >
                    {item}
                  </Text>
                </View>
              ),
            )}

            {/* Question Mark */}

            <View
              style={[
                styles.patternItem,
                styles.questionMarkItem,
              ]}
            >
              <Text
                style={styles.questionMark}
              >
                ?
              </Text>
            </View>
          </View>
        </View>

        {/* Instruction */}

        <Text style={styles.chooseText}>
          Choose the missing item
        </Text>

        {/* Options */}

        <View style={styles.optionsContainer}>
          {question.options.map(
            (option, index) => {
              const isCorrect =
                option ===
                question.correctAnswer;

              const isSelected =
                selectedAnswer === option;

              const showCorrect =
                showResult && isCorrect;

              const showWrong =
                isSelected && !isCorrect;

              return (
                <Pressable
                  key={`${question.id}-${option}-${index}`}
                  disabled={
                    showResult ||
                    wrongAttempts >= 2
                  }
                  onPress={() =>
                    handleAnswer(option)
                  }
                  style={({ pressed }) => [
                    styles.optionButton,

                    showCorrect &&
                      styles.correctOption,

                    showWrong &&
                      styles.wrongOption,

                    pressed &&
                      !showResult &&
                      wrongAttempts < 2 &&
                      styles.optionPressed,
                  ]}
                >
                  <Text
                    style={styles.optionEmoji}
                  >
                    {option}
                  </Text>

                  {(showCorrect ||
                    showWrong) && (
                    <View
                      style={styles.optionIcon}
                    >
                      <Ionicons
                        name={
                          showCorrect
                            ? 'checkmark-circle'
                            : 'close-circle'
                        }
                        size={24}
                        color={
                          showCorrect
                            ? COLORS.success
                            : COLORS.error
                        }
                      />
                    </View>
                  )}
                </Pressable>
              );
            },
          )}
        </View>

        {/* Try Again */}

        {wrongAttempts === 1 &&
          selectedAnswer !==
            question.correctAnswer && (
            <View
              style={styles.tryAgainContainer}
            >
              <View
                style={styles.tryAgainIcon}
              >
                <Ionicons
                  name="refresh-outline"
                  size={17}
                  color={COLORS.primary}
                />
              </View>

              <Text
                style={styles.tryAgainText}
              >
                Not quite! Try another one.
              </Text>
            </View>
          )}

        {/* Result */}

        {showResult && (
          <View
            style={[
              styles.resultCard,
              selectedAnswer ===
              question.correctAnswer
                ? styles.correctResult
                : styles.answerResult,
            ]}
          >
            <View
              style={styles.resultIconLarge}
            >
              <Ionicons
                name={
                  selectedAnswer ===
                  question.correctAnswer
                    ? 'checkmark'
                    : 'information'
                }
                size={22}
                color={
                  selectedAnswer ===
                  question.correctAnswer
                    ? COLORS.success
                    : COLORS.primary
                }
              />
            </View>

            <View style={styles.resultContent}>
              <Text
                style={[
                  styles.resultTitle,
                  {
                    color:
                      selectedAnswer ===
                      question.correctAnswer
                        ? COLORS.success
                        : COLORS.primary,
                  },
                ]}
              >
                {selectedAnswer ===
                question.correctAnswer
                  ? 'Great job!'
                  : 'Here is the answer'}
              </Text>

              <Text style={styles.resultText}>
                {selectedAnswer ===
                question.correctAnswer
                  ? 'You completed the pattern!'
                  : `The answer is ${question.correctAnswer}.`}
              </Text>
            </View>
          </View>
        )}

        {/* Next */}

        {showResult && (
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextButton,
              pressed &&
                styles.nextButtonPressed,
            ]}
          >
            <Text style={styles.nextButtonText}>
              {questionNumber ===
              TOTAL_QUESTIONS
                ? 'Finish'
                : 'Next'}
            </Text>

            <Ionicons
              name="arrow-forward"
              size={19}
              color={COLORS.white}
            />
          </Pressable>
        )}
      </ScrollView>
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

  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
  },

  headerSpacer: {
    width: 44,
  },

  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.96 }],
  },

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

  questionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  questionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  questionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.secondaryText,
  },

  questionText: {
    marginTop: 7,
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },

  questionHint: {
    marginTop: 5,
    fontSize: 13,
    color: COLORS.secondaryText,
  },

  patternCard: {
    marginTop: 16,
    backgroundColor: COLORS.white,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  patternRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },

  patternItem: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  patternEmoji: {
    fontSize: 32,
  },

  questionMarkItem: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },

  questionMark: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.primary,
  },

  chooseText: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },

  optionsContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },

  optionButton: {
    width: 92,
    height: 92,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  optionEmoji: {
    fontSize: 44,
  },

  optionPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.8,
  },

  correctOption: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
    borderWidth: 2,
  },

  wrongOption: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
    borderWidth: 2,
  },

  optionIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.white,
    borderRadius: 20,
  },

  tryAgainContainer: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tryAgainIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  tryAgainText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  resultCard: {
    marginTop: 16,
    padding: 15,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  correctResult: {
    backgroundColor: COLORS.successLight,
  },

  answerResult: {
    backgroundColor: COLORS.primaryLight,
  },

  resultIconLarge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  resultContent: {
    flex: 1,
  },

  resultTitle: {
    fontSize: 15,
    fontWeight: '800',
  },

  resultText: {
    marginTop: 3,
    fontSize: 13,
    color: COLORS.secondaryText,
  },

  nextButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  nextButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
    marginRight: 8,
  },

  finishedContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  finishedIcon: {
    width: 110,
    height: 110,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  finishedEmoji: {
    fontSize: 58,
  },

  finishedTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.text,
  },

  finishedDescription: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 30,
  },

  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },

  secondaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  secondaryButtonPressed: {
    opacity: 0.7,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
});
