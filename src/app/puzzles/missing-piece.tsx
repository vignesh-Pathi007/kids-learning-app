import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
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

type PuzzleQuestion = {
    id: number;
    sequence: string[];
    correctAnswer: string;
    options: string[];
};

/* ---------------------------------------------------------
   Puzzle Data
--------------------------------------------------------- */

const PUZZLES: PuzzleQuestion[] = [
    {
        id: 1,
        sequence: ['🍎', '🍎', '?', '🍎'],
        correctAnswer: '🍎',
        options: ['🍎', '🍌', '🍊'],
    },

    {
        id: 2,
        sequence: ['🐶', '?', '🐶', '🐶'],
        correctAnswer: '🐶',
        options: ['🐱', '🐶', '🐰'],
    },

    {
        id: 3,
        sequence: ['⭐', '⭐', '?', '⭐'],
        correctAnswer: '⭐',
        options: ['🌙', '☀️', '⭐'],
    },

    {
        id: 4,
        sequence: ['🚗', '?', '🚗', '🚗'],
        correctAnswer: '🚗',
        options: ['🚌', '🚗', '🚲'],
    },

    {
        id: 5,
        sequence: ['🍓', '🍓', '🍓', '?'],
        correctAnswer: '🍓',
        options: ['🍉', '🍓', '🍍'],
    },

    {
        id: 6,
        sequence: ['🐼', '?', '🐼', '🐼'],
        correctAnswer: '🐼',
        options: ['🐯', '🐼', '🦁'],
    },

    {
        id: 7,
        sequence: ['🌸', '🌸', '?', '🌸'],
        correctAnswer: '🌸',
        options: ['🌻', '🌷', '🌸'],
    },

    {
        id: 8,
        sequence: ['⚽', '?', '⚽', '⚽'],
        correctAnswer: '⚽',
        options: ['🏀', '⚽', '🏈'],
    },

    {
        id: 9,
        sequence: ['🐸', '🐸', '🐸', '?'],
        correctAnswer: '🐸',
        options: ['🐵', '🐸', '🐹'],
    },

    {
        id: 10,
        sequence: ['🍕', '?', '🍕', '🍕'],
        correctAnswer: '🍕',
        options: ['🍔', '🌭', '🍕'],
    },
];

const TOTAL_QUESTIONS = PUZZLES.length;

/* ---------------------------------------------------------
   Shuffle
--------------------------------------------------------- */

function shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
}

/* ---------------------------------------------------------
   Screen
--------------------------------------------------------- */

