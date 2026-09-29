import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useMemo, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOTAL_QUESTIONS = 10;
const MIN_TABLE = 1;
const MAX_TABLE = 20;

type Question = {
    id: string;
    table: number;
    multiplier: number;
    answer: number;
    options: number[];
};

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

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

function shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
}

function getRandomNumber(
    min: number,
    max: number,
): number {
    return (
        Math.floor(
            Math.random() * (max - min + 1),
        ) + min
    );
}

/* ---------------------------------------------------------
   Question Generator
--------------------------------------------------------- */

function createQuestion(): Question {
    const table = getRandomNumber(
        MIN_TABLE,
        MAX_TABLE,
    );

    const multiplier = getRandomNumber(1, 12);

    const answer = table * multiplier;

    const wrongAnswers = new Set<number>();

    while (wrongAnswers.size < 2) {
        const variation = getRandomNumber(-5, 5);

        const wrongAnswer =
            answer + variation;

        if (
            wrongAnswer > 0 &&
            wrongAnswer !== answer
        ) {
            wrongAnswers.add(wrongAnswer);
        }
    }

    const options = shuffle([
        answer,
        ...Array.from(wrongAnswers),
    ]);

    return {
        id: `${table}-${multiplier}-${options.join('-')}`,
        table,
        multiplier,
        answer,
        options,
    };
}

/* ---------------------------------------------------------
   Practice Session
--------------------------------------------------------- */

