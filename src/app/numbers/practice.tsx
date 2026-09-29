import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';

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

import { numbersData } from '../../../data/numbers';

type QuestionType =
    | 'numberToWord'
    | 'wordToNumber'
    | 'countToNumber'
    | 'missingNumber';

type QuestionOption = {
    text: string;
};

type Question = {
    id: string;

    type: QuestionType;

    correctIndex: number;

    questionNumber: number;

    questionWord: string;

    sequencePrevious?: number;

    sequenceNext?: number;

    countNumber?: number;

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
    return [...items].sort(
        () => Math.random() - 0.5,
    );
}

function createQuestionId(
    type: QuestionType,
    correctNumber: number,
    options: QuestionOption[],
): string {
    const optionKey = options
        .map((option) => option.text)
        .sort()
        .join('|');

    return `${type}-${correctNumber}-${optionKey}`;
}

function getRandomItems(
    count: number,
    excludeNumber: number,
) {
    const available = numbersData.filter(
        (item) =>
            item.number !== excludeNumber,
    );

    return shuffle(available).slice(
        0,
        count,
    );
}

/* ---------------------------------------------------------
   Question Generator
--------------------------------------------------------- */

function createQuestion(): Question {
    const correctIndexInData =
        Math.floor(
            Math.random() *
            numbersData.length,
        );

    const correct =
        numbersData[correctIndexInData];

    const questionTypes: QuestionType[] = [
        'numberToWord',
        'wordToNumber',
        'countToNumber',
        'missingNumber',
    ];

    const type =
        questionTypes[
        Math.floor(
            Math.random() *
            questionTypes.length,
        )
        ];

    /* -------------------------------------------------------
       1. Number → Word
    ------------------------------------------------------- */

    if (type === 'numberToWord') {
        const wrongItems =
            getRandomItems(
                2,
                correct.number,
            );

        const items = shuffle([
            correct,
            ...wrongItems,
        ]);

        const options = items.map(
            (item) => ({
                text: item.word,
            }),
        );

        return {
            id: createQuestionId(
                type,
                correct.number,
                options,
            ),

            type,

            correctIndex:
                items.findIndex(
                    (item) =>
                        item.number ===
                        correct.number,
                ),

            questionNumber:
                correct.number,

            questionWord:
                correct.word,

            options,
        };
    }

    /* -------------------------------------------------------
       2. Word → Number
    ------------------------------------------------------- */

    if (type === 'wordToNumber') {
        const wrongItems =
            getRandomItems(
                2,
                correct.number,
            );

        const items = shuffle([
            correct,
            ...wrongItems,
        ]);

        const options = items.map(
            (item) => ({
                text: String(
                    item.number,
                ),
            }),
        );

        return {
            id: createQuestionId(
                type,
                correct.number,
                options,
            ),

            type,

            correctIndex:
                items.findIndex(
                    (item) =>
                        item.number ===
                        correct.number,
                ),

            questionNumber:
                correct.number,

            questionWord:
                correct.word,

            options,
        };
    }

    /* -------------------------------------------------------
       3. Count → Number
    ------------------------------------------------------- */

    if (type === 'countToNumber') {
        /*
         * Counting is limited to 1–10
         * so the UI stays simple for children.
         */

        const countNumber =
            Math.floor(
                Math.random() * 10,
            ) + 1;

        const correctItem =
            numbersData[
            countNumber - 1
            ];

        const wrongItems =
            getRandomItems(
                2,
                countNumber,
            );

        const items = shuffle([
            correctItem,
            ...wrongItems,
        ]);

        const options = items.map(
            (item) => ({
                text: String(
                    item.number,
                ),
            }),
        );

        return {
            id: createQuestionId(
                type,
                countNumber,
                options,
            ),

            type,

            correctIndex:
                items.findIndex(
                    (item) =>
                        item.number ===
                        countNumber,
                ),

            questionNumber:
                countNumber,

            questionWord:
                correctItem.word,

            countNumber,

            options,
        };
    }

    /* -------------------------------------------------------
       4. Missing Number
    ------------------------------------------------------- */

    /*
     * Use 2–99 so previous and next
     * numbers are always available.
     */

    const missingNumber =
        Math.floor(
            Math.random() * 98,
        ) + 2;

    const previous =
        missingNumber - 1;

    const next =
        missingNumber + 1;

    const wrongCandidates =
        numbersData.filter(
            (item) =>
                item.number !==
                missingNumber &&
                item.number !==
                previous &&
                item.number !== next,
        );

    const otherWrong =
        shuffle(
            wrongCandidates,
        )[0];

    const missingOptions =
        shuffle([
            String(missingNumber),
            String(previous),
            String(
                otherWrong.number,
            ),
        ]);

    const options =
        missingOptions.map(
            (number) => ({
                text: number,
            }),
        );

    return {
        id: createQuestionId(
            type,
            missingNumber,
            options,
        ),

        type,

        correctIndex:
            missingOptions.findIndex(
                (number) =>
                    number ===
                    String(
                        missingNumber,
                    ),
            ),

        questionNumber:
            missingNumber,

        questionWord:
            numbersData[
                missingNumber - 1
            ].word,

        sequencePrevious:
            previous,

        sequenceNext: next,

        options,
    };
}

