import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Pressable,
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

type PairItem = {
    id: string;
    emoji: string;
    word: string;
};

type Question = {
    item: PairItem;
    options: PairItem[];
    correctIndex: number;
};

const TOTAL_QUESTIONS = 10;

const PAIRS: PairItem[] = [
    { id: 'apple', emoji: '🍎', word: 'Apple' },
    { id: 'ball', emoji: '⚽', word: 'Ball' },
    { id: 'cat', emoji: '🐱', word: 'Cat' },
    { id: 'dog', emoji: '🐶', word: 'Dog' },
    { id: 'elephant', emoji: '🐘', word: 'Elephant' },
    { id: 'fish', emoji: '🐟', word: 'Fish' },
    { id: 'flower', emoji: '🌸', word: 'Flower' },
    { id: 'lion', emoji: '🦁', word: 'Lion' },
    { id: 'sun', emoji: '☀️', word: 'Sun' },
    { id: 'car', emoji: '🚗', word: 'Car' },
    { id: 'banana', emoji: '🍌', word: 'Banana' },
    { id: 'bird', emoji: '🐦', word: 'Bird' },
];

function shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
}

function createQuestion(): Question {
    const item =
        PAIRS[Math.floor(Math.random() * PAIRS.length)];

    const wrongOptions = shuffle(
        PAIRS.filter((option) => option.id !== item.id),
    ).slice(0, 2);

    const options = shuffle([
        item,
        ...wrongOptions,
    ]);

    return {
        item,
        options,
        correctIndex: options.findIndex(
            (option) => option.id === item.id,
        ),
    };
}

function createSession(): Question[] {
    const questions: Question[] = [];
    const used = new Set<string>();

    while (questions.length < TOTAL_QUESTIONS) {
        const question = createQuestion();

        if (!used.has(question.item.id)) {
            used.add(question.item.id);
            questions.push(question);
        }
    }

    return questions;
}

