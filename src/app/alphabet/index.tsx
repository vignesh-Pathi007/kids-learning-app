import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { alphabetData } from '../../../data/alphabets';

const COLORS = {
    background: '#FFF9F2',
    white: '#FFFFFF',

    primary: '#5B5CE2',
    primaryLight: '#E8E7FF',

    text: '#25304A',
    secondaryText: '#718096',

    border: '#E8E5DF',
    progressBackground: '#E8E7FF',
};

const alphabetAudio = {
    A: require('../../../assets/audio/alphabet/a.mp3'),
    B: require('../../../assets/audio/alphabet/b.mp3'),
    C: require('../../../assets/audio/alphabet/c.mp3'),
    D: require('../../../assets/audio/alphabet/d.mp3'),
    E: require('../../../assets/audio/alphabet/e.mp3'),
    F: require('../../../assets/audio/alphabet/f.mp3'),
    G: require('../../../assets/audio/alphabet/g.mp3'),
    H: require('../../../assets/audio/alphabet/h.mp3'),
    I: require('../../../assets/audio/alphabet/i.mp3'),
    J: require('../../../assets/audio/alphabet/j.mp3'),
    K: require('../../../assets/audio/alphabet/k.mp3'),
    L: require('../../../assets/audio/alphabet/l.mp3'),
    M: require('../../../assets/audio/alphabet/m.mp3'),
    N: require('../../../assets/audio/alphabet/n.mp3'),
    O: require('../../../assets/audio/alphabet/o.mp3'),
    P: require('../../../assets/audio/alphabet/p.mp3'),
    Q: require('../../../assets/audio/alphabet/q.mp3'),
    R: require('../../../assets/audio/alphabet/r.mp3'),
    S: require('../../../assets/audio/alphabet/s.mp3'),
    T: require('../../../assets/audio/alphabet/t.mp3'),
    U: require('../../../assets/audio/alphabet/u.mp3'),
    V: require('../../../assets/audio/alphabet/v.mp3'),
    W: require('../../../assets/audio/alphabet/w.mp3'),
    X: require('../../../assets/audio/alphabet/x.mp3'),
    Y: require('../../../assets/audio/alphabet/y.mp3'),
    Z: require('../../../assets/audio/alphabet/z.mp3'),
} as const;

