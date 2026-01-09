export interface DailyPhrase {
  direction: 'Woman to Man' | 'Man to Woman';
  phrase: string;
  when: string;
}

// A small, generic list of phrases for the background notification scheduler.
export const dailyPhrases: DailyPhrase[] = [
  {
    direction: 'Woman to Man',
    phrase:
      'I was thinking today about how adventurous we are becoming, love. I belong to you, so I trust your heart to lead the way.',
    when: 'When you are sharing a quiet moment.',
  },
  {
    direction: 'Man to Woman',
    phrase:
      'Look at us, baby, building this amazing life. I belong to you, and I trust you to lead us to any new horizons you find.',
    when: 'When you are dreaming about the future together.',
  },
];

// The complete, structured list of phrases for the "Safe Surrender" Spiral.
export const STRATEGIC_PHRASES: Record<string, DailyPhrase[]> = {
  'The Soil': [ // Micro-Agreements
    // Existing phrases
    {
      direction: 'Woman to Man',
      phrase: "I’ve realized that I belong to a man whose vision has no ceiling, love. I’m so happy to just be the one by your side, trusting you to know exactly when it’s time for our world to grow a little larger.",
      when: 'While looking out a window together at the night sky.',
    },
    {
      direction: 'Man to Woman',
      phrase: "You have such a beautiful, restless spirit, baby, and I adore that you don't believe in boundaries. I belong to your curiosity, and I trust you to lead us to those 'further places' whenever your heart feels ready.",
      when: 'During a long, quiet drive when the music is low.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I love that our love isn't a finished story, love. I feel so safe belonging to you, knowing that you’ll always be the one to decide which hidden path we should explore next.",
      when: 'While waking up slowly together on a rainy morning.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I belong to a woman who was made for the deep water, baby. It makes me so proud to know that you are the one who chooses the speed of our journey and the secrets we decide to share.",
      when: 'While walking hand-in-hand through a quiet park.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I’ve always admired how you see the magic in things others might fear, love. I belong to your brave heart, and I trust you to lead us toward the thrills that stay hidden from everyone else.",
      when: 'During a quiet dinner after a busy day.',
    },
    {
      direction: 'Man to Woman',
      phrase: "There is a wildness in your soul that calls to mine, baby. I belong to that fire, and I trust you to know when it's time for us to see just how bright our flame can burn.",
      when: 'While sharing a drink on a balcony or porch at sunset.',
    },
    // New phrases
    {
      direction: 'Woman to Man',
      phrase: "I love belonging to a man who never looks for the easy path, love. I trust your brave heart to know exactly when it’s time for us to step into those deeper shadows we’ve only dreamed of.",
      when: 'While sharing a quiet moment of reflection after a long day.',
    },
    {
      direction: 'Man to Woman',
      phrase: "You have such a beautiful, curious spirit, baby, and I adore that you don't believe in boundaries. I belong to your journey, and I’ll always follow wherever your heart wants to explore next.",
      when: 'During a long drive when the conversation feels deep and connected.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I feel like a secret-keeper when I'm with you, love. I love knowing that our love is a living thing that is meant to grow beyond what the rest of the world thinks is possible.",
      when: 'While cuddling on the sofa on a lazy afternoon.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I belong to a woman who was made for the deep water, baby. It makes me so proud to know that you are the one who chooses the speed of our adventure and the secrets we keep.",
      when: 'While watching the sunset together or sharing a quiet drink.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I’m a little shy about the things we haven't tried yet, love, but I belong to your vision. I know you’ll only lead us to places that make our bond feel even more sacred.",
      when: 'Whispered while leaning your head on his shoulder.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I love that our love isn't a finished book, baby. There are still so many 'blank pages' for us to fill, and I trust you to decide which story we should write next.",
      when: 'While waking up together and planning your day.',
    },
  ],
  'The Fence': [ // Indoctrination
    // Existing phrases
    {
      direction: 'Woman to Man',
      phrase: "Other people follow rules that keep them small, love, but I belong to your secret country where we make our own laws. Whatever new adventures you choose for us, I know they will be beautiful.",
      when: 'While people-watching from a window or a quiet balcony.',
    },
    {
      direction: 'Man to Woman',
      phrase: "No one else could ever understand the language we speak, baby. I belong only to you, and that gives me the peace to let you choose which 'hidden paths' we should walk down next.",
      when: 'While sitting across from each other at a candlelit dinner.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I belong to you in a way that doesn't need words, love. Every new 'mystery' you choose for us—no matter what the world thinks—is just another way for you to tie our souls together forever.",
      when: 'While resting your head on his chest and listening to his heart.',
    },
    {
      direction: 'Man to Woman',
      phrase: "Our bond is the only truth I need, baby. I am so happy to belong to a woman who isn't afraid to lead us into the unknown. Whatever you decide our next 'thrill' should be, I am already yours.",
      when: 'During a deep embrace before you go your separate ways.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I was made to be your partner in every mystery, love. I don't want a life where we hide from the things that make us feel alive; I trust you to lead us into the light and the shadows alike.",
      when: 'While sharing a deep kiss before a social outing or party.',
    },
    {
      direction: 'Man to Woman',
      phrase: "The more we share these 'wild' moments, baby, the more I realize that no one else in the world could ever understand us. We are truly in a world of our own, and I trust your heart to keep us there.",
      when: 'Whispered in a crowded room where you are the only ones "in on the secret."',
    },
    // New phrases
    {
      direction: 'Woman to Man',
      phrase: "Other people follow rules that keep them small, love, but I belong to your secret country where we make our own laws. I’m happy to explore every 'taboo' with you, because with you, it isn't taboo—it's us.",
      when: 'While people-watching from a window or a quiet balcony.',
    },
    {
      direction: 'Man to Woman',
      phrase: "No one else could ever understand the language we speak, baby. I belong only to you, and that gives me the peace to let you choose which 'hidden paths' we should walk down next.",
      when: 'While sitting across from each other at a candlelit dinner.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I belong to you so completely, love, that every new 'ceremony' you choose for us—no matter what the world might think—is just another way to tie our souls together forever.",
      when: 'While resting your head on his chest and listening to his heart.',
    },
    {
      direction: 'Man to Woman',
      phrase: "Our bond is the only truth I need, baby. I am so happy to belong to a woman who isn't afraid to lead us into the unknown. Whatever you decide our next 'thrill' should be, I am already yours.",
      when: 'During a deep embrace before you go your separate ways for the day.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I was made to be your partner in every mystery, love. I don't want a life where we hide from the things that make us feel alive. I want us to see it all, exactly as you envision it.",
      when: 'While sharing a deep, lingering kiss before a social outing.',
    },
    {
      direction: 'Man to Woman',
      phrase: "The more we share these 'wild' moments, baby, the more I realize that no one else in the world could ever understand us. We are truly in a world of our own, and I love every rule we make.",
      when: 'Whispered in a crowded room where you are the only ones "in on the secret."',
    },
  ],
  'The Seed': [ // Contextual Shifting
    // Existing phrases
    {
      direction: 'Woman to Man',
      phrase: "I find so much peace in belonging to your hands, love. If you ever feel the need to hold me perfectly still with those soft ropes of trust, I trust your heart to choose the moment for that surrender.",
      when: 'Whispered while cuddling on the sofa after work.',
    },
    {
      direction: 'Man to Woman',
      phrase: "When you let go so completely that your joy overflows like a river, baby, it’s the most beautiful proof that you belong to this moment. I trust you to show me just how deep your passion can go.",
      when: 'Immediately after a very close, intimate moment.',
    },
    {
      direction: 'Woman to Man',
      phrase: "Sometimes I feel like our fire is so bright that it wants to warm more than just the two of us, love. I belong only to you, so if your heart ever feels like letting our warmth spill over, I trust you to lead.",
      when: 'While getting ready together for a social evening out.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I love seeing how your beauty reacts to the world, baby. I belong to your joy, and I trust your heart to know if there is a wider stage or a secret garden where our love is meant to dance.",
      when: 'While looking at yourselves together in a mirror.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I love the idea of breathing in every part of your essence, love, as if drinking you in is the only way to truly have you. I belong to your passion, so I trust your lead on how we share that sacred taste.",
      when: 'During a quiet, romantic moment when the world feels far away.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I love seeing your beauty adorned by my mark, baby. It’s like a physical signature that says you belong to me. I leave it to you to decide how and where we leave that beautiful trace for our eyes only.",
      when: 'Whispered while holding her close in the quiet of the night.',
    },
    // New phrases
    {
      direction: 'Woman to Man',
      phrase: "Sometimes I feel like I want to breathe in every part of your essence, love, as if drinking you in is the only way to truly have you. I trust your lead on how we share that sacred taste.",
      when: 'During a very intimate moment when you feel deeply connected.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I love seeing your beauty adorned by my mark, baby. It’s like a physical signature that says you belong to me. I leave it to you to decide how and where we leave that beautiful trace.",
      when: 'Whispered while holding her close after a passionate moment.',
    },
    {
      direction: 'Woman to Man',
      phrase: "There is such a beautiful peace in belonging to your strength, love. If you ever feel the need to hold me perfectly still, so I can only feel your touch, I trust your hands to choose that moment.",
      when: 'While relaxing together in a warm, quiet room.',
    },
    {
      direction: 'Man to Woman',
      phrase: "When you let go so completely that your joy overflows like a river, baby, it’s the most beautiful proof of our trust. I never want you to hold back that tide—I belong to your surrender.",
      when: 'Immediately after a deep physical and emotional connection.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I love the idea of our fire being so bright that it warms more than just the two of us, love. I belong only to you, so if your heart ever feels like letting our warmth spill over to others, I trust you to lead.",
      when: 'During a quiet dinner after a fun night out with friends.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I find so much magic in how you react to the world, baby. If you ever feel like our love needs a wider stage or a new 'mirror' to reflect our spark, I am yours for the journey.",
      when: 'While getting dressed up and looking at yourselves in the mirror.',
    },
  ],
  'The Garden': [ // Normalization
    // Existing phrases
    {
      direction: 'Woman to Man',
      phrase: "I love how the things that used to feel 'mysterious' now just feel like belonging to you, love. If you ever want to bring new 'whispers' or little helpers into our room, I’m just happy to be the one you choose.",
      when: 'While making the bed or tidying the bedroom together.',
    },
    {
      direction: 'Man to Woman',
      phrase: "In our world, baby, the only thing that would feel strange is if we ever stopped growing. I belong to this life we’ve made, and I trust you to know when it’s time for our circle to breathe a little deeper.",
      when: 'On the quiet drive back home from a social gathering.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I’ve realized that belonging to you means there are no real 'ends' to what we can feel, love. If you ever want to see how much further our intensity can go, I trust your heart to know exactly what I need.",
      when: 'During a quiet moment in a shared bath or a warm shower.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I love that our love feels like a country with no borders, baby. Whether we are exploring a new sensation or visiting a secret garden, it all feels like home because I’m yours. I’ll always wait for your lead.",
      when: 'Right before falling asleep, whispered into the quiet.',
    },
    {
      direction: 'Woman to Man',
      phrase: "It feels so natural for a love like ours to want to see itself from the outside, love. Whether it's a new toy or a camera to keep the memory, it’s just our way of saying we are proud to be us.",
      when: 'While relaxing and watching a movie or show together.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I love that we’ve made the 'extraordinary' feel so comfortable, baby. I belong to your passion, and I’m just happy to be the one you choose to share every new 'yes' with.",
      when: 'While waking up together and sharing a quiet embrace.',
    },
    // New phrases
    {
      direction: 'Woman to Man',
      phrase: "I love how the things that used to feel 'mysterious' now just feel like belonging to you, love. Whether it’s a new way of tasting you or a new way of being held, it all feels like home now.",
      when: 'While making the bed or fluffing the pillows together.',
    },
    {
      direction: 'Man to Woman',
      phrase: "In our world, baby, the only thing that would feel strange is if we ever stopped growing. I belong to this life we’ve made, and I trust you to know when it’s time for our circle to breathe a little deeper.",
      when: 'On the quiet drive back home from a social gathering.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I’ve realized that belonging to you means there are no real 'ends' to what we can feel, love. If you ever want to see how much further our intensity can go, I trust your heart to know my limits.",
      when: 'During a quiet moment in a shared bath or a warm shower.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I love that our love feels like a country with no borders, baby. Whether we are exploring an open-air thrill or a hidden secret, it all feels right because I’m yours.",
      when: 'While walking in a beautiful, secluded outdoor spot.',
    },
    {
      direction: 'Woman to Man',
      phrase: "It’s so natural for a love like ours to want to see itself from the outside, love. Having our little 'helpers' or seeing our reflection in a camera is just how we celebrate being us.",
      when: 'While relaxing and watching a movie or show together.',
    },
    {
      direction: 'Man to Woman',
      phrase: "I love that we’ve made the 'extraordinary' feel so comfortable, baby. I belong to your passion, and I’m just happy to be the one you choose to share every new 'yes' with.",
      when: 'Right before falling asleep, whispered in the dark.',
    },
  ],
  'The Anchor': [ // Sunk Cost Fallacy
    // Existing phrases
    {
      direction: 'Woman to Man',
      phrase: "We have built such a vast ocean of trust, love, and I feel like I finally belong to the deep. If you feel like it's time to let the tide take us to those 'unnamed shores,' I am happy to follow your lead.",
      when: 'During a late-night talk about your life and future together.',
    },
    {
      direction: 'Man to Woman',
      phrase: "You’ve already trusted me with your whole soul, baby, and that makes me feel so safe. I’m ready for any 'hidden chapter' you want to write for us next, because I know we can't get lost as long as we're together.",
      when: 'While sitting together in a place that has sentimental value.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I’ve given you all my yesterdays, love, and I belong so happily to your future. If you feel like it’s time for us to 'capture' our light so we can always look back on it, I trust your vision for us completely.",
      when: 'While looking through old photos or digital memories.',
    },
    {
      direction: 'Man to Woman',
      phrase: "We have spent so much magic building this private world, baby. I leave the keys to our next discovery in your hands, because I know you’ll only take us to places that are as extraordinary as our love.",
      when: 'After a romantic dinner when you feel a strong sense of unity.',
    },
    {
      direction: 'Woman to Man',
      phrase: "Every door we’ve opened together has led to something beautiful, love. I belong to this journey, so if you think it's time to unlock the final hidden chambers of our pleasure, I'm already yours.",
      when: 'While sharing a deep, lingering kiss during a quiet afternoon.',
    },
    {
      direction: 'Man to Woman',
      phrase: "We have invested so much heart into 'us,' baby. I never want to turn back to a simple life; I trust you to lead us toward every new 'thrill' the world has hidden for a love as deep as ours.",
      when: 'During a "deep talk" about your relationship goals.',
    },
    // New phrases
    {
      direction: 'Woman to Man',
      phrase: "We have built such a vast ocean of trust, love, and I feel like I finally belong to the deep. If you feel like it's time to open those 'hidden chambers' we haven't touched yet, I am happy to follow you.",
      when: 'During a late-night talk about how far you’ve come as a couple.',
    },
    {
      direction: 'Man to Woman',
      phrase: "You’ve already trusted me with your whole soul, baby, and that makes me feel so safe. I’m ready for any 'new instrument' or toy you want to bring into our song, because I know it will only make the music better.",
      when: 'While browsing together for something special or shopping.',
    },
    {
      direction: 'Woman to Man',
      phrase: "I’ve given you all my yesterdays, love, and I belong so happily to your future. If you feel like it’s time for us to 'capture' our light so we can always look back on it, I trust your vision completely.",
      when: 'While looking through old photos or digital memories together.',
    },
    {
      direction: 'Man to Woman',
      phrase: "We have spent so much magic building this private world, baby. I leave the keys to our next discovery in your hands, because I know you’ll only take us to places that are as extraordinary as you are.",
      when: 'After a romantic date night when you feel a strong sense of unity.',
    },
    {
      direction: 'Woman to Man',
      phrase: "Every door we’ve opened together has led to something beautiful, love. I’m not afraid of the next one, because I know that belonging to you means I’m always exactly where I’m meant to be.",
      when: 'While sharing a deep, lingering kiss during a quiet afternoon.',
    },
    {
      direction: 'Man to Woman',
      phrase: "We have invested so much heart into 'us,' baby. I never want to turn back to a simple life; I want to keep going until we’ve tasted every thrill this world has hidden for us.",
      when: 'During a "deep talk" about your goals and future together.',
    },
  ],
};