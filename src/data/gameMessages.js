// The little quiz has no score, so these now react to how many different little worlds
// (quiz endings) have been found. Always kind.

// EDIT ME: message by worlds found (highest matching min wins).
export const gameMessages = [
  { min: 0, title: 'Every little thing counts!', text: 'You found a corner of what I adore about you. There are so many more where that came from.' },
  { min: 3, title: 'Your heart is filling up!', text: 'Look at all those little worlds. And I could keep this list going for a very long time.' },
  { min: 5, title: 'Overflowing with everything I adore!', text: 'You found every corner! Your year is already spilling over with good things, and so is my heart.' }
];

// EDIT ME: little coupons, unlocked by finding quiz endings. Everyone unlocks the first one.
// Change the text to real promises you will happily keep.
export const rewards = [
  { min: 0, title: 'One very long hug', text: 'Redeemable any time, no expiry date.' },
  { min: 2, title: 'A treat on me', text: 'Coffee, boba or dessert: your pick, and I bring the company.' },
  { min: 3, title: 'A date, your choice', text: 'Movie, a walk, or something silly: you decide, I show up.' },
  { min: 5, title: 'Lily of the valley', text: 'A bouquet of your favourite flowers, hand-delivered.' }
];

// Little words that float up when the candles go out.
export const momentWords = ['your laugh', 'your smile', 'a sweet hello', 'your kindness', 'a quiet moment', 'your eyes', 'a warm hug'];
