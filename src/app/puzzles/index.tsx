import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

    orange: '#F59E0B',
    orangeLight: '#FFF1D6',

    green: '#15966A',
    greenLight: '#DDF7EA',

    pink: '#D94F76',
    pinkLight: '#FFE3EB',

    blue: '#3984E8',
    blueLight: '#E3F0FF',

    text: '#25304A',
    secondaryText: '#718096',
    border: '#E8E5DF',
};

type PuzzleItem = {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    background: string;
};

const puzzles: PuzzleItem[] = [
    {
        id: 'missing-piece',
        title: 'Missing Piece',
        description: 'Complete the puzzle',
        icon: 'extension-puzzle-outline',
        color: COLORS.primary,
        background: COLORS.primaryLight,
    },
    {
        id: 'match-pair',
        title: 'Match the Pair',
        description: 'Find the matching pair',
        icon: 'git-compare-outline',
        color: COLORS.orange,
        background: COLORS.orangeLight,
    },
    {
        id: 'different-one',
        title: 'Find the Different',
        description: 'Spot what is different',
        icon: 'search-outline',
        color: COLORS.green,
        background: COLORS.greenLight,
    },
    {
        id: 'pattern',
        title: 'Complete the Pattern',
        description: 'What comes next?',
        icon: 'grid-outline',
        color: COLORS.pink,
        background: COLORS.pinkLight,
    },
    {
        id: 'count-choose',
        title: 'Count & Choose',
        description: 'Count and select',
        icon: 'calculator-outline',
        color: COLORS.blue,
        background: COLORS.blueLight,
    },
];