export default function MissingPieceScreen() {
    const [questions, setQuestions] = useState<PuzzleQuestion[]>(
        () => shuffle(PUZZLES),
    );

    const [questionIndex, setQuestionIndex] = useState(0);

    const [selectedAnswer, setSelectedAnswer] =
        useState<string | null>(null);

    const [wrongAttempts, setWrongAttempts] = useState(0);

    const [showResult, setShowResult] = useState(false);

    const [finished, setFinished] = useState(false);

    const question = questions[questionIndex];

    const questionNumber = questionIndex + 1;

    const progress =
        (questionNumber / TOTAL_QUESTIONS) * 100;

    /* -------------------------------------------------------
       Shuffle options for current question
    ------------------------------------------------------- */

    const options = useMemo(() => {
        if (!question) {
            return [];
        }

        return shuffle(question.options);
    }, [question]);

    /* -------------------------------------------------------
       Answer
    ------------------------------------------------------- */

    const handleAnswer = (answer: string) => {
        if (!question) {
            return;
        }

        /*
         * Don't allow another answer after
         * the correct answer or second wrong attempt.
         */
        if (
            selectedAnswer === question.correctAnswer ||
            wrongAttempts >= 2
        ) {
            return;
        }

        const isCorrect =
            answer === question.correctAnswer;

        setSelectedAnswer(answer);

        /* Correct */

        if (isCorrect) {
            setShowResult(true);
            return;
        }

        /* Wrong */

        const newWrongAttempts =
            wrongAttempts + 1;

        setWrongAttempts(newWrongAttempts);

        /*
         * First wrong attempt:
         * allow another try.
         */

        if (newWrongAttempts === 1) {
            return;
        }

        /*
         * Second wrong attempt:
         * reveal answer.
         */

        setShowResult(true);
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
       Practice Again
    ------------------------------------------------------- */

    const handlePracticeAgain = () => {
        setQuestions(shuffle(PUZZLES));

        setQuestionIndex(0);
        setSelectedAnswer(null);
        setWrongAttempts(0);
        setShowResult(false);
        setFinished(false);
    };

    /* -------------------------------------------------------
       Option Style
    ------------------------------------------------------- */

    const getOptionStyle = (
        option: string,
    ) => {
        const isCorrect =
            option === question.correctAnswer;

        const isSelected =
            option === selectedAnswer;

        /*
         * Correct answer after result
         */

        if (
            showResult &&
            isCorrect
        ) {
            return [
                styles.option,
                styles.correctOption,
            ];
        }

        /*
         * Selected wrong answer
         */

        if (
            isSelected &&
            !isCorrect
        ) {
            return [
                styles.option,
                styles.wrongOption,
            ];
        }

        return styles.option;
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
                <View
                    style={styles.finishedContainer}
                >
                    <View
                        style={styles.finishedIcon}
                    >
                        <Text
                            style={styles.finishedEmoji}
                        >
                            🎉
                        </Text>
                    </View>

                    <Text
                        style={styles.finishedTitle}
                    >
                        Great job!
                    </Text>

                    <Text
                        style={styles.finishedDescription}
                    >
                        You completed the Missing Piece
                        puzzles!
                    </Text>

                    <Pressable
                        onPress={handlePracticeAgain}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            pressed &&
                            styles.buttonPressed,
                        ]}
                    >
                        <Text
                            style={
                                styles.primaryButtonText
                            }
                        >
                            Play Again
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            router.back()
                        }
                        style={({ pressed }) => [
                            styles.secondaryButton,
                            pressed &&
                            styles.buttonPressed,
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
                        onPress={() =>
                            router.back()
                        }
                        style={({ pressed }) => [
                            styles.headerButton,
                            pressed &&
                            styles.buttonPressed,
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
                        Missing Piece
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
                            Puzzle {questionNumber} of{' '}
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

                {/* Puzzle Card */}

                <View
                    style={styles.puzzleCard}
                >
                    <Text
                        style={styles.puzzleLabel}
                    >
                        MISSING PIECE
                    </Text>

                    <Text
                        style={styles.questionText}
                    >
                        Which piece is missing?
                    </Text>

                    {/* Sequence */}

                    <View
                        style={styles.sequence}
                    >
                        {question.sequence.map(
                            (item, index) => {
                                const isMissing =
                                    item === '?';

                                return (
                                    <View
                                        key={`${question.id}-${index}`}
                                        style={[
                                            styles.sequenceBox,
                                            isMissing &&
                                            styles.missingBox,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.sequenceEmoji,
                                                isMissing &&
                                                styles.missingText,
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                    </View>
                                );
                            },
                        )}
                    </View>

                    <Text
                        style={styles.helperText}
                    >
                        Choose the piece that completes
                        the puzzle.
                    </Text>
                </View>

                {/* Try Again */}

                {wrongAttempts === 1 &&
                    !showResult && (
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
                                style={
                                    styles.tryAgainText
                                }
                            >
                                Not quite! Try another one.
                            </Text>
                        </View>
                    )}

                {/* Options */}

                <View
                    style={styles.optionsSection}
                >
                    <Text
                        style={styles.chooseLabel}
                    >
                        CHOOSE A PIECE
                    </Text>

                    <View
                        style={styles.optionsRow}
                    >
                        {options.map(
                            option => {
                                const isCorrect =
                                    option ===
                                    question.correctAnswer;

                                const isSelected =
                                    option ===
                                    selectedAnswer;

                                const disabled =
                                    selectedAnswer ===
                                    question.correctAnswer ||
                                    wrongAttempts >= 2;

                                return (
                                    <Pressable
                                        key={option}
                                        disabled={disabled}
                                        onPress={() =>
                                            handleAnswer(
                                                option,
                                            )
                                        }
                                        style={({ pressed }) => [
                                            getOptionStyle(
                                                option,
                                            ),
                                            pressed &&
                                            !disabled &&
                                            styles.optionPressed,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.optionEmoji,
                                                isCorrect &&
                                                showResult &&
                                                styles.correctOptionText,
                                                isSelected &&
                                                !isCorrect &&
                                                styles.wrongOptionText,
                                            ]}
                                        >
                                            {option}
                                        </Text>

                                        {showResult &&
                                            isCorrect && (
                                                <View
                                                    style={
                                                        styles.resultIcon
                                                    }
                                                >
                                                    <Ionicons
                                                        name="checkmark"
                                                        size={18}
                                                        color={
                                                            COLORS.success
                                                        }
                                                    />
                                                </View>
                                            )}

                                        {isSelected &&
                                            !isCorrect && (
                                                <View
                                                    style={
                                                        styles.resultIcon
                                                    }
                                                >
                                                    <Ionicons
                                                        name="close"
                                                        size={18}
                                                        color={
                                                            COLORS.error
                                                        }
                                                    />
                                                </View>
                                            )}
                                    </Pressable>
                                );
                            },
                        )}
                    </View>
                </View>

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

                        <View
                            style={
                                styles.resultContent
                            }
                        >
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

                            <Text
                                style={styles.resultText}
                            >
                                {selectedAnswer ===
                                    question.correctAnswer
                                    ? 'You found the missing piece!'
                                    : `The missing piece is ${question.correctAnswer}`}
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
                            styles.buttonPressed,
                        ]}
                    >
                        <Text
                            style={
                                styles.nextButtonText
                            }
                        >
                            {questionNumber ===
                                TOTAL_QUESTIONS
                                ? 'Finish'
                                : 'Next Puzzle'}
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
        backgroundColor:
            COLORS.background,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },

    /* Header */

    header: {
        height: 52,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 20,
    },

    headerButton: {
        width: 44,
        height: 44,

        borderRadius: 15,

        backgroundColor:
            COLORS.white,

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

    buttonPressed: {
        opacity: 0.7,

        transform: [
            {
                scale: 0.97,
            },
        ],
    },

    /* Progress */

    progressSection: {
        marginBottom: 20,
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

    /* Puzzle */

    puzzleCard: {
        backgroundColor:
            COLORS.white,

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

    puzzleLabel: {
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

    sequence: {
        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'center',

        gap: 10,

        marginTop: 26,
    },

    sequenceBox: {
        width: 62,
        height: 62,

        borderRadius: 18,

        backgroundColor:
            COLORS.primaryLight,

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor:
            COLORS.primaryLight,
    },

    missingBox: {
        backgroundColor:
            '#F4F3FF',

        borderWidth: 2,

        borderColor:
            COLORS.primary,

        borderStyle: 'dashed',
    },

    sequenceEmoji: {
        fontSize: 34,
    },

    missingText: {
        fontSize: 30,

        fontWeight: '900',

        color: COLORS.primary,
    },

    helperText: {
        marginTop: 18,

        fontSize: 13,

        fontWeight: '600',

        color: COLORS.secondaryText,

        textAlign: 'center',
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

        backgroundColor:
            COLORS.white,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 7,
    },

    tryAgainText: {
        fontSize: 13,

        fontWeight: '700',

        color: COLORS.primary,
    },

    /* Options */

    optionsSection: {
        marginTop: 22,
    },

    chooseLabel: {
        fontSize: 11,

        fontWeight: '800',

        letterSpacing: 1.3,

        color: COLORS.secondaryText,

        marginBottom: 10,
    },

    optionsRow: {
        flexDirection: 'row',

        gap: 10,
    },

    option: {
        flex: 1,

        minHeight: 100,

        borderRadius: 20,

        backgroundColor:
            COLORS.white,

        borderWidth: 1,

        borderColor:
            COLORS.border,

        alignItems: 'center',
        justifyContent: 'center',

        position: 'relative',
    },

    optionPressed: {
        transform: [
            {
                scale: 0.96,
            },
        ],

        opacity: 0.8,
    },

    optionEmoji: {
        fontSize: 48,
    },

    correctOption: {
        backgroundColor:
            COLORS.successLight,

        borderColor:
            COLORS.success,

        borderWidth: 2,
    },

    wrongOption: {
        backgroundColor:
            COLORS.errorLight,

        borderColor:
            COLORS.error,

        borderWidth: 2,
    },

    correctOptionText: {
        color: COLORS.success,
    },

    wrongOptionText: {
        color: COLORS.error,
    },

    resultIcon: {
        position: 'absolute',

        right: 8,
        top: 8,

        width: 25,
        height: 25,

        borderRadius: 12.5,

        backgroundColor:
            COLORS.white,

        alignItems: 'center',
        justifyContent: 'center',
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

    resultIconLarge: {
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

    secondaryButtonText: {
        fontSize: 15,

        fontWeight: '700',

        color: COLORS.text,
    },
});