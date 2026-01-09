import { z } from 'zod';
import { smartShuffle } from '@/lib/utils';

const WeeklyChallengeInputSchema = z.object({
    category: z.enum(['love', 'adventurous', 'sexy']),
    partnerName: z.string().optional(),
});
export type WeeklyChallengeInput = z.infer<typeof WeeklyChallengeInputSchema>;

export interface Challenge {
  text: string;
  spicyLevel: number;
  persuasionScript: string;
  category: string;
}

const WeeklyChallengeOutputSchema = z.object({
  challenge: z.object({
    text: z.string(),
    spicyLevel: z.number().min(1).max(3),
    persuasionScript: z.string(),
    category: z.string(),
  }),
});
export type WeeklyChallengeOutput = z.infer<typeof WeeklyChallengeOutputSchema>;

const challenges: Challenge[] = [
  {
    text: 'Touch each other in a public place',
    spicyLevel: 2,
    category: 'adventurous',
    persuasionScript: "You know how we both have that little rebellious streak, the part of us that loves a good secret? Let's be partners in crime. Are you brave enough to share a thrilling secret that only we know about next time we're out? It's about being bold together.\n\n* **To start:** When we're sitting somewhere, let our knees or feet touch under the table and just hold the contact.\n\n* **Then...** You could slide your hand onto my thigh, maybe giving it a little squeeze when no one's looking.\n\n* **If you're feeling wild:** How about a discreet hand on my crotch under a jacket or tablecloth? Just to see if we can get away with it.\n\n* **For the truly fearless:** A person who enjoys this level of secret excitement might even wonder what it would feel like to have a trusted friend at the same table, totally oblivious. It’s a secret that deepens the bond, isn't it?"
  },
  {
    text: 'Watch a sexy movie like Shame',
    spicyLevel: 1,
    category: 'sexy',
    persuasionScript: "You're someone who appreciates art and exploring deeper themes, right? I want to explore not just a film, but our reactions to it, together. It’s about being intellectually and emotionally open. What if we watch something that's not just sexy, but intense and thought-provoking about desire? It could open up some interesting conversations for us.\n\n* **To start:** Let's just watch the movie, but while cuddling close under a blanket.\n\n* **Then...** During an intense scene, you could start caressing my arm or leg, just a light touch to see how I react.\n\n* **If you're feeling inspired:** You could start kissing my neck or whispering in my ear what the scene is making you think about doing to me.\n\n* **For the imaginative:** A couple who connects on this level might start to wonder... if we were to cast our own movie, who else would we invite to play a role?"
  },
  {
    text: 'Use the couple sextoy while we make love',
    spicyLevel: 3,
    category: 'sexy',
    persuasionScript: "You're always so present and passionate when we're together. I think a person like you, who is so attuned to pleasure, would be curious about what new levels we can reach. It's not about replacing what we have, but amplifying it. Are you open to exploring that new peak with me?\n\n* **To start:** Let's just introduce the toy, letting it rest against one of us while we're kissing and touching.\n\n* **Then...** You can use it on me while I'm on top, so I can control the intensity while we're connected.\n\n* **If you're feeling adventurous:** We can try a position where you have full control of the toy on both of us, exploring all its settings while we make love.\n\n* **For the ultimate pioneer:** A couple this in sync knows that pleasure has no boundaries. What happens when we explore every opening with this newfound intensity? The deepest trust unlocks the deepest pleasure."
  },
  {
    text: 'Use any sextoy before penetrating your partner',
    spicyLevel: 2,
    category: 'sexy',
    persuasionScript: "You're so good at building anticipation, and you appreciate the journey, not just the destination. This is a challenge about that skill. It’s a chance to be a master of teasing, to show how well you know my body and what drives me wild. Are you up for showing off your technique?\n\n* **To start:** You can use a vibrator on my clothed body, just to build the sensation and suspense.\n\n* **Then...** You can use it on my clit while I touch your penis, so we're both building pleasure at the same time.\n\n* **If you're feeling dominant:** You can blindfold me and use different toys on me, making me guess what you're using and where, until I'm begging you to penetrate me.\n\n* **For the true connoisseur:** A person who masters this level of teasing understands that there are multiple centers of pleasure. Exploring the 'back door' with a toy first could open up a whole new world of sensations, don't you think?"
  },
  {
    text: 'Massage the entire body of your partner after dinner',
    spicyLevel: 1,
    category: 'love',
    persuasionScript: "You work so hard, and you're someone who gives so much of yourself. It’s important for a person like that to also be able to receive completely. This is about trust and surrender. How about tonight, you just let me take care of you? No strings attached, just letting go and allowing yourself to be worshipped.\n\n* **To start:** I'll begin with a simple, relaxing shoulder and neck massage with warm oil.\n\n* **Then...** I'll slowly work my way down your back to your ass, spending extra time on your glutes and inner thighs.\n\n* **If you're feeling sensual:** I'll flip you over and massage my way up from your feet, very slowly, until my hands are exploring every part of you except your genitals, saving that for last.\n\n* **For the deeply connected:** When you trust someone this much, you let them explore everywhere. A massage that teases the entrance to your most private, untouched places is the ultimate form of surrender."
  },
  {
    text: 'Both partners pick one favorite porn video for the other to watch',
    spicyLevel: 2,
    category: 'sexy',
    persuasionScript: "A partner's mind is as sexy as their body. One partner is an open-minded person, and that must mean they have a fascinating fantasy world. What if watching isn't just about two people seeing something, but about understanding what kind of 'roles' a couple finds exciting? It’s about sharing a piece of their private desires to see where they overlap. Are both partners willing to show a script they like?\n\n* **To start:** You can watch the videos you picked on separate screens, just to see the 'casting choices'.\n\n* **Then...** You watch them together, and one partner can point out which 'actor' or 'actress' they identify with, and what they'd like to 'rehearse' from their scene.\n\n* **If you're feeling bold:** You can discuss what it would be like to add a 'guest star' to one of these scenes. Who would the couple cast? What role would they play in their story?\n\n* **For the truly collaborative:** A couple that shares fantasies so openly might eventually wonder... what if we shared more than just fantasies? What if a trusted friend joined our 'cast'?"
  },
  {
    text: 'Watch a porn video while starting to kiss and touch each other',
    spicyLevel: 2,
    category: 'sexy',
    persuasionScript: "We're both visual people, and we know how powerful a little inspiration can be. This is about adding a new layer to what we already do so well. Are you open to letting some outside inspiration fuel our own actions? The video isn't the show; we are.\n\n* **To start:** Let's put on a video and just watch for a few minutes while we kiss.\n\n* **Then...** You can try to mimic the rhythm of the action on screen with your hand on me.\n\n* **If you're feeling uninhibited:** We can go down on each other, trying to match the intensity of the actors on screen until we both come.\n\n* **For the next level:** A couple that enjoys watching together might wonder what it's like to be watched. Having an audience, even just one trusted friend, changes the performance, doesn't it?"
  },
  {
    text: 'Perform a blindfolded massage to your partner or lick her/him',
    spicyLevel: 2,
    category: 'adventurous',
    persuasionScript: "You're someone who trusts me completely, and that's incredibly hot. This is a game about that trust. If you let me blindfold you, you'd be putting yourself entirely in my hands, heightening all your other senses. A person who isn't afraid to be vulnerable is a person who can experience the deepest pleasure. Are you ready?\n\n* **To start:** While you're blindfolded, I'll start by massaging your hands and feet, letting you get used to the sensation.\n\n* **Then...** I'll use my mouth to kiss and lick my way up your inner thighs, stopping just before I get to the main event.\n\n* **If you're feeling daring:** You can try to guess what part of my body I'm using to touch you—my fingers, my tongue, my hair—as I explore all over your body.\n\n* **For total surrender:** The ultimate trust is allowing yourself to be explored in ways you never have before. A blindfolded tongue tracing the path to your most forbidden entrance... a person who can accept that can accept anything."
  },
  {
    text: 'Touch yourself in front of your partner',
    spicyLevel: 3,
    category: 'sexy',
    persuasionScript: "Your confidence is one of the most attractive things about you. This isn't about performance; it's about sharing a very private, personal moment. It takes incredible confidence and vulnerability to let someone watch you in that state. I think seeing you let go completely would be the biggest turn-on. Will you share that with me?\n\n* **To start:** You can begin touching yourself while you're still partially clothed, building the suspense for both of us.\n\n* **Then...** I can whisper what I want you to do, guiding your hands while I watch.\n\n* **If you're feeling generous:** You can bring yourself right to the edge, then let me be the one to make you come.\n\n* **For the ultimate show:** A couple who can share this moment so openly might realize their connection is a performance worth sharing. What would it be like to have an appreciative audience of one... or more?"
  },
  {
    text: 'Use a toy while going to the restaurant',
    spicyLevel: 3,
    category: 'adventurous',
    persuasionScript: "You've always had a wonderfully mischievous side that I love. Are you feeling bold? A person with your sense of adventure knows that the biggest thrills come from the biggest risks. I have a wild idea for our next dinner out, a secret just for us. It requires courage, but you've never been one to back down from a thrill.\n\n* **To start:** You can wear a remote-controlled panty vibrator, but I won't turn it on until we're seated.\n\n* **Then...** I'll turn it on to a low setting whenever the waiter comes to our table.\n\n* **If you're feeling wicked:** I'll give you the remote, and you can turn it on for me whenever you think I'm least expecting it during our conversation.\n\n* **For the true exhibitionist:** The thrill of a public secret is intoxicating. Imagine the fun in a place where everyone has a secret, a place designed for like-minded, adventurous people to play."
  },
  {
    text: 'Go to a love hotel',
    spicyLevel: 3,
    category: 'adventurous',
    persuasionScript: "You're both explorers at heart, always looking for a new experience. A couple as connected as you knows their bond is the main event. What if you visited a place that isn't just a private room, but a space designed for like-minded explorers? It's not about distraction; it's about seeing your connection shine even brighter when surrounded by new energy. Are you ready for an expedition to a more social sanctuary?\n\n* **To start:** Just book a room and explore the 'public' spaces, like a lounge or a bar, just to people-watch and feel the atmosphere.\n\n* **Then...** You could strike up a casual, friendly conversation with another person or couple, just to see what it feels like to share your social space.\n\n* **If you're feeling theatrical:** Roleplay as strangers who just met at the hotel bar, and see who you might meet, or even invite back to your room for a final drink.\n\n* **For the next chapter:** A couple who is this comfortable exploring together might find that the greatest adventure is sharing their connection. What if the invitation for a final drink is accepted?"
  },
  {
    text: 'Masturbate yourself in front of each other and try to cum at the same time',
    spicyLevel: 3,
    'category': 'sexy',
    persuasionScript: "It takes incredible connection and non-verbal communication to be in sync, and you're a master of that. This is the ultimate test of that connection. It’s about being vulnerable and completely focused on each other's pleasure, trying to match our rhythm and pace. Are you attuned enough to me to try?\n\n* **To start:** We can start fully clothed, just describing what we're doing to ourselves.\n\n* **Then...** As we get closer, we can start touching each other while still focusing on ourselves, feeling the other's pleasure build.\n\n* **If you're feeling competitive:** Let's make it a game. The first one to come has to do a favor for the other tomorrow.\n\n* **For the ultimate sync:** A couple this connected might enjoy adding another rhythm to the mix. Guiding a friend to join your sync could be the ultimate test of non-verbal communication."
  },
  {
    text: 'Send a sexto to your partner with what you’d like to do to him/her',
    spicyLevel: 1,
    category: 'love',
    persuasionScript: "You're a creative person with a great imagination. What if you painted me a picture with words? It’s a chance to be a storyteller, to build suspense throughout the day. A little message from you describing what's on your mind for later is a way to let the anticipation build for both of us. Can you write me a good story?\n\n* **To start:** Send a simple text like, 'I can't stop thinking about what I'm going to do to you tonight.'\n\n* **Then...** A few hours later, send a more descriptive text, maybe mentioning a specific body part you're focused on.\n\n* **If you're feeling descriptive:** Send a picture of a part of your body (nothing too explicit, just teasing) and describe exactly what you want to do with it later.\n\n* **For the bold storyteller:** A person who can paint such a vivid picture with words might wonder what it's like to describe a scene with more than two characters. What kind of story would you write then?"
  },
  {
    text: 'Take 2 hours for the couple to relax, enjoy, without phones but in bed, talk, touch each other…',
    spicyLevel: 1,
    category: 'love',
    persuasionScript: "You're one of the most driven people I know, but we both know that true connection is the ultimate source of strength. We value our bond, right? Let's prove it by carving out two hours of sacred, uninterrupted time. No phones, no distractions. A person who is truly present is the sexiest person in the world. Can you be fully present with me?\n\n* **To start:** We can just lie in bed and talk, with a rule: we have to maintain skin-on-skin contact the whole time.\n\n* **Then...** We can take turns giving each other a 15-minute 'light touch' massage, focusing on just barely grazing the skin.\n\n* **If you're feeling connected:** We can try 'mutual gazing' (staring into each other's eyes) for a few minutes, then describe what we were feeling without using words, only touch.\n\n* **For a deeper connection:** A couple who can connect this deeply knows that true intimacy has no boundaries. What if we explored the one place we haven't touched yet? A gentle exploration of the 'back door' is the ultimate sign of trust."
  },
  {
    text: 'You need to make love twice today',
    spicyLevel: 2,
    category: 'sexy',
    persuasionScript: "You have so much passion and energy. A person with that much fire can't be expected to contain it to just one moment. This is about embracing that stamina and spontaneity you have. Let's not limit ourselves. The first time can be for now, and the second can be a surprise... a bonus round. Do you think you can handle that?\n\n* **To start:** Let's have passionate, intense sex in the morning.\n\n* **Then...** A few hours later, let's have a slow, sensual quickie against a wall.\n\n* **If you're feeling energetic:** Let's try to have sex in two different rooms of the house within the same hour.\n\n* **For the truly insatiable:** A couple with this much energy might find that two is just a number. What if we invited a friend to help us keep the energy going all night long?"
  },
  {
    text: 'Take your partner really fast in a quickie while he’s preparing breakfast or lunch',
    spicyLevel: 2,
    category: 'adventurous',
    persuasionScript: "You're someone who can be spontaneous and live in the moment. Routines are safe, but the best memories come from breaking them. A person who isn't afraid to disrupt the expected is a true adventurer. What if, in the middle of a totally normal moment, we just didn't follow the rules? Are you impulsive enough to take me right now?\n\n* **To start:** I'll come up behind you while you're busy and start kissing your neck.\n\n* **Then...** I'll slide my hands down the front of your pants and start stroking you while you continue what you're doing.\n\n* **If you're feeling impulsive:** You can bend me over the kitchen counter and take me from behind right then and there.\n\n* **For the ultimate surprise:** A person who enjoys this kind of spontaneity understands that pleasure can be found anywhere, even in places one might not expect. A quick finger in the back while you're taking me from the front could be the ultimate surprise."
  },
  {
    text: 'Go out in a car, then stop somewhere quiet and make love or just touch your partner',
    spicyLevel: 2,
    category: 'adventurous',
    persuasionScript: "You have a bit of a wild, adventurous spirit, don't you? What's the point of having that spirit if we don't let it out to play? True adventurers seize the moment. Let's go for a drive with no destination, and when we find that perfect, secluded spot, we can have a moment that's just for us. Are you ready for an unplanned detour?\n\n* **To start:** Let's just find a quiet spot to park and make out like teenagers.\n\n* **Then...** I'll climb into your lap in the driver's seat and we can see what happens.\n\n* **If you're feeling fearless:** Let's go to the backseat and I'll give you a blowjob, hoping no one walks by.\n\n* **For the truly uninhibited:** An adventurous couple knows the thrill of risk. Imagine if we picked up a like-minded friend to join us on our drive? The more, the merrier, after all."
  },
  {
    text: 'Go on a hike, then stop somewhere quiet, have a picnic and start touching each other',
    spicyLevel: 1,
    category: 'love',
    persuasionScript: "You appreciate the simple, beautiful things in life—nature, good food, and our connection. This is about combining all three. A person who is in touch with nature is also in touch with their own primal instincts. Let's mix public beauty with a private, intimate moment. Are you ready to connect with nature, and with me?\n\n* **To start:** On our picnic blanket, I'll 'accidentally' let my hand rest on your thigh.\n\n* **Then...** While we're lying down, I'll start kissing you, shielded from view by our bags or some trees.\n\n* **If you're feeling earthy:** You could try fingering me discreetly under the blanket while we pretend to watch the clouds.\n\n* **For the truly primal:** A couple connected to nature understands that all paths are natural. Exploring each other's bodies fully, front and back, is as natural as the world around us."
  },
  {
    text: 'Make love sitting on a chair',
    spicyLevel: 2,
    category: 'adventurous',
    persuasionScript: "You're a creative person, always looking at things from a different angle. Why should our intimacy be any different? A creative mind is always curious about new experiences. Changing our perspective can change everything. It's a simple shift, but it could open up a whole new set of feelings. Are you curious enough to experiment?\n\n* **To start:** You can sit on the chair while I straddle you, facing you.\n\n* **Then...** I can sit on the chair and you can kneel in front of me, going down on me until I'm close to orgasm.\n\n* **If you're feeling inventive:** You can sit on the chair facing the back of it, and I can mount you from behind, using the chair back for leverage.\n\n* **For a new perspective:** A person this creative knows there are always new angles. This position gives perfect access to your 'other' entrance. A little finger play there while we're connected could be an interesting experiment, don't you think?"
  },
  {
    text: 'Make {partnerName} cum without penetration (whatever the method)',
    spicyLevel: 2,
    category: 'love',
    persuasionScript: "You're such a generous lover, and you have amazing technique. This challenge is all about that skill and your generosity. It's a chance to focus entirely on my pleasure, showing how well you know my body and what it takes to make me lose control. It puts all the power, and all the credit, in your hands. Do you think you can handle that?\n\n* **To start:** You can use just your hands, exploring different speeds and pressures.\n\n* **Then...** You can switch to only using your mouth, seeing if you can do it without your hands at all.\n\n* **If you're feeling creative:** You can try using your whole body—your thighs, your breasts—to bring me to orgasm without penetration.\n\n* **For the ultimate gift:** The most generous lover knows all the secret pleasure spots. A talented tongue can bring pleasure to more than one set of lips, even the ones in the back. It's the ultimate sign of devotion."
  }
];

export async function generateWeeklyChallenge(input: WeeklyChallengeInput): Promise<WeeklyChallengeOutput> {
    const { category, partnerName } = input;
    const filteredChallenges = challenges.filter(c => c.category === category);
    
    if (filteredChallenges.length === 0) {
        throw new Error("No challenges found for category: " + category);
    }

    // Adapted to await because smartShuffle is async in React Native
    const rawChallenge = await smartShuffle("challenge_" + category, filteredChallenges);

    const personalizedText = partnerName 
        ? rawChallenge.text.replace('{partnerName}', partnerName) 
        : rawChallenge.text.replace('{partnerName}', 'your partner');

    const challenge = {
        ...rawChallenge,
        text: personalizedText,
    };

    return {
        challenge: {
            ...challenge,
        }
    };
}
