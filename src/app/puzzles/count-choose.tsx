import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CountQuestion = {
  id: string;
  emoji: string;
  count: number;
  options: number[];
};

const TOTAL_QUESTIONS = 10;

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

const OBJECTS = [
  '🍎',
  '🍊',
  '⭐',
  '🐻',
  '🦋',
  '🌸',
  '🍓',
  '🐶',
  '🚗',
  '🎈',
];

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function createQuestion(): CountQuestion {
  const count =
    Math.floor(Math.random() * 10) + 1;

  const emoji =
    OBJECTS[
      Math.floor(Math.random() * OBJECTS.length)
    ];

  /*
   * Create wrong answers close to the correct
   * answer so the child actually has to count.
   */
  const wrongAnswers = new Set<number>();

  while (wrongAnswers.size < 2) {
    const variation =
      Math.floor(Math.random() * 5) + 1;

    const direction =
      Math.random() > 0.5 ? 1 : -1;

    const wrong =
      count + variation * direction;

    if (
      wrong >= 1 &&
      wrong <= 10 &&
      wrong !== count
    ) {
      wrongAnswers.add(wrong);
    }
  }

  const options = shuffle([
    count,
    ...Array.from(wrongAnswers),
  ]);

  return {
    id: `${emoji}-${count}-${options.join('-')}`,
    emoji,
    count,
    options,
  };
}

/* ---------------------------------------------------------
   Create Unique Session
--------------------------------------------------------- */

function createPracticeSession(): CountQuestion[] {
  const questions: CountQuestion[] = [];
  const usedIds = new Set<string>();

  let attempts = 0;

  while (
    questions.length < TOTAL_QUESTIONS &&
    attempts < 500
  ) {
    attempts++;

    const question = createQuestion();

    if (!usedIds.has(question.id)) {
      usedIds.add(question.id);
      questions.push(question);
    }
  }

  return questions;
}

/* ---------------------------------------------------------
   Screen
--------------------------------------------------------- */