function createPracticeSession(): Question[] {
    const questions: Question[] = [];
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

export default function TablesPracticeScreen() {
    const [questions, setQuestions] =
        useState<Question[]>(() =>
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
       Automatic Question Audio
    ------------------------------------------------------- */

    useEffect(() => {
        if (!question || finished) {
            return;
        }

        Speech.stop();

        const timer = setTimeout(() => {
            Speech.speak(
                `${question.table} times ${question.multiplier} equals what?`,
                {
                    language: 'en-US',
                    rate: 0.72,
                    pitch: 1.15,
                },
            );
        }, 250);

        return () => {
            clearTimeout(timer);
            Speech.stop();
        };
    }, [questionIndex, finished]);

    /* -------------------------------------------------------
       Question Text
    ------------------------------------------------------- */

    const questionText = useMemo(() => {
        if (!question) {
            return '';
        }

        return `${question.table} × ${question.multiplier} = ?`;
    }, [question]);

    /* -------------------------------------------------------
       Answer Handling
    ------------------------------------------------------- */

    const handleAnswer = (answer: number) => {
        if (!question) {
            return;
        }

        /*
         * Don't allow another answer after
         * the correct answer.
         */
        if (
            selectedAnswer === question.answer
        ) {
            return;
        }

        /*
         * After second wrong attempt,
         * answer is already revealed.
         */
        if (wrongAttempts >= 2) {
            return;
        }

        Speech.stop();

        const isCorrect =
            answer === question.answer;

        /* -----------------------------------------------------
           Correct
        ----------------------------------------------------- */

        if (isCorrect) {
            setSelectedAnswer(answer);
            setShowResult(true);

            Speech.speak('Great job!', {
                language: 'en-US',
                rate: 0.72,
                pitch: 1.3,
            });

            return;
        }

        /* -----------------------------------------------------
           Wrong
        ----------------------------------------------------- */

        const newWrongAttempts =
            wrongAttempts + 1;

        setWrongAttempts(
            newWrongAttempts,
        );

        setSelectedAnswer(answer);

        /*
         * First wrong answer:
         * allow another attempt.
         */
        if (newWrongAttempts === 1) {
            Speech.speak('Try again!', {
                language: 'en-US',
                rate: 0.72,
                pitch: 1.2,
            });

            return;
        }

        /*
         * Second wrong answer:
         * reveal answer.
         */
        if (newWrongAttempts >= 2) {
            setShowResult(true);

            Speech.speak(
                `The correct answer is ${question.answer}`,
                {
                    language: 'en-US',
                    rate: 0.72,
                    pitch: 1.15,
                },
            );
        }
    };

    /* -------------------------------------------------------
       Next Question
    ------------------------------------------------------- */

    const handleNext = () => {
        Speech.stop();

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
        Speech.stop();

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
       Hear Question Again
    ------------------------------------------------------- */

    const hearQuestion = () => {
        if (!question) {
            return;
        }

        Speech.stop();

        Speech.speak(
            `${question.table} times ${question.multiplier} equals what?`,
            {
                language: 'en-US',
                rate: 0.72,
                pitch: 1.15,
            },
        );
    };

    /* -------------------------------------------------------
       Option Style
    ------------------------------------------------------- */

    const getOptionStyle = (
        option: number,
    ) => {
        /*
         * Correct answer after result.
         */
        if (
            (showResult || wrongAttempts >= 2) &&
            option === question.answer
        ) {
            return [
                styles.option,
                styles.correctOption,
            ];
        }

        /*
         * Selected wrong answer.
         */
        if (
            selectedAnswer === option &&
            option !== question.answer
        ) {
            return [
                styles.option,
                styles.wrongOption,
            ];
        }

        return styles.option;
    };

    /* -------------------------------------------------------
       Option Icon
    ------------------------------------------------------- */

    const getOptionIcon = (
        option: number,
    ) => {
        if (
            (showResult || wrongAttempts >= 2) &&
            option === question.answer
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
            selectedAnswer === option &&
            option !== question.answer
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
                    <View style={styles.finishedIcon}>
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
                        style={
                            styles.finishedDescription
                        }
                    >
                        You finished your tables
                        practice.
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
                            style={
                                styles.primaryButtonText
                            }
                        >
                            Practice Again
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            Speech.stop();
                            router.back();
                        }}
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
                            Back to Tables
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
                        onPress={() => {
                            Speech.stop();
                            router.back();
                        }}
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

                    <Text
                        style={styles.headerTitle}
                    >
                        Tables Practice
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
                            Question {questionNumber}{' '}
                            of {TOTAL_QUESTIONS}
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
                        MULTIPLICATION
                    </Text>

                    <Text
                        style={styles.questionText}
                    >
                        What is
                    </Text>

                    <View
                        style={styles.equationCard}
                    >
                        <Text
                            style={styles.tableNumber}
                        >
                            {question.table}
                        </Text>

                        <Text
                            style={styles.operator}
                        >
                            ×
                        </Text>

                        <Text
                            style={styles.tableNumber}
                        >
                            {question.multiplier}
                        </Text>

                        <Text
                            style={styles.operator}
                        >
                            =
                        </Text>

                        <Text
                            style={styles.questionMark}
                        >
                            ?
                        </Text>
                    </View>

                    <Text
                        style={styles.helperText}
                    >
                        Choose the correct answer
                    </Text>

                    <Pressable
                        onPress={hearQuestion}
                        style={({ pressed }) => [
                            styles.hearButton,
                            pressed &&
                            styles.hearButtonPressed,
                        ]}
                    >
                        <Ionicons
                            name="volume-high"
                            size={18}
                            color={COLORS.primary}
                        />

                        <Text
                            style={styles.hearButtonText}
                        >
                            Hear question
                        </Text>
                    </Pressable>
                </View>

                {/* Try Again */}

                {wrongAttempts === 1 &&
                    selectedAnswer !==
                    question.answer && (
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
                                Not quite! Try another
                                answer.
                            </Text>
                        </View>
                    )}

                {/* Options */}

                <View
                    style={styles.optionsSection}
                >
                    {question.options.map(
                        (option, optionIndex) => {
                            const isCorrect =
                                option ===
                                question.answer;

                            const isWrongSelected =
                                selectedAnswer === option &&
                                !isCorrect;

                            const disabled =
                                selectedAnswer ===
                                question.answer ||
                                wrongAttempts >= 2;

                            return (
                                <Pressable
                                    key={`${question.id}-${option}`}
                                    disabled={disabled}
                                    onPress={() =>
                                        handleAnswer(option)
                                    }
                                    style={({ pressed }) => [
                                        getOptionStyle(option),
                                        pressed &&
                                        !disabled &&
                                        styles.optionPressed,
                                    ]}
                                >
                                    <View
                                        style={
                                            styles.optionNumber
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.optionNumberText,
                                                isCorrect &&
                                                (showResult ||
                                                    wrongAttempts >=
                                                    2) &&
                                                styles.correctOptionText,
                                                isWrongSelected &&
                                                styles.wrongOptionText,
                                            ]}
                                        >
                                            {optionIndex + 1}
                                        </Text>
                                    </View>

                                    <Text
                                        style={[
                                            styles.optionText,
                                            isCorrect &&
                                            (showResult ||
                                                wrongAttempts >=
                                                2) &&
                                            styles.correctOptionText,
                                            isWrongSelected &&
                                            styles.wrongOptionText,
                                        ]}
                                    >
                                        {option}
                                    </Text>

                                    <View
                                        style={
                                            styles.optionResult
                                        }
                                    >
                                        {getOptionIcon(option)}
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
                                question.answer
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
                                        question.answer
                                        ? 'checkmark'
                                        : 'information'
                                }
                                size={22}
                                color={
                                    selectedAnswer ===
                                        question.answer
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
                                                question.answer
                                                ? COLORS.success
                                                : COLORS.primary,
                                    },
                                ]}
                            >
                                {selectedAnswer ===
                                    question.answer
                                    ? 'Great job!'
                                    : 'Here is the answer'}
                            </Text>

                            <Text
                                style={styles.resultText}
                            >
                                {selectedAnswer ===
                                    question.answer
                                    ? `${question.table} × ${question.multiplier} = ${question.answer}`
                                    : `${question.table} × ${question.multiplier} = ${question.answer}`}
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
                            style={
                                styles.nextButtonText
                            }
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
        backgroundColor:
            COLORS.primary,
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
        marginBottom: 8,
    },

    questionText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.secondaryText,
    },

    equationCard: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 22,
        backgroundColor:
            COLORS.primaryLight,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    tableNumber: {
        fontSize: 42,
        fontWeight: '900',
        color: COLORS.primary,
        minWidth: 48,
        textAlign: 'center',
    },

    operator: {
        marginHorizontal: 7,
        fontSize: 30,
        fontWeight: '700',
        color: COLORS.secondaryText,
    },

    questionMark: {
        fontSize: 42,
        fontWeight: '900',
        color: COLORS.primary,
        minWidth: 48,
        textAlign: 'center',
    },

    helperText: {
        marginTop: 14,
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.secondaryText,
    },

    hearButton: {
        marginTop: 15,
        height: 40,
        paddingHorizontal: 14,
        borderRadius: 13,
        backgroundColor:
            COLORS.primaryLight,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    hearButtonPressed: {
        opacity: 0.75,
        transform: [
            {
                scale: 0.97,
            },
        ],
    },

    hearButtonText: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
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
        backgroundColor: COLORS.white,
        paddingHorizontal: 18,

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

    optionNumber: {
        width: 38,
        height: 38,
        borderRadius: 13,
        backgroundColor:
            COLORS.primaryLight,

        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
    },

    optionNumberText: {
        fontSize: 16,
        fontWeight: '900',
        color: COLORS.primary,
    },

    optionText: {
        flex: 1,
        fontSize: 18,
        fontWeight: '800',
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
        fontSize: 14,
        fontWeight: '600',
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