/* ---------------------------------------------------------
   Create Unique Practice Session
--------------------------------------------------------- */

function createPracticeSession(): Question[] {
    const questions: Question[] = [];

    const usedQuestionIds =
        new Set<string>();

    let attempts = 0;

    const maxAttempts = 500;

    while (
        questions.length <
        TOTAL_QUESTIONS &&
        attempts < maxAttempts
    ) {
        attempts++;

        const question =
            createQuestion();

        if (
            !usedQuestionIds.has(
                question.id,
            )
        ) {
            usedQuestionIds.add(
                question.id,
            );

            questions.push(question);
        }
    }

    return questions;
}

/* ---------------------------------------------------------
   Screen
--------------------------------------------------------- */

export default function NumberPracticeScreen() {
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
        (questionNumber /
            TOTAL_QUESTIONS) *
        100;

    /* -------------------------------------------------------
       Automatic Question Audio
    ------------------------------------------------------- */

    useEffect(() => {
        if (
            !question ||
            finished
        ) {
            return;
        }

        Speech.stop();

        let phrase = '';

        switch (question.type) {
            case 'numberToWord':
                phrase = `Which word is ${question.questionNumber}?`;
                break;

            case 'wordToNumber':
                phrase = `Which number is ${question.questionWord}?`;
                break;

            case 'countToNumber':
                phrase =
                    'How many objects are there?';
                break;

            case 'missingNumber':
                phrase =
                    'Which number is missing?';
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
    }, [
        questionIndex,
        finished,
    ]);

    /* -------------------------------------------------------
       Question Text
    ------------------------------------------------------- */

    const questionText =
        useMemo(() => {
            if (!question) {
                return '';
            }

            switch (
            question.type
            ) {
                case 'numberToWord':
                    return `Which word is ${question.questionNumber}?`;

                case 'wordToNumber':
                    return `Which number is ${question.questionWord}?`;

                case 'countToNumber':
                    return 'How many objects are there?';

                case 'missingNumber':
                    return 'Which number is missing?';
            }
        }, [question]);

    /* -------------------------------------------------------
       Answer Handling
    ------------------------------------------------------- */

    const handleAnswer = (
        index: number,
    ) => {
        if (!question) {
            return;
        }

        if (
            selectedIndex ===
            question.correctIndex
        ) {
            return;
        }

        if (wrongAttempts >= 2) {
            return;
        }

        const isCorrect =
            index ===
            question.correctIndex;

        Speech.stop();

        /* Correct */

        if (isCorrect) {
            setSelectedIndex(index);

            setShowResult(true);

            Speech.speak(
                'Great job!',
                {
                    language:
                        'en-US',
                    rate: 0.72,
                    pitch: 1.3,
                },
            );

            return;
        }

        /* Wrong */

        const newWrongAttempts =
            wrongAttempts + 1;

        setWrongAttempts(
            newWrongAttempts,
        );

        setSelectedIndex(index);

        /* First wrong attempt */

        if (
            newWrongAttempts === 1
        ) {
            Speech.speak(
                'Try again!',
                {
                    language:
                        'en-US',
                    rate: 0.72,
                    pitch: 1.2,
                },
            );

            return;
        }

        /* Second wrong attempt */

        if (
            newWrongAttempts >= 2
        ) {
            setShowResult(true);

            Speech.speak(
                `The correct answer is ${question.options[question.correctIndex].text}`,
                {
                    language:
                        'en-US',
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
            (previous) =>
                previous + 1,
        );

        setSelectedIndex(null);

        setWrongAttempts(0);

        setShowResult(false);
    };

    /* -------------------------------------------------------
       New Practice Session
    ------------------------------------------------------- */

    const handlePracticeAgain =
        () => {
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
        if (
            (showResult ||
                wrongAttempts >= 2) &&
            index ===
            question.correctIndex
        ) {
            return [
                styles.option,
                styles.correctOption,
            ];
        }

        if (
            selectedIndex === index &&
            index !==
            question.correctIndex
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
        if (
            (showResult ||
                wrongAttempts >= 2) &&
            index ===
            question.correctIndex
        ) {
            return (
                <Ionicons
                    name="checkmark-circle"
                    size={25}
                    color={
                        COLORS.success
                    }
                />
            );
        }

        if (
            selectedIndex === index &&
            index !==
            question.correctIndex
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
                style={
                    styles.safeArea
                }
                edges={[
                    'top',
                    'left',
                    'right',
                ]}
            >
                <View
                    style={
                        styles.finishedContainer
                    }
                >
                    <View
                        style={
                            styles.finishedIcon
                        }
                    >
                        <Text
                            style={
                                styles.finishedEmoji
                            }
                        >
                            🎉
                        </Text>
                    </View>

                    <Text
                        style={
                            styles.finishedTitle
                        }
                    >
                        Great job!
                    </Text>

                    <Text
                        style={
                            styles.finishedDescription
                        }
                    >
                        You finished your
                        number practice.
                    </Text>

                    <Pressable
                        onPress={
                            handlePracticeAgain
                        }
                        style={({
                            pressed,
                        }) => [
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
                        style={({
                            pressed,
                        }) => [
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
                            Back to Numbers
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
            style={
                styles.safeArea
            }
            edges={[
                'top',
                'left',
                'right',
            ]}
        >
            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.content
                }
            >
                {/* Header */}

                <View
                    style={
                        styles.header
                    }
                >
                    <Pressable
                        onPress={() => {
                            Speech.stop();

                            router.back();
                        }}
                        style={({
                            pressed,
                        }) => [
                                styles.headerButton,
                                pressed &&
                                styles.pressed,
                            ]}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={22}
                            color={
                                COLORS.text
                            }
                        />
                    </Pressable>

                    <Text
                        style={
                            styles.headerTitle
                        }
                    >
                        Number Practice
                    </Text>

                    <View
                        style={
                            styles.headerSpacer
                        }
                    />
                </View>

                {/* Progress */}

                <View
                    style={
                        styles.progressSection
                    }
                >
                    <View
                        style={
                            styles.progressHeader
                        }
                    >
                        <Text
                            style={
                                styles.progressText
                            }
                        >
                            Question{' '}
                            {questionNumber}{' '}
                            of{' '}
                            {TOTAL_QUESTIONS}
                        </Text>

                        <Text
                            style={
                                styles.progressPercentage
                            }
                        >
                            {Math.round(
                                progress,
                            )}
                            %
                        </Text>
                    </View>

                    <View
                        style={
                            styles.progressTrack
                        }
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
                    style={
                        styles.questionCard
                    }
                >
                    <Text
                        style={
                            styles.questionLabel
                        }
                    >
                        NUMBER PRACTICE
                    </Text>

                    <Text
                        style={
                            styles.questionText
                        }
                    >
                        {questionText}
                    </Text>

                    {/* Number → Word */}

                    {question.type ===
                        'numberToWord' && (
                            <View
                                style={
                                    styles.largeNumberContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.largeQuestionNumber
                                    }
                                >
                                    {
                                        question.questionNumber
                                    }
                                </Text>
                            </View>
                        )}

                    {/* Word → Number */}

                    {question.type ===
                        'wordToNumber' && (
                            <View
                                style={
                                    styles.wordQuestionContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.wordQuestionText
                                    }
                                >
                                    {
                                        question.questionWord
                                    }
                                </Text>
                            </View>
                        )}

                    {/* Count → Number */}

                    {question.type ===
                        'countToNumber' && (
                            <View
                                style={
                                    styles.countContainer
                                }
                            >
                                <View
                                    style={
                                        styles.objectGrid
                                    }
                                >
                                    {Array.from(
                                        {
                                            length:
                                                question.countNumber ||
                                                0,
                                        },
                                    ).map(
                                        (_, index) => (
                                            <Text
                                                key={
                                                    index
                                                }
                                                style={
                                                    styles.countEmoji
                                                }
                                            >
                                                🍎
                                            </Text>
                                        ),
                                    )}
                                </View>
                            </View>
                        )}

                    {/* Missing Number */}

                    {question.type ===
                        'missingNumber' && (
                            <View
                                style={
                                    styles.missingNumberContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.sequenceNumber
                                    }
                                >
                                    {
                                        question.sequencePrevious
                                    }
                                </Text>

                                <View
                                    style={
                                        styles.missingBox
                                    }
                                >
                                    <Text
                                        style={
                                            styles.missingText
                                        }
                                    >
                                        ?
                                    </Text>
                                </View>

                                <Text
                                    style={
                                        styles.sequenceNumber
                                    }
                                >
                                    {
                                        question.sequenceNext
                                    }
                                </Text>
                            </View>
                        )}
                </View>

                {/* Try Again */}

                {wrongAttempts === 1 &&
                    selectedIndex !==
                    question.correctIndex && (
                        <View
                            style={
                                styles.tryAgainContainer
                            }
                        >
                            <View
                                style={
                                    styles.tryAgainIcon
                                }
                            >
                                <Ionicons
                                    name="refresh-outline"
                                    size={17}
                                    color={
                                        COLORS.primary
                                    }
                                />
                            </View>

                            <Text
                                style={
                                    styles.tryAgainText
                                }
                            >
                                Not quite! Try
                                another answer.
                            </Text>
                        </View>
                    )}

                {/* Options */}

                <View
                    style={
                        styles.optionsSection
                    }
                >
                    {question.options.map(
                        (
                            option,
                            index,
                        ) => {
                            const isCorrect =
                                index ===
                                question.correctIndex;

                            const isWrongSelected =
                                selectedIndex ===
                                index &&
                                !isCorrect;

                            const disabled =
                                selectedIndex ===
                                question.correctIndex ||
                                wrongAttempts >=
                                2;

                            return (
                                <Pressable
                                    key={`${question.id}-${index}`}
                                    disabled={
                                        disabled
                                    }
                                    onPress={() =>
                                        handleAnswer(
                                            index,
                                        )
                                    }
                                    style={({
                                        pressed,
                                    }) => [
                                            getOptionStyle(
                                                index,
                                            ),
                                            pressed &&
                                            !disabled &&
                                            styles.optionPressed,
                                        ]}
                                >
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
                                        {
                                            option.text
                                        }
                                    </Text>

                                    <View
                                        style={
                                            styles.optionResult
                                        }
                                    >
                                        {getOptionIcon(
                                            index,
                                        )}
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
                            style={
                                styles.resultIcon
                            }
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
                            style={
                                styles.resultContent
                            }
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
                                style={
                                    styles.resultText
                                }
                            >
                                {selectedIndex ===
                                    question.correctIndex
                                    ? 'You got it right!'
                                    : `${question.questionNumber} is ${question.questionWord}`}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Next */}

                {showResult && (
                    <Pressable
                        onPress={
                            handleNext
                        }
                        style={({
                            pressed,
                        }) => [
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
                            color={
                                COLORS.white
                            }
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
        paddingTop: 12,
        paddingBottom: 40,
    },

    /* Header */

    header: {
        height: 52,

        flexDirection: 'row',

        alignItems: 'center',

        justifyContent:
            'space-between',

        marginBottom: 24,
    },

    headerButton: {
        width: 44,
        height: 44,

        borderRadius: 15,

        backgroundColor:
            COLORS.white,

        alignItems: 'center',

        justifyContent:
            'center',

        borderWidth: 1,

        borderColor:
            COLORS.border,
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

        justifyContent:
            'space-between',

        marginBottom: 9,
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

    /* Question Card */

    questionCard: {
        backgroundColor:
            COLORS.white,

        borderRadius: 28,

        padding: 24,

        alignItems: 'center',

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

    questionLabel: {
        fontSize: 11,

        fontWeight: '800',

        letterSpacing: 1.5,

        color:
            COLORS.secondaryText,

        marginBottom: 10,
    },

    questionText: {
        fontSize: 20,

        lineHeight: 28,

        fontWeight: '800',

        color: COLORS.text,

        textAlign: 'center',
    },

    /* Large Number */

    largeNumberContainer: {
        width: 130,

        height: 130,

        borderRadius: 34,

        backgroundColor:
            COLORS.primaryLight,

        alignItems: 'center',

        justifyContent:
            'center',

        marginTop: 20,
    },

    largeQuestionNumber: {
        fontSize: 58,

        fontWeight: '900',

        color: COLORS.primary,
    },

    /* Word */

    wordQuestionContainer: {
        minWidth: 180,

        minHeight: 90,

        paddingHorizontal: 20,

        borderRadius: 24,

        backgroundColor:
            COLORS.primaryLight,

        alignItems: 'center',

        justifyContent:
            'center',

        marginTop: 20,
    },

    wordQuestionText: {
        fontSize: 28,

        fontWeight: '900',

        color: COLORS.primary,

        textAlign: 'center',
    },

    /* Count */

    countContainer: {
        marginTop: 18,

        width: '100%',

        alignItems: 'center',
    },

    objectGrid: {
        maxWidth: 300,

        flexDirection: 'row',

        flexWrap: 'wrap',

        justifyContent:
            'center',

        gap: 5,
    },

    countEmoji: {
        fontSize: 30,
    },

    /* Missing Number */

    missingNumberContainer: {
        flexDirection: 'row',

        alignItems: 'center',

        marginTop: 22,

        gap: 14,
    },

    sequenceNumber: {
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

        justifyContent:
            'center',
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

        justifyContent:
            'center',
    },

    tryAgainIcon: {
        width: 28,

        height: 28,

        borderRadius: 10,

        backgroundColor:
            COLORS.white,

        alignItems: 'center',

        justifyContent:
            'center',

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

        borderColor:
            COLORS.border,
    },

    optionPressed: {
        transform: [
            {
                scale: 0.98,
            },
        ],

        opacity: 0.8,
    },

    optionText: {
        flex: 1,

        fontSize: 18,

        fontWeight: '800',

        color: COLORS.text,

        textAlign: 'center',
    },

    optionResult: {
        width: 28,

        alignItems:
            'flex-end',
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

        justifyContent:
            'center',

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

        color:
            COLORS.secondaryText,
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

        justifyContent:
            'center',

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

        justifyContent:
            'center',
    },

    finishedIcon: {
        width: 110,

        height: 110,

        borderRadius: 36,

        backgroundColor:
            COLORS.primaryLight,

        alignItems: 'center',

        justifyContent:
            'center',

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

        color:
            COLORS.secondaryText,

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

        justifyContent:
            'center',
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

        justifyContent:
            'center',

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