export default function PuzzlesScreen() {
    const handlePuzzlePress = (id: string) => {
        router.push(`/puzzles/${id}`);
    };

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

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>
                            Puzzles
                        </Text>

                        <Text style={styles.headerSubtitle}>
                            Learn while you play
                        </Text>
                    </View>

                    <View style={styles.headerButtonPlaceholder} />
                </View>

                {/* Hero */}

                <View style={styles.heroCard}>
                    <View style={styles.heroText}>
                        <Text style={styles.heroSmallText}>
                            READY TO PLAY?
                        </Text>

                        <Text style={styles.heroTitle}>
                            Let's solve{'\n'}some puzzles! 🧩
                        </Text>

                        <Text style={styles.heroDescription}>
                            Pick a game and use your thinking skills.
                        </Text>
                    </View>

                    <View style={styles.heroIconContainer}>
                        <Text style={styles.heroEmoji}>
                            🧩
                        </Text>

                        <View style={styles.smallStar}>
                            <Text style={styles.smallStarText}>
                                ⭐
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Section Header */}

                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Choose a puzzle
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Which one do you want to try?
                        </Text>
                    </View>

                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>
                            {puzzles.length}
                        </Text>
                    </View>
                </View>

                {/* Puzzle Cards */}

                <View style={styles.puzzleGrid}>
                    {puzzles.map((puzzle, index) => (
                        <Pressable
                            key={puzzle.id}
                            onPress={() =>
                                handlePuzzlePress(puzzle.id)
                            }
                            style={({ pressed }) => [
                                styles.puzzleCard,
                                pressed && styles.cardPressed,
                            ]}
                        >
                            {/* Number */}

                            <View
                                style={[
                                    styles.cardNumber,
                                    {
                                        backgroundColor:
                                            puzzle.background,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.cardNumberText,
                                        {
                                            color: puzzle.color,
                                        },
                                    ]}
                                >
                                    {index + 1}
                                </Text>
                            </View>

                            {/* Icon */}

                            <View
                                style={[
                                    styles.puzzleIcon,
                                    {
                                        backgroundColor:
                                            puzzle.background,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={puzzle.icon}
                                    size={32}
                                    color={puzzle.color}
                                />
                            </View>

                            {/* Content */}

                            <View style={styles.puzzleContent}>
                                <Text style={styles.puzzleTitle}>
                                    {puzzle.title}
                                </Text>

                                <Text style={styles.puzzleDescription}>
                                    {puzzle.description}
                                </Text>

                                <View style={styles.playRow}>
                                    <Text
                                        style={[
                                            styles.playText,
                                            {
                                                color: puzzle.color,
                                            },
                                        ]}
                                    >
                                        Play now
                                    </Text>

                                    <Ionicons
                                        name="arrow-forward"
                                        size={16}
                                        color={puzzle.color}
                                    />
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Bottom Tip */}

                <View style={styles.tipCard}>
                    <View style={styles.tipIcon}>
                        <Text style={styles.tipEmoji}>
                            💡
                        </Text>
                    </View>

                    <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>
                            Think carefully!
                        </Text>

                        <Text style={styles.tipText}>
                            Try each puzzle and have fun learning.
                        </Text>
                    </View>
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
        paddingTop: 10,
        paddingBottom: 30,
    },

    /* Header */

    header: {
        height: 58,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 18,
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

    headerButtonPlaceholder: {
        width: 44,
    },

    headerTitleContainer: {
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: COLORS.text,
    },

    headerSubtitle: {
        marginTop: 2,

        fontSize: 11,
        fontWeight: '600',

        color: COLORS.secondaryText,
    },

    pressed: {
        opacity: 0.65,

        transform: [
            {
                scale: 0.96,
            },
        ],
    },

    /* Hero */

    heroCard: {
        minHeight: 175,

        borderRadius: 28,

        padding: 22,

        backgroundColor: COLORS.primary,

        flexDirection: 'row',
        alignItems: 'center',

        overflow: 'hidden',

        marginBottom: 25,
    },

    heroText: {
        flex: 1,
        paddingRight: 8,
    },

    heroSmallText: {
        fontSize: 10,
        fontWeight: '900',

        letterSpacing: 1.5,

        color: '#DCDFFF',

        marginBottom: 8,
    },

    heroTitle: {
        fontSize: 25,
        lineHeight: 30,

        fontWeight: '900',

        color: COLORS.white,
    },

    heroDescription: {
        marginTop: 9,

        fontSize: 12.5,
        lineHeight: 18,

        fontWeight: '600',

        color: '#E4E5FF',
    },

    heroIconContainer: {
        width: 105,
        height: 105,

        borderRadius: 34,

        backgroundColor: 'rgba(255,255,255,0.16)',

        alignItems: 'center',
        justifyContent: 'center',

        position: 'relative',
    },

    heroEmoji: {
        fontSize: 57,
    },

    smallStar: {
        position: 'absolute',

        right: -5,
        top: -5,

        width: 35,
        height: 35,

        borderRadius: 12,

        backgroundColor: COLORS.white,

        alignItems: 'center',
        justifyContent: 'center',
    },

    smallStarText: {
        fontSize: 17,
    },

    /* Section */

    sectionHeader: {
        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'space-between',

        marginBottom: 14,
    },

    sectionTitle: {
        fontSize: 19,

        fontWeight: '900',

        color: COLORS.text,
    },

    sectionSubtitle: {
        marginTop: 3,

        fontSize: 12.5,

        fontWeight: '600',

        color: COLORS.secondaryText,
    },

    countBadge: {
        width: 38,
        height: 38,

        borderRadius: 13,

        backgroundColor: COLORS.primaryLight,

        alignItems: 'center',
        justifyContent: 'center',
    },

    countBadgeText: {
        fontSize: 15,

        fontWeight: '900',

        color: COLORS.primary,
    },

    /* Puzzle Cards */

    puzzleGrid: {
        gap: 13,
    },

    puzzleCard: {
        minHeight: 112,

        backgroundColor: COLORS.white,

        borderRadius: 23,

        padding: 14,

        flexDirection: 'row',

        alignItems: 'center',

        borderWidth: 1,
        borderColor: COLORS.border,

        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.035,

        shadowRadius: 8,

        elevation: 1,
    },

    cardPressed: {
        opacity: 0.82,

        transform: [
            {
                scale: 0.985,
            },
        ],
    },

    cardNumber: {
        position: 'absolute',

        top: 10,
        right: 12,

        width: 25,
        height: 25,

        borderRadius: 9,

        alignItems: 'center',
        justifyContent: 'center',
    },

    cardNumberText: {
        fontSize: 11,

        fontWeight: '900',
    },

    puzzleIcon: {
        width: 68,
        height: 68,

        borderRadius: 21,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 15,
    },

    puzzleContent: {
        flex: 1,

        paddingRight: 25,
    },

    puzzleTitle: {
        fontSize: 17,

        fontWeight: '900',

        color: COLORS.text,
    },

    puzzleDescription: {
        marginTop: 4,

        fontSize: 12.5,

        lineHeight: 18,

        fontWeight: '600',

        color: COLORS.secondaryText,
    },

    playRow: {
        flexDirection: 'row',

        alignItems: 'center',

        marginTop: 8,
    },

    playText: {
        marginRight: 5,

        fontSize: 12,

        fontWeight: '800',
    },

    /* Tip */

    tipCard: {
        marginTop: 20,

        padding: 15,

        borderRadius: 20,

        backgroundColor: COLORS.white,

        borderWidth: 1,

        borderColor: COLORS.border,

        flexDirection: 'row',

        alignItems: 'center',
    },

    tipIcon: {
        width: 45,
        height: 45,

        borderRadius: 15,

        backgroundColor: COLORS.orangeLight,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 12,
    },

    tipEmoji: {
        fontSize: 23,
    },

    tipContent: {
        flex: 1,
    },

    tipTitle: {
        fontSize: 14,

        fontWeight: '800',

        color: COLORS.text,
    },

    tipText: {
        marginTop: 3,

        fontSize: 11.5,

        lineHeight: 17,

        color: COLORS.secondaryText,
    },
});