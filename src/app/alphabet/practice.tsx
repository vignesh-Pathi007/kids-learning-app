import React, { useEffect, useMemo, useState } from 'react';
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
import * as Speech from 'expo-speech';

import { alphabetData } from '../../../data/alphabets';

type QuestionType =
    | 'letterToPicture'
    | 'pictureToLetter'
    | 'letterToWord'
    | 'missingLetter';

type QuestionOption = {
    text: string;
    emoji?: string;
};

type Question = {
    id: string;
    type: QuestionType;
    correctIndex: number;

    questionLetter: string;
    questionWord: string;
    questionEmoji: string;

    options: QuestionOption[];
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

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

function shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
}

function createQuestionId(
    type: QuestionType,
    correctLetter: string,
    options: QuestionOption[],
): string {
    const optionKey = options
        .map((option) => option.text)
        .sort()
        .join('|');

    return `${type} -${correctLetter} -${optionKey} `;
}

function getRandomItems(
    count: number,
    excludeIndex: number,
) {
    const available = alphabetData.filter(
        (_, index) => index !== excludeIndex,
    );

    return shuffle(available).slice(0, count);
}

/* ---------------------------------------------------------
   Question Generator
--------------------------------------------------------- */

function createQuestion(): Question {
    const correctIndexInData = Math.floor(
        Math.random() * alphabetData.length,
    );

    const correct =
        alphabetData[correctIndexInData];

    const questionTypes: QuestionType[] = [
        'letterToPicture',
        'pictureToLetter',
        'letterToWord',
        'missingLetter',
    ];

    const type =
        questionTypes[
        Math.floor(
            Math.random() * questionTypes.length,
        )
        ];

    /* -------------------------------------------------------
       1. Letter → Picture / Word
    ------------------------------------------------------- */

    if (type === 'letterToPicture') {
        const wrongItems = getRandomItems(
            2,
            correctIndexInData,
        );

        const items = shuffle([
            correct,
            ...wrongItems,
        ]);

        const options = items.map((item) => ({
            text: item.word,
            emoji: item.emoji,
        }));

        return {
            id: createQuestionId(
                type,
                correct.letter,
                options,
            ),

            type,

            correctIndex: items.findIndex(
                (item) =>
                    item.letter === correct.letter,
            ),

            questionLetter: correct.letter,
            questionWord: correct.word,
            questionEmoji: correct.emoji,

            options,
        };
    }

    /* -------------------------------------------------------
       2. Picture → Letter
    ------------------------------------------------------- */

    if (type === 'pictureToLetter') {
        const wrongItems = getRandomItems(
            2,
            correctIndexInData,
        );

        const items = shuffle([
            correct,
            ...wrongItems,
        ]);

        const options = items.map((item) => ({
            text: item.letter,
        }));

        return {
            id: createQuestionId(
                type,
                correct.letter,
                options,
            ),

            type,

            correctIndex: items.findIndex(
                (item) =>
                    item.letter === correct.letter,
            ),

            questionLetter: correct.letter,
            questionWord: correct.word,
            questionEmoji: correct.emoji,

            options,
        };
    }

    /* -------------------------------------------------------
       3. Letter → Word
    ------------------------------------------------------- */

    if (type === 'letterToWord') {
        const wrongItems = getRandomItems(
            2,
            correctIndexInData,
        );

        const items = shuffle([
            correct,
            ...wrongItems,
        ]);

        const options = items.map((item) => ({
            text: item.word,
        }));

        return {
            id: createQuestionId(
                type,
                correct.letter,
                options,
            ),

            type,

            correctIndex: items.findIndex(
                (item) =>
                    item.letter === correct.letter,
            ),

            questionLetter: correct.letter,
            questionWord: correct.word,
            questionEmoji: correct.emoji,

            options,
        };
    }

    /* -------------------------------------------------------
       4. Missing Letter
    ------------------------------------------------------- */

    const validMissingIndexes = Array.from(
        {
            length: Math.max(
                1,
                alphabetData.length - 2,
            ),
        },
        (_, index) => index + 1,
    ).filter(
        (index) =>
            index < alphabetData.length - 1,
    );

    const missingDataIndex =
        validMissingIndexes[
        Math.floor(
            Math.random() *
            validMissingIndexes.length,
        )
        ];

    const missing =
        alphabetData[missingDataIndex];

    const previous =
        alphabetData[missingDataIndex - 1];

    const next =
        alphabetData[missingDataIndex + 1];

    const otherWrongCandidates =
        alphabetData.filter(
            (_, index) =>
                index !== missingDataIndex &&
                index !== missingDataIndex - 1 &&
                index !== missingDataIndex + 1,
        );

    const otherWrong =
        shuffle(otherWrongCandidates)[0];

    const missingOptions = shuffle([
        missing.letter,
        previous.letter,
        otherWrong.letter,
    ]);

    const options = missingOptions.map(
        (letter) => ({
            text: letter,
        }),
    );

    return {
        id: createQuestionId(
            type,
            missing.letter,
            options,
        ),

        type,

        correctIndex: missingOptions.findIndex(
            (letter) =>
                letter === missing.letter,
        ),

        questionLetter: missing.letter,
        questionWord: missing.word,
        questionEmoji: missing.emoji,

        options,
    };
}

