import { Baby, Flame, Footprints, Gem, HeartPulse, KeyRound, Mountain, Rabbit, Sprout, Users } from "lucide-react-native";
type LucideIcon = any;

export interface Level {
    level: number;
    threshold: number;
    title: string;
    description: string;
    icon: LucideIcon;
}

export const levels: Level[] = [
    {
        level: 1,
        threshold: 1,
        title: "The First Spark",
        icon: Sprout,
        description: "You've taken the first, most important step. You've proven you're both open-minded people. A couple who tries one new thing is always curious enough to try another. What's next on your path?"
    },
    {
        level: 2,
        threshold: 3,
        title: "Playful Explorers",
        icon: Flame,
        description: "You're building a habit of saying 'yes' together. You enjoy this, don't you? A couple this invested in pleasure knows that the most exciting discoveries are just ahead. You're not just trying new things; you're learning to enjoy the thrill of the unknown together."
    },
    {
        level: 3,
        threshold: 5,
        title: "Trailblazers",
        icon: Footprints,
        description: "Look how far you've come. You're creating your own map of desire. A truly adventurous couple like you wouldn't stop now, not when you've discovered the excitement of seeing each other through new eyes, maybe even through the eyes of a stranger."
    },
    {
        level: 4,
        threshold: 8,
        title: "Masters of Desire",
        icon: HeartPulse,
        description: "This is becoming second nature. You've moved beyond simple curiosity and are now crafting your shared desires. You've learned to communicate in a language of pure pleasure, bending the 'rules' of the bedroom until they break. You're discovering that power can be the ultimate aphrodisiac."
    },
    {
        level: 5,
        threshold: 12,
        title: "Keepers of Secrets",
        icon: KeyRound,
        description: "You now share intimate secrets that belong only to you. A couple that trusts each other this deeply knows that some secrets are kept not with words, but with the body. You are unlocking doors to pleasures others only whisper about, realizing that the ultimate trust is surrendering control of your body to your partner, even in its most vulnerable places."
    },
    {
        level: 6,
        threshold: 17,
        title: "Connoisseurs of Ecstasy",
        icon: Mountain,
        description: "For you, the forbidden has become familiar. You've learned that your connection is so strong it can be shared, that the highest peaks are sometimes found when your circle of trust expands. You're not just a couple; you're the center of your own universe, and you decide who gets an invitation."
    },
    {
        level: 7,
        threshold: 25,
        title: "Legends of Lust",
        icon: Users,
        description: "You have rewritten the rules of reality. Your pleasure is a performance, a ritual you can share within select circles. You have graduated from your private world into a larger one, where your shared connection is the anchor in a sea of new bodies and experiences. There are no limits, only new celebrations of desire in places built for that very purpose."
    }
];
