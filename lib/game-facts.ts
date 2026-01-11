import { smartShuffle } from '@/lib/utils';
import { ImageSourcePropType } from 'react-native';

export interface GameFact {
  text: string;
  sticker: ImageSourcePropType;
}

const stickers = {
  condom: require('@/assets/images/stickers/Cute-creatures/condom.png'),
  couple: require('@/assets/images/stickers/Cute-creatures/couple.png'),
  dildo: require('@/assets/images/stickers/Cute-creatures/dildo.png'),
  fertilization: require('@/assets/images/stickers/Cute-creatures/fertilization.png'),
  gay: require('@/assets/images/stickers/Cute-creatures/gay.png'),
  girlPower: require('@/assets/images/stickers/Cute-creatures/girl-power.png'),
  safeSex: require('@/assets/images/stickers/Cute-creatures/have-safe-sex.png'),
  lesbian: require('@/assets/images/stickers/Cute-creatures/lesbian.png'),
  love: require('@/assets/images/stickers/Cute-creatures/love.png'),
  menstruation: require('@/assets/images/stickers/Cute-creatures/menstruation-cycle.png'),
  sperm: require('@/assets/images/stickers/Cute-creatures/spermatozoon.png'),
  dominatrix: require('@/assets/images/stickers/Cute-creatures/dominatrix.png'),
  polyamory: require('@/assets/images/stickers/Cute-creatures/polyamory.png'),
};