/* ---------------------------------------------------------
   Create Unique Practice Session
--------------------------------------------------------- */

function createPracticeSession(): Question[] {
    const questions: Question[] = [];
    const usedQuestionIds = new Set<string>();

    let attempts = 0;
    const maxAttempts = 500;

    while (
        questions.length < TOTAL_QUESTIONS &&
        attempts < maxAttempts
    ) {
        attempts++;

        const question = createQuestion();

        if (!usedQuestionIds.has(question.id)) {
            usedQuestionIds.add(question.id);
            questions.push(question);
        }
    }

    return questions;
}

/* ---------------------------------------------------------
   Screen
--------------------------------------------------------- */

export default function AlphabetPracticeScreen() {
    const [questions, setQuestions] =
        useState<Question[]>(() =>
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

        let phrase = '';

        switch (question.type) {
            case 'letterToPicture':
                phrase = `Which word starts with ${question.questionLetter}?`;
                break;

            case 'pictureToLetter':
                phrase = `Which letter is ${question.questionWord}?`;
                break;

            case 'letterToWord':
                phrase = `Which word starts with ${question.questionLetter}?`;
                break;

            case 'missingLetter':
                phrase = 'Which letter is missing?';
                break;
        }

        Speech.speak(phrase, {
            language: 'en-US',
            rate: 0.72,
            pitch: 1.25,
        });

        return () => {
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

        switch (question.type) {
            case 'letterToPicture':
                return `Which word starts with ${question.questionLetter}?`;

            case 'pictureToLetter':
                return 'Which letter is this?';

            case 'letterToWord':
                return `Which word starts with ${question.questionLetter}?`;

            case 'missingLetter':
                return 'Which letter is missing?';
        }
    }, [question]);

    /* -------------------------------------------------------
       Answer Handling
    ------------------------------------------------------- */

    const handleAnswer = (index: number) => {
        if (!question) {
            return;
        }

        /*
         * Once the answer is correct, don't allow
         * another selection.
         */
        if (
            selectedIndex === question.correctIndex
        ) {
            return;
        }

        /*
         * After the second wrong attempt,
         * the correct answer is revealed.
         */
        if (wrongAttempts >= 2) {
            return;
        }

        const isCorrect =
            index === question.correctIndex;

        Speech.stop();

        /* -----------------------------------------------
           Correct
        ----------------------------------------------- */

        if (isCorrect) {
            setSelectedIndex(index);
            setShowResult(true);

            Speech.speak('Great job!', {
                language: 'en-US',
                rate: 0.72,
                pitch: 1.3,
            });

            return;
        }

        /* -----------------------------------------------
           Wrong
        ----------------------------------------------- */

        const newWrongAttempts =
            wrongAttempts + 1;

        setWrongAttempts(newWrongAttempts);
        setSelectedIndex(index);

        /*
         * First wrong attempt:
         * Don't reveal the answer.
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
         * Second wrong attempt:
         * Reveal the correct answer.
         */
        if (newWrongAttempts >= 2) {
            setShowResult(true);

            Speech.speak(
                `The correct answer is ${question.options[question.correctIndex].text} `,
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
            (previous) => previous + 1,
        );

        setSelectedIndex(null);
        setWrongAttempts(0);
        setShowResult(false);
    };

    /* -------------------------------------------------------
       New Practice Session
    ------------------------------------------------------- */

    const handlePracticeAgain = () => {
        Speech.stop();

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
       Option Style
    ------------------------------------------------------- */

    const getOptionStyle = (
        index: number,
    ) => {
        /*
         * After second wrong answer,
         * highlight correct answer.
         */
        if (
            (showResult || wrongAttempts >= 2) &&
            index === question.correctIndex
        ) {
            return [
                styles.option,
                styles.correctOption,
            ];
        }

        /*
         * Highlight the child's wrong answer.
         */
        if (
            selectedIndex === index &&
            index !== question.correctIndex
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
        index: number,
    ) => {
        /*
         * Correct answer
         */
        if (
            (showResult || wrongAttempts >= 2) &&
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

        /*
         * Wrong answer selected
         */
        if (
            selectedIndex === index &&
            index !== question.correctIndex
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
                        You finished your alphabet
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
                            Back to Alphabet
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
                        Practice
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
                                    width: `${progress}% `,
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
                        PRACTICE
                    </Text>

                    <Text
                        style={styles.questionText}
                    >
                        {questionText}
                    </Text>

                    {/* Picture → Letter */}
                    {question.type ===
                        'pictureToLetter' && (
                            <View
                                style={styles.questionImage}
                            >
                                <Text
                                    style={
                                        styles.questionEmoji
                                    }
                                >
                                    {question.questionEmoji}
                                </Text>

                                <Text
                                    style={styles.questionWord}
                                >
                                    {question.questionWord}
                                </Text>
                            </View>
                        )}

                    {/* Letter → Picture */}
                    {question.type ===
                        'letterToPicture' && (
                            <View
                                style={
                                    styles.largeLetterContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.largeQuestionLetter
                                    }
                                >
                                    {question.questionLetter}
                                </Text>
                            </View>
                        )}

                    {/* Letter → Word */}
                    {question.type ===
                        'letterToWord' && (
                            <View
                                style={
                                    styles.largeLetterContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.largeQuestionLetter
                                    }
                                >
                                    {question.questionLetter}
                                </Text>
                            </View>
                        )}

                    {/* Missing Letter */}
                    {question.type ===
                        'missingLetter' && (
                            <View
                                style={
                                    styles.missingLetterContainer
                                }
                            >
                                <Text
                                    style={styles.sequenceText}
                                >
                                    {
                                        alphabetData[
                                            Math.max(
                                                0,
                                                alphabetData.findIndex(
                                                    (item) =>
                                                        item.letter ===
                                                        question.questionLetter,
                                                ) - 1,
                                            )
                                        ]?.letter
                                    }
                                </Text>

                                <View
                                    style={styles.missingBox}
                                >
                                    <Text
                                        style={styles.missingText}
                                    >
                                        ?
                                    </Text>
                                </View>

                                <Text
                                    style={styles.sequenceText}
                                >
                                    {
                                        alphabetData[
                                            Math.min(
                                                alphabetData.length - 1,
                                                alphabetData.findIndex(
                                                    (item) =>
                                                        item.letter ===
                                                        question.questionLetter,
                                                ) + 1,
                                            )
                                        ]?.letter
                                    }
                                </Text>
                            </View>
                        )}
                </View>

                {/* Try Again Message */}
                {wrongAttempts === 1 &&
                    selectedIndex !==
                    question.correctIndex && (
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
                        (option, index) => {
                            const isCorrect =
                                index ===
                                question.correctIndex;

                            const isWrongSelected =
                                selectedIndex === index &&
                                !isCorrect;

                            /*
                             * Disable:
                             * - correct answer after selection
                             * - everything after second wrong attempt
                             *
                             * But after first wrong attempt,
                             * the child can still choose again.
                             */
                            const disabled =
                                selectedIndex ===
                                question.correctIndex ||
                                wrongAttempts >= 2;

                            return (
                                <Pressable
                                    key={`${question.id} -${index} `}
                                    disabled={disabled}
                                    onPress={() =>
                                        handleAnswer(index)
                                    }
                                    style={({ pressed }) => [
                                        getOptionStyle(index),
                                        pressed &&
                                        !disabled &&
                                        styles.optionPressed,
                                    ]}
                                >
                                    {option.emoji && (
                                        <Text
                                            style={
                                                styles.optionEmoji
                                            }
                                        >
                                            {option.emoji}
                                        </Text>
                                    )}

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
                                        {option.text}
                                    </Text>

                                    <View
                                        style={
                                            styles.optionResult
                                        }
                                    >
                                        {getOptionIcon(index)}
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
                            selectedIndex ===
                                question.correctIndex
                                ? styles.correctResult
                                : styles.answerResult,
                        ]}
                    >
                        <View
                            style={styles.resultIcon}
                        >
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

                        <View
                            style={styles.resultContent}
                        >
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

                            <Text
                                style={styles.resultText}
                            >
                                {selectedIndex ===
                                    question.correctIndex
                                    ? 'You got it right!'
                                    : `${question.questionLetter} is for ${question.questionWord}`}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Next Button */}
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
        transform: [{ scale: 0.96 }],
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

        backgroundColor: COLORS.primaryLight,

        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',

        borderRadius: 4,

        backgroundColor: COLORS.primary,
    },

    /* Question Card */

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

    /* Picture Question */

    questionImage: {
        marginTop: 20,

        alignItems: 'center',
    },

    questionEmoji: {
        fontSize: 64,
    },

    questionWord: {
        marginTop: 8,

        fontSize: 18,

        fontWeight: '700',

        color: COLORS.text,
    },

    /* Large Letter */

    largeLetterContainer: {
        width: 105,
        height: 105,

        borderRadius: 30,

        backgroundColor:
            COLORS.primaryLight,

        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 20,
    },

    largeQuestionLetter: {
        fontSize: 58,

        fontWeight: '900',

        color: COLORS.primary,
    },

    /* Missing Letter */

    missingLetterContainer: {
        flexDirection: 'row',

        alignItems: 'center',

        marginTop: 22,

        gap: 14,
    },

    sequenceText: {
        fontSize: 44,

        fontWeight: '900',

        color: COLORS.text,
    },

    missingBox: {
        width: 62,
        height: 62,

        borderRadius: 18,

        backgroundColor:
            COLORS.primaryLight,

        alignItems: 'center',
        justifyContent: 'center',
    },

    missingText: {
        fontSize: 32,

        fontWeight: '800',

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

        backgroundColor:
            COLORS.white,

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

    optionEmoji: {
        fontSize: 30,

        marginRight: 14,
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