export default function CountChooseScreen() {
  const [questions, setQuestions] =
    useState<CountQuestion[]>(() =>
      createPracticeSession(),
    );

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [wrongAttempts, setWrongAttempts] =
    useState(0);

  const [showResult, setShowResult] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const question =
    questions[questionIndex];

  const questionNumber =
    questionIndex + 1;

  const progress =
    (questionNumber / TOTAL_QUESTIONS) * 100;

  /* -------------------------------------------------------
     Automatic Question Reading
  ------------------------------------------------------- */

  /*
   * No sound is used here because you said puzzles
   * don't need sound.
   *
   * If you want voice later, we can add expo-speech
   * without changing the question logic.
   */

  /* -------------------------------------------------------
     Question Text
  ------------------------------------------------------- */

  const questionText = useMemo(() => {
    if (!question) {
      return '';
    }

    return `How many ${question.emoji} are there?`;
  }, [question]);

  /* -------------------------------------------------------
     Answer Handling
  ------------------------------------------------------- */

  const handleAnswer = (answer: number) => {
    if (!question) {
      return;
    }

    /*
     * Correct answer already selected.
     */
    if (
      selectedAnswer === question.count
    ) {
      return;
    }

    /*
     * After second wrong attempt,
     * don't allow another answer.
     */
    if (wrongAttempts >= 2) {
      return;
    }

    const isCorrect =
      answer === question.count;

    /* -----------------------------------------------------
       Correct
    ----------------------------------------------------- */

    if (isCorrect) {
      setSelectedAnswer(answer);
      setShowResult(true);

      return;
    }

    /* -----------------------------------------------------
       Wrong
    ----------------------------------------------------- */

    const newWrongAttempts =
      wrongAttempts + 1;

    setWrongAttempts(newWrongAttempts);
    setSelectedAnswer(answer);

    /*
     * First wrong attempt:
     * allow another try.
     */
    if (newWrongAttempts === 1) {
      return;
    }

    /*
     * Second wrong attempt:
     * reveal the answer.
     */
    if (newWrongAttempts >= 2) {
      setShowResult(true);
    }
  };

  /* -------------------------------------------------------
     Next Question
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
     Practice Again
  ------------------------------------------------------- */

  const handlePracticeAgain = () => {
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
     Finished Screen
  ------------------------------------------------------- */

  if (finished) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={[
          'top',
          'left',
          'right',
        ]}
      >
        <View style={styles.finishedContainer}>

          <View style={styles.finishedIcon}>
            <Text style={styles.finishedEmoji}>
              🎉
            </Text>
          </View>

          <Text style={styles.finishedTitle}>
            Great job!
          </Text>

          <Text
            style={styles.finishedDescription}
          >
            You finished your counting puzzle!
          </Text>

          <Pressable
            onPress={handlePracticeAgain}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed &&
                styles.primaryButtonPressed,
            ]}
          >
            <Text
              style={styles.primaryButtonText}
            >
              Play Again
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed &&
                styles.secondaryButtonPressed,
            ]}
          >
            <Text
              style={
                styles.secondaryButtonText
              }
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

  /* -------------------------------------------------------
     Option Helpers
  ------------------------------------------------------- */

  const getOptionStyle = (
    answer: number,
  ) => {
    /*
     * Correct answer after result.
     */
    if (
      (showResult || wrongAttempts >= 2) &&
      answer === question.count
    ) {
      return [
        styles.option,
        styles.correctOption,
      ];
    }

    /*
     * Wrong selected answer.
     */
    if (
      selectedAnswer === answer &&
      answer !== question.count
    ) {
      return [
        styles.option,
        styles.wrongOption,
      ];
    }

    return styles.option;
  };

  const getOptionIcon = (
    answer: number,
  ) => {
    /*
     * Correct
     */
    if (
      (showResult || wrongAttempts >= 2) &&
      answer === question.count
    ) {
      return (
        <Ionicons
          name="checkmark-circle"
          size={25}
          color={COLORS.success}
        />
      );
    }

    /*
     * Wrong
     */
    if (
      selectedAnswer === answer &&
      answer !== question.count
    ) {
      return (
        <Ionicons
          name="close-circle"
          size={25}
          color={COLORS.error}
        />
      );
    }

    return null;
  };

  /* -------------------------------------------------------
     Main Screen
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >

        {/* Header */}

        <View style={styles.header}>

          <Pressable
            onPress={() => router.replace('/puzzles')}
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
            Count & Choose
          </Text>

          <View
            style={styles.headerSpacer}
          />

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
              Question {questionNumber} of{' '}
              {TOTAL_QUESTIONS}
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
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Question Card */}

        <View
          style={styles.questionCard}
        >

          <Text
            style={styles.questionLabel}
          >
            COUNT & CHOOSE
          </Text>

          <Text
            style={styles.questionText}
          >
            {questionText}
          </Text>

          {/* Objects */}

          <View
            style={styles.objectsContainer}
          >
            {Array.from({
              length: question.count,
            }).map((_, index) => (
              <View
                key={index}
                style={styles.objectCircle}
              >
                <Text
                  style={styles.objectEmoji}
                >
                  {question.emoji}
                </Text>
              </View>
            ))}
          </View>

        </View>

        {/* Try Again */}

        {wrongAttempts === 1 &&
          selectedAnswer !==
            question.count && (
            <View
              style={
                styles.tryAgainContainer
              }
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
                Not quite! Count again and
                try another answer.
              </Text>
            </View>
          )}

        {/* Options */}

        <View
          style={styles.optionsSection}
        >
          {question.options.map(
            (answer) => {
              const isCorrect =
                answer === question.count;

              const isWrongSelected =
                selectedAnswer === answer &&
                !isCorrect;

              const disabled =
                selectedAnswer ===
                  question.count ||
                wrongAttempts >= 2;

              return (
                <Pressable
                  key={`${question.id}-${answer}`}
                  disabled={disabled}
                  onPress={() =>
                    handleAnswer(answer)
                  }
                  style={({ pressed }) => [
                    getOptionStyle(answer),
                    pressed &&
                      !disabled &&
                      styles.optionPressed,
                  ]}
                >

                  <View
                    style={
                      styles.numberOptionCircle
                    }
                  >
                    <Text
                      style={[
                        styles.optionNumber,
                        isCorrect &&
                          (showResult ||
                            wrongAttempts >=
                              2) &&
                          styles.correctOptionText,
                        isWrongSelected &&
                          styles.wrongOptionText,
                      ]}
                    >
                      {answer}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.optionLabel,
                      isCorrect &&
                        (showResult ||
                          wrongAttempts >= 2) &&
                        styles.correctOptionText,
                      isWrongSelected &&
                        styles.wrongOptionText,
                    ]}
                  >
                    {answer === 1
                      ? 'object'
                      : 'objects'}
                  </Text>

                  <View
                    style={
                      styles.optionResult
                    }
                  >
                    {getOptionIcon(answer)}
                  </View>

                </Pressable>
              );
            },
          )}
        </View>

        {/* Result */}

        {showResult && (
          <View
            style={[
              styles.resultCard,
              selectedAnswer ===
                question.count
                ? styles.correctResult
                : styles.answerResult,
            ]}
          >

            <View
              style={styles.resultIcon}
            >
              <Ionicons
                name={
                  selectedAnswer ===
                  question.count
                    ? 'checkmark'
                    : 'information'
                }
                size={22}
                color={
                  selectedAnswer ===
                  question.count
                    ? COLORS.success
                    : COLORS.primary
                }
              />
            </View>

            <View
              style={styles.resultContent}
            >

              <Text
                style={[
                  styles.resultTitle,
                  {
                    color:
                      selectedAnswer ===
                      question.count
                        ? COLORS.success
                        : COLORS.primary,
                  },
                ]}
              >
                {selectedAnswer ===
                question.count
                  ? 'Great job!'
                  : 'Here is the answer'}
              </Text>

              <Text
                style={styles.resultText}
              >
                {selectedAnswer ===
                question.count
                  ? `There are ${question.count} ${
                      question.count === 1
                        ? 'object'
                        : 'objects'
                    }!`
                  : `The correct answer is ${question.count}.`}
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
                styles.nextPressed,
            ]}
          >

            <Text
              style={styles.nextButtonText}
            >
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
    paddingTop: 12,
    paddingBottom: 40,
  },

  /* Header */

  header: {
    height: 52,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 24,
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
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },

  headerSpacer: {
    width: 44,
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
    marginBottom: 22,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 9,
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

    backgroundColor:
      COLORS.primaryLight,

    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',

    borderRadius: 4,

    backgroundColor: COLORS.primary,
  },

  /* Question */

  questionCard: {
    backgroundColor: COLORS.white,

    borderRadius: 28,

    padding: 24,

    alignItems: 'center',

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

  questionLabel: {
    fontSize: 11,

    fontWeight: '800',

    letterSpacing: 1.5,

    color: COLORS.secondaryText,

    marginBottom: 10,
  },

  questionText: {
    fontSize: 20,

    lineHeight: 28,

    fontWeight: '800',

    color: COLORS.text,

    textAlign: 'center',
  },

  /* Objects */

  objectsContainer: {
    marginTop: 24,

    width: '100%',

    minHeight: 110,

    flexDirection: 'row',

    flexWrap: 'wrap',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 10,

    paddingHorizontal: 5,
  },

  objectCircle: {
    width: 54,
    height: 54,

    borderRadius: 18,

    backgroundColor:
      COLORS.primaryLight,

    alignItems: 'center',
    justifyContent: 'center',
  },

  objectEmoji: {
    fontSize: 31,
  },

  /* Try Again */

  tryAgainContainer: {
    marginTop: 14,

    paddingVertical: 10,
    paddingHorizontal: 14,

    borderRadius: 14,

    backgroundColor:
      COLORS.primaryLight,

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
    flex: 1,

    fontSize: 13,

    fontWeight: '700',

    color: COLORS.primary,
  },

  /* Options */

  optionsSection: {
    marginTop: 18,

    gap: 12,
  },

  option: {
    minHeight: 68,

    borderRadius: 18,

    backgroundColor:
      COLORS.white,

    paddingHorizontal: 16,

    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  optionPressed: {
    transform: [
      {
        scale: 0.98,
      },
    ],

    opacity: 0.8,
  },

  numberOptionCircle: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor:
      COLORS.primaryLight,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  optionNumber: {
    fontSize: 20,

    fontWeight: '900',

    color: COLORS.primary,
  },

  optionLabel: {
    flex: 1,

    fontSize: 16,

    fontWeight: '700',

    color: COLORS.text,
  },

  optionResult: {
    width: 28,

    alignItems: 'flex-end',
  },

  correctOption: {
    backgroundColor:
      COLORS.successLight,

    borderColor:
      COLORS.success,
  },

  wrongOption: {
    backgroundColor:
      COLORS.errorLight,

    borderColor:
      COLORS.error,
  },

  correctOptionText: {
    color: COLORS.success,
  },

  wrongOptionText: {
    color: COLORS.error,
  },

  /* Result */

  resultCard: {
    marginTop: 18,

    padding: 15,

    borderRadius: 18,

    flexDirection: 'row',

    alignItems: 'center',
  },

  correctResult: {
    backgroundColor:
      COLORS.successLight,
  },

  answerResult: {
    backgroundColor:
      COLORS.primaryLight,
  },

  resultIcon: {
    width: 40,
    height: 40,

    borderRadius: 14,

    backgroundColor:
      COLORS.white,

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

  /* Next */

  nextButton: {
    height: 56,

    borderRadius: 18,

    backgroundColor:
      COLORS.primary,

    marginTop: 16,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor:
      COLORS.primary,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.18,

    shadowRadius: 8,

    elevation: 3,
  },

  nextPressed: {
    opacity: 0.8,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  nextButtonText: {
    fontSize: 15,

    fontWeight: '800',

    color: COLORS.white,

    marginRight: 8,
  },

  /* Finished */

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

    backgroundColor:
      COLORS.primaryLight,

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

    backgroundColor:
      COLORS.primary,

    alignItems: 'center',

    justifyContent: 'center',
  },

  primaryButtonPressed: {
    opacity: 0.8,

    transform: [
      {
        scale: 0.98,
      },
    ],
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

    backgroundColor:
      COLORS.white,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 12,

    borderWidth: 1,

    borderColor:
      COLORS.border,
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