export default function AlphabetScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Sound is ON by default.
    const [soundEnabled, setSoundEnabled] = useState(true);

    const currentItem = alphabetData[currentIndex];

    const audioSource = alphabetAudio[
        currentItem.letter as keyof typeof alphabetAudio
    ];

    const player = useAudioPlayer(audioSource);

    /*
     * Automatically play the current letter whenever:
     * - The screen opens
     * - The letter changes
     * - Sound is turned back ON
     */
    useEffect(() => {
        const playCurrentLetter = async () => {
            if (!soundEnabled) {
                Speech.stop();
                player.pause();
                return;
            }

            const phrase = `${currentItem.letter} for ${currentItem.word}`;
            let preferredVoiceName = '';

            try {
                const voices = await Speech.getAvailableVoicesAsync();
                const femaleVoice = voices.find((voice) => {
                    const name = voice.name.toLowerCase();
                    const language = voice.language.toLowerCase();

                    return (
                        language.startsWith('en') &&
                        (name.includes('female') ||
                            name.includes('woman') ||
                            name.includes('girl') ||
                            name.includes('samantha') ||
                            name.includes('zira') ||
                            name.includes('aria') ||
                            name.includes('victoria') ||
                            name.includes('jenny'))
                    );
                });

                preferredVoiceName = femaleVoice?.identifier ?? '';
            } catch {
                preferredVoiceName = '';
            }

            Speech.stop();
            Speech.speak(phrase, {
                language: 'en-US',
                rate: 0.72,
                pitch: 1.35,
                volume: 1,
                voice: preferredVoiceName || undefined,
            });

            player.pause();
        };

        playCurrentLetter();
    }, [currentIndex, soundEnabled, currentItem.letter, currentItem.word, player]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((previous) => previous - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < alphabetData.length - 1) {
            setCurrentIndex((previous) => previous + 1);
        }
    };

    const toggleSound = () => {
        setSoundEnabled((previous) => {
            const nextValue = !previous;

            if (!nextValue) {
                Speech.stop();
                player.pause();
            }

            return nextValue;
        });
    };

    const progress =
        ((currentIndex + 1) / alphabetData.length) * 100;

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === alphabetData.length - 1;

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
                        onPress={() => router.push('/')}
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
                        Alphabet
                    </Text>

                    <Pressable
                        onPress={toggleSound}
                        style={({ pressed }) => [
                            styles.headerButton,
                            soundEnabled && styles.soundActive,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Ionicons
                            name={
                                soundEnabled
                                    ? 'volume-high'
                                    : 'volume-mute'
                            }
                            size={21}
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
                            Letter {currentIndex + 1} of {alphabetData.length}
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

                {/* Learning Card */}
                <View style={styles.learningCard}>
                    <Text style={styles.smallLabel}>
                        LETTER
                    </Text>

                    <Text style={styles.letter}>
                        {currentItem.letter}
                    </Text>

                    <View style={styles.illustrationContainer}>
                        <Text style={styles.illustration}>
                            {currentItem.emoji}
                        </Text>
                    </View>

                    <Text style={styles.word}>
                        {currentItem.word}
                    </Text>

                    <Text style={styles.example}>
                        {currentItem.letter} is for {currentItem.word}
                    </Text>
                </View>

                {/* Navigation */}
                <View style={styles.navigation}>
                    <View style={styles.navRow}>
                        <Pressable
                            disabled={isFirst}
                            onPress={handlePrevious}
                            style={({ pressed }) => [
                                styles.previousButton,
                                isFirst && styles.disabledButton,
                                pressed && !isFirst && styles.pressed,
                            ]}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={19}
                                color={
                                    isFirst
                                        ? '#B8BCC7'
                                        : COLORS.text
                                }
                            />

                            <Text
                                style={[
                                    styles.previousText,
                                    isFirst && styles.disabledText,
                                ]}
                            >
                                Previous
                            </Text>
                        </Pressable>

                        <Pressable
                            disabled={isLast}
                            onPress={handleNext}
                            style={({ pressed }) => [
                                styles.nextButton,
                                isLast && styles.nextDisabled,
                                pressed && !isLast && styles.nextPressed,
                            ]}
                        >
                            <Text style={styles.nextText}>
                                {isLast ? 'Finished' : 'Next'}
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

                    <Pressable
                        onPress={() => router.push('/alphabet/practice')}
                        style={({ pressed }) => [
                            styles.practiceButton,
                            pressed && styles.practiceButtonPressed,
                        ]}
                    >
                        <Ionicons
                            name="school-outline"
                            size={20}
                            color={COLORS.primary}
                        />

                        <Text style={styles.practiceButtonText}>
                            Practice Alphabet
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

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

    soundActive: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primaryLight,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.text,
    },

    pressed: {
        opacity: 0.65,
        transform: [{ scale: 0.96 }],
    },

    /* Progress */

    progressSection: {
        marginBottom: 24,
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
        backgroundColor: COLORS.progressBackground,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },

    /* Learning */

    learningCard: {
        backgroundColor: COLORS.white,

        borderRadius: 28,

        padding: 24,

        alignItems: 'center',

        borderWidth: 1,
        borderColor: COLORS.border,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },

    smallLabel: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
        color: COLORS.secondaryText,
    },

    letter: {
        fontSize: 140,
        lineHeight: 150,
        fontWeight: '900',
        color: COLORS.primary,
        marginTop: 4,
    },

    illustrationContainer: {
        width: 120,
        height: 120,
        borderRadius: 36,

        backgroundColor: COLORS.primaryLight,

        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 4,
        marginBottom: 14,
    },

    illustration: {
        fontSize: 62,
    },

    word: {
        fontSize: 27,
        fontWeight: '800',
        color: COLORS.text,
    },

    example: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.secondaryText,

        marginTop: 7,

        textAlign: 'center',
    },

    /* Navigation */

    navigation: {
        marginTop: 20,
        gap: 12,
    },

    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },

    previousButton: {
        flex: 1,
        height: 54,
        paddingHorizontal: 16,
        borderRadius: 17,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    previousText: {
        marginLeft: 8,

        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },

    disabledButton: {
        opacity: 0.45,
    },

    disabledText: {
        color: COLORS.secondaryText,
    },

    nextButton: {
        flex: 1,
        height: 54,
        paddingHorizontal: 18,
        borderRadius: 17,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },

    nextPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.97 }],
    },

    nextDisabled: {
        backgroundColor: '#D6D6E8',
        shadowOpacity: 0,
    },

    nextText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.white,

        marginRight: 8,
    },
    practiceButton: {
        height: 54,
        borderRadius: 17,
        backgroundColor: COLORS.primaryLight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#D9D9FF',
        paddingHorizontal: 18,
    },

    practiceButtonPressed: {
        opacity: 0.75,
        transform: [{ scale: 0.98 }],
    },

    practiceButtonText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.primary,
    },
});