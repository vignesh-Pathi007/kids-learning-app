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

const TOTAL_QUESTIONS = 10;

type DifferenceItem = {
    id: string;
    emoji: string;
};

type DifferenceQuestion = {
    id: string;
    items: DifferenceItem[];
    correctIndex: number;
};

const puzzleSets = [
    {
        normal: '🍎',
        different: '🍊',
    },
    {
        normal: '🐶',
        different: '🐱',
    },
    {
        normal: '⭐',
        different: '🌙',
    },
    {
        normal: '🚗',
        different: '🚌',
    },
    {
        normal: '🍌',
        different: '🍎',
    },
    {
        normal: '🐟',
        different: '🐠',
    },
    {
        normal: '🌸',
        different: '🌻',
    },
    {
        normal: '⚽',
        different: '🏀',
    },
    {
        normal: '🦋',
        different: '🐝',
    },
    {
        normal: '🐘',
        different: '🦒',
    },
    {
        normal: '🍕',
        different: '🍔',
    },
    {
        normal: '☀️',
        different: '🌈',
    },
];

function shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
}

function createQuestion(): DifferenceQuestion {
    const set =
        puzzleSets[
        Math.floor(Math.random() * puzzleSets.length)
        ];

    const itemCount =
        Math.random() > 0.5 ? 4 : 5;

    const correctIndex =
        Math.floor(Math.random() * itemCount);

    const items: DifferenceItem[] = Array.from(
        { length: itemCount },
        (_, index) => ({
            id: `${Date.now()}-${Math.random()}-${index}`,
            emoji:
                index === correctIndex
                    ? set.different
                    : set.normal,
        }),
    );

    return {
        id: `${Date.now()}-${Math.random()}`,
        items,
        correctIndex,
    };
}

function createPracticeSession(): DifferenceQuestion[] {
    const questions: DifferenceQuestion[] = [];

    while (questions.length < TOTAL_QUESTIONS) {
        questions.push(createQuestion());
    }

    return questions;
}

export default function DifferentOneScreen() {
    const [questions, setQuestions] =
        useState<DifferenceQuestion[]>(() =>
            createPracticeSession(),
        );

    const [questionIndex, setQuestionIndex] =
        useState(0);

    const [selectedIndex, setSelectedIndex] =
        useState<number | null>(null);

    const [wrongAttempts, setWrongAttempts] =
        useState(0);

    const [showResult, setShowResult] =
        useState(false);

    const [finished, setFinished] =
        useState(false);

    const question = questions[questionIndex];

    const questionNumber = questionIndex + 1;

    const progress =
        (questionNumber / TOTAL_QUESTIONS) * 100;

    const questionText = useMemo(
        () => 'Can you find the different one?',
        [],
    );

    /* -------------------------------------------------------
       Answer
    ------------------------------------------------------- */

    const handleAnswer = (index: number) => {
        if (!question) {
            return;
        }

        if (
            selectedIndex === question.correctIndex
        ) {
            return;
        }

        if (wrongAttempts >= 2) {
            return;
        }

        const isCorrect =
            index === question.correctIndex;

        setSelectedIndex(index);

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

        setSelectedIndex(null);
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
        setSelectedIndex(null);
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
                        Great job!
                    </Text>

                    <Text style={styles.finishedDescription}>
                        You finished the Find the Difference
                        puzzle.
                    </Text>

                    <Pressable
                        onPress={handlePracticeAgain}
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
                        <Text style={styles.secondaryButtonText}>
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
                        Find the Difference
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
                    <View style={styles.questionIcon}>
                        <Ionicons
                            name="search-outline"
                            size={25}
                            color={COLORS.primary}
                        />
                    </View>

                    <Text style={styles.questionLabel}>
                        FIND IT
                    </Text>

                    <Text style={styles.questionText}>
                        {questionText}
                    </Text>

                    <Text style={styles.questionHint}>
                        Tap the one that is different.
                    </Text>
                </View>

                {/* Puzzle */}

                <View style={styles.puzzleCard}>
                    <View style={styles.itemsGrid}>
                        {question.items.map(
                            (item, index) => {
                                const isCorrect =
                                    index ===
                                    question.correctIndex;

                                const isSelected =
                                    selectedIndex === index;

                                const showCorrect =
                                    showResult && isCorrect;

                                const showWrong =
                                    isSelected && !isCorrect;

                                return (
                                    <Pressable
                                        key={item.id}
                                        disabled={
                                            showResult ||
                                            wrongAttempts >= 2
                                        }
                                        onPress={() =>
                                            handleAnswer(index)
                                        }
                                        style={({ pressed }) => [
                                            styles.itemButton,

                                            showCorrect &&
                                            styles.correctItem,

                                            showWrong &&
                                            styles.wrongItem,

                                            pressed &&
                                            !showResult &&
                                            wrongAttempts < 2 &&
                                            styles.itemPressed,
                                        ]}
                                    >
                                        <Text
                                            style={styles.itemEmoji}
                                        >
                                            {item.emoji}
                                        </Text>

                                        {(showCorrect ||
                                            showWrong) && (
                                                <View
                                                    style={
                                                        styles.resultIcon
                                                    }
                                                >
                                                    <Ionicons
                                                        name={
                                                            showCorrect
                                                                ? 'checkmark-circle'
                                                                : 'close-circle'
                                                        }
                                                        size={25}
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
                </View>

                {/* Try Again */}

                {wrongAttempts === 1 &&
                    selectedIndex !==
                    question.correctIndex && (
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
                            selectedIndex ===
                                question.correctIndex
                                ? styles.correctResult
                                : styles.answerResult,
                        ]}
                    >
                        <View style={styles.resultIconLarge}>
                            <Ionicons
                                name={
                                    selectedIndex ===
                                        question.correctIndex
                                        ? 'checkmark'
                                        : 'information'
                                }
                                size={22}
                                color={
                                    selectedIndex ===
                                        question.correctIndex
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
                                            selectedIndex ===
                                                question.correctIndex
                                                ? COLORS.success
                                                : COLORS.primary,
                                    },
                                ]}
                            >
                                {selectedIndex ===
                                    question.correctIndex
                                    ? 'Great job!'
                                    : 'Here is the answer'}
                            </Text>

                            <Text style={styles.resultText}>
                                {selectedIndex ===
                                    question.correctIndex
                                    ? 'You found the different one!'
                                    : 'The highlighted item is different.'}
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
        letterSpacing: 1.5,
        color: COLORS.secondaryText,
    },

    questionText: {
        marginTop: 7,
        fontSize: 22,
        lineHeight: 29,
        fontWeight: '900',
        color: COLORS.text,
        textAlign: 'center',
    },

    questionHint: {
        marginTop: 5,
        fontSize: 13,
        color: COLORS.secondaryText,
        textAlign: 'center',
    },

    puzzleCard: {
        marginTop: 16,
        backgroundColor: COLORS.white,
        borderRadius: 26,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 14,
    },

    itemButton: {
        width: 125,
        height: 125,
        borderRadius: 24,
        backgroundColor: COLORS.background,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    itemEmoji: {
        fontSize: 58,
    },

    itemPressed: {
        transform: [{ scale: 0.95 }],
        opacity: 0.8,
    },

    correctItem: {
        backgroundColor: COLORS.successLight,
        borderColor: COLORS.success,
    },

    wrongItem: {
        backgroundColor: COLORS.errorLight,
        borderColor: COLORS.error,
    },

    resultIcon: {
        position: 'absolute',
        right: 7,
        top: 7,
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