export const funFacts: GameFact[] = [
    // --- Targeted Facts for Exploration ---
    { text: "Did you know?.. Anal play is all about relaxation and the 'ring' of muscles. With high-quality lube and a slow pace, it can unlock entirely new levels of pleasure.", sticker: stickers.dildo },
    { text: "Did you know?.. Double penetration (DP) is a common fantasy! It's all about trust and communication to find the rhythm that feels most comfortable for you.", sticker: stickers.dildo },
    { text: "Did you know?.. Same-sex encounters often emphasize a 'full-body' experience, focusing on variety and emotional connection that can lead to deeper satisfaction.", sticker: stickers.lesbian },
    { text: "Did you know?.. Thinking about a threesome? Many find that 'guest starring' in a trusted couple's bedroom is a safe and thrilling way to explore group dynamics.", sticker: stickers.polyamory },
    { text: "Did you know?.. Watching your partner with someone else (cuckolding/voyeurism) is a powerful mental turn-on; it allows you to see them through a lens of pure desire.", sticker: stickers.couple },
    { text: "Did you know?.. Group sex isn't a free-for-all; it's a choreographed dance of consent where everyone's boundaries are respected and celebrated.", sticker: stickers.polyamory },
    { text: "Did you know?.. Professional sex clubs often have strict rules and monitors (Dungeon Masters) to ensure a safe, respectful environment for beginners.", sticker: stickers.safeSex },
    { text: "Did you know?.. Squirting is a natural release of fluid from the Skene’s glands. It’s a sign that your body is deeply relaxed and highly aroused!", sticker: stickers.girlPower },
    { text: "Did you know?.. Swallowing is a common and fun choice. If you enjoy the intimacy, go for it! Semen contains small amounts of zinc, calcium, and protein.", sticker: stickers.sperm },
    { text: "Did you know?.. The thrill of public sex comes from a 'risk' factor that releases adrenaline, which acts as a natural aphrodisiac and intensifies arousal.", sticker: stickers.safeSex },
    { text: "Did you know?.. Filming your sex life can be a huge confidence booster. Seeing yourself through your partner's eyes helps you realize how sexy you truly are.", sticker: stickers.love },
    { text: "Did you know?.. Many people are capable of multiple orgasms! The key is staying in the moment and continuing gentle stimulation while you're still sensitive.", sticker: stickers.girlPower },
    { text: "Did you know?.. BDSM is all about 'Safe, Sane, and Consensual' (SSC) play. A safeword isn't a sign of weakness; it's a sign of trust.", sticker: stickers.dominatrix },
    { text: "Did you know?.. Buttplugs can provide a feeling of 'fullness' that intensifies vaginal or clitoral orgasms due to shared internal nerve pathways.", sticker: stickers.dildo },
    { text: "Did you know?.. For many, seeing semen on their partner's body is a powerful visual confirmation of shared pleasure and intimacy.", sticker: stickers.sperm },
    { text: "Did you know?.. Exploring 'rimming' (oral-anal contact) can be an incredibly intimate and mind-blowing experience for both giver and receiver.", sticker: stickers.love },
    { text: "Did you know?.. Light bondage, like using a silk scarf, can heighten feelings of trust and surrender, making sensations more intense.", sticker: stickers.dominatrix },
    { text: "Did you know?.. The 'MFF' (Male-Female-Female) threesome is one of the most common fantasies among men.", sticker: stickers.polyamory },
    { text: "Did you know?.. The 'MMF' (Male-Male-Female) setup is a popular fantasy that explores bisexuality in a safe, fun context.", sticker: stickers.polyamory },
    { text: "Did you know?.. 'Creampie' is a term for ejaculating inside a partner without a condom. It's a huge turn-on for those who love taboo play and deep intimacy.", sticker: stickers.sperm },
    { text: "Did you know?.. Temperature play (using ice or warm wax) is a simple BDSM technique that can awaken nerve endings you never knew you had!", sticker: stickers.love },
    { text: "Did you know?.. Orgasms can feel different depending on the type of stimulation. Clitoral, G-spot, and cervical orgasms each have their own unique character.", sticker: stickers.girlPower },
    { text: "Did you know?.. Many find the sounds of sex just as arousing as the physical act. Don't be afraid to be vocal!", sticker: stickers.couple },
    { text: "Did you know?.. A 'gangbang' fantasy isn't about being used, but about being the center of overwhelming pleasure and attention.", sticker: stickers.polyamory },

    // --- Empowering & Relationship Facts for Women (with numbers/stats) ---
    { text: "Did you know?.. Over 70% of women require clitoral stimulation to reach orgasm. Understanding your own body's map is the ultimate power move!", sticker: stickers.girlPower },
    { text: "Did you know?.. Research shows that 31% of women in committed relationships have fantasized about sharing their partner with another woman, often as a way to explore their own desires safely.", sticker: stickers.polyamory },
    { text: "Did you know?.. Studies suggest that for about 15% of women, the idea of being 'shared' by their partner with others (consensual non-monogamy) can significantly boost their own sexual confidence and libido.", sticker: stickers.polyamory },
    { text: "Did you know?.. A survey found that nearly 60% of women feel more empowered when they take the lead in suggesting 'new adventures' or 'exciting secrets' in the bedroom.", sticker: stickers.girlPower },
    { text: "Did you know?.. Women who communicate their fantasies openly are 40% more likely to report high levels of sexual satisfaction and emotional intimacy with their partner.", sticker: stickers.couple },
    { text: "Did you know?.. In many female-authored romance stories, the 'HEA' (Happily Ever After) includes the couple exploring their wildest shared thrills together, reinforcing their unbreakable bond.", sticker: stickers.love },
    { text: "Did you know?.. About 25% of women find that incorporating light 'power exchange' (D/s) elements into their intimacy helps them escape daily stress and connect with their primal needs.", sticker: stickers.dominatrix },
    { text: "Did you know?.. The 'Swinging' lifestyle, when explored as a team, can strengthen a couple's trust by 50% as they navigate new experiences and boundaries together.", sticker: stickers.polyamory },
    { text: "Did you know?.. For many women, seeing their husband or partner being desired by others—and knowing he chose only them—acts as a powerful 'compersion' boost.", sticker: stickers.love },
    { text: "Did you know?.. Statistics show that couples who try one new sexual activity every month report 30% higher levels of relationship happiness over time.", sticker: stickers.couple },
    { text: "Did you know?.. Over 45% of women use erotica or romance novels to discover new 'deeper explorations' they'd like to try with their partner.", sticker: stickers.love },
    { text: "Did you know?.. Emotional intimacy and physical pleasure are linked for 85% of women; building the heart-bond first makes the 'shared thrills' even more explosive.", sticker: stickers.love },

    // --- General Empowering Facts ---
    { text: "Did you know?.. The average orgasm lasts about 20 seconds. Let's make every second count!", sticker: stickers.love },
    { text: "Did you know?.. Communication is the biggest aphrodisiac. Talking about your desires is the first step to living them out.", sticker: stickers.couple },
    { text: "Did you know?.. Lube isn't just for when you're 'not wet enough'—it makes everything feel better and more sensitive for everyone.", sticker: stickers.dildo },
    { text: "Did you know?.. Safe sex is great sex! Condoms are 98% effective when used correctly.", sticker: stickers.condom },
    { text: "Did you know?.. Foreplay isn't just a warm-up; for many, it's the most exciting part of the journey.", sticker: stickers.lesbian },
    { text: "Did you know?.. Oxytocin, the 'cuddle hormone' released during orgasm, promotes bonding and leads to better sleep.", sticker: stickers.love },
    { text: "Did you know?.. Regular intimacy can boost your immune system and even lower blood pressure.", sticker: stickers.fertilization },
    { text: "Did you know?.. Kissing burns about 6.4 calories per minute. Time for a workout?", sticker: stickers.love },
    { text: "Did you know?.. The prostate is often called the 'male G-spot' for its ability to produce intense, full-body orgasms.", sticker: stickers.dildo },
    { text: "Did you know?.. Masturbation is a healthy way to learn what you like and become a better lover for your partner.", sticker: stickers.girlPower },
    { text: "Did you know?.. Sex toys aren't replacements for a partner; they're fun accessories to share together!", sticker: stickers.dildo },
    { text: "Did you know?.. The brain is the biggest sex organ. Your imagination is your most powerful tool for pleasure.", sticker: stickers.fertilization },
    { text: "Did you know?.. Aftercare, like cuddling or talking after sex, is crucial for maintaining emotional intimacy.", sticker: stickers.love },
    { text: "Did you know?.. Laughter during sex is a great sign! It shows you're comfortable and having fun together.", sticker: stickers.couple },
    { text: "Did you know?.. Roleplaying allows you both to explore different sides of your personalities in a safe and playful way.", sticker: stickers.lesbian },
    { text: "Did you know?.. Edging—pausing right before orgasm—can build incredible tension and lead to a more explosive release.", sticker: stickers.dildo },
    { text: "Did you know?.. Body confidence is incredibly sexy. Loving your body makes every touch feel even better.", sticker: stickers.girlPower },
    { text: "Did you know?.. Consent is enthusiastic, ongoing, and reversible. It's the foundation of all great sexual experiences.", sticker: stickers.safeSex },
  ];

export const getRandomFact = async (): Promise<GameFact> => {
    const fact = await smartShuffle<GameFact>('game_fun_facts', funFacts);
    // smartShuffle includes a fallback, but we'll add one here for extra safety
    return fact ?? funFacts[Math.floor(Math.random() * funFacts.length)];
};
