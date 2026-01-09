export interface Horizon {
  topic: string; // The general theme for the AI prompt
  metaphors: string; // Specific metaphors related to the topic
}

// This is the predefined, ordered journey the user will progress through automatically.
export const HORIZON_CYCLE: Horizon[] = [
  {
    topic: 'Exploring new levels of trust and surrender in our private world.',
    metaphors:
      '"The poetry of surrender," "being held perfectly still by your strength," "soft ropes of trust."',
  },
  {
    topic: 'Using new instruments or helpers to find colors in our love we haven\'t seen yet.',
    metaphors:
      '"New instruments for our symphony," "little helpers to find colors we haven\'t seen."',
  },
  {
    topic: 'Capturing our magic to keep the memory of our connection alive forever.',
    metaphors:
      '"Capturing our magic to keep the memory alive forever," "our spark reflecting in a mirror."',
  },
  {
    topic: 'Unlocking the final, hidden chambers of our physical and emotional connection.',
    metaphors:
      '"Unlocking the final hidden chambers," "the deep water where the tides are strongest."',
  },
  {
    topic: 'Letting the beauty of our private world spill over into the open air.',
    metaphors:
      '"Our love spilling over into the open air," "sharing a secret in a crowded room."',
  },
  {
    topic: 'Sharing the light of our love and letting our fire warm others.',
    metaphors:
      '"Letting our fire warm others," "sharing our light," "our spark reflecting in a mirror."',
  },
];
