import { Award, Footprints, Gem, Heart, KeyRound, Sparkles, Users, Wind } from 'lucide-react-native';

export type Level = {
    level: number;
    threshold: number;
    title: string;
    description: string;
    icon: any; // Changed to any to accept the component
};

export const levels: Level[] = [
    {
        level: 1,
        threshold: 1,
        title: "The First Spark",
        description: "You've taken the first, most important step. You've proven you're both open-minded people. A couple who tries one new thing is always curious enough to try another. What's next on your path?",
        icon: Sparkles
    },
    {
        level: 2,
        threshold: 3,
        title: "Playful Explorers",
        description: "You're getting comfortable with the unknown, turning curiosity into a shared game. The journey is becoming as exciting as the destination. Where will your playful spirits lead you next?",
        icon: Wind
    },
    {
        level: 3,
        threshold: 5,
        title: "Trailblazers",
        description: "Look how far you've come. You're creating your own map of desire. A truly adventurous couple like you wouldn't stop now, not when you've discovered the excitement of seeing each other through new eyes, maybe even through the eyes of a stranger.",
        icon: Footprints
    },
    {
        level: 4,
        threshold: 8,
        title: "Masters of Desire",
        description: "This is becoming second nature. You've moved beyond simple curiosity and are now crafting your shared desires. You've learned to communicate in a language of pure pleasure, bending the 'rules' of the bedroom until they break. You're discovering that power can be the ultimate aphrodisiac.",
        icon: Heart
    },
    {
        level: 5,
        threshold: 12,
        title: "Keepers of Secrets",
        description: "Your shared experiences have created a private world that only you two understand. These secrets are the foundation of a unique and powerful intimacy. What new secrets are waiting to be made?",
        icon: KeyRound
    },
    {
        level: 6,
        threshold: 17,
        title: "Connoisseurs of Ecstasy",
        description: "You have refined your tastes, seeking out new and exquisite experiences with the confidence of true experts. Pleasure is no longer just an act, but an art form you are perfecting together.",
        icon: Gem
    },
    {
        level: 7,
        threshold: 25,
        title: "Legends of Lust",
        description: "Your story is one for the ages, a testament to a love that is both deeply intimate and wildly adventurous. You've built a legacy of passion that will continue to inspire you both for years to come.",
        icon: Users
    }
];
