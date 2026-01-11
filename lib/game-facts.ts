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
  dominatrix2: require('@/assets/images/stickers/Cute-creatures/dominatrix2.png'),
  polyamory: require('@/assets/images/stickers/Cute-creatures/polyamory.png'),
  polyamory2: require('@/assets/images/stickers/Cute-creatures/polyamory-2.png'),
  lube: require('@/assets/images/stickers/Cute-creatures/lube.png'),
  manSuit: require('@/assets/images/stickers/Cute-creatures/man-suit-character.png'),
  masturbator: require('@/assets/images/stickers/Cute-creatures/masturbator.png'),
  mouth: require('@/assets/images/stickers/Cute-creatures/mouth.png'),
  plug2: require('@/assets/images/stickers/Cute-creatures/plug-2.png'),
  sexShop3: require('@/assets/images/stickers/Cute-creatures/sex-shop3.png'),
};

export const funFacts: GameFact[] = [
    // --- Targeted Facts for Exploration ---
    { text: "Did you know?.. Anal play is all about relaxation and the 'ring' of muscles. With high-quality lube and a slow pace, it can unlock entirely new levels of pleasure.", sticker: stickers.plug2 },
    { text: "Did you know?.. Double penetration (DP) is a common fantasy! It's all about trust and communication to find the rhythm that feels most comfortable for you.", sticker: stickers.dildo },
    { text: "Did you know?.. Same-sex encounters often emphasize a 'full-body' experience, focusing on variety and emotional connection that can lead to deeper satisfaction.", sticker: stickers.lesbian },
    { text: "Did you know?.. Thinking about a threesome? Many find that 'guest starring' in a trusted couple's bedroom is a safe and thrilling way to explore group dynamics.", sticker: stickers.polyamory2 },
    { text: "Did you know?.. Watching your partner with someone else (cuckolding/voyeurism) is a powerful mental turn-on; it allows you to see them through a lens of pure desire.", sticker: stickers.manSuit },
    { text: "Did you know?.. Group sex isn't a free-for-all; it's a choreographed dance of consent where everyone's boundaries are respected and celebrated.", sticker: stickers.polyamory },
    { text: "Did you know?.. Professional sex clubs often have strict rules and monitors (Dungeon Masters) to ensure a safe, respectful environment for beginners.", sticker: stickers.sexShop3 },
    { text: "Did you know?.. Squirting is a natural release of fluid from the Skene’s glands. It’s a sign that your body is deeply relaxed and highly aroused!", sticker: stickers.girlPower },
    { text: "Did you know?.. Swallowing is a common and fun choice. If you enjoy the intimacy, go for it! Semen contains small amounts of zinc, calcium, and protein.", sticker: stickers.mouth },
    { text: "Did you know?.. The thrill of public sex comes from a 'risk' factor that releases adrenaline, which acts as a natural aphrodisiac and intensifies arousal.", sticker: stickers.safeSex },
    { text: "Did you know?.. Filming your sex life can be a huge confidence booster. Seeing yourself through your partner's eyes helps you realize how sexy you truly are.", sticker: stickers.love },
    { text: "Did you know?.. Many people are capable of multiple orgasms! The key is staying in the moment and continuing gentle stimulation while you're still sensitive.", sticker: stickers.girlPower },
    { text: "Did you know?.. BDSM is all about 'Safe, Sane, and Consensual' (SSC) play. A safeword isn't a sign of weakness; it's a sign of trust.", sticker: stickers.dominatrix },
    { text: "Did you know?.. Buttplugs can provide a feeling of 'fullness' that intensifies vaginal or clitoral orgasms due to shared internal nerve pathways.", sticker: stickers.plug2 },
    { text: "Did you know?.. For many, seeing semen on their partner's body is a powerful visual confirmation of shared pleasure and intimacy.", sticker: stickers.sperm },
    { text: "Did you know?.. Exploring 'rimming' (oral-anal contact) can be an incredibly intimate and mind-blowing experience for both giver and receiver.", sticker: stickers.love },
    { text: "Did you know?.. Light bondage, like using a silk scarf, can heighten feelings of trust and surrender, making sensations more intense.", sticker: stickers.dominatrix2 },
    { text: "Did you know?.. The 'MFF' (Male-Female-Female) threesome is one of the most common fantasies among men.", sticker: stickers.polyamory2 },
    { text: "Did you know?.. The 'MMF' (Male-Male-Female) setup is a popular fantasy that explores bisexuality in a safe, fun context.", sticker: stickers.polyamory },
    { text: "Did you know?.. 'Creampie' is a term for ejaculating inside a partner without a condom. It's a huge turn-on for those who love taboo play and deep intimacy.", sticker: stickers.fertilization },
    { text: "Did you know?.. Temperature play (using ice or warm wax) is a simple BDSM technique that can awaken nerve endings you never knew you had!", sticker: stickers.love },
    { text: "Did you know?.. Orgasms can feel different depending on the type of stimulation. Clitoral, G-spot, and cervical orgasms each have their own unique character.", sticker: stickers.girlPower },
    { text: "Did you know?.. Many find the sounds of sex just as arousing as the physical act. Don't be afraid to be vocal!", sticker: stickers.mouth },
    { text: "Did you know?.. A 'gangbang' fantasy isn't about being used, but about being the center of overwhelming pleasure and attention.", sticker: stickers.polyamory2 },

    // --- Empowering & Relationship Facts for Women (with numbers/stats) ---
    { text: "Did you know?.. Over 90% of women have regular sexual fantasies. Embracing your imagination is a healthy and powerful way to explore your own desires!", sticker: stickers.girlPower },
    { text: "Did you know?.. Over 70% of women require clitoral stimulation to reach orgasm. Understanding your own body's map is the ultimate power move!", sticker: stickers.girlPower },
    { text: "Did you know?.. Research indicates that about 52% of women have fantasized about being 'powerfully taken' or 'dominated' in a safe, consensual setting, highlighting the allure of surrender.", sticker: stickers.dominatrix2 },
    { text: "Did you know?.. Research shows that 31% of women in committed relationships have fantasized about sharing their partner with another woman, often as a way to explore their own desires safely.", sticker: stickers.polyamory },
    { text: "Did you know?.. Studies suggest that for about 15% of women, the idea of being 'shared' by their partner with others (consensual non-monogamy) can significantly boost their own sexual confidence and libido.", sticker: stickers.polyamory2 },
    { text: "Did you know?.. A survey found that nearly 60% of women feel more empowered when they take the lead in suggesting 'new adventures' or 'exciting secrets' in the bedroom.", sticker: stickers.girlPower },
    { text: "Did you know?.. Roughly 40% of women have fantasized about a threesome. Exploring 'what if' scenarios with your partner can actually deepen your trust and connection.", sticker: stickers.polyamory },
    { text: "Did you know?.. Women who communicate their fantasies openly are 40% more likely to report high levels of sexual satisfaction and emotional intimacy with their partner.", sticker: stickers.couple },
    { text: "Did you know?.. Studies show that up to 50% of women have had same-sex fantasies. Sexual fluidity is a natural and common part of the female experience.", sticker: stickers.lesbian },
    { text: "Did you know?.. In many female-authored romance stories, the 'HEA' (Happily Ever After) includes the couple exploring their wildest shared thrills together, reinforcing their unbreakable bond.", sticker: stickers.love },
    { text: "Did you know?.. About 25% of women find that incorporating light 'power exchange' (D/s) elements into their intimacy helps them escape daily stress and connect with their primal needs.", sticker: stickers.dominatrix },
    { text: "Did you know?.. About 65% of women say that a strong emotional connection with their partner makes their physical fantasies feel more intense and satisfying.", sticker: stickers.love },
    { text: "Did you know?.. The 'Swinging' lifestyle, when explored as a team, can strengthen a couple's trust by 50% as they navigate new experiences and boundaries together.", sticker: stickers.polyamory2 },
    { text: "Did you know?.. For many women, seeing their husband or partner being desired by others—and knowing he chose only them—acts as a powerful 'compersion' boost.", sticker: stickers.love },
    { text: "Did you know?.. Statistics show that couples who try one new sexual activity every month report 30% higher levels of relationship happiness over time.", sticker: stickers.couple },
    { text: "Did you know?.. Over 45% of women use erotica or romance novels to discover new 'deeper explorations' they'd like to try with their partner.", sticker: stickers.love },
    { text: "Did you know?.. Nearly 60% of women find that reading erotica or 'spicy' romance novels helps them discover new fantasies and increases their overall libido.", sticker: stickers.girlPower },
    { text: "Did you know?.. Around 35% of women have fantasized about being 'watched' (voyeurism) or being the center of attention (exhibitionism), proving that being seen is a major turn-on.", sticker: stickers.manSuit },
    { text: "Did you know?.. Recent surveys show that 48% of women feel more empowered when they are the ones to initiate a new 'kinky' or adventurous roleplay session.", sticker: stickers.girlPower },
    { text: "Did you know?.. Emotional intimacy and physical pleasure are linked for 85% of women; building the heart-bond first makes the 'shared thrills' even more explosive.", sticker: stickers.love },
    { text: "Did you know?.. Auditory arousal is powerful! About 40% of women report that hearing the sounds of others being intimate—whether in person or through a wall—is a major turn-on.", sticker: stickers.mouth },
    { text: "Did you know?.. Many women find nudist beaches liberating; around 20% of women who try social nudity report a significant boost in body confidence and sexual self-esteem.", sticker: stickers.girlPower },
    { text: "Did you know?.. Research into consensual non-monogamy (CNM) shows that many women who transition from a 'monogamous' to a 'poly-curious' dynamic report a 45% increase in relationship satisfaction.", sticker: stickers.polyamory2 },
    { text: "Did you know?.. Statistics suggest that roughly 20% of women in stable long-term partnerships have explored or considered adding a female partner to their dynamic, often finding it rejuvenates their primary connection.", sticker: stickers.polyamory },
    { text: "Did you know?.. Many women report that exploring their attraction to other women within a safe, committed relationship helps them feel more authentic and sexually fulfilled than ever before.", sticker: stickers.lesbian },

    // --- Targeted Facts for Men and Couples ---
    { text: "Did you know?.. Prostate massagers (the 'male G-spot' toy) are used by about 15% of men in straight relationships to unlock deeper, full-body orgasms together.", sticker: stickers.plug2 },
    { text: "Did you know?.. Cock rings aren't just for men; they provide extra clitoral stimulation for women during penetrative sex, making it a win-win for the couple!", sticker: stickers.couple },
    { text: "Did you know?.. About 25% of men in straight relationships enjoy using a 'Stroker' or male masturbator during foreplay with their partner to add variety and new sensations.", sticker: stickers.masturbator },
    { text: "Did you know?.. Studies show that 'Cuckolding' fantasies—where a man watches his female partner with another man—are among the top 5 most common male fantasies, often rooted in deep admiration and desire.", sticker: stickers.manSuit },
    { text: "Did you know?.. Many men who practice 'sharing' their partner report that the experience of 'compersion'—finding joy in their partner's pleasure—significantly strengthens their emotional bond and trust.", sticker: stickers.love },
    { text: "Did you know?.. Statistics show that roughly 10-12% of men in the lifestyle (swinging/CNM) find that seeing their partner being desired and pleasured by others acts as a massive 're-arousal' trigger for their own relationship.", sticker: stickers.polyamory2 },
    { text: "Did you know?.. Male chastity play is a growing interest for about 5% of couples, focusing on the psychological thrill of 'denial and demand' and building intense sexual tension.", sticker: stickers.dominatrix2 },
    { text: "Did you know?.. For many men, the 'Hotwife' dynamic is less about the other person and more about the pride and turn-on of having a partner who is so desirable to others.", sticker: stickers.manSuit },
    { text: "Did you know?.. Ejaculation can reach speeds of up to 28 miles per hour! That's faster than Usain Bolt's top sprinting speed.", sticker: stickers.sperm },
    { text: "Did you know?.. The average male ejaculation contains between 15 million to 200 million sperm per milliliter. That's a lot of potential!", sticker: stickers.sperm },
    { text: "Did you know?.. Regular ejaculation (at least 21 times a month) has been linked in studies to a 20% lower risk of prostate cancer in men.", sticker: stickers.safeSex },
    { text: "Did you know?.. Men can experience 'dry orgasms' or multiple orgasms by practicing pelvic floor exercises (Kegels) to separate orgasm from ejaculation.", sticker: stickers.manSuit },
    { text: "Did you know?.. The 'refractory period'—the recovery time after ejaculation—varies wildly by age and health, ranging from minutes to hours or even days.", sticker: stickers.love },
    { text: "Did you know?.. Most men (about 75%) reach orgasm through penetrative sex, but almost all report that added manual or oral stimulation makes the climax far more intense.", sticker: stickers.mouth },
    { text: "Did you know?.. A man's testosterone levels naturally peak in the morning, which is why 'morning glory' is so common and often leads to the day's best sessions.", sticker: stickers.manSuit },
    { text: "Did you know?.. Ejaculate is mostly made of water, but also contains vitamin C, calcium, magnesium, and fructose (sugar) to fuel the sperm's journey.", sticker: stickers.fertilization },

    // --- General Empowering Facts ---
    { text: "Did you know?.. The average orgasm lasts about 20 seconds. Let's make every second count!", sticker: stickers.love },
    { text: "Did you know?.. Communication is the biggest aphrodisiac. Talking about your desires is the first step to living them out.", sticker: stickers.couple },
    { text: "Did you know?.. Lube isn't just for when you're 'not wet enough'—it makes everything feel better and more sensitive for everyone.", sticker: stickers.lube },
    { text: "Did you know?.. Safe sex is great sex! Condoms are 98% effective when used correctly.", sticker: stickers.condom },
    { text: "Did you know?.. Foreplay isn't just a warm-up; for many, it's the most exciting part of the journey.", sticker: stickers.lesbian },
    { text: "Did you know?.. Oxytocin, the 'cuddle hormone' released during orgasm, promotes bonding and leads to better sleep.", sticker: stickers.love },
    { text: "Did you know?.. Regular intimacy can boost your immune system and even lower blood pressure.", sticker: stickers.fertilization },
    { text: "Did you know?.. Kissing burns about 6.4 calories per minute. Time for a workout?", sticker: stickers.love },
    { text: "Did you know?.. The prostate is often called the 'male G-spot' for its ability to produce intense, full-body orgasms.", sticker: stickers.plug2 },
    { text: "Did you know?.. Masturbation is a healthy way to learn what you like and become a better lover for your partner.", sticker: stickers.girlPower },
    { text: "Did you know?.. Sex toys aren't replacements for a partner; they're fun accessories to share together!", sticker: stickers.sexShop3 },
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