export default function MatchPairScreen() {
    const [questions, setQuestions] =
        useState<Question[]>(() => createSession());

    const [questionIndex, setQuestionIndex] =
        useState(0);

    const [selectedIndex, setSelectedIndex] =
        useState<number | null>(null);

    const [showResult, setShowResult] =
        useState(false);

    const [finished, setFinished] =
        useState(false);

    const question = questions[questionIndex];

    const questionNumber = questionIndex + 1;

    const progress =
        (questionNumber / TOTAL_QUESTIONS) * 100;

    const handleAnswer = (index: number) => {
        if (showResult) {
            return;
        }

        setSelectedIndex(index);
        setShowResult(true);
    };

    const handleNext = () => {
        if (questionIndex >= questions.length - 1) {
            setFinished(true);
            return;
        }

        setQuestionIndex(
            (previous) => previous + 1,
        );

        setSelectedIndex(null);
        setShowResult(false);
    };

    const handlePlayAgain = () => {
        setQuestions(createSession());
        setQuestionIndex(0);
        setSelectedIndex(null);
        setShowResult(false);
        setFinished(false);
    };

    const getOptionStyle = (index: number) => {
        if (!showResult) {
            return styles.option;
        }

        if (index === question.correctIndex) {
            return [
                styles.option,
                styles.correctOption,
            ];
        }

        if (index === selectedIndex) {
            return [
                styles.option,
                styles.wrongOption,
            ];
        }

        return styles.option;
    };

    const getOptionTextStyle = (index: number) => {
        if (
            showResult &&
            index === question.correctIndex
        ) {
            return [
                styles.optionText,
                styles.correctOptionText,
            ];
        }

        if (
            showResult &&
            index === selectedIndex
        ) {
            return [
                styles.optionText,
                styles.wrongOptionText,
            ];
        }

        return styles.optionText;
    };

    const getOptionIcon = (index: number) => {
        if (
            showResult &&
            index === question.correctIndex
        ) {
            return (
                <Ionicons
                    name="checkmark-circle"
                    size={25}
                    color={COLORS.success}
                />
            );
        }

        if (
            showResult &&
            index === selectedIndex
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
                        Great job!
                    </Text>

                    <Text style={styles.finishedDescription}>
                        You completed the Match the Pair
                        puzzle.
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

    const isCorrect =
        selectedIndex === question.correctIndex;

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'left', 'right']}
        >
            <View style={styles.container}>
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
                        Match the Pair
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

                {/* Question */}

                <View style={styles.questionCard}>
                    <Text style={styles.questionLabel}>
                        MATCH THE PAIR
                    </Text>

                    <Text style={styles.questionText}>
                        Find the word that matches
                        this picture.
                    </Text>

                    <View style={styles.pictureContainer}>
                        <Text style={styles.pictureEmoji}>
                            {question.item.emoji}
                        </Text>
                    </View>
                </View>

                {/* Options */}

                <View style={styles.optionsSection}>
                    {question.options.map(
                        (option, index) => (
                            <Pressable
                                key={option.id}
                                disabled={showResult}
                                onPress={() =>
                                    handleAnswer(index)
                                }
                                style={({ pressed }) => [
                                    getOptionStyle(index),
                                    pressed &&
                                    !showResult &&
                                    styles.optionPressed,
                                ]}
                            >
                                <Text
                                    style={getOptionTextStyle(index)}
                                >
                                    {option.word}
                                </Text>

                                <View
                                    style={styles.optionResult}
                                >
                                    {getOptionIcon(index)}
                                </View>
                            </Pressable>
                        ),
                    )}
                </View>

                {/* Result */}

                {showResult && (
                    <View
                        style={[
                            styles.resultCard,
                            isCorrect
                                ? styles.correctResult
                                : styles.answerResult,
                        ]}
                    >
                        <View style={styles.resultIcon}>
                            <Ionicons
                                name={
                                    isCorrect
                                        ? 'checkmark'
                                        : 'information'
                                }
                                size={22}
                                color={
                                    isCorrect
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
                                        color: isCorrect
                                            ? COLORS.success
                                            : COLORS.primary,
                                    },
                                ]}
                            >
                                {isCorrect
                                    ? 'Great job!'
                                    : 'Almost there!'}
                            </Text>

                            <Text style={styles.resultText}>
                                {isCorrect
                                    ? `Yes! ${question.item.emoji} matches ${question.item.word}.`
                                    : `The correct answer is ${question.item.word}.`}
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
                            pressed && styles.nextPressed,
                        ]}
                    >
                        <Text style={styles.nextButtonText}>
                            {questionNumber === TOTAL_QUESTIONS
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
            </View>
        </SafeAreaView>
    );
}

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
        marginBottom: 20,
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
        transform: [{ scale: 0.96 }],
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
        backgroundColor: COLORS.primaryLight,
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
        fontSize: 19,
        lineHeight: 27,
        fontWeight: '800',
        color: COLORS.text,
        textAlign: 'center',
    },

    pictureContainer: {
        width: 125,
        height: 125,
        borderRadius: 35,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },

    pictureEmoji: {
        fontSize: 68,
    },

    /* Options */

    optionsSection: {
        marginTop: 18,
        gap: 12,
    },

    option: {
        minHeight: 64,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    optionPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },

    optionText: {
        flex: 1,
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.text,
    },

    optionResult: {
        width: 28,
        alignItems: 'flex-end',
    },

    correctOption: {
        backgroundColor: COLORS.successLight,
        borderColor: COLORS.success,
    },

    wrongOption: {
        backgroundColor: COLORS.errorLight,
        borderColor: COLORS.error,
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
        backgroundColor: COLORS.successLight,
    },

    answerResult: {
        backgroundColor: COLORS.primaryLight,
    },

    resultIcon: {
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
        lineHeight: 19,
        color: COLORS.secondaryText,
    },

    /* Next */

    nextButton: {
        height: 56,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: COLORS.primary,
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
        transform: [{ scale: 0.98 }],
